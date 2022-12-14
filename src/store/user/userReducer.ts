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
  continueRemind: false,
  pushToken: [],
};

const initialUserState = {
  user: initUser,
  notification: null as notificationType | null,
  isAuth: false,
  isLoading: false,
  isNav: false,
  isOffline: false,
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
        type: action.payload.type,
        message: action.payload.message,
        timerId: action.payload.timerId,
      };
    },
    loading(state, action) {
      state.isLoading = action.payload;
    },
    showNav(state, action) {
      state.isNav = action.payload;
    },
    setOffline(state, action) {
      state.isOffline = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
