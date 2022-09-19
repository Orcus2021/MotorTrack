import { userActions } from "./userReducer";
import asyncCarAction from "../car/asyncCarAction";
import asyncRecordAction from "../record/asyncRecordAction";
import { recordActions } from "../record/recordReducer";
import { carActions } from "../car/carReducer";
import { AppDispatch } from "../index";
import firebase from "../../utils/firebase";
import { userLogin } from "../../types/userType";
import { userType } from "../../types/userType";
import { createMessage } from "../../utils/calcFunc";

const asyncUserAction = {
  signUp(data: userLogin) {
    return async (dispatch: AppDispatch) => {
      dispatch(userActions.loading(true));
      // dispatch(
      //   userActions.showNotification({
      //     status: "pending",
      //     title: "Sending...",
      //     message: "Sending user data!",
      //   })
      // );
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
            insuranceRemind: false,
            inspectionRemind: false,
            continueRemind: true,
          };
          await firebase.setDoc(`/users/${userID}`, initUser);

          return initUser;
        }
      };

      try {
        const user = await signUp();

        dispatch(userActions.signUp(user));
        dispatch(userActions.loading(false));
        // dispatch(
        //   userActions.showNotification({
        //     status: "success",
        //     title: "Success",
        //     message: "Sign up successfully!",
        //   })
        // );
      } catch (e) {
        console.log(e);
        // dispatch(
        //   userActions.showNotification({
        //     status: "error",
        //     title: "Error",
        //     message: "Sign up is failed!",
        //   })
        // );
      }
    };
  },
  signIn(data: userLogin | string) {
    return async (dispatch: AppDispatch) => {
      dispatch(userActions.loading(true));
      // dispatch(
      //   userActions.showNotification({
      //     status: "pending",
      //     title: "Sending...",
      //     message: "Sending user data!",
      //   })
      // );
      const signIn = async () => {
        let userID = data;
        if (typeof data !== "string") {
          userID = await firebase.signIn(data).catch((e) => {
            throw new Error(e);
          });
        }
        if (typeof userID === "string") {
          dispatch(asyncCarAction.getCars(userID));
          return await firebase.getDoc(`/users/${userID}`);
        }
      };

      try {
        const user = (await signIn()) as userType;
        console.log(user);
        dispatch(userActions.signIn(user));

        if (user.selectCar.length > 0) {
          dispatch(carActions.selectCar(user.selectCar));
          await dispatch(asyncRecordAction.getAllRecords(user.selectCar));
        }
        // dispatch(userActions.loading(false));
        // dispatch(
        //   userActions.showNotification({
        //     status: "success",
        //     title: "Success",
        //     message: "Sign in successfully!",
        //   })
        // );
      } catch (e: any) {
        console.log(e.message);
        if (
          e.message.includes("auth/user-not-found") ||
          e.message.includes("auth/wrong-password")
        ) {
          createMessage("error", dispatch, "帳號或密碼錯誤");
        }
        dispatch(userActions.loading(false));

        // dispatch(
        //   userActions.showNotification({
        //     status: "error",
        //     title: "Error",
        //     message: "Sign in is failed!",
        //   })
        // );
      }
    };
  },
  logout() {
    return (dispatch: AppDispatch) => {
      // dispatch(
      //   userActions.showNotification({
      //     status: "pending",
      //     title: "Sending...",
      //     message: "Logging out",
      //   })
      // );
      const logout = () => {
        firebase.logout();
      };

      try {
        logout();
        dispatch(userActions.logout());
        createMessage("success", dispatch, "已成功登出");
      } catch (e) {
        console.log(e);
      }
    };
  },
  updateUser(id: string, data: object) {
    return async (dispatch: AppDispatch) => {
      const update = () => {
        firebase.updateDoc(`/users/${id}`, data);
      };

      try {
        update();
        dispatch(userActions.update(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  uploadImage(id: string, type: string, file: File) {
    return async (dispatch: AppDispatch) => {
      let data = {};
      const upload = async () => {
        let url = `/${id}/user/${file.name}`;
        if (type === "banner") url = `/${id}/banner/${file.name}`;

        const response = await firebase.uploadImage(url, file);
        if (response) {
          const url = `/users/${id}`;

          if (type === "banner") {
            data = { bannerImg: response };
          } else {
            data = { userImg: response };
          }
          await firebase.updateDoc(url, data);
        }
      };

      try {
        console.log("upload");
        dispatch(userActions.loading(true));
        await upload();
        dispatch(userActions.update(data));
        dispatch(userActions.loading(false));
      } catch (e) {
        console.log(e);
      }
    };
  },
};

export default asyncUserAction;
