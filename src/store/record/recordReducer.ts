import { createSlice } from "@reduxjs/toolkit";
import {
  partsType,
  partType,
  repairType,
  feeType,
} from "../../types/recordType";
const initialRecord = {
  fee: [] as feeType[],
  repair: [] as repairType[],
  refuel: [] as feeType[],
  parts: {} as partsType,
};

const recordSlice = createSlice({
  name: "record",
  initialState: initialRecord,
  reducers: {
    addRepair(state, action) {
      state.repair.push(action.payload);
      action.payload.records.forEach((record: partType) => {
        const keyArr = Object.keys(state.parts);
        const found = keyArr.find((key) => key === record.category);
        if (found) {
          state.parts[record.category].push(record);
        } else {
          state.parts[record.category] = [record];
        }
      });
    },
    setAllRecords(state, action) {
      state.fee = action.payload.fee;
      state.parts = action.payload.parts;
      state.refuel = action.payload.refuel;
      state.repair = action.payload.repair;
    },
    updateRepair(state, action) {
      const recordIndex = state.repair.findIndex(
        (record) => record.id === action.payload.id
      );
      state.repair[recordIndex] = {
        ...state.repair[recordIndex],
        ...action.payload,
      };
      action.payload.records.forEach((newPart: partType) => {
        const partIndex = state.parts[newPart.category].findIndex(
          (part) => part.recordID === action.payload.id
        );
        state.parts[newPart.category][partIndex] = newPart;
      });
    },
    deleteRepair(state, action) {
      const oldRecord = state.repair.find(
        (record) => record.id === action.payload
      );
      state.repair = state.repair.filter(
        (record) => record.id !== action.payload
      );
      oldRecord?.records.forEach((oldPart: partType) => {
        state.parts[oldPart.category] = state.parts[oldPart.category].filter(
          (part) => part.recordID !== action.payload
        );
      });
    },
    deletePart(state, action) {
      state.parts[action.payload.category] = state.parts[
        action.payload.category
      ].filter((part: partType) => part.recordID !== action.payload.recordID);
    },
    addExpense(state, action) {
      if (action.payload.category === "refuel") {
        state.refuel.push(action.payload);
      } else {
        state.fee.push(action.payload);
      }
    },
    updateExpense(state, action) {
      if (action.payload.category === "refuel") {
        const recordIndex = state.refuel.findIndex(
          (record) => record.id === action.payload.id
        );
        state.refuel[recordIndex] = {
          ...state.refuel[recordIndex],
          ...action.payload,
        };
      } else {
        const recordIndex = state.fee.findIndex(
          (record) => record.id === action.payload.id
        );
        state.fee[recordIndex] = {
          ...state.fee[recordIndex],
          ...action.payload,
        };
      }
    },
    deleteExpense(state, action) {
      if (action.payload.category === "refuel") {
        state.refuel = state.refuel.filter(
          (record) => record.id !== action.payload.id
        );
      } else {
        state.fee = state.fee.filter(
          (record) => record.id !== action.payload.id
        );
      }
    },
    clearAllRecord(state) {
      state.fee = [] as feeType[];
      state.repair = [] as repairType[];
      state.refuel = [] as feeType[];
      state.parts = {} as partsType;
    },
  },
});

export const recordActions = recordSlice.actions;
export default recordSlice.reducer;
