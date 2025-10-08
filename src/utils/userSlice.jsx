// src/utils/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Load persisted data from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("userToken");

const initialState = {
  loading: false,
  user: storedUser ? JSON.parse(storedUser) : null, // ✅ restore user object
  userToken: storedToken || null, // ✅ restore token
  error: null,
  success: false,
};

console.log("Initial user state************:...", initialState);

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.userToken = action.payload.token;

      // ✅ Persist to localStorage
      localStorage.setItem("userToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.userToken = null;
      state.success = false;
      state.error = null;

      // ✅ Clear localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
