import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    auth: {
        user: null,
        token: null,
        loading: false,
        error: null 
        },

    profile: {
        bio: null,
        isAdmin: false
    }
};

const authSlice = createSlice({
    name: "userDetails", 
    initialState,
    reducers: {
        loginStart: (state) => {
            state.auth.loading = true;
            state.auth.error = null;
        },
        loginSuccess: (state, action) => {
            state.auth.loading = false;
            state.auth.user = action.payload.user;
            state.auth.token = action.payload.token;
        },
        loginFailure: (state, action) => {
            state.auth.loading = false
            state.auth.error = action.payload;
        },
        logout: (state) => {
            state.auth.user = null;
            state.auth.token = null;
        }

    }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer