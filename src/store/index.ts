import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userReducer";
import carReducer from "./car/carReducer";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

const store = configureStore({
  reducer: { user: userReducer, car: carReducer },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
