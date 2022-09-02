import { AppDispatch } from "../index";
import { recordActions } from "./recordReducer";
import { repairType, partType, partsType } from "../../types/recordType";
import firebase from "../../utils/firebase";
import { arrayUnion } from "firebase/firestore";

const asyncRecordAction = {
  addRepair(id: string, data: repairType) {
    return async (dispatch: AppDispatch) => {
      const add = async () => {
        const url = `/carsRecords/${id}/repairRecords`;
        const response = await firebase.setRecordDoc(url, data);

        response.records.forEach(async (partObj: partType) => {
          const url = `carsRecords/${id}/parts/${partObj.category}`;
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
  updateRepair(id: string, data: repairType, oldParts: partsType) {
    return async (dispatch: AppDispatch) => {
      const update = async () => {
        const url = `/carsRecords/${id}/repairRecords/${data.id}`;
        const response = await firebase.setDoc(url, data);
        const parts = { ...oldParts };
        if (response) {
          data.records.forEach(async (newPart: partType) => {
            const partIndex = parts[newPart.category].findIndex(
              (part) => part.recordID === data.id
            );
            parts[newPart.category][partIndex] = newPart;
            const url = `/carsRecords/${id}/parts/${newPart.category}`;
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
