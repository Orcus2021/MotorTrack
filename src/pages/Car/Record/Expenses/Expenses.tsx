import React, { useEffect, useState } from "react";
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
import InputBox from "../../../../components/Input/InputBox";
import { NeonText } from "../../../../components/style";
import FormNoteBox from "../FormNoteBox";

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 10px;
  position: relative;
`;

const InputWrapper = styled.div`
  width: 50%;
  margin-right: 10px;
  @media screen and (max-width: 701px) {
    &:nth-child(2) {
      margin-right: 0;
    }
  }
`;

const DetailBX = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media screen and (max-width: 701px) {
    flex-direction: column;
  }
`;
const Detail = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  @media screen and (max-width: 701px) {
    width: 100%;
  }
`;

const Select = styled.input`
  position: absolute;
  height: 0;
  width: 0;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background-color: transparent;
`;

const Title = styled(NeonText)`
  font-size: 20px;
  padding: 15px 0 0 25px;
  font-weight: 400;
`;

const InputsWrapper = styled.div`
  position: relative;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(1, 0, 44, 0.2);
  backdrop-filter: blur(5px);
  padding: 20px 10px 0px 10px;
  border-radius: 8px;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  margin: 20px 0;
  z-index: 1;
`;

const Expenses: React.FC<{
  onClose: (str: string) => void;
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

  const closeRepair = () => {
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

  const createExpenseHandler = (newRecord: feeType) => {
    newRecord.amount = Number(newRecord.amount);
    newRecord.mileage = Number(newRecord.mileage);

    if (!newRecord.id) {
      newRecord.id = "";

      dispatch(
        asyncRecordAction.addExpense(carID as string, newRecord, recordAnnual)
      );
    } else if (newRecord.category === record?.category) {
      dispatch(asyncRecordAction.updateExpense(carID as string, newRecord));
    } else if (newRecord.category !== record?.category) {
      // FIXME

      dispatch(
        asyncRecordAction.updateDiffCategoryExpense(
          carID as string,
          newRecord,
          record as feeType
        )
      );
    }
    addMessage("remind");
    dispatch(
      asyncCarAction.updateCar(carID as string, { mileage: newRecord.mileage })
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
      <Container>
        <FormProvider {...methods}>
          <Title>費用表單</Title>
          <InputsWrapper>
            <InputBox
              message={errors.title && "標題尚未填寫"}
              name="title"
              content="標題"
              error={typeof errors?.title?.type === "string"}
              require={{
                required: true,
                onBlur: (e: { target: { value: string } }) => {
                  setValue("title", e.target.value.trim());
                },
              }}
              type="text"
            />
            <DetailBX>
              <Detail>
                <InputWrapper>
                  <InputBox
                    message={errors.date && "日期尚未填寫"}
                    name="date"
                    content="日期"
                    error={typeof errors?.date?.type === "string"}
                    require={{ required: true }}
                    type="date"
                  />
                </InputWrapper>
                <InputWrapper>
                  <InputBox
                    message={
                      errors.mileage?.type === "min" ? "勿低於目前里程數" : ""
                    }
                    name="mileage"
                    content="里程數"
                    error={typeof errors?.mileage?.type === "string"}
                    require={{
                      required: true,
                      min: updateId ? record?.mileage : carMileage,
                    }}
                    type="number"
                  />
                </InputWrapper>
              </Detail>
              <Detail>
                <InputBox
                  message={
                    errors.amount?.type === "min"
                      ? "總金額錯誤"
                      : errors.amount?.type === "required"
                      ? "總金額尚未填寫"
                      : ""
                  }
                  name="amount"
                  content="總金額"
                  error={typeof errors?.amount?.type === "string"}
                  require={{
                    required: true,
                    min: 0,
                    max: 999999,
                  }}
                  type="number"
                />
              </Detail>
            </DetailBX>
          </InputsWrapper>

          <SelectCategory
            onSelect={selectHandler}
            selectCategory={selectCategory}
          />

          <Select {...register("category")} />
          <FormNoteBox
            onCloseRepair={closeRepair}
            onDeleteRepair={deleteRepairRecord}
            updateId={updateId}
            onSubmit={handleSubmit(createExpenseHandler)}
          />
        </FormProvider>
      </Container>
    </>
  );
};

export default Expenses;
