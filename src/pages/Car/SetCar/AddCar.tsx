import React from "react";
import styled from "styled-components";
import { InputFloat, SpanFloat } from "../../../components/style";
import { useNavigate } from "react-router-dom";
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
const InputBx = styled.div`
  display: flex;
  position: relative;
  width: 250px;
  flex-direction: row;
  align-items: center;
`;
const Input = styled(InputFloat)``;
const Span = styled(SpanFloat)``;
const Label = styled.label`
  font-size: 16px;
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
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<carType>({ mode: "onBlur" });

  const createCar = (car: carType) => {
    car.ownerId = user.id;
    car.mileage = 0;
    car.id = "";
    car.recordAnnual = {};
    dispatch(asyncCarAction.create(user.id, user.cars, car));
    navigate("/car_manage/record");
  };

  return (
    <AddContainer>
      <AddWrapper>
        <LogoBx></LogoBx>
        <RightBx>
          <form onSubmit={handleSubmit(createCar)}>
            <InputBx>
              {/* <Label>名稱</Label> */}
              <Input
                type="text"
                required
                {...register("name", { required: true })}
              />
              <Span>名稱</Span>
            </InputBx>

            {errors.name && <p>車輛名稱尚未填寫</p>}
            <InputBx>
              <Label>廠牌</Label>
            </InputBx>
            <Input
              type="text"
              placeholder="廠牌"
              {...register("brand", { required: true })}
            />
            {errors.brand && <p>brand is required</p>}
            <Input
              type="text"
              placeholder="車牌"
              {...register("plateNum", {
                required: true,
                pattern: /[A-Z]{0,4}\d{0,4}-[A-Z]{0,4}\d{0,4}/,
              })}
            />
            {errors.plateNum?.type === "required" && <p>尚未填寫</p>}
            {errors.plateNum?.type === "pattern" && <p>格式錯誤</p>}
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
