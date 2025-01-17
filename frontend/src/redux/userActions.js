// 🔹 Import Redux actions from the user slice to update authentication state
import { loginStart, loginSuccess, loginFailure, logout } from "./userSlice";

// 🔹 Define the API base URL for authentication requests
const API_URL = "http://localhost:3001/api/auth"; // Update with backend URL

/**
 * 🔹 Login Action (Asynchronous Thunk)
 * This function handles user login by sending email & password to the backend.
 * - It first dispatches `loginStart()` to indicate the login request has started.
 * - It then makes an API request to authenticate the user.
 * - If successful, it dispatches `loginSuccess()` with the user's data.
 * - If there's an error, it dispatches `loginFailure()` with the error message.
 */
export const login = (email, password) => async (dispatch) => {
    dispatch(loginStart()); // 🔥 Set loading to true & reset any previous errors
    try {
        // 🔹 Send login request to the backend API
        const response = await fetch(`${API_URL}/login`, {
            method: "POST", // Use POST method for authentication
            headers: { "Content-Type": "application/json" }, // Set request headers
            body: JSON.stringify({ email, password }), // Convert email & password to JSON
            credentials: "include", // 🔥 Ensures cookies are included in the request
        });

        // 🔹 Parse response data as JSON
        const data = await response.json();
        console.log(data); // Debugging: Check the response data in the console

        // 🔹 Check if the response status is NOT OK (e.g., invalid credentials)
        if (!response.ok) throw new Error(data.message || "Login Failed");

        console.log("login successful:", data); // Debugging: Confirm login success

        // 🔹 Dispatch loginSuccess action to store user data in Redux state
        dispatch(loginSuccess(data));
    } catch (error) {
        dispatch(loginFailure(error.message)); // 🔹 Dispatch loginFailure with error message
    }
};

/**
 * 🔹 Logout Action
 * This function handles user logout by dispatching the `logout()` action.
 * - It does not need an API call if authentication is handled via cookies.
 * - If using JWT in localStorage, this function should also clear localStorage.
 */
export const logoutUser = () => async (dispatch) => {
    dispatch(logout()); // 🔹 Dispatch logout action to clear user state in Redux
};
