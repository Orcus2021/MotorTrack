import { carActions } from "./carReducer";
import asyncUserAction from "../user/asyncUserAction";
import { AppDispatch } from "../index";
import { carType } from "../../types/carType";
import { carAgeAndInspectionDay } from "../../utils/calcFunc";
import firebase from "../../utils/firebase";

const asyncCarAction = {
  create(id: string, carNum: number, data: carType) {
    return async (dispatch: AppDispatch) => {
      const create = async () => {
        const { age, inspectionDay } = carAgeAndInspectionDay(data.licenseDate);
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
  deleteCar(id: string, carNum: number, cars: carType[]) {
    return async (dispatch: AppDispatch) => {
      const url = `/carsRecords/${id}`;
      const deleteCar = async () => {
        const response = await firebase.delete(url);
        const carArr = cars.filter((car) => car.id !== id);
        if (response) {
          dispatch(
            asyncUserAction.updateUser(id, {
              cars: carNum - 1,
              selectCar: carArr[0].id,
            })
          );
        }
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
