import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components/macro";
import expenseCategory from "../../../../utils/expenseItem";
import { carType } from "../../../../types/carType";
import { feeType } from "../../../../types/recordType";
import { useForm, FormProvider } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../store";
import asyncCarAction from "../../../../store/car/asyncCarAction";
import { formatDate, createMessage } from "../../../../utils/calcFunc";
import asyncRecordAction from "../../../../store/record/asyncRecordAction";
import SelectCategory from "./SelectCategory";
import Input from "../../../../components/Input";

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
  flex-direction: column;
  margin-bottom: 15px;
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
const Select = styled.input`
  height: 0;
  width: 0;
  border: none;
  outline: none;
  background-color: transparent;
`;
const ErrorMsg = styled.p`
  text-align: left;
  height: 10px;
  font-size: 10px;
  padding-left: 10px;
`;
const InputBx = styled.div`
  margin-right: 10px;
  flex-grow: 1;
`;
const AmountBx = styled(InputBx)`
  margin-right: 0;
`;

const Expenses: React.FC<{
  onClose: Dispatch<SetStateAction<string>>;
  updateId: string;
}> = (props) => {
  const { onClose, updateId } = props;
  const dispatch = useAppDispatch();
  const record = useAppSelector((state) => {
    const newExpenses = [...state.record.fee, ...state.record.refuel];
    return newExpenses.find((record) => record.id === updateId);
  });

  const [selectCategory, setSelectCategory] = useState<string>(
    record?.category || "refuel"
  );
  const car = useAppSelector((state) => state.car.car);
  const { id: carID, mileage: carMileage, recordAnnual } = car as carType;
  const methods = useForm<feeType>({
    defaultValues: record || {
      mileage: carMileage,
      date: formatDate(new Date()),
      category: "refuel",
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = methods;

  const closeRepair = (e: React.FormEvent) => {
    e.preventDefault();
    onClose("record");
  };

  useEffect(() => {
    if (updateId) {
      reset(record);
    } else {
      reset({
        mileage: carMileage,
        date: formatDate(new Date()),
        category: "refuel",
      });
    }
  }, [record, reset, updateId, carMileage]);

  const options: JSX.Element[] = [];
  expenseCategory.forEach((value, key) => {
    options.push(<option value={key}>{value.name}</option>);
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

  const selectHandler = (key: string) => {
    setSelectCategory(key);
    setValue("category", key);
  };

  return (
    <>
      <RepairContainer>
        <FormProvider {...methods}>
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
            <Input
              name="title"
              content="標題"
              error={errors?.title}
              require={{ required: true }}
              type="text"
            />
            <ErrorMsg>{errors.title && "標題尚未填寫"}</ErrorMsg>
          </TitleBx>
          <DetailBX>
            <Detail>
              <InputBx>
                <Input
                  name="date"
                  content="日期"
                  error={errors?.date}
                  require={{ required: true }}
                  type="date"
                />
                <ErrorMsg>{errors.date && "日期尚未填寫"}</ErrorMsg>
              </InputBx>
              <InputBx>
                <Input
                  name="mileage"
                  content="里程數"
                  error={errors?.mileage}
                  require={{
                    required: true,
                    min: updateId ? record?.mileage : carMileage,
                  }}
                  type="number"
                />
                <ErrorMsg>
                  {errors.mileage?.type === "min" && "勿低於目前里程數"}
                </ErrorMsg>
              </InputBx>
            </Detail>
            <Detail>
              <AmountBx>
                <Input
                  name="amount"
                  content="總金額"
                  error={errors?.amount}
                  require={{ required: true, min: 0 }}
                  type="number"
                />
                <ErrorMsg>
                  {errors.amount?.type === "min" && "總金額錯誤"}
                  {errors.amount?.type === "required" && "總金額尚未填寫"}
                </ErrorMsg>
              </AmountBx>
            </Detail>
          </DetailBX>

          <SelectCategory
            onSelect={selectHandler}
            selectCategory={selectCategory}
          />

          <Select {...register("category")} />

          <NoteTitle>備註</NoteTitle>
          <NoteContent {...register("note")} />
        </FormProvider>
      </RepairContainer>
    </>
  );
};

export default Expenses;
