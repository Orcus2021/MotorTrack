import { createSlice } from "@reduxjs/toolkit";

const initialRecor = {
  fee: [],
  repair: [],
  refuel: [],
  parts: {},
};

const recordSlice = createSlice({
  name: "user",
  initialState: initialRecord,
  reducers: {
    signUp(state, action) {
      state.user = action.payload;
      state.isAuth = true;
    },
    signIn(state, action) {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout(state) {
      state.user = initUser;
      state.isAuth = false;
    },
    update(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const recordActions = recordSlice.actions;
export default recordSlice.reducer;
