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
    updateParts(state, action) {},
    addExpense() {},
    updateExpense() {},
    deleteRecord() {},
  },
});

export const recordActions = recordSlice.actions;
export default recordSlice.reducer;
