// Importing `createSlice` from Redux Toolkit to create a slice of state
import { createSlice } from "@reduxjs/toolkit";

// 🔹 Load auth state from localStorage (if available)
const loadAuthState = () => {
    try {
        const serializedState = localStorage.getItem("authState");
        return serializedState ? JSON.parse(serializedState) : null;
    } catch (error) {
        console.error("Error loading auth state:", error);
        return null;
    }
};

// 🔹 Define the initial state of the authentication-related data
const initialState = loadAuthState() || {
    auth: {
        user: null,   // Stores the logged-in user's details (null when not logged in)
        loading: false, // Indicates if an authentication request is in progress
        error: null  // Stores any authentication errors
    },

    profile: {
        bio: null,     // Placeholder for user biography (future expansion)
        isAdmin: false // Boolean flag to indicate if the user has admin privileges
    }
};

// 🔹 Create an authentication slice using Redux Toolkit's `createSlice`
const authSlice = createSlice({
    name: "userDetails", // 🔹 This name is used as the key in Redux state
    initialState,        // 🔹 The defined initial state is used here

    // 🔹 Define Redux reducers that modify the state based on dispatched actions
    reducers: {
        // 🔹 Handles login request start (sets loading to true)
        // 🔹 Register reducers
        registerStart: (state) => {
            state.auth.loading = true;
            state.auth.error = null;
        },
        registerSuccess: (state, action) => {
            state.auth.loading = false;
            state.auth.user = action.payload;

            // 🔥 Save updated auth state to localStorage after successful registration
            localStorage.setItem("authState", JSON.stringify(state));
        },
        registerFailure: (state, action) => {
            state.auth.loading = false;
            state.auth.error = action.payload;
        },
        loginStart: (state) => {
            state.auth.loading = true;  // Set loading state to true during login request
            state.auth.error = null;    // Reset any previous error messages
        },

        // 🔹 Handles successful login (stores user and token in state)
        loginSuccess: (state, action) => {
            state.auth.loading = false; // Login completed, so loading is set to false
            state.auth.user = action.payload.user; // Store the logged-in user's details

            // 🔥 Save updated auth state to localStorage
            localStorage.setItem("authState", JSON.stringify(state));
        },

        // 🔹 Handles login failure (stores error message)
        loginFailure: (state, action) => {
            state.auth.loading = false; // Login attempt finished, stop loading
            state.auth.error = action.payload; // Store the error message
        },

        // 🔹 Handles user logout (clears user data and authentication token)
        logout: (state) => {
            state.auth.user = null;  // Reset user state (logged out)
            state.auth.token = null; // Clear authentication token

            // 🔥 Clear auth state from localStorage on logout
            localStorage.removeItem("authState");
        }
    }
});

// 🔹 Exporting action creators so they can be dispatched in components
export const { registerStart, registerSuccess, registerFailure, loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// 🔹 Exporting the reducer so it can be added to the Redux store
export default authSlice.reducer;
