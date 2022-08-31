import { userActions } from "./userReducer";
import asyncCarAction from "../car/asyncCarAction";
import { AppDispatch } from "../index";
import firebase from "../../utils/firebase";
import { userLogin } from "../../types/userType";

const asyncUserAction = {
  signUp(data: userLogin) {
    return async (dispatch: AppDispatch) => {
      dispatch(
        userActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending user data!",
        })
      );
      const signUp = async () => {
        const userID = await firebase.signUp(data).catch((e) => {
          throw new Error(e);
        });

        if (userID) {
          const initUser = {
            id: userID,
            name: data.name,
            email: data.email,
            userImg: "",
            cars: 0,
            bannerImg: "",
            selectCar: "",
          };
          await firebase.setDoc(`/users/${userID}`, initUser);

          return initUser;
        }
      };

      try {
        const user = await signUp();

        dispatch(userActions.signUp(user));
        dispatch(
          userActions.showNotification({
            status: "success",
            title: "Success",
            message: "Sign up successfully!",
          })
        );
      } catch (e) {
        console.log(e);
        dispatch(
          userActions.showNotification({
            status: "error",
            title: "Error",
            message: "Sign up is failed!",
          })
        );
      }
    };
  },
  signIn(data: userLogin) {
    return async (dispatch: AppDispatch) => {
      dispatch(
        userActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending user data!",
        })
      );
      const signIn = async () => {
        const userID = await firebase.signIn(data).catch((e) => {
          throw new Error(e);
        });

        if (userID) {
          dispatch(asyncCarAction.getCars(userID));
          return await firebase.getDoc(`/users/${userID}`);
        }
      };

      try {
        const user = await signIn();
        dispatch(userActions.signIn(user));
        dispatch(
          userActions.showNotification({
            status: "success",
            title: "Success",
            message: "Sign in successfully!",
          })
        );
      } catch (e) {
        console.log(e);
        dispatch(
          userActions.showNotification({
            status: "error",
            title: "Error",
            message: "Sign in is failed!",
          })
        );
      }
    };
  },
  logout() {
    return async (dispatch: AppDispatch) => {
      dispatch(
        userActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Logging out",
        })
      );
      const logout = async () => {
        await firebase.logout();
      };

      try {
        await logout();
        dispatch(userActions.logout());
        dispatch(
          userActions.showNotification({
            status: "success",
            title: "Success",
            message: "Log out successfully!",
          })
        );
      } catch (e) {
        console.log(e);
      }
    };
  },
  updateUser(id: string, data: object) {
    return async (dispatch: AppDispatch) => {
      const update = async () => {
        const response = await firebase.updateDoc(`/users/${id}`, data);
        console.log(response);
      };

      try {
        await update();
        dispatch(userActions.update(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
};

export default asyncUserAction;
