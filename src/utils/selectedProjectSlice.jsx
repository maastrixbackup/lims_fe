// src/utils/selectedProjectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const selectedProjectSlice = createSlice({
  name: "selectedProject",
  initialState: { project: null },
  reducers: {
    setSelectedProject: (state, action) => {
      state.project = action.payload;
    },
    clearSelectedProject: (state) => {
      state.project = null;
    },
  },
});

export const { setSelectedProject, clearSelectedProject } =
  selectedProjectSlice.actions;
export default selectedProjectSlice.reducer;
