//create slice for authentication state management
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.userId = action.payload.user.sub;

            // Save token and user data to localStorage
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("userId", action.payload.user.sub);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.userId = null;

            // Clear token and user data from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userId");

        },
    },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;