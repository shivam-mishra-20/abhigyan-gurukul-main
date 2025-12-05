// Custom event name for auth state changes
export const AUTH_STATE_CHANGE_EVENT = "authStateChange";

// Function to notify auth state change for other components to use
export const notifyAuthStateChange = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
};
