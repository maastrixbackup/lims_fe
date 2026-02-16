import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../utils/config";

/* ===================== FETCH PROJECTS ===================== */
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

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      return data.projects || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===================== FETCH VILLAGES ===================== */
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

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch villages");
      }

      return data.villages || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===================== SLICE ===================== */
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

      /* ---------- PROJECTS ---------- */
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;

        state.projects = (action.payload || []).map((p) => ({
          id: p.id || p.project_id,
          project_name: p.project_name || p.name,
          status: p.status,
          client_code: p.client_code || "",
          created_at: p.created_at,
          project_location: p.project_location || "",
          type: p.type, // ✅🔥 FIX (MOST IMPORTANT LINE)
        }));
      })

      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- VILLAGES ---------- */
      .addCase(fetchVillages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.villages = action.payload || [];
      })

      .addCase(fetchVillages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listSlice.reducer;
