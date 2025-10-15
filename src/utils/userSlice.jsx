// src/utils/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// ✅ Load persisted data from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("userToken");
const storedAccess = localStorage.getItem("accessed_projects");
console.log("Stored user from localStorage:", storedUser);
console.log("Stored token from localStorage:", storedToken);
console.log("Stored accessed_projects from localStorage:", storedAccess); 

const initialState = {
  loading: false,
  user: storedUser ? JSON.parse(storedUser) : null,
  userToken: storedToken || null,
  accessed_projects: storedAccess ? JSON.parse(storedAccess) : [],
  error: null,
  success: false,
};

console.log("Initial user state************:...", initialState);

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token, accessed_projects } = action.payload;
      state.user = user;
      state.userToken = token;
      state.accessed_projects = accessed_projects || [];
      state.success = true;
      state.error = null;

      // ✅ Persist data to localStorage
      localStorage.setItem("userToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "accessed_projects",
        JSON.stringify(accessed_projects || [])
      );
    },
    logout: (state) => {
      state.user = null;
      state.userToken = null;
      state.accessed_projects = [];
      state.success = false;
      state.error = null;

      // ✅ Clear from localStorage
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("accessed_projects");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
