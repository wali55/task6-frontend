import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    nickname: null,
    isConnected: false,
  },
  reducers: {
    setNickname: (state, action) => {
      state.nickname = action.payload;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setNickname, setConnected } = userSlice.actions;
export default userSlice.reducer;