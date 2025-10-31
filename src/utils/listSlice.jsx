import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../utils/config";

// 🔹 Fetch project list
export const fetchProjects = createAsyncThunk(
  "list/fetchProjects",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/project/projectList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.projects || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch village list
export const fetchVillages = createAsyncThunk(
  "list/fetchVillages",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/village/villageList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.villages || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const listSlice = createSlice({
  name: "list",
  initialState: {
    projects: [],
    villages: [],
    loading: false,
    error: null,
  },
  reducers: {},

});

export default listSlice.reducer;
