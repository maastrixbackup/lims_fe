// src/utils/khataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const khataSlice = createSlice({
  name: "khata",
  initialState: {
    selectedKhataId: null,
  },
  reducers: {
    setSelectedKhataId: (state, action) => {
      state.selectedKhataId = action.payload;
    },
    clearSelectedKhataId: (state) => {
      state.selectedKhataId = null;
    },
  },
});

export const { setSelectedKhataId, clearSelectedKhataId } = khataSlice.actions;
export default khataSlice.reducer;
