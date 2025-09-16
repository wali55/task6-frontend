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
        data: { userId },
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
  async (
    { presentationId, targetUserId, role, userId },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(
        `/presentations/${presentationId}/users/${targetUserId}/role`,
        {
          userId,
          role,
        }
      );
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
    showCreateForm: false,
    currentSlideIndex: 0,
    selectedTextBlock: null,
    isDragging: false,
    isPresentMode: false,
    currentSlideId: null,
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
      state.slides = action.payload.slides;
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
      state.slides = state.slides.filter(
        (slide) => slide.id !== action.payload.slideId
      );
      if (state.selectedSlide?.id === action.payload.slideId) {
        state.selectedSlide = state.slides[0] || null;
      }
    },
    roleChanged: (state, action) => {
      const user = state.activeUsers.find(
        (u) => u.userId === action.payload.userId
      );
      if (user) {
        user.role = action.payload.role;
      }
    },
    setCurrentSlide: (state, action) => {
      state.currentSlideIndex = action.payload;
    },
    textBlockAdded: (state, action) => {
      const { slideId, textBlock } = action.payload;
      const slide = state.slides.find((s) => s.id === slideId);
      if (slide) {
        if (!slide.content) slide.content = { elements: [] };
        slide.content.elements.push(textBlock);

        if (state.selectedSlide?.id === slideId) {
          state.selectedSlide = { ...slide };
        }
      }
    },
    textBlockDeleted: (state, action) => {
      const { slideId, blockId } = action.payload;
      const slide = state.slides.find((s) => s.id === slideId);
      if (slide) {
        slide.content.elements = slide.content.elements.filter(
          (el) => el.id !== blockId
        );
      }

      if (state.selectedSlide?.id === slideId) {
        state.selectedSlide.content.elements =
          state.selectedSlide.content.elements.filter(
            (el) => el.id !== blockId
          );
      }

      if (state.selectedTextBlock === blockId) {
        state.selectedTextBlock = null;
      }
    },
    textBlockUpdated: (state, action) => {
      const { slideId, blockId, updates } = action.payload;

      const slide = state.slides.find((s) => s.id === slideId);
      if (slide) {
        const blockIndex = slide.content?.elements?.findIndex(
          (el) => el.id === blockId
        );
        if (blockIndex !== -1) {
          slide.content.elements[blockIndex] = {
            ...slide.content.elements[blockIndex],
            ...updates,
          };
        }
      }

      if (state.selectedSlide?.id === slideId) {
        const blockIndex = state.selectedSlide.content?.elements?.findIndex(
          (el) => el.id === blockId
        );
        if (blockIndex !== -1) {
          state.selectedSlide.content.elements[blockIndex] = {
            ...state.selectedSlide.content.elements[blockIndex],
            ...updates,
          };
        }
      }
    },

    textBlockMoved: (state, action) => {
      const { slideId, blockId, x, y } = action.payload;

      const slide = state.slides.find((s) => s.id === slideId);
      if (slide) {
        const block = slide.content?.elements?.find((el) => el.id === blockId);
        if (block) {
          block.x = x;
          block.y = y;
        }
      }

      if (state.selectedSlide?.id === slideId) {
        const block = state.selectedSlide.content?.elements?.find(
          (el) => el.id === blockId
        );
        if (block) {
          block.x = x;
          block.y = y;
        }
      }
    },
    setSelectedTextBlock: (state, action) => {
      state.selectedTextBlock = action.payload;
    },
    setDragging: (state, action) => {
      state.isDragging = action.payload;
    },
    presentationStarted: (state, action) => {
      state.isPresentMode = true;
      state.currentSlideId = action.payload.currentSlideId;
    },
    presentationEnded: (state) => {
      state.isPresentMode = false;
      state.currentSlideId = null;
    },
    slideNavigated: (state, action) => {
      state.currentSlideId = action.payload.currentSlideId;
    },
    setPresentationState: (state, action) => {
      const { presentation } = action.payload;
      state.isPresentMode = presentation.isPresentMode || false;
      state.currentSlideId = presentation.currentSlideId || null;
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
        state.slides = state.slides.filter(
          (slide) => slide.id !== action.payload.slideId
        );
        if (state.selectedSlide?.id === action.payload.slideId) {
          state.selectedSlide = state.slides[0] || null;
        }
      });
  },
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
  roleChanged,
  setCurrentSlide,
  textBlockAdded,
  textBlockUpdated,
  textBlockDeleted,
  textBlockMoved,
  setSelectedTextBlock,
  setDragging,
  presentationStarted,
  presentationEnded,
  slideNavigated,
  setPresentationState,
} = presentationSlice.actions;

export default presentationSlice.reducer;
