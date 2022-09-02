import React, { useState } from "react";
import firebase from "./utils/firebase";
import asyncRecordAction from "./store/record/asyncRecordAction";
import styled from "styled-components/macro";
import { useAppDispatch, useAppSelector } from "./store/index";
import { useForm } from "react-hook-form";
import { arrayUnion } from "firebase/firestore";

const From = styled.form`
  margin-top: 68px;
`;
const Test = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });
  const carID = useAppSelector((state) => state.car.car.id);
  const repair = useAppSelector((state) => state.record.repair);
  const part = useAppSelector((state) => state.record.parts);
  console.log("repair", repair);
  console.log("part", part);
  const dispatch = useAppDispatch();

  const createRecord = (record) => {
    record.id = "";
    record.category = "repair";

    const partObj = {
      recordID: "",
      category: "engineOil",
      spec: "ART999",
      startDate: "2022-5-5",
      endDate: "2022-7-5",
      startMileage: 1000,
      endMileage: 2000,
      price: 13123,
      qty: 1,
      subTotal: 13123,
      note: "dsfafd",
    };
    const partObj1 = {
      recordID: "",
      category: "airFilter",
      spec: "GGYY200",
      startDate: "2022-5-5",
      endDate: "2022-7-5",
      startMileage: 1000,
      endMileage: 2000,
      price: 13123,
      qty: 1,
      subTotal: 13123,
      note: "dsfafd",
    };
    record.records = [partObj, partObj1];

    dispatch(asyncRecordAction.addRepair(carID, record, part));
  };

  return (
    <>
      <From onSubmit={handleSubmit(createRecord)}>
        <input
          type="text"
          placeholder="title"
          {...register("title", { required: true })}
        />
        <input
          type="date"
          placeholder="date"
          {...register("date", { required: true })}
        />
        <input
          type="number"
          placeholder="mileage"
          {...register("mileage", { required: true })}
        />
        <input
          type="number"
          placeholder="amount"
          {...register("amount", { required: true })}
        />
        <input
          type="text"
          placeholder="note"
          {...register("note", { required: true })}
        />

        <button>add</button>
      </From>
      <div></div>
    </>
  );
};

export default Test;
