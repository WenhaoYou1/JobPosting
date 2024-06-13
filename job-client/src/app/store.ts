import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import jobReducer from "../features/jobSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
