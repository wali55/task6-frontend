import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import presentationReducer from "./slices/presentationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    presentation: presentationReducer,
  },
});
