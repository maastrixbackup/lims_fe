// src/utils/listSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../utils/config";

// ✅ Fetch Projects
export const fetchProjects = createAsyncThunk(
  "list/fetchProjects",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.userToken;
    if (!token) return rejectWithValue("No token found");

    try {
      const res = await fetch(`${API_BASE_URL}/project/projectList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch projects");
      return data.projects || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch Villages
export const fetchVillages = createAsyncThunk(
  "list/fetchVillages",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.userToken;
    if (!token) return rejectWithValue("No token found");

    try {
      const res = await fetch(`${API_BASE_URL}/village/villageList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("village data redux", data)

      if (!data.success) throw new Error(data.message || "Failed to fetch villages");
      return data.villages || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Slice
const listSlice = createSlice({
  name: "list",
  initialState: {
    projects: [],
    villages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Villages
      .addCase(fetchVillages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.villages = action.payload;
      })
      .addCase(fetchVillages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listSlice.reducer;
