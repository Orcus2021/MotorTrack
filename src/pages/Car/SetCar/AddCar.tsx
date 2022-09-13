import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import Input from "../../../components/Input/Input";
import brands from "../../../utils/brands";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm, FormProvider } from "react-hook-form";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";
import { createMessage } from "../../../utils/calcFunc";
import Button from "../../../components/Button";
import Brands from "./Brands";
import { NeonText } from "../../../components/style";

import logoIcon from "../../../assets/logo_white.png";

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
const BrandWrapper = styled.div`
  width: 50%;
  /* background-color: var(--mainColor); */
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
  flex-direction: column;
  align-items: flex-start;
`;
const BtnBx = styled.div`
  display: flex;
  align-items: center;
`;

const LogoWrapper = styled.div`
  width: 250px;
  height: 100px;

  border-radius: 4px;
  /* background-color: #ffffff8b; */
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const LogoImg = styled.img`
  object-fit: contain;
  width: 250px;
  height: auto;
`;
const ErrorMsg = styled.p`
  text-align: left;
  height: 10px;
  font-size: 10px;
  margin-bottom: 15px;
`;

const Title = styled(NeonText)<{ $isError?: boolean }>`
  text-align: center;
  font-size: 20px;
  ${(props) => {
    if (props.$isError) {
      return "text-shadow: 0 0 10px var(--errorColor), 0 0 20px var(--errorColor), 0 0 40px var(--errorColor), 0 0 80px var(--errorColor), 0 0 120px var(--errorColor);";
    }
  }};
`;

const BrandInputBx = styled.div`
  overflow: hidden;
  height: 0;
`;

const AddCar = () => {
  const user = useAppSelector((state) => state.user.user);
  const [brandName, setBrandName] = useState<{ name: string; key: string }>({
    name: "",
    key: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm<carType>();

  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setValue("brand", brandName.name);
  }, [brandName, setValue]);

  const createCar = async (car: carType) => {
    car.brand = brandName.key;
    car.ownerId = user.id;
    car.mileage = 0;
    car.id = "";
    car.recordAnnual = {};

    await dispatch(asyncCarAction.create(user.id, user.cars, car));

    createMessage("remind", dispatch, "已新增車輛");
    navigate("/car_manage/record");
  };
  const goRecord = () => {
    navigate("/car_manage/record");
  };

  const brandNameHandler = (name: string, key: string) => {
    clearErrors("brand");
    setBrandName({ name, key });
  };
  // console.log(typeof errors?.licenseDate?.type === "string");
  return (
    <FormProvider {...methods}>
      <AddContainer>
        <AddWrapper>
          <BrandWrapper>
            <Title $isError={typeof errors?.brand?.type === "string"}>
              {brandName.name || "廠牌(請選擇)"}
            </Title>
            <BrandInputBx>
              <Input
                name="brand"
                content="廠牌(請選擇)"
                error={typeof errors?.brand?.type === "string"}
                require={{ required: true }}
                type="text"
                readOnly={true}
              />
            </BrandInputBx>

            <Brands onBrand={brandNameHandler} brandName={brandName} />
          </BrandWrapper>
          <RightBx>
            <LogoWrapper>
              <LogoImg src={brands.get(brandName.key)?.img || logoIcon} />
            </LogoWrapper>

            <InputBx>
              <Input
                name="name"
                content="暱稱"
                error={typeof errors?.name?.type === "string"}
                require={{ required: true }}
                type="text"
              />
            </InputBx>
            <ErrorMsg>{errors.name && "車輛名稱尚未填寫"}</ErrorMsg>

            <InputBx>
              <Input
                name="plateNum"
                content="車牌"
                error={typeof errors?.plateNum?.type === "string"}
                require={{
                  required: true,
                  pattern: /[A-Z]{0,4}\d{0,4}-[A-Z]{0,4}\d{0,4}/,
                }}
                type="text"
              />
            </InputBx>
            <ErrorMsg>
              {errors.plateNum?.type === "required" && <p>尚未填寫</p>}
              {errors.plateNum?.type === "pattern" && <p>格式錯誤</p>}
            </ErrorMsg>
            <InputBx>
              <Input
                name="licenseDate"
                content="行照發照日"
                error={typeof errors?.licenseDate?.type === "string"}
                require={{ required: true }}
                type="date"
              />
            </InputBx>
            <ErrorMsg>{errors.licenseDate && "尚未填寫"}</ErrorMsg>
            <InputBx>
              <Input
                name="insuranceDate"
                content="保險到期日"
                error={typeof errors?.insuranceDate?.type === "string"}
                require={{ required: true }}
                calendarPosition={"top"}
                type="date"
              />
            </InputBx>
            <ErrorMsg>{errors.insuranceDate && "尚未填寫"}</ErrorMsg>
            <BtnBx>
              <Button label="返回" type="cancel" handleClick={goRecord} />
              <Button
                label="新增"
                type="primary"
                handleClick={handleSubmit(createCar)}
              />
            </BtnBx>
          </RightBx>
        </AddWrapper>
      </AddContainer>
    </FormProvider>
  );
};

export default AddCar;
