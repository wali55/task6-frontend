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

export const deleteSlide = createAsyncThunk(
  "presentation/deleteSlide",
  async ({ presentationId, slideId, userId }, { rejectWithValue }) => {
    try {
      await api.delete(`/slides/${presentationId}/slides/${slideId}`, {
        data: { userId }
      });
      return { slideId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete slide"
      );
    }
  }
);

export const changeUserRole = createAsyncThunk(
  "presentation/changeUserRole",
  async ({ presentationId, targetUserId, role, userId }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/presentations/${presentationId}/users/${targetUserId}/role`, {
        userId,
        role
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change role"
      );
    }
  }
);

const presentationSlice = createSlice({
  name: "presentation",
  initialState: {
    currentPresentation: null,
    activeUsers: [],
    slides: [],
    selectedSlide: null,
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
    setSlides: (state, action) => {
      state.slides = action.payload;
    },
    setSelectedSlide: (state, action) => {
      state.selectedSlide = action.payload;
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
    slideAdded: (state, action) => {
      state.slides.push(action.payload);
    },
    slideDeleted: (state, action) => {
      state.slides = state.slides.filter(slide => slide.id !== action.payload.slideId);
      if (state.selectedSlide?.id === action.payload.slideId) {
        state.selectedSlide = state.slides[0] || null;
      }
    },
    roleChanged: (state, action) => {
      const user = state.activeUsers.find(u => u.userId === action.payload.userId);
      if (user) {
        user.role = action.payload.role;
      }
    }
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
      .addCase(fetchSinglePresentation.fulfilled, (state, action) => {
        state.currentPresentation = action.payload;
        state.slides = action.payload.slides || [];
        state.selectedSlide = action.payload.slides?.[0] || null;
      })
      .addCase(createPresentation.fulfilled, (state, action) => {
        state.presentations.push(action.payload);
        state.showCreateForm = false;
      })
      .addCase(deleteSlide.fulfilled, (state, action) => {
        state.slides = state.slides.filter(slide => slide.id !== action.payload.slideId);
        if (state.selectedSlide?.id === action.payload.slideId) {
          state.selectedSlide = state.slides[0] || null;
        }
      });
  }
});

export const {
  setCurrentPresentation,
  setShowCreateForm,
  setActiveUsers,
  setSlides,
  setSelectedSlide,
  setConnected,
  userJoined,
  userLeft,
  userLeftPresentation,
  slideAdded,
  slideDeleted,
  roleChanged
} = presentationSlice.actions;

export default presentationSlice.reducer;
