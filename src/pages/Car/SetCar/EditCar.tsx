import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components/macro";
import brands from "../../../utils/brands";
import Brands from "./Brands";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { createMessage } from "../../../utils/calcFunc";
import { useForm, FormProvider } from "react-hook-form";
import { carAgeAndInspectionDay } from "../../../utils/calcFunc";
import asyncCarAction from "../../../store/car/asyncCarAction";
import Input from "../../../components/Input/Input";
import InputBox from "../../../components/Input/InputBox";
import { carType } from "../../../types/carType";
import Modal from "../../../components/Modal/Modal";
import Confirm from "../../../components/Modal/Confirm";
import Button from "../../../components/Button/Button";
import { NeonText } from "../../../components/style";

import logoIcon from "../../../assets/logo_white.png";

const EditContainer = styled.div`
  width: 100%;
  display: flex;
  max-width: 800px;
  flex-direction: column;
  align-items: center;
`;

const EditWrapper = styled.div`
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
  @media screen and (max-width: 701px) {
    flex-direction: column;
  }
`;

const RightBx = styled.div`
  display: flex;
  width: 290px;
  min-width: 290px;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 701px) {
    width: 100%;
  }
`;

const CarInfo = styled.p`
  font-size: 14px;
  margin-right: 10px;
  margin-left: 5px;
`;
const BrandWrapper = styled.div`
  flex-grow: 1;
  /* margin-right: 17px; */
  width: 100%;
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
  @media screen and (max-width: 701px) {
    width: 100%;
  }
`;

const BtnBx = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoBx = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
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
  position: absolute;
  object-fit: contain;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
`;
const CarInfoBx = styled.div`
  width: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: var(--mainColor);
  padding: 5px 10px;
  border-radius: 50px;
`;
const SubTitle = styled.span`
  font-size: 14px;
  color: #fff;
`;

const BrandInputBx = styled.div`
  overflow: hidden;
  height: 0;
`;

const BrandTitle = styled.p`
  text-align: center;
  font-size: 16px;
  display: inline-block;
  min-width: 150px;
  padding: 5px 10px;
  background-color: var(--mainColor);
  border-radius: 50px;
  margin-left: 10px;
`;
const Title = styled(NeonText)`
  font-size: 20px;
  padding: 20px 0 15px 25px;
  font-weight: 400;
`;

type brandType = { name: string; key: string };
const EditCar = () => {
  const car = useAppSelector((state) => state.car.car);
  const cars = useAppSelector((state) => state.car.cars);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initBrandName = car
    ? { name: brands.get(car.brand)?.name, key: car.brand }
    : { name: "", key: "" };
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [brandName, setBrandName] = useState<brandType>(
    initBrandName as brandType
  );
  const [carAge, setCarAge] = useState<string>(car?.age || "0");
  const [inspectionDay, setInspectionDay] = useState<string>(
    car?.inspectionDay || "0"
  );
  const initCar = useMemo(() => {
    return {
      id: car?.id,
      name: car?.name,
      brand: car?.brand,
      plateNum: car?.plateNum,
      licenseDate: car?.licenseDate,
      insuranceDate: car?.insuranceDate,
    };
  }, [car]);

  const methods = useForm<carType>({ defaultValues: initCar });
  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(initCar);
  }, [car, reset, initCar]);

  useEffect(() => {
    const subscription = watch(({ licenseDate }) => {
      if (licenseDate) {
        const { age, inspectionDay } = carAgeAndInspectionDay(licenseDate);

        setCarAge(age);
        setInspectionDay(inspectionDay);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    setValue("brand", brandName.name);
  }, [brandName, setValue]);

  const editCarHandler = async (editCar: carType) => {
    editCar.brand = brandName.key;
    editCar.age = carAge;
    editCar.inspectionDay = inspectionDay;
    dispatch(asyncCarAction.updateCar(editCar.id as string, editCar));
    createMessage("remind", dispatch, "已更新車輛");
    navigate("/car_manage/record");
  };
  const callConfirm = () => {
    setShowConfirm(true);
  };

  const deleteCarHandler = () => {
    dispatch(asyncCarAction.deleteCar(car?.id as string, user, cars));
    navigate("/car_manage/record");
    createMessage("remind", dispatch, "已刪除車輛");
  };

  const brandNameHandler = (name: string, key: string) => {
    setBrandName({ name, key });
  };

  const closePartForm = () => {
    setCloseEffect(true);

    setTimeout(() => {
      setShowConfirm(false);
      setCloseEffect(false);
    }, 600);
  };

  const goRecord = () => {
    navigate("/car_manage/record");
  };

  return (
    <>
      <FormProvider {...methods}>
        <EditContainer>
          <Title>編輯車輛</Title>
          <EditWrapper>
            <BrandWrapper>
              <BrandTitle>{brandName.name}</BrandTitle>
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
                <LogoBx>
                  <LogoImg src={brands.get(brandName.key)?.img || logoIcon} />
                </LogoBx>
              </LogoWrapper>
              <CarInfoBx>
                <SubTitle>車齡 :</SubTitle>
                <CarInfo>{carAge}</CarInfo>
                <SubTitle>驗車日期:</SubTitle>
                <CarInfo>{inspectionDay}</CarInfo>
              </CarInfoBx>

              <InputBx>
                <InputBox
                  name="name"
                  content="暱稱"
                  error={typeof errors?.name?.type === "string"}
                  require={{
                    required: true,
                    maxLength: 20,
                    onBlur: (e: { target: { value: string } }) => {
                      setValue("name", e.target.value.trim());
                    },
                  }}
                  type="text"
                  message={
                    errors?.name?.type === "required"
                      ? "尚未填寫暱稱"
                      : errors?.name?.type === "maxLength"
                      ? "字數最多20字元"
                      : ""
                  }
                />
              </InputBx>

              <InputBx>
                <InputBox
                  name="plateNum"
                  content="車牌"
                  error={typeof errors?.plateNum?.type === "string"}
                  require={{
                    required: true,
                    pattern: /^[A-Z0-9]{0,4}-[A-Z0-9]{0,4}$/,
                    onBlur: (e: { target: { value: string } }) => {
                      setValue("plateNum", e.target.value.trim());
                    },
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
                  calendarPosition="top"
                  message={errors.licenseDate && "尚未填寫"}
                />
              </InputBx>

              <InputBx>
                <InputBox
                  name="insuranceDate"
                  content="保險到期日"
                  error={typeof errors?.insuranceDate?.type === "string"}
                  require={{ required: true }}
                  type="date"
                  calendarPosition="top"
                  message={errors.insuranceDate && "尚未填寫"}
                />
              </InputBx>
              <BtnBx>
                <Button label="返回" handleClick={goRecord} type="cancel" />
                <Button label="刪除" handleClick={callConfirm} type="reject" />
                <Button
                  label="更新"
                  handleClick={handleSubmit(editCarHandler)}
                  type="primary"
                />
              </BtnBx>
            </RightBx>
          </EditWrapper>
        </EditContainer>
      </FormProvider>
      {showConfirm && (
        <Modal
          closeEffect={closeEffect}
          onClose={closePartForm}
          containerWidth={400}
        >
          <Confirm onClose={closePartForm} onDelete={deleteCarHandler} />
        </Modal>
      )}
    </>
  );
};

export default EditCar;
