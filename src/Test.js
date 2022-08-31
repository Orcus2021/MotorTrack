import React, { useState } from "react";
import asyncCarAction from "./store/car/asyncCarAction";
import { carActions } from "./store/car/carReducer";
import { useAppDispatch, useAppSelector } from "./store/index";

const Test = () => {
  const [carName, setCarName] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carLicensePlateNum, setCarLicensePlateNum] = useState("");
  const [carInsuranceDate, setCarInsuranceDate] = useState("");
  const [carLicenseDate, setCarLicenseDate] = useState("");
  const [carID, setCarID] = useState("");
  const cars = useAppSelector((state) => state.car.cars);
  const car = useAppSelector((state) => state.car.car);
  const userId = useAppSelector((state) => state.user.user.id);
  console.log(userId);
  console.log(cars);
  console.log(car);

  const dispatch = useAppDispatch();

  const createCar = () => {
    const carObj = {
      ownerId: userId,
      id: "",
      name: carName,
      brand: carBrand,
      mileage: 0,
      plateNum: carLicensePlateNum,
      insuranceDate: carInsuranceDate,
      licenseDate: carLicenseDate,
    };
    dispatch(asyncCarAction.create(carObj));
  };
  const getCar = () => {
    dispatch(asyncCarAction.getCars(userId));
  };
  const nameHandler = (e) => {
    setCarName(e.target.value);
  };

  const brandHandler = (e) => {
    setCarBrand(e.target.value);
  };
  const plateNumHandler = (e) => {
    setCarLicensePlateNum(e.target.value);
  };
  const insuranceHandler = (e) => {
    setCarInsuranceDate(e.target.value);
  };
  const licenseDateHandler = (e) => {
    setCarLicenseDate(e.target.value);
  };
  console.log(carID);
  const selectCar = () => {
    dispatch(carActions.selectCar(carID));
  };
  const updateCar = () => {
    const newCar = { ...car, name: "壞透了" };

    dispatch(
      asyncCarAction.updateCar(`/carsRecords/2bS9IHW1qDdcElhJYPkU`, newCar)
    );
  };
  const deleteCar = () => {
    dispatch(asyncCarAction.deleteCar(carID));
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="nickname"
          value={carName}
          onChange={nameHandler}
        />
        <input
          type="text"
          placeholder="brand"
          value={carBrand}
          onChange={brandHandler}
        />
        <input
          type="text"
          placeholder="PlateNum"
          value={carLicensePlateNum}
          onChange={plateNumHandler}
        />
        <input
          type="date"
          placeholder="Insurance"
          value={carInsuranceDate}
          onChange={insuranceHandler}
        />
        <input
          type="date"
          placeholder="License"
          value={carLicenseDate}
          onChange={licenseDateHandler}
        />
        <input
          type="text"
          placeholder="ID"
          value={carID}
          onChange={(e) => setCarID(e.target.value)}
        />
        <button onClick={createCar}>SEND</button>
        <button onClick={getCar}>GET</button>
        <button onClick={selectCar}>SELECT</button>
        <button onClick={updateCar}>UPDATE</button>

        {cars.length > 0 &&
          cars.map((d) => {
            return <p>{d.id}</p>;
          })}
      </div>
      <div>
        <button onClick={deleteCar}>DELETE</button>
      </div>
    </>
  );
};

export default Test;
