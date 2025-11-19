import { collection, getDocs, setDoc, doc, query, where, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

/**
 * Aggregates all results from 'Results' collection into 'ActualStudentResults' collection
 * Groups by student name, class, and batch to eliminate duplicates
 * @param {string} studentName - Optional: sync only for specific student
 * @param {string} studentClass - Optional: required if studentName is provided
 * @param {string} studentBatch - Optional: required if studentName is provided
 * @returns {Promise<Object>} - Success status and message
 */
export const syncStudentResults = async (studentName = null, studentClass = null, studentBatch = null) => {
  try {
    console.log("Starting result sync...", { studentName, studentClass, studentBatch });
    
    // Step 1: Clean up duplicate ActualStudentResults documents
    const actualResultsSnapshot = await getDocs(collection(db, "ActualStudentResults"));
    const studentDocsMap = new Map(); // Map of studentKey -> array of documents
    
    actualResultsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const key = `${data.name}_${data.class}_${data.batch || ""}`;
      
      if (!studentDocsMap.has(key)) {
        studentDocsMap.set(key, []);
      }
      studentDocsMap.get(key).push({ id: docSnap.id, data });
    });
    
    // Remove duplicates - keep the one with the most results or highest total marks
    const deletePromises = [];
    for (const [, docs] of studentDocsMap) {
      if (docs.length > 1) {
        console.log(`Found ${docs.length} duplicate documents for same student, cleaning up...`);
        
        // Sort by: 1) number of results, 2) total marks
        docs.sort((a, b) => {
          const aResults = a.data.results || [];
          const bResults = b.data.results || [];
          
          // First compare by number of results
          if (bResults.length !== aResults.length) {
            return bResults.length - aResults.length;
          }
          
          // Then by total marks
          const aTotalMarks = aResults.reduce((sum, r) => sum + parseFloat(r.marks || 0), 0);
          const bTotalMarks = bResults.reduce((sum, r) => sum + parseFloat(r.marks || 0), 0);
          return bTotalMarks - aTotalMarks;
        });
        
        // Keep the first one (best), delete the rest
        for (let i = 1; i < docs.length; i++) {
          console.log(`Deleting duplicate document: ${docs[i].id}`);
          deletePromises.push(deleteDoc(doc(db, "ActualStudentResults", docs[i].id)));
        }
      }
    }
    
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
      console.log(`Deleted ${deletePromises.length} duplicate documents`);
    }
    
    // Step 2: Build query for Results collection
    let resultsQuery;
    if (studentName && studentClass) {
      resultsQuery = query(
        collection(db, "Results"),
        where("name", "==", studentName),
        where("class", "==", studentClass)
      );
    } else {
      resultsQuery = collection(db, "Results");
    }

    // Fetch all results
    const resultsSnapshot = await getDocs(resultsQuery);
    
    if (resultsSnapshot.empty) {
      console.log("No results found to sync");
      return { success: true, message: "No results to sync" };
    }

    // Group results by student (name + class + batch)
    const studentResultsMap = new Map();

    resultsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const name = data.name;
      const cls = data.class;
      const batch = data.batch || ""; // Handle missing batch
      
      if (!name || !cls) {
        console.warn("Skipping result with missing name or class", data);
        return;
      }

      // Create unique key for each student
      const studentKey = `${name}_${cls}_${batch}`;

      if (!studentResultsMap.has(studentKey)) {
        studentResultsMap.set(studentKey, {
          name,
          class: cls,
          batch,
          results: []
        });
      }

      // Add this result to the student's results array
      // Only include the fields we need for leaderboard
      studentResultsMap.get(studentKey).results.push({
        subject: data.subject || "",
        marks: data.marks || 0,
        outOf: data.outOf || 0,
        testDate: data.testDate || "",
        remarks: data.remarks || ""
      });
    });

    // Fetch user batch information for students with missing batch
    const usersSnapshot = await getDocs(collection(db, "Users"));
    const userBatchMap = new Map();
    usersSnapshot.forEach((docSnap) => {
      const userData = docSnap.data();
      if (userData.name && userData.Class) {
        const key = `${userData.name}_${userData.Class}`;
        userBatchMap.set(key, userData.batch || userData.Batch || "");
      }
    });

    // Write aggregated results to ActualStudentResults collection
    let syncCount = 0;
    const updatePromises = [];

    for (const [, studentData] of studentResultsMap) {
      // If batch is missing, try to get it from Users collection
      if (!studentData.batch) {
        const userKey = `${studentData.name}_${studentData.class}`;
        const userBatch = userBatchMap.get(userKey);
        if (userBatch) {
          studentData.batch = userBatch;
        }
      }

      // Create document ID: name_class_batch (consistent with existing pattern)
      const docId = `${studentData.name.replace(/\s+/g, "_")}_${studentData.class}_${studentData.batch || "NoBatch"}`;
      
      // Sort results by test date (newest first)
      studentData.results.sort((a, b) => {
        const dateA = new Date(a.testDate || 0);
        const dateB = new Date(b.testDate || 0);
        return dateB - dateA;
      });

      // Remove duplicate results (same subject, marks, outOf, testDate)
      const uniqueResults = [];
      const seenResults = new Set();
      
      for (const result of studentData.results) {
        const resultKey = `${result.subject}_${result.marks}_${result.outOf}_${result.testDate}`;
        if (!seenResults.has(resultKey)) {
          seenResults.add(resultKey);
          uniqueResults.push(result);
        }
      }
      
      studentData.results = uniqueResults;

      // Write to ActualStudentResults
      const updatePromise = setDoc(doc(db, "ActualStudentResults", docId), {
        name: studentData.name,
        class: studentData.class,
        batch: studentData.batch,
        results: studentData.results,
        lastUpdated: new Date().toISOString()
      });

      updatePromises.push(updatePromise);
      syncCount++;
    }

    // Execute all updates
    await Promise.all(updatePromises);

    console.log(`Successfully synced ${syncCount} student records`);
    return { 
      success: true, 
      message: `Successfully synced ${syncCount} student record${syncCount !== 1 ? 's' : ''}`,
      count: syncCount
    };

  } catch (error) {
    console.error("Error syncing student results:", error);
    return { 
      success: false, 
      message: `Failed to sync results: ${error.message}`,
      error
    };
  }
};

/**
 * Sync results for a specific student only
 * @param {string} studentName - Student name
 * @param {string} studentClass - Student class
 * @param {string} studentBatch - Student batch (optional)
 */
export const syncSingleStudentResults = async (studentName, studentClass, studentBatch = "") => {
  // Fetch batch from Users if not provided
  let batch = studentBatch;
  if (!batch) {
    try {
      const usersQuery = query(
        collection(db, "Users"),
        where("name", "==", studentName),
        where("Class", "==", studentClass)
      );
      const usersSnapshot = await getDocs(usersQuery);
      if (!usersSnapshot.empty) {
        const userData = usersSnapshot.docs[0].data();
        batch = userData.batch || userData.Batch || "";
      }
    } catch (error) {
      console.warn("Could not fetch batch for student:", error);
    }
  }

  return await syncStudentResults(studentName, studentClass, batch);
};
