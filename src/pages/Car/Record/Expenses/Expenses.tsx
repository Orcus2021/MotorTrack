import React, { Dispatch, SetStateAction, useEffect } from "react";
import styled from "styled-components/macro";
import expenseCategory from "../../../../utils/expenseItem";
import { carType } from "../../../../types/carType";
import { feeType } from "../../../../types/recordType";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../store";
import asyncCarAction from "../../../../store/car/asyncCarAction";
import { formatDate, createMessage } from "../../../../utils/calcFunc";
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
const Select = styled.select``;

const Expenses: React.FC<{
  onClose: Dispatch<SetStateAction<string>>;
  updateId: string;
}> = (props) => {
  const { onClose, updateId } = props;
  const record = useAppSelector((state) => {
    const newExpenses = [...state.record.fee, ...state.record.refuel];
    return newExpenses.find((record) => record.id === updateId);
  });
  const car = useAppSelector((state) => state.car.car);
  const { id: carID, mileage: carMileage, recordAnnual } = car as carType;
  const { register, handleSubmit, reset } = useForm<feeType>();
  const dispatch = useAppDispatch();

  const closeRepair = (e: React.FormEvent) => {
    e.preventDefault();
    onClose("record");
  };

  useEffect(() => {
    if (updateId) {
      reset(record);
    } else {
      reset({ mileage: carMileage, date: formatDate(new Date()) });
    }
  }, [record, reset, updateId, carMileage]);

  const options: JSX.Element[] = [];
  expenseCategory.forEach((value, key) => {
    options.push(<option value={key}>{value}</option>);
  });

  const addMessage = (type: string) => {
    let message = updateId ? "已更新紀錄" : "已新增紀錄";
    if (type === "error") message = "已刪除紀錄";
    createMessage(type, dispatch, message);
  };

  const createExpenseHandler = (record: feeType) => {
    record.amount = Number(record.amount);
    record.mileage = Number(record.mileage);
    if (!record.id) {
      record.id = "";

      dispatch(
        asyncRecordAction.addExpense(carID as string, record, recordAnnual)
      );
    } else {
      dispatch(asyncRecordAction.updateExpense(carID as string, record));
    }
    addMessage("remind");
    dispatch(
      asyncCarAction.updateCar(carID as string, { mileage: record.mileage })
    );

    onClose("record");
  };
  const deleteRepairRecord = () => {
    dispatch(
      asyncRecordAction.deleteExpense(
        carID as string,
        record as feeType,
        recordAnnual
      )
    );
    addMessage("error");
    onClose("record");
  };

  return (
    <>
      <RepairContainer>
        <HeaderBar>
          <ConfirmBtn onClick={handleSubmit(createExpenseHandler)}>
            {updateId ? "更新" : "新增"}
          </ConfirmBtn>
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
              {...register("mileage", {
                required: true,
                min: updateId ? record?.mileage : car?.mileage,
              })}
            />
          </Detail>
          <Detail>
            <Label>總金額</Label>
            <Input type="number" {...register("amount", { required: true })} />
          </Detail>
        </DetailBX>

        <Select {...register("category")}>{options}</Select>

        <NoteTitle>備註</NoteTitle>
        <NoteContent {...register("note")} />
      </RepairContainer>
    </>
  );
};

export default Expenses;
