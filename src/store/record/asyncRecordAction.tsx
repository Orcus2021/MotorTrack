import { AppDispatch } from "../index";
import { recordActions } from "./recordReducer";
import { recordAnnualType } from "../../types/carType";
import { carActions } from "../car/carReducer";
import {
  repairType,
  partType,
  partsType,
  feeType,
} from "../../types/recordType";
import firebase from "../../utils/firebase";
import { arrayUnion } from "firebase/firestore";

const asyncRecordAction = {
  addRepair(carId: string, data: repairType, recordAnnual: recordAnnualType) {
    return async (dispatch: AppDispatch) => {
      const add = async () => {
        const url = `/carsRecords/${carId}/repairRecords`;
        const response = await firebase.setRecordDoc(url, data);

        const dateArr = data.date.split("-");
        const newRecordAnnual = { ...recordAnnual };
        newRecordAnnual[dateArr[0]] = (newRecordAnnual[dateArr[0]] || 0) + 1;
        const annualUrl = `/carsRecords/${carId}`;
        firebase.updateDoc(annualUrl, { recordAnnual: newRecordAnnual });
        dispatch(
          carActions.update({ id: carId, recordAnnual: newRecordAnnual })
        );

        response.records.forEach(async (partObj: partType) => {
          const url = `carsRecords/${carId}/parts/${partObj.category}`;
          firebase.setMergeDoc(url, { records: arrayUnion(partObj) });
        });
        return response;
      };
      try {
        const record = await add();

        dispatch(recordActions.addRepair(record));
      } catch (e) {
        console.log(e);
      }
    };
  },
  updateRepair(carId: string, data: repairType, oldParts: partsType) {
    return async (dispatch: AppDispatch) => {
      const update = async () => {
        const url = `/carsRecords/${carId}/repairRecords/${data.id}`;
        await firebase.setDoc(url, data);
        const parts = { ...oldParts };
        // if (response) {} FIXME
        data.records.forEach((newPart: partType) => {
          const partIndex = parts[newPart.category].findIndex(
            (part) => part.recordID === data.id
          );
          parts[newPart.category][partIndex] = newPart;
          const url = `/carsRecords/${carId}/parts/${newPart.category}`;
          firebase.setDoc(url, { records: parts[newPart.category] });
        });
      };
      try {
        await update();
        dispatch(recordActions.updateRepair(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  deleteRepair(
    carId: string,
    record: repairType,
    recordAnnual: recordAnnualType
  ) {
    return async (dispatch: AppDispatch) => {
      const recordID = record.id;
      const oldParts = record.records;
      const remove = async () => {
        const url = `/carsRecords/${carId}/repairRecords/${recordID}`;
        const response = await firebase.delete(url);

        const dateArr = record.date.split("-");
        const newRecordAnnual = { ...recordAnnual };
        newRecordAnnual[dateArr[0]] = newRecordAnnual[dateArr[0]] - 1;
        const annualUrl = `/carsRecords/${carId}`;
        firebase.updateDoc(annualUrl, { recordAnnual: newRecordAnnual });
        dispatch(
          carActions.update({ id: carId, recordAnnual: newRecordAnnual })
        );

        if (response) {
          oldParts.forEach((part: partType) => {
            const url = `/carsRecords/${carId}/parts/${part.category}`;
            firebase.deleteParts(url, part);
          });
        }
      };
      try {
        dispatch(recordActions.deleteRepair(recordID));
        await remove();
      } catch (e) {
        console.log(e);
      }
    };
  },
  deletePart(carId: string, data: partType) {
    return (dispatch: AppDispatch) => {
      const remove = () => {
        const url = `/carsRecords/${carId}/parts/${data.category}`;
        firebase.deleteParts(url, data);
      };
      try {
        remove();
        dispatch(recordActions.deletePart(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  addExpense(carId: string, data: feeType, recordAnnual: recordAnnualType) {
    return async (dispatch: AppDispatch) => {
      const add = async () => {
        let url = "";
        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords`;
        } else {
          url = `/carsRecords/${carId}/feeRecords`;
        }
        const response = await firebase.setExpenseDoc(url, data);

        const dateArr = data.date.split("-");
        const newRecordAnnual = { ...recordAnnual };
        newRecordAnnual[dateArr[0]] = (newRecordAnnual[dateArr[0]] || 0) + 1;
        const annualUrl = `/carsRecords/${carId}`;

        firebase.updateDoc(annualUrl, { recordAnnual: newRecordAnnual });

        dispatch(
          carActions.update({ id: carId, recordAnnual: newRecordAnnual })
        );

        return response;
      };
      try {
        const record = await add();
        dispatch(recordActions.addExpense(record));
      } catch (e) {
        console.log(e);
      }
    };
  },
  updateExpense(carId: string, data: feeType) {
    return (dispatch: AppDispatch) => {
      const update = async () => {
        let url = "";

        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords/${data.id}`;
        } else {
          url = `/carsRecords/${carId}/feeRecords/${data.id}`;
        }
        firebase.updateDoc(url, data);
      };
      try {
        update();
        dispatch(recordActions.updateExpense(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  updateDiffCategoryExpense(carId: string, data: feeType, oldDate: feeType) {
    return (dispatch: AppDispatch) => {
      const update = async () => {
        let url = "";

        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords/${data.id}`;
          firebase.delete(`/carsRecords/${carId}/feeRecords/${data.id}`);
        } else {
          url = `/carsRecords/${carId}/feeRecords/${data.id}`;
          firebase.delete(`/carsRecords/${carId}/refuelRecords/${data.id}`);
        }
        firebase.setDoc(url, data);
      };
      try {
        update();
        dispatch(recordActions.addExpense(data));
        dispatch(recordActions.deleteExpense(oldDate));
      } catch (e) {
        console.log(e);
      }
    };
  },
  deleteExpense(carId: string, data: feeType, recordAnnual: recordAnnualType) {
    return async (dispatch: AppDispatch) => {
      const remove = () => {
        let url = "";
        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords/${data.id}`;
        } else {
          url = `/carsRecords/${carId}/feeRecords/${data.id}`;
        }
        firebase.delete(url);

        const dateArr = data.date.split("-");
        const newRecordAnnual = { ...recordAnnual };
        newRecordAnnual[dateArr[0]] = newRecordAnnual[dateArr[0]] - 1;
        const annualUrl = `/carsRecords/${carId}`;
        firebase.updateDoc(annualUrl, { recordAnnual: newRecordAnnual });
        dispatch(
          carActions.update({ id: carId, recordAnnual: newRecordAnnual })
        );
      };
      try {
        remove();
        dispatch(recordActions.deleteExpense(data));
      } catch (e) {
        console.log(e);
      }
    };
  },

  getAllRecords(id: string) {
    return async (dispatch: AppDispatch) => {
      const getAll = async () => {
        const response = await firebase.getAllRecords(id);
        return response;
      };
      try {
        const records = await getAll();
        dispatch(recordActions.setAllRecords(records));
        dispatch(recordActions.getAllExpense());
      } catch (e) {
        console.log(e);
      }
    };
  },
};
export default asyncRecordAction;
