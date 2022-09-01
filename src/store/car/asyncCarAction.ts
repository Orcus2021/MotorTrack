import { carActions } from "./carReducer";
import asyncUserAction from "../user/asyncUserAction";
import { AppDispatch } from "../index";
import { carType } from "../../types/carType";
import firebase from "../../utils/firebase";

export const carAge = (date: string) => {
  const dateArr = date.split("-");
  const nowDate = new Date();
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];
  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth() + 1;
  const nowDay = nowDate.getDate();
  const ageYear = nowYear - Number(year);
  const ageMonth = nowMonth - Number(month);
  const ageDay = nowDay - Number(day);
  let months;
  if (ageDay >= 0) {
    months = ageYear * 12 + ageMonth;
  } else {
    months = ageYear * 12 + ageMonth - 1;
  }
  let age;
  if (months >= 12 && months % 12 === 0) {
    age = `${Math.floor(months / 12)}年`;
  } else if (months >= 12 && months % 12 !== 0) {
    age = `${Math.floor(months / 12)}年${months % 12}個月`;
  } else if (months <= 0) {
    age = "0個月";
  } else {
    age = `${months}個月`;
  }
  let inspectionDay: string = "";
  if (Math.floor(months / 12) < 5) {
    inspectionDay = `${nowYear + 5}-${month}-${day}`;
  } else if (Math.floor(months / 12) >= 5 && ageMonth >= 0 && ageDay >= 0) {
    inspectionDay = `${nowYear}-${month}-${day}`;
  } else if (
    (Math.floor(months / 12) >= 5 && ageMonth < 0) ||
    (Math.floor(months / 12) >= 5 && ageMonth === 0 && ageDay <= 0)
  ) {
    inspectionDay = `${nowYear + 1}-${month}-${day}`;
  }
  return { age, inspectionDay };
};

const asyncCarAction = {
  create(id: string, carNum: number, data: carType) {
    return async (dispatch: AppDispatch) => {
      const create = async () => {
        const { age, inspectionDay } = carAge(data.licenseDate);
        data.age = age;
        data.inspectionDay = inspectionDay;

        const response = await firebase.setCarDoc(data);
        if (response) {
          dispatch(carActions.create(response));
          dispatch(
            asyncUserAction.updateUser(id, {
              cars: carNum + 1,
              selectCar: response.id,
            })
          );
        }
      };
      try {
        await create();
      } catch (e) {
        console.log(e);
      }
    };
  },
  getCars(id: string) {
    return async (dispatch: AppDispatch) => {
      const get = async () => {
        const response = await firebase.getCars(id);
        if (response) {
          return response;
        }
      };
      try {
        const cars = await get();
        dispatch(carActions.getCars(cars));
      } catch (e) {
        console.log(e);
      }
    };
  },
  updateCar(id: string, data: object) {
    return async (dispatch: AppDispatch) => {
      const url = `/carsRecords/${id}`;
      const update = async () => {
        await firebase.updateDoc(url, data);
      };
      try {
        await update();
        dispatch(carActions.update(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  deleteCar(id: string) {
    return async (dispatch: AppDispatch) => {
      const url = `/carsRecords/${id}`;
      const deleteCar = async () => {
        await firebase.delete(url);
      };
      try {
        await deleteCar();
        dispatch(carActions.delete(id));
        console.log("delete", id);
      } catch (e) {
        console.log(e);
      }
    };
  },
};
export default asyncCarAction;
