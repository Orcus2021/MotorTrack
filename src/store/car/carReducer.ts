import { createSlice } from "@reduxjs/toolkit";
import { carType } from "../../types/carType";

const initialCarState = {
  cars: [] as carType[],
  car: {} as carType | undefined,
};

const carSlice = createSlice({
  name: "car",
  initialState: initialCarState,
  reducers: {
    create(state, action) {
      state.cars.push(action.payload);
      state.car = action.payload;
    },
    getCars(state, action) {
      state.cars = action.payload;
    },
    selectCar(state, action) {
      state.car = state.cars.find((car) => car.id === action.payload);
    },
    update(state, action) {
      const carIndex = state.cars.findIndex(
        (car) => car.id === action.payload.id
      );
      state.cars[carIndex] = { ...state.cars[carIndex], ...action.payload };
      state.car = { ...state.car, ...action.payload };
    },
    delete(state, action) {
      state.cars = state.cars.filter((car) => car.id !== action.payload);
      state.car = state.cars[0];
    },
    clear(state) {
      state.cars = [];
      state.car = undefined;
    },
  },
});

export const carActions = carSlice.actions;
export default carSlice.reducer;
