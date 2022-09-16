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
import InputBox from "../../../components/Input/InputBox";

import logoIcon from "../../../assets/logo_white.png";

const AddContainer = styled.div`
  width: 100%;
  display: flex;
  max-width: 800px;
  flex-direction: column;
  align-items: center;
`;
const AddWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(1, 0, 44, 0.2);
  backdrop-filter: blur(5px);
`;
const BrandWrapper = styled.div`
  flex-grow: 1;
  margin-right: 17px;
  /* background-color: var(--mainColor); */
  /* height: 400px; */
`;
const RightBx = styled.div`
  display: flex;
  width: 290px;
  min-width: 290px;
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

const SubTitle = styled.p<{ $isError?: boolean }>`
  text-align: center;
  font-size: 16px;
  ${(props) => {
    if (props.$isError) {
      return "text-shadow: 0 0 10px var(--errorColor), 0 0 20px var(--errorColor), 0 0 40px var(--errorColor), 0 0 80px var(--errorColor), 0 0 120px var(--errorColor);";
    }
  }};
`;
const Title = styled(NeonText)`
  font-size: 20px;
  padding: 20px 0 15px 25px;
  font-weight: 400;
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

  return (
    <FormProvider {...methods}>
      <AddContainer>
        <Title>新增車輛</Title>
        <AddWrapper>
          <BrandWrapper>
            <SubTitle $isError={typeof errors?.brand?.type === "string"}>
              {brandName.name || "廠牌(請選擇)"}
            </SubTitle>
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
              <InputBox
                name="name"
                content="暱稱"
                error={typeof errors?.name?.type === "string"}
                require={{ required: true }}
                type="text"
                message={errors.name && "車輛名稱尚未填寫"}
              />
            </InputBx>
            <InputBx>
              <InputBox
                name="plateNum"
                content="車牌"
                error={typeof errors?.plateNum?.type === "string"}
                require={{
                  required: true,
                  pattern: /[A-Z]{0,4}\d{0,4}-[A-Z]{0,4}\d{0,4}/,
                }}
                type="text"
                message={
                  errors.plateNum?.type === "required"
                    ? "尚未填寫"
                    : errors.plateNum?.type === "pattern"
                    ? "格式錯誤"
                    : ""
                }
              />
            </InputBx>

            <InputBx>
              <InputBox
                name="licenseDate"
                content="行照發照日"
                error={typeof errors?.licenseDate?.type === "string"}
                require={{ required: true }}
                type="date"
                message={errors.licenseDate && "尚未填寫"}
              />
            </InputBx>
            <InputBx>
              <InputBox
                name="insuranceDate"
                content="保險到期日"
                error={typeof errors?.insuranceDate?.type === "string"}
                require={{ required: true }}
                calendarPosition={"top"}
                type="date"
                message={errors.insuranceDate && "尚未填寫"}
              />
            </InputBx>
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
