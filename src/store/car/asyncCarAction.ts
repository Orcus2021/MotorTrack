import { carActions } from "./carReducer";
import { AppDispatch } from "../index";
import { carType } from "../../types/carType";
import firebase from "../../utils/firebase";

const asyncCarAction = {
  create(data: carType) {
    return async (dispatch: AppDispatch) => {
      const create = async () => {
        const response = await firebase.setCarDoc(data);
        if (response) {
          dispatch(carActions.create(response));
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
  updateCar(url: string, data: carType) {
    return async (dispatch: AppDispatch) => {
      const update = async () => {
        await firebase.setDoc(url, data);
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
