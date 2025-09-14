import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const createUser = createAsyncThunk(
  "user/createUser",
  async (nickname, { rejectWithValue }) => {
    try {
      const response = await api.post("/users", { nickname });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Create user failed"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    nickname: null,
    userId: null,
    error: null,
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.nickname = action.payload?.nickname;
        state.userId = action.payload?.userId;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
