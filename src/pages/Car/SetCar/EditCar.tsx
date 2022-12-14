import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import Button from "../../../components/Button/Button";
import Input from "../../../components/Input/Input";
import InputBox from "../../../components/Input/InputBox";
import Confirm from "../../../components/Modal/Confirm";
import Modal from "../../../components/Modal/Modal";
import { NeonText } from "../../../components/style";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { carType } from "../../../types/carType";
import brands from "../../../utils/brands";
import { carAgeAndInspectionDay, createMessage } from "../../../utils/calcFunc";
import Brands from "./Brands";

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

const RightWrapper = styled.div`
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InputWrapper = styled.div`
  display: flex;
  position: relative;
  width: 250px;
  flex-direction: column;
  align-items: flex-start;
  @media screen and (max-width: 701px) {
    width: 100%;
  }
`;

const BtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LogoBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const LogoWrapper = styled.div`
  width: 250px;
  height: 100px;
  border-radius: 4px;
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
const CarInfoBox = styled.div`
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

const BrandInputBox = styled.div`
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
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [carAge, setCarAge] = useState<string>(car?.age || "0");
  const [inspectionDay, setInspectionDay] = useState<string>(
    car?.inspectionDay || "0"
  );
  const initBrandName = car
    ? { name: brands.get(car.brand)?.name, key: car.brand }
    : { name: "", key: "" };
  const [brandName, setBrandName] = useState<brandType>(
    initBrandName as brandType
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
    createMessage("remind", dispatch, "???????????????");
    navigate("/car_manage/record");
  };
  const callConfirmHandler = () => {
    setShowConfirm(true);
  };

  const deleteCarHandler = () => {
    dispatch(asyncCarAction.deleteCar(car?.id as string, user, cars));
    navigate("/car_manage/record");
    createMessage("remind", dispatch, "???????????????");
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

  const goRecordHandler = () => {
    navigate("/car_manage/record");
  };

  return (
    <>
      <FormProvider {...methods}>
        <EditContainer>
          <Title>????????????</Title>
          <EditWrapper>
            <BrandWrapper>
              <BrandTitle>{brandName.name}</BrandTitle>
              <BrandInputBox>
                <Input
                  name="brand"
                  content="??????(?????????)"
                  error={typeof errors?.brand?.type === "string"}
                  require={{ required: true }}
                  type="text"
                  readOnly={true}
                />
              </BrandInputBox>
              <Brands onBrand={brandNameHandler} brandName={brandName} />
            </BrandWrapper>
            <RightWrapper>
              <LogoWrapper>
                <LogoBox>
                  <LogoImg src={brands.get(brandName.key)?.img || logoIcon} />
                </LogoBox>
              </LogoWrapper>
              <CarInfoBox>
                <SubTitle>?????? :</SubTitle>
                <CarInfo>{carAge}</CarInfo>
                <SubTitle>????????????:</SubTitle>
                <CarInfo>{inspectionDay}</CarInfo>
              </CarInfoBox>

              <InputWrapper>
                <InputBox
                  name="name"
                  content="??????"
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
                      ? "??????????????????"
                      : errors?.name?.type === "maxLength"
                      ? "????????????20??????"
                      : ""
                  }
                />
              </InputWrapper>

              <InputWrapper>
                <InputBox
                  name="plateNum"
                  content="??????"
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
                      ? "????????????"
                      : errors.plateNum?.type === "pattern"
                      ? "????????????"
                      : ""
                  }
                />
              </InputWrapper>

              <InputWrapper>
                <InputBox
                  name="licenseDate"
                  content="???????????????"
                  error={typeof errors?.licenseDate?.type === "string"}
                  require={{ required: true }}
                  type="date"
                  calendarPosition="top"
                  message={errors.licenseDate && "????????????"}
                />
              </InputWrapper>

              <InputWrapper>
                <InputBox
                  name="insuranceDate"
                  content="???????????????"
                  error={typeof errors?.insuranceDate?.type === "string"}
                  require={{ required: true }}
                  type="date"
                  calendarPosition="top"
                  message={errors.insuranceDate && "????????????"}
                />
              </InputWrapper>
              <BtnBox>
                <Button
                  label="??????"
                  handleClick={goRecordHandler}
                  type="cancel"
                />
                <Button
                  label="??????"
                  handleClick={callConfirmHandler}
                  type="reject"
                />
                <Button
                  label="??????"
                  handleClick={handleSubmit(editCarHandler)}
                  type="primary"
                />
              </BtnBox>
            </RightWrapper>
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
