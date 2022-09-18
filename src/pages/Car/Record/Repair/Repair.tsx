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
import moment from "moment";
import { NeonText } from "../../../../components/style";
import FormNoteBox from "../FormNoteBox";
import InputBox from "../../../../components/Input/InputBox";

const RepairContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  padding: 10px;
  position: relative;
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
const AmountDetail = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media screen and (max-width: 701px) {
    width: 100%;
  }
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
  backdrop-filter: blur(5px);
  padding: 20px 10px 0px 10px;
  border-radius: 8px;
  background: rgba(1, 0, 44, 0.2);
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  margin: 20px 0;
  z-index: 1;
`;

const Repair: React.FC<{
  onClose: (str: string) => void;
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

    if (record.records.length === 0) {
      createMessage("alert", dispatch, "請新增維修項目");
      return;
    }

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
    <FormProvider {...methods}>
      <RepairContainer>
        <Title>維修表單</Title>
        <InputsWrapper>
          <InputBox
            name="title"
            content="標題"
            error={typeof errors?.title?.type === "string"}
            require={{ required: true }}
            type="text"
            message={errors.title && "標題尚未填寫"}
          />
          <DetailBX>
            <Detail>
              <InputWrapper>
                <InputBox
                  name="date"
                  content="日期"
                  error={typeof errors?.date?.type === "string"}
                  require={{ required: true }}
                  type="date"
                  message={errors.date && "日期尚未填寫"}
                />
              </InputWrapper>
              <InputWrapper>
                <InputBox
                  name="mileage"
                  content="里程數"
                  error={typeof errors?.mileage?.type === "string"}
                  require={{
                    required: true,
                    min: updateId ? record?.mileage : carMileage,
                  }}
                  type="number"
                  message={errors.mileage?.type === "min" && "勿低於目前里程數"}
                />
              </InputWrapper>
            </Detail>
            <AmountDetail onClick={remindHandler}>
              <InputBox
                name="amount"
                content="總金額"
                error={typeof errors?.amount?.type === "string"}
                require={{ required: true }}
                type="number"
                readOnly={true}
                value={amountValue}
                message={errors.amount && "尚未新增零件資料"}
              />
            </AmountDetail>
          </DetailBX>
        </InputsWrapper>

        <RepairList
          onAdd={addPartHandler}
          parts={parts}
          onDeletePart={deletePartHandler}
        />
        <FormNoteBox
          onCloseRepair={closeRepair}
          onDeleteRepair={deleteRepairRecord}
          updateId={updateId}
          onSubmit={handleSubmit(createRepairHandler)}
        />
      </RepairContainer>
    </FormProvider>
  );
};

export default Repair;
