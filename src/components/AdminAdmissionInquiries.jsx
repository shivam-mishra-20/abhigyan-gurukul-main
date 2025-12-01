import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWhatsapp,
} from "react-icons/fa";

const AdminAdmissionInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Scholarship Test Venue Details
  const SCHOLARSHIP_VENUE = {
    name: "Abhigyan Gurukul",
    address:
      "SF-32, Akshar Pavilion A1, Vasna Bhayli main Rd, Vadodara, Gujarat 391410",
    time: "10:00 AM to 1:00 PM",
    contactNo: "+91 9829491219",
  };

  // Function to send WhatsApp confirmation message
  const sendWhatsAppConfirmation = (inquiry) => {
    const phoneNumber = inquiry.fatherContactNo || inquiry.motherContactNo;

    if (!phoneNumber) {
      alert("No contact number available to send WhatsApp message.");
      return;
    }

    // Clean the phone number (remove spaces, dashes, etc.)
    let cleanedPhone = phoneNumber.replace(/[\s\-()]/g, "");

    // Add country code if not present (assuming India +91)
    if (!cleanedPhone.startsWith("+")) {
      if (cleanedPhone.startsWith("91") && cleanedPhone.length === 12) {
        cleanedPhone = "+" + cleanedPhone;
      } else if (cleanedPhone.length === 10) {
        cleanedPhone = "+91" + cleanedPhone;
      }
    }

    // Compose formal WhatsApp message
    const message = `Dear Parent/Guardian,

Greetings from *Abhigyan Gurukul*!

We are pleased to inform you that the admission inquiry for *${
      inquiry.studentName
    }* has been *approved*.

We cordially invite you to appear for the Scholarship Test. Please find the details below:

 *SCHOLARSHIP TEST DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━
 *Date:* ${inquiry.scholarshipTestDate}
 *Time:* ${SCHOLARSHIP_VENUE.time}
 *Venue:* ${SCHOLARSHIP_VENUE.name}
 *Address:* ${SCHOLARSHIP_VENUE.address}

 *Student Details:*
• Name: ${inquiry.studentName}
• Class Applied: ${inquiry.seekingAdmissionClass}
• Scholarship Test Class: ${
      inquiry.scholarshipTestClass || inquiry.seekingAdmissionClass
    }

 *Important Instructions:*
1. Please arrive 15 minutes before the scheduled time.
2. Carry a valid ID proof and a recent passport-size photograph.
3. Bring your own stationery (pen, pencil, eraser, etc.).


For any queries, please contact us at:
 ${SCHOLARSHIP_VENUE.contactNo}

We look forward to welcoming ${inquiry.studentName} at Abhigyan Gurukul.

Best Regards,
*Abhigyan Gurukul*
_Tree of Knowledge_`;

    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${cleanedPhone.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, "_blank");
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    const filterInquiriesData = () => {
      let filtered = inquiries;

      // Filter by status
      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (inquiry) => inquiry.status === statusFilter
        );
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (inquiry) =>
            inquiry.studentName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            inquiry.fatherContactNo?.includes(searchTerm) ||
            inquiry.motherContactNo?.includes(searchTerm) ||
            inquiry.fatherName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            inquiry.motherName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredInquiries(filtered);
    };

    filterInquiriesData();
  }, [searchTerm, statusFilter, inquiries]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "admissionInquiries"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const inquiriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleString() || "N/A",
      }));
      setInquiries(inquiriesData);
      setFilteredInquiries(inquiriesData);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "admissionInquiries", id));
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete inquiry");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "admissionInquiries", id), {
        status: newStatus,
      });

      // If approved, send WhatsApp confirmation
      if (newStatus === "approved" && selectedInquiry) {
        const shouldSendWhatsApp = window.confirm(
          "Status updated to Approved! Would you like to send a WhatsApp confirmation message to the parent?"
        );
        if (shouldSendWhatsApp) {
          sendWhatsAppConfirmation(selectedInquiry);
        }
      }

      fetchInquiries();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // Function to handle approval with WhatsApp message from modal
  const handleApproveWithWhatsApp = async () => {
    if (!selectedInquiry) return;

    try {
      await updateDoc(doc(db, "admissionInquiries", selectedInquiry.id), {
        status: "approved",
      });

      // Send WhatsApp confirmation
      sendWhatsAppConfirmation(selectedInquiry);

      fetchInquiries();

      // Update selectedInquiry state
      setSelectedInquiry({ ...selectedInquiry, status: "approved" });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
  };

  const handleEdit = (inquiry) => {
    setEditFormData(inquiry);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, timestamp: _timestamp, ...updateData } = editFormData;
      await updateDoc(doc(db, "admissionInquiries", id), updateData);
      setShowEditModal(false);
      fetchInquiries();
    } catch (error) {
      console.error("Error updating inquiry:", error);
      alert("Failed to update inquiry");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Enquiry Date",
      "Student Name",
      "DOB",
      "Seeking Class",
      "School Name",
      "Scholarship Test Class",
      "Scholarship Test Date",
      "Previous Result",
      "Math Marks",
      "Science Marks",
      "SS Marks",
      "English Marks",
      "Board Name",
      "Father Name",
      "Father Occupation",
      "Father Company",
      "Father Office",
      "Father Contact",
      "Father Designation",
      "Mother Name",
      "Mother Occupation",
      "Mother Contact",
      "Mother Designation",
      "Home Address",
      "Query",
      "Status",
      "Timestamp",
    ];

    const rows = filteredInquiries.map((inquiry) => [
      inquiry.enquiryDate || "",
      inquiry.studentName,
      inquiry.dateOfBirth,
      inquiry.seekingAdmissionClass,
      inquiry.schoolName,
      inquiry.scholarshipTestClass || "",
      inquiry.scholarshipTestDate || "",
      inquiry.previousExamResult || "",
      `${inquiry.mathMarks || ""} / ${inquiry.mathOutOf || ""}`,
      `${inquiry.scienceMarks || ""} / ${inquiry.scienceOutOf || ""}`,
      `${inquiry.ssMarks || ""} / ${inquiry.ssOutOf || ""}`,
      `${inquiry.englishMarks || ""} / ${inquiry.englishOutOf || ""}`,
      inquiry.boardName,
      inquiry.fatherName,
      inquiry.fatherOccupation,
      inquiry.fatherCompanyName || "",
      inquiry.fatherOfficeAddress || "",
      inquiry.fatherContactNo,
      inquiry.fatherDesignation || "",
      inquiry.motherName,
      inquiry.motherOccupation,
      inquiry.motherContactNo,
      inquiry.motherDesignation || "",
      inquiry.homeAddress,
      inquiry.query || "",
      inquiry.status,
      inquiry.timestamp,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admission_inquiries_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: <FaClock />,
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-300",
      },
      approved: {
        icon: <FaCheckCircle />,
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-300",
      },
      rejected: {
        icon: <FaTimesCircle />,
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-300",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text} border ${config.border}`}
      >
        <span className="mr-1">{config.icon}</span>
        {status?.toUpperCase() || "PENDING"}
      </span>
    );
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "pending").length,
    approved: inquiries.filter((i) => i.status === "approved").length,
    rejected: inquiries.filter((i) => i.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Admission Inquiries Management
          </h1>
          <p className="text-gray-600">
            Manage and track all admission inquiries from prospective students
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Inquiries
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUser className="text-purple-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.rejected}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <FaTimesCircle className="text-red-600 text-2xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExportCSV}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <FaDownload />
              Export CSV
            </motion.button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-green-600 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Student Name
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Parent Contacts
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Seeking Class
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Board
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Submitted
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((inquiry, index) => (
                    <motion.tr
                      key={inquiry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white font-bold mr-3">
                            {inquiry.studentName?.charAt(0).toUpperCase() ||
                              "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {inquiry.studentName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Class {inquiry.seekingAdmissionClass}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm space-y-1">
                          {inquiry.fatherContactNo && (
                            <p className="flex items-center text-gray-700">
                              <FaPhone className="mr-2 text-gray-400" />
                              <span className="text-xs text-gray-500 mr-1">
                                F:
                              </span>
                              {inquiry.fatherContactNo}
                            </p>
                          )}
                          {inquiry.motherContactNo && (
                            <p className="flex items-center text-gray-700">
                              <FaPhone className="mr-2 text-gray-400" />
                              <span className="text-xs text-gray-500 mr-1">
                                M:
                              </span>
                              {inquiry.motherContactNo}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {inquiry.seekingAdmissionClass}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                          {inquiry.boardName || "Not specified"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(inquiry.status)}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">
                          {inquiry.timestamp}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewDetails(inquiry)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(inquiry)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(inquiry.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-green-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">
                  Admission Inquiry Details
                </h2>
              </div>

              <div className="p-6">
                {/* Status Update */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Update Status:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedInquiry.id, "pending")
                      }
                      className="flex-1 min-w-[120px] px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <FaClock /> <span>Pending</span>
                    </button>
                    <button
                      onClick={handleApproveWithWhatsApp}
                      className="flex-1 min-w-[120px] px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      title="Approve and send WhatsApp confirmation"
                    >
                      <FaCheckCircle /> <span>Approve</span>{" "}
                      <FaWhatsapp className="ml-1" />
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedInquiry.id, "rejected")
                      }
                      className="flex-1 min-w-[120px] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <FaTimesCircle /> <span>Reject</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    <FaWhatsapp className="inline mr-1 text-green-500" />
                    Clicking &#34;Approve&#34; button will send a WhatsApp
                    confirmation with scholarship test details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-purple-500 pb-2">
                      Student Information
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500">Enquiry Date</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedInquiry.enquiryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedInquiry.studentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-gray-800">
                        {selectedInquiry.dateOfBirth}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Seeking Admission in Class
                      </p>
                      <p className="text-gray-800 font-semibold">
                        {selectedInquiry.seekingAdmissionClass}
                      </p>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-green-500 pb-2">
                      Academic Information
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500">School Name</p>
                      <p className="text-gray-800">
                        {selectedInquiry.schoolName}
                      </p>
                    </div>
                    {selectedInquiry.scholarshipTestClass && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Scholarship Test Class
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {selectedInquiry.scholarshipTestClass}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.scholarshipTestDate && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Scholarship Test Date
                        </p>
                        <p className="text-gray-800 font-semibold">
                          {selectedInquiry.scholarshipTestDate}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">
                        Previous Exam Result
                      </p>
                      <p className="text-gray-800">
                        {selectedInquiry.previousExamResult}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Maths Marks</p>
                      <p className="text-gray-800">
                        {selectedInquiry.mathMarks} /{" "}
                        {selectedInquiry.mathOutOf}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Science Marks</p>
                      <p className="text-gray-800">
                        {selectedInquiry.scienceMarks} /{" "}
                        {selectedInquiry.scienceOutOf}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        SS (Social Science) Marks
                      </p>
                      <p className="text-gray-800">
                        {selectedInquiry.ssMarks} / {selectedInquiry.ssOutOf}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">English Marks</p>
                      <p className="text-gray-800">
                        {selectedInquiry.englishMarks} /{" "}
                        {selectedInquiry.englishOutOf}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Board</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedInquiry.boardName}
                      </p>
                    </div>
                  </div>

                  {/* Father&apos;s Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
                      Father&apos;s Information
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedInquiry.fatherName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="text-gray-800">
                        {selectedInquiry.fatherOccupation}
                      </p>
                    </div>
                    {selectedInquiry.fatherCompanyName && (
                      <div>
                        <p className="text-sm text-gray-500">Company Name</p>
                        <p className="text-gray-800">
                          {selectedInquiry.fatherCompanyName}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.fatherOfficeAddress && (
                      <div>
                        <p className="text-sm text-gray-500">Office Address</p>
                        <p className="text-gray-800">
                          {selectedInquiry.fatherOfficeAddress}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="text-gray-800">
                        {selectedInquiry.fatherContactNo}
                      </p>
                    </div>
                    {selectedInquiry.fatherDesignation && (
                      <div>
                        <p className="text-sm text-gray-500">Designation</p>
                        <p className="text-gray-800">
                          {selectedInquiry.fatherDesignation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Mother&apos;s Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-orange-500 pb-2">
                      Mother&apos;s Information
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedInquiry.motherName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="text-gray-800">
                        {selectedInquiry.motherOccupation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="text-gray-800">
                        {selectedInquiry.motherContactNo}
                      </p>
                    </div>
                    {selectedInquiry.motherDesignation && (
                      <div>
                        <p className="text-sm text-gray-500">Designation</p>
                        <p className="text-gray-800">
                          {selectedInquiry.motherDesignation}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div className="col-span-1 md:col-span-2 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-pink-500 pb-2">
                      Additional Information
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500">Home Address</p>
                      <p className="text-gray-800">
                        {selectedInquiry.homeAddress}
                      </p>
                    </div>
                    {selectedInquiry.query && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Query / Special Request
                        </p>
                        <p className="text-gray-800">{selectedInquiry.query}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Submission Date</p>
                      <p className="text-gray-800">
                        {selectedInquiry.timestamp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Edit Admission Inquiry</h2>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.studentName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          studentName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editFormData.dateOfBirth || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Seeking Admission in Class
                    </label>
                    <input
                      type="text"
                      value={editFormData.seekingAdmissionClass || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          seekingAdmissionClass: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Board
                    </label>
                    <select
                      value={editFormData.boardName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          boardName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="GSEB">GSEB</option>
                    </select>
                  </div>

                  {/* Father's Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Father&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.fatherName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fatherName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Father&apos;s Contact Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.fatherContactNo || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          fatherContactNo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Mother's Information */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mother&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.motherName || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          motherName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mother&apos;s Contact Number
                    </label>
                    <input
                      type="tel"
                      value={editFormData.motherContactNo || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          motherContactNo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Home Address
                    </label>
                    <textarea
                      value={editFormData.homeAddress || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          homeAddress: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      rows="3"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editFormData.status || "pending"}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-green-600 text-white rounded-lg hover:from-purple-700 hover:to-green-700 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAdmissionInquiries;
