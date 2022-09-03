import { AppDispatch } from "../index";
import { recordActions } from "./recordReducer";
import {
  repairType,
  partType,
  partsType,
  feeType,
} from "../../types/recordType";
import firebase from "../../utils/firebase";
import { arrayUnion } from "firebase/firestore";

const asyncRecordAction = {
  addRepair(carId: string, data: repairType) {
    return async (dispatch: AppDispatch) => {
      const add = async () => {
        const url = `/carsRecords/${carId}/repairRecords`;
        const response = await firebase.setRecordDoc(url, data);

        response.records.forEach(async (partObj: partType) => {
          const url = `carsRecords/${carId}/parts/${partObj.category}`;
          await firebase.setMergeDoc(url, { records: arrayUnion(partObj) });
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
        const response = await firebase.setDoc(url, data);
        const parts = { ...oldParts };
        if (response) {
          data.records.forEach(async (newPart: partType) => {
            const partIndex = parts[newPart.category].findIndex(
              (part) => part.recordID === data.id
            );
            parts[newPart.category][partIndex] = newPart;
            const url = `/carsRecords/${carId}/parts/${newPart.category}`;
            await firebase.setDoc(url, { records: parts[newPart.category] });
          });
        }
      };
      try {
        await update();
        dispatch(recordActions.updateRepair(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  deleteRepair(carId: string, recordID: string, oldParts: partType[]) {
    return async (dispatch: AppDispatch) => {
      const remove = async () => {
        const url = `/carsRecords/${carId}/repairRecords/${recordID}`;
        const response = await firebase.delete(url);
        if (response) {
          oldParts.forEach(async (part: partType) => {
            const url = `/carsRecords/${carId}/parts/${part.category}`;
            await firebase.deleteParts(url, part);
          });
        }
      };
      try {
        await remove();
        dispatch(recordActions.deleteRepair(recordID));
      } catch (e) {
        console.log(e);
      }
    };
  },
  deletePart(carId: string, data: partType) {
    return async (dispatch: AppDispatch) => {
      const remove = async () => {
        const url = `/carsRecords/${carId}/parts/${data.category}`;
        await firebase.deleteParts(url, data);
      };
      try {
        await remove();
        dispatch(recordActions.deletePart(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  addExpense(carId: string, data: feeType) {
    return async (dispatch: AppDispatch) => {
      const add = async () => {
        let url = "";
        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords`;
        } else {
          url = `/carsRecords/${carId}/feeRecords`;
        }
        const response = await firebase.setExpenseDoc(url, data);
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
    return async (dispatch: AppDispatch) => {
      const update = async () => {
        let url = "";
        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords/${data.id}`;
        } else {
          url = `/carsRecords/${carId}/feeRecords/${data.id}`;
        }
        const response = await firebase.updateDoc(url, data);
        return response;
      };
      try {
        await update();
        dispatch(recordActions.updateExpense(data));
      } catch (e) {
        console.log(e);
      }
    };
  },
  deleteExpense(carId: string, data: feeType) {
    return async (dispatch: AppDispatch) => {
      const remove = async () => {
        let url = "";
        if (data.category === "refuel") {
          url = `/carsRecords/${carId}/refuelRecords/${data.id}`;
        } else {
          url = `/carsRecords/${carId}/feeRecords/${data.id}`;
        }
        await firebase.delete(url);
      };
      try {
        await remove();
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
      } catch (e) {
        console.log(e);
      }
    };
  },
};
export default asyncRecordAction;
