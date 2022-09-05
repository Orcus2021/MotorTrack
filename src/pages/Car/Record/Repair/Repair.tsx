import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import RepairList from "./RepairList";
import styled from "styled-components/macro";
import { partsType, partType, repairType } from "../../../../types/recordType";
import { carType } from "../../../../types/carType";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../store";
import asyncRecordAction from "../../../../store/record/asyncRecordAction";
import { formatDate } from "../../../../utils/calcFunc";
import trashIcon from "../../../../assets/trash.png";
import asyncCarAction from "../../../../store/car/asyncCarAction";
const RepairContainer = styled.div`
  width: 100%;
  padding: 10px;
  position: relative;
`;
const HeaderBar = styled.div`
  width: 100%;
  height: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;
const ConfirmBtn = styled.button`
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  background-color: transparent;
  margin-right: 10px;
`;
const TitleBx = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;
const Input = styled.input`
  flex-grow: 1;
  height: 25px;
  outline: none;
  border: solid 2px #fff;
  font-size: 16px;
`;
const Label = styled.label`
  font-size: 16px;
  min-width: 50px;
`;
const DetailBX = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;
const Detail = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
`;
const NoteTitle = styled.p`
  width: 100%;
  font-size: 16px;
`;
const NoteContent = styled.textarea`
  resize: none;
  width: 100%;
  height: 150px;
`;
const IconBx = styled.div`
  position: relative;
  height: 20px;
  width: 20px;
  cursor: pointer;
`;
const Icon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Repair: React.FC<{
  onClose: Dispatch<SetStateAction<string>>;
  updateId: string;
}> = (props) => {
  const { onClose, updateId } = props;
  const dispatch = useAppDispatch();
  const car = useAppSelector((state) => state.car.car);
  const initParts = useAppSelector((state) => state.record.parts);
  const record = useAppSelector((state) =>
    state.record.repair.find((record) => record.id === updateId)
  );
  const [parts, setParts] = useState<partType[] | []>(record?.records || []);
  const deletePart = useRef<partType[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm<repairType>();
  const { id: carID, mileage: carMileage, recordAnnual } = car as carType;
  const test = useAppSelector((state) => state.record.expenses);
  console.log(test);
  useEffect(() => {
    if (updateId) {
      reset(record);
    } else {
      reset({ mileage: carMileage, date: formatDate(new Date()) });
    }
  }, [record, reset, updateId, carMileage]);

  useEffect(() => {
    if (parts.length > 0) {
      const partsArr = parts as partType[];
      const amount: number = partsArr.reduce(
        (total: number, { subtotal }: { subtotal: number }) => total + subtotal,
        0
      );
      setValue("amount", amount);
    }
  }, [parts, setValue]);

  const addPartHandler = (newPart: partType) => {
    const partIndex = parts.findIndex(
      (part) => part.category === newPart.category
    );
    if (partIndex < 0) {
      setParts((pre) => [...pre, newPart]);
      return;
    }
    setParts((pre) => {
      const newPartArr = [...pre];
      newPartArr[partIndex] = newPart;
      return newPartArr;
    });
  };

  const setPartDateAndMileage = (record: repairType) => {
    const dateArr = record.date.split("-");
    let recordYear = Number(dateArr[0]);
    let recordMonth = Number(dateArr[1]);
    const recordDay = Number(dateArr[2]);
    const JSONParts = JSON.stringify(parts);
    const newParts = JSON.parse(JSONParts) as partType[];

    const newRecords = newParts.map((part) => {
      if (recordMonth + part.month >= 12) {
        recordYear += 1;
        recordMonth = (recordMonth + part.month) % 12;
      }
      const endDate = `${recordYear + part.year}-${
        recordMonth + part.month
      }-${recordDay}`;
      if (!part.recordID) part.recordID = "";
      part.startDate = record.date;
      part.endDate = endDate;
      part.startMileage = record.mileage;
      part.endMileage = record.mileage + part.mileage;
      return part;
    });
    return newRecords;
  };

  const createRepairHandler = (record: repairType) => {
    record.amount = Number(record.amount);
    record.mileage = Number(record.mileage);
    record.records = setPartDateAndMileage(record);

    if (!record.id) {
      record.id = "";
      record.category = "repair";
      dispatch(
        asyncRecordAction.addRepair(carID as string, record, recordAnnual)
      );
    } else {
      const JSONParts = JSON.stringify(initParts);
      const newParts = JSON.parse(JSONParts) as partsType;

      dispatch(
        asyncRecordAction.updateRepair(carID as string, record, newParts)
      );
      deletePart.current.forEach((removePart) => {
        dispatch(asyncRecordAction.deletePart(carID as string, removePart));
      });
    }
    dispatch(
      asyncCarAction.updateCar(carID as string, { mileage: record.mileage })
    );

    onClose("record");
  };

  const closeRepair = (e: React.FormEvent) => {
    e.preventDefault();
    onClose("record");
  };

  const deleteRepairRecord = () => {
    dispatch(
      asyncRecordAction.deleteRepair(
        carID as string,
        record as repairType,
        recordAnnual
      )
    );
    onClose("record");
  };
  const deletePartHandler = (removePart: partType) => {
    setParts((pre) => {
      const newParts = [...pre];
      return newParts.filter((part) => part.category !== removePart.category);
    });
    if (removePart.recordID) {
      deletePart.current = [...deletePart.current, removePart];
    }
  };

  return (
    <>
      <RepairContainer>
        <form onSubmit={handleSubmit(createRepairHandler)}>
          <HeaderBar>
            <ConfirmBtn>{updateId ? "更新" : "新增"}</ConfirmBtn>
            {updateId && (
              <IconBx onClick={deleteRepairRecord}>
                <Icon src={trashIcon} />
              </IconBx>
            )}
            <ConfirmBtn onClick={closeRepair}>取消</ConfirmBtn>
          </HeaderBar>
          <TitleBx>
            <Label>標題</Label>
            <Input type="text" {...register("title", { required: true })} />
          </TitleBx>
          <DetailBX>
            <Detail>
              <Label>日期</Label>
              <Input type="date" {...register("date", { required: true })} />
              <Label>里程數</Label>
              <Input
                type="number"
                {...register("mileage", { required: true })}
              />
            </Detail>
            <Detail>
              <Label>總金額</Label>
              <Input
                type="number"
                {...register("amount", { required: true })}
                readOnly
              />
            </Detail>
          </DetailBX>
        </form>
        <RepairList
          onAdd={addPartHandler}
          parts={parts}
          onDeletePart={deletePartHandler}
        />
        <NoteTitle>備註</NoteTitle>
        <NoteContent {...register("note")} />
      </RepairContainer>
    </>
  );
};

export default Repair;
