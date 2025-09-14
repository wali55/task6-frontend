import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPresentations = createAsyncThunk(
  "presentation/fetchPresentations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/presentations");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get presentations"
      );
    }
  }
);

export const fetchSinglePresentation = createAsyncThunk(
  "presentation/fetchSinglePresentation",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/presentations/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get presentation"
      );
    }
  }
);

export const createPresentation = createAsyncThunk(
  "presentation/createPresentation",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/presentations", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create presentation"
      );
    }
  }
);

const presentationSlice = createSlice({
  name: "presentation",
  initialState: {
    currentPresentation: null,
    activeUsers: [],
    isConnected: false,
    presentations: [],
    loading: false,
    error: null,
    showCreateForm: false
  },
  reducers: {
    setCurrentPresentation: (state, action) => {
      state.currentPresentation = action.payload;
    },
    setShowCreateForm: (state, action) => {
      state.showCreateForm = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    userJoined: (state, action) => {
      state.activeUsers = action.payload.activeUsers;
    },
    userLeft: (state, action) => {
      state.activeUsers = action.payload.activeUsers;
    },
    userLeftPresentation: (state, action) => {
      state.activeUsers = action.payload.activeUsers;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPresentations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresentations.fulfilled, (state, action) => {
        state.loading = false;
        state.presentations = action.payload;
      })
      .addCase(fetchPresentations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSinglePresentation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSinglePresentation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPresentation = action.payload;
      })
      .addCase(fetchSinglePresentation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPresentation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPresentation.fulfilled, (state, action) => {
        state.loading = false;
        state.presentations.push(action.payload);
      })
      .addCase(createPresentation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentPresentation,
  setActiveUsers,
  setConnected,
  userJoined,
  userLeft,
  setShowCreateForm,
  userLeftPresentation
} = presentationSlice.actions;

export default presentationSlice.reducer;
