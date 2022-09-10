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
import { useForm, FormProvider } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../store";
import asyncRecordAction from "../../../../store/record/asyncRecordAction";
import { formatDate, createMessage } from "../../../../utils/calcFunc";
import asyncCarAction from "../../../../store/car/asyncCarAction";
import Input from "../../../../components/Input";
import moment from "moment";

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
  align-items: flex-start;
  margin-bottom: 20px;
`;

const DetailBX = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;
const Detail = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
`;
const AmountDetail = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const NoteTitle = styled.p`
  width: 100%;
  font-size: 16px;
`;
const NoteContent = styled.textarea`
  resize: none;
  width: 100%;
  height: 150px;
  background-color: transparent;
  color: #fff;
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
const ErrorMsg = styled.p`
  text-align: left;
  height: 10px;
  font-size: 10px;
  padding-left: 10px;
`;

const InputBx = styled.div`
  margin-right: 10px;
`;

const Repair: React.FC<{
  onClose: Dispatch<SetStateAction<string>>;
  updateId: string;
  onClear: () => void;
}> = (props) => {
  const { onClose, updateId, onClear } = props;
  const dispatch = useAppDispatch();
  const car = useAppSelector((state) => state.car.car);
  const initRecord = useAppSelector((state) => state.record);
  const record = useAppSelector((state) =>
    state.record.repair.find((record) => record.id === updateId)
  );
  const [parts, setParts] = useState<partType[] | []>(record?.records || []);
  const [amountValue, setAmountValue] = useState<number>();
  const deletePart = useRef<partType[]>([]);
  const { id: carID, mileage: carMileage, recordAnnual } = car as carType;
  const { parts: initParts } = initRecord;

  const methods = useForm<repairType>({
    defaultValues: record || {
      mileage: carMileage,
      date: formatDate(new Date()),
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

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
      setAmountValue(amount);
    } else {
      setValue("amount", NaN);
      setAmountValue(0);
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
    const JSONParts = JSON.stringify(parts);
    const newParts = JSON.parse(JSONParts) as partType[];

    const newRecords = newParts.map((part) => {
      const endDate = moment()
        .add(part.month, "months")
        .add(part.year, "years")
        .subtract(1, "days")
        .format("YYYY-MM-DD");

      if (!part.recordID) part.recordID = "";
      part.startDate = record.date;
      part.endDate = endDate;
      part.startMileage = record.mileage;
      part.endMileage = record.mileage + part.mileage;
      return part;
    });
    return newRecords;
  };

  const createRemind = (type: string) => {
    let message = updateId ? "已更新紀錄" : "已新增紀錄";
    if (type === "error") message = "已刪除紀錄";
    createMessage(type, dispatch, message);
  };

  const createRepairHandler = (record: repairType) => {
    record.amount = Number(record.amount);
    record.mileage = Number(record.mileage);
    record.records = setPartDateAndMileage(record);

    if (record.records.length === 0) return;

    if (!record.id && carID) {
      record.id = "";
      record.category = "repair";
      dispatch(asyncRecordAction.addRepair(carID, record, recordAnnual));
    } else if (carID) {
      const JSONParts = JSON.stringify(initParts);
      const newParts = JSON.parse(JSONParts) as partsType;

      dispatch(asyncRecordAction.updateRepair(carID, record, newParts));
      deletePart.current.forEach((removePart) => {
        dispatch(asyncRecordAction.deletePart(carID, removePart));
      });
    }
    if (car && record.mileage > car.mileage)
      dispatch(asyncCarAction.updateCar(carID, { mileage: record.mileage }));
    createRemind("remind");
    onClear();
    onClose("record");
  };

  const closeRepair = () => {
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
    createRemind("error");
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
  const remindHandler = () => {
    createMessage("remind", dispatch, "請新增維修／保養項目");
  };

  return (
    <>
      <FormProvider {...methods}>
        <RepairContainer>
          <HeaderBar>
            <ConfirmBtn onClick={handleSubmit(createRepairHandler)}>
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
            <AmountDetail onClick={remindHandler}>
              <Input
                name="amount"
                content="總金額"
                error={errors?.amount}
                require={{ required: true }}
                type="number"
                readOnly={true}
                value={amountValue}
              />
              <ErrorMsg>{errors.amount && "尚未新增零件資料"}</ErrorMsg>
            </AmountDetail>
          </DetailBX>
          <RepairList
            onAdd={addPartHandler}
            parts={parts}
            onDeletePart={deletePartHandler}
          />
          <NoteTitle>備註</NoteTitle>
          <NoteContent {...register("note")} />
        </RepairContainer>
      </FormProvider>
    </>
  );
};

export default Repair;
