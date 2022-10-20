import { createSlice } from "@reduxjs/toolkit";
import { selectAnnualExpenses } from "../../utils/calcFunc";
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
  expenses: {
    allExpenses: 0,
    feeExpenses: 0,
    repairExpenses: 0,
    refuelExpenses: 0,
    selectYear: "",
  },
};

const recordSlice = createSlice({
  name: "record",
  initialState: initialRecord,
  reducers: {
    setAllRecords(state, action) {
      state.fee = action.payload.fee;
      state.parts = action.payload.parts;
      state.refuel = action.payload.refuel;
      state.repair = action.payload.repair;
    },
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
      state.expenses.repairExpenses += action.payload.amount;
      state.expenses.allExpenses += action.payload.amount;
    },
    updateRepair(state, action) {
      const recordIndex = state.repair.findIndex(
        (record) => record.id === action.payload.id
      );
      state.repair[recordIndex] = {
        ...state.repair[recordIndex],
        ...action.payload,
      };
      const newRepairExpenses = selectAnnualExpenses(state.repair, undefined);
      const diffAmount = newRepairExpenses - state.expenses.repairExpenses;
      state.expenses.repairExpenses = newRepairExpenses;
      state.expenses.allExpenses += diffAmount;
      action.payload.records.forEach((newPart: partType) => {
        const partIndex = state.parts[newPart.category].findIndex(
          (part) => part.recordID === action.payload.id
        );
        state.parts[newPart.category][partIndex] = newPart;
      });
    },
    deleteRepair(state, action) {
      const oldRecord = state.repair.find(
        (record) => record.id === action.payload.recordID
      );
      state.repair = state.repair.filter(
        (record) => record.id !== action.payload.recordID
      );
      oldRecord?.records.forEach((oldPart: partType) => {
        state.parts[oldPart.category] = state.parts[oldPart.category].filter(
          (part) => part.recordID !== action.payload.recordID
        );
      });

      state.expenses.repairExpenses -= action.payload.amount;
      state.expenses.allExpenses -= action.payload.amount;
    },
    deletePart(state, action) {
      state.parts[action.payload.category] = state.parts[
        action.payload.category
      ].filter((part: partType) => part.recordID !== action.payload.recordID);
    },
    addExpense(state, action) {
      if (action.payload.category === "refuel") {
        state.refuel.push(action.payload);
        state.expenses.refuelExpenses += action.payload.amount;
      } else {
        state.fee.push(action.payload);
        state.expenses.feeExpenses += action.payload.amount;
      }
      state.expenses.allExpenses += action.payload.amount;
    },
    getYearExpense(state, action) {
      const feeExpenses = selectAnnualExpenses(state.fee, action.payload);
      const refuelExpenses = selectAnnualExpenses(state.refuel, action.payload);
      const repairExpenses = selectAnnualExpenses(state.repair, action.payload);

      state.expenses.repairExpenses = repairExpenses;
      state.expenses.refuelExpenses = refuelExpenses;
      state.expenses.feeExpenses = feeExpenses;
      state.expenses.allExpenses =
        feeExpenses + refuelExpenses + repairExpenses;
      state.expenses.selectYear = action.payload;
    },
    getAllExpense(state) {
      const feeExpenses = selectAnnualExpenses(state.fee, undefined);
      const refuelExpenses = selectAnnualExpenses(state.refuel, undefined);
      const repairExpenses = selectAnnualExpenses(state.repair, undefined);

      state.expenses.repairExpenses = repairExpenses;
      state.expenses.refuelExpenses = refuelExpenses;
      state.expenses.feeExpenses = feeExpenses;
      state.expenses.allExpenses =
        feeExpenses + refuelExpenses + repairExpenses;
      state.expenses.selectYear = "all";
    },
    updateExpense(state, action) {
      let diffAmount;
      if (action.payload.category === "refuel") {
        const recordIndex = state.refuel.findIndex(
          (record) => record.id === action.payload.id
        );
        state.refuel[recordIndex] = {
          ...state.refuel[recordIndex],
          ...action.payload,
        };
        const refuelExpenses = selectAnnualExpenses(state.refuel, undefined);
        diffAmount = refuelExpenses - state.expenses.refuelExpenses;
        state.expenses.refuelExpenses = refuelExpenses;
      } else {
        const recordIndex = state.fee.findIndex(
          (record) => record.id === action.payload.id
        );
        state.fee[recordIndex] = {
          ...state.fee[recordIndex],
          ...action.payload,
        };
        const feeExpenses = selectAnnualExpenses(state.fee, undefined);
        diffAmount = feeExpenses - state.expenses.feeExpenses;
        state.expenses.feeExpenses = feeExpenses;
      }
      state.expenses.allExpenses += diffAmount;
    },
    deleteExpense(state, action) {
      if (action.payload.category === "refuel") {
        state.refuel = state.refuel.filter(
          (record) => record.id !== action.payload.id
        );
        state.expenses.refuelExpenses -= action.payload.amount;
      } else {
        state.fee = state.fee.filter(
          (record) => record.id !== action.payload.id
        );
        state.expenses.feeExpenses -= action.payload.amount;
      }
      state.expenses.allExpenses -= action.payload.amount;
    },
    clearAllRecord(state) {
      state.fee = [] as feeType[];
      state.repair = [] as repairType[];
      state.refuel = [] as feeType[];
      state.parts = {} as partsType;
      state.expenses = {
        allExpenses: 0,
        feeExpenses: 0,
        repairExpenses: 0,
        refuelExpenses: 0,
        selectYear: "",
      };
    },
  },
});

export const recordActions = recordSlice.actions;
export default recordSlice.reducer;
