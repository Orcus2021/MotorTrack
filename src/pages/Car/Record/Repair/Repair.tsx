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
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../store";
import asyncRecordAction from "../../../../store/record/asyncRecordAction";

import trashIcon from "../../../../assets/trash.png";
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
  const carID = useAppSelector((state) => state.car.car?.id);
  const record = useAppSelector((state) =>
    state.record.repair.find((record) => record.id === updateId)
  );
  const [parts, setParts] = useState<partType[] | []>(record?.records || []);
  const deletePart = useRef<partType[]>([]);
  const { register, handleSubmit, reset } = useForm<repairType>();
  const dispatch = useAppDispatch();

  const initParts = useAppSelector((state) => state.record.parts);

  useEffect(() => {
    if (updateId) {
      reset(record);
    }
  }, [record, reset, updateId]);

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
    const recordYear = dateArr[0];
    const recordMonth = dateArr[1];
    const recordDay = dateArr[2];
    const JSONParts = JSON.stringify(parts);
    const newParts = JSON.parse(JSONParts) as partType[];

    const newRecords = newParts.map((part) => {
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
    record.records = setPartDateAndMileage(record);
    if (!record.id) {
      record.id = "";
      record.category = "repair";
      dispatch(asyncRecordAction.addRepair(carID as string, record));
      onClose("record");
      return;
    }
    const JSONParts = JSON.stringify(initParts);
    const newParts = JSON.parse(JSONParts) as partsType;

    dispatch(asyncRecordAction.updateRepair(carID as string, record, newParts));
    deletePart.current.forEach((removePart) => {
      dispatch(asyncRecordAction.deletePart(carID as string, removePart));
    });

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
        record?.id as string,
        record?.records as partType[]
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
      console.log("delete");
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
