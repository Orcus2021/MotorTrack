import { userActions } from "./userReducer";
import asyncCarAction from "../car/asyncCarAction";
import asyncRecordAction from "../record/asyncRecordAction";
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
            continueRemind: false,
          };
          await firebase.setDoc(`/users/${userID}`, initUser);

          return initUser;
        }
      };

      try {
        const user = await signUp();

        dispatch(userActions.signUp(user));
        dispatch(userActions.loading(false));
      } catch (e) {
        console.log(e);
      }
    };
  },
  signIn(data: userLogin | string) {
    return async (dispatch: AppDispatch) => {
      dispatch(userActions.loading(true));

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

        dispatch(userActions.signIn(user));

        if (user.selectCar.length > 0) {
          dispatch(carActions.selectCar(user.selectCar));
          await dispatch(asyncRecordAction.getAllRecords(user.selectCar));
        }
      } catch (e: any) {
        if (
          e.message.includes("auth/user-not-found") ||
          e.message.includes("auth/wrong-password")
        ) {
          createMessage("error", dispatch, "帳號或密碼錯誤");
        }
        dispatch(userActions.loading(false));
      }
    };
  },
  logout() {
    return async (dispatch: AppDispatch) => {
      const logout = async () => {
        await firebase.logout();
      };

      try {
        await logout();
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
