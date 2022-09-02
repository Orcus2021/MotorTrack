import React from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm } from "react-hook-form";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";

const AddContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const AddWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px 0 10px;
`;
const LogoBx = styled.div`
  width: 50%;
  background-color: var(--mainColor);
  height: 400px;
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
const AddBtn = styled.button`
  border: none;
  padding: 5px 10px;
  background-color: var(--mainColor);
  cursor: pointer;
`;

const AddCar = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<carType>({ mode: "onBlur" });

  const createCar = (car: carType) => {
    car.ownerId = user.id;
    car.mileage = 0;
    car.id = "";
    dispatch(asyncCarAction.create(user.id, user.cars, car));
  };

  console.log(errors);
  return (
    <AddContainer>
      <AddWrapper>
        <LogoBx></LogoBx>
        <RightBx>
          <form onSubmit={handleSubmit(createCar)}>
            <Input
              type="text"
              placeholder="車輛名稱"
              {...register("name", { required: true })}
            />
            {errors.name && <p>brand is required</p>}
            <Input
              type="text"
              placeholder="廠牌"
              {...register("brand", { required: true })}
            />
            {errors.brand && <p>brand is required</p>}
            <Input type="text" placeholder="車牌" {...register("plateNum")} />
            <Input
              type="date"
              placeholder="行照發照日"
              {...register("licenseDate")}
            />
            <Input
              type="date"
              placeholder="保險到期日"
              {...register("insuranceDate")}
            />
            <AddBtn>新增</AddBtn>
          </form>
        </RightBx>
      </AddWrapper>
    </AddContainer>
  );
};

export default AddCar;
