import { createSlice } from "@reduxjs/toolkit";
import { userType, notificationType } from "../../types/userType";
const initUser: userType = {
  id: "",
  name: "",
  email: "",
  userImg: "",
  cars: 0,
  bannerImg: "",
  selectCar: "",
};

const initialUserState = {
  user: initUser,
  notification: null as notificationType | null,
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
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

export const userActions = userSlice.actions;
export default userSlice.reducer;
