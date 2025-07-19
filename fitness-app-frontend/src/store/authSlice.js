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

        },
        logout: (state) => {

        },
    },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;