import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm } from "react-hook-form";
import { carAge as carAgeHandler } from "../../../store/car/asyncCarAction";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";

const EditContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const EditWrapper = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px 0 10px;
`;
const LogoBx = styled.div`
  width: 50%;
  background-color: var(--mainColor);
  height: 200px;
`;
const LeftBx = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RightBx = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  width: 100%;
`;
const EditBtn = styled.button`
  border: none;
  padding: 5px 10px;
  background-color: var(--mainColor);
  cursor: pointer;
`;
const DeleteBtn = styled.button`
  border: none;
  padding: 5px 10px;
  background-color: #ec5990;
  cursor: pointer;
`;
const CarInfo = styled.p`
  font-size: 16px;
`;

const EditCar = () => {
  const car = useAppSelector((state) => state.car.car);
  const dispatch = useAppDispatch();
  const [carAge, setCarAge] = useState<string>(car?.age || "0");
  const [inspectionDay, setInspectionDay] = useState<string>(
    car?.inspectionDay || "0"
  );
  const { register, handleSubmit, watch, reset } = useForm<carType>({
    mode: "onBlur",
  });
  const initCar = useMemo(() => {
    return {
      name: car?.name,
      brand: car?.brand,
      plateNum: car?.plateNum,
      licenseDate: car?.licenseDate,
      insuranceDate: car?.insuranceDate,
    };
  }, [car]);

  useEffect(() => {
    reset(initCar);
  }, [car, reset, initCar]);
  useEffect(() => {
    const subscription = watch(({ licenseDate }) => {
      if (licenseDate) {
        const { age, inspectionDay } = carAgeHandler(licenseDate);

        setCarAge(age);
        setInspectionDay(inspectionDay);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const editCar = (editCar: carType) => {
    editCar.age = carAge;
    editCar.inspectionDay = inspectionDay;

    dispatch(asyncCarAction.updateCar(car?.id as string, editCar));
  };
  const deleteCarHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(asyncCarAction.deleteCar(car?.id as string));
  };
  return (
    <EditContainer>
      <EditWrapper onSubmit={handleSubmit(editCar)}>
        <LeftBx>
          <LogoBx></LogoBx>
          <Input
            type="text"
            placeholder="車輛名稱"
            {...register("name", { required: true })}
          />
          <Input
            type="text"
            placeholder="廠牌"
            {...register("brand", { required: true })}
          />
          <Input type="text" placeholder="車牌" {...register("plateNum")} />
        </LeftBx>
        <RightBx>
          <CarInfo>驗車時間設定</CarInfo>
          <Input
            type="date"
            placeholder="行照發照日"
            {...register("licenseDate")}
          />
          <CarInfo>車齡:{carAge}</CarInfo>
          <CarInfo>驗車日期:{inspectionDay}</CarInfo>
          <CarInfo>保險到期設定</CarInfo>
          <Input
            type="date"
            placeholder="保險到期日"
            {...register("insuranceDate")}
          />
          <EditBtn>編輯</EditBtn>
          <DeleteBtn onClick={deleteCarHandler}>刪除</DeleteBtn>
        </RightBx>
      </EditWrapper>
    </EditContainer>
  );
};

export default EditCar;
