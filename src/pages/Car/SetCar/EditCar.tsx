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
import Input from "../../../components/Input";
import { carType } from "../../../types/carType";
import Modal from "../../../components/Modal/Modal";
import Confirm from "./Confirm";

import logoIcon from "../../../assets/logo_white.png";

const EditContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const EditWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px 0 10px;
`;

const RightBx = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
// const Input = styled.input`
//   width: 100%;
// `;
const EditBtn = styled.button`
  border: none;
  padding: 5px 10px;
  background-color: var(--mainColor);
  cursor: pointer;
`;
const DeleteBtn = styled.button`
  border: none;
  padding: 5px 10px;
  background-color: var(--errorColor);
  cursor: pointer;
`;
const CarInfo = styled.p`
  font-size: 12px;
  margin-right: 10px;
`;
const BrandWrapper = styled.div`
  width: 50%;
  height: 400px;
`;
const InputBx = styled.div`
  display: flex;
  position: relative;
  width: 250px;
  flex-direction: column;
  align-items: flex-start;
`;
const BrandInput = styled.input<{ $isError: undefined | object }>`
  background-color: transparent;
  font-size: 1rem;
  border: 1px solid
    ${(props) => (props.$isError ? "var(--errorColor)" : "#fff")};
  outline: none;
  color: #fff;
  text-align: center;
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
const ErrorMsg = styled.p`
  text-align: left;
  height: 10px;
  font-size: 10px;
  margin-bottom: 15px;
  &:nth-child(7) {
    margin-bottom: 0;
  }
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
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
`;
const SubTitle = styled.span`
  font-size: 12px;
  color: var(--mainColor);
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
      name: car?.name,
      brand: car?.brand,
      plateNum: car?.plateNum,
      licenseDate: car?.licenseDate,
      insuranceDate: car?.insuranceDate,
    };
  }, [car]);

  const methods = useForm<carType>({ defaultValues: initCar });
  const {
    register,
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

  const editCarHandler = (editCar: carType) => {
    editCar.brand = brandName.key;
    editCar.age = carAge;
    editCar.inspectionDay = inspectionDay;

    dispatch(asyncCarAction.updateCar(car?.id as string, editCar));
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

  return (
    <>
      <FormProvider {...methods}>
        <EditContainer>
          <EditWrapper>
            <BrandWrapper>
              <InputBx>
                <BrandInput
                  type="text"
                  placeholder="廠牌(請選擇)"
                  $isError={errors?.brand}
                  readOnly
                  {...register("brand", { required: true })}
                />
              </InputBx>
              <Brands onBrand={brandNameHandler} brandName={brandName} />
            </BrandWrapper>
            <RightBx>
              <LogoWrapper>
                <LogoBx>
                  <LogoImg src={brands.get(brandName.key)?.img || logoIcon} />
                </LogoBx>
              </LogoWrapper>

              <InputBx>
                <Input
                  name="name"
                  content="暱稱"
                  error={errors?.name}
                  require={{ required: true }}
                  type="text"
                />
              </InputBx>
              <ErrorMsg>{errors.name && "車輛名稱尚未填寫"}</ErrorMsg>

              <InputBx>
                <Input
                  name="plateNum"
                  content="車牌"
                  error={errors?.plateNum}
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
                  error={errors?.licenseDate}
                  require={{ required: true }}
                  type="date"
                />
              </InputBx>
              <ErrorMsg>{errors.licenseDate && "尚未填寫"}</ErrorMsg>
              <CarInfoBx>
                <SubTitle>車齡:</SubTitle>
                <CarInfo>{carAge}</CarInfo>
                <SubTitle>驗車日期:</SubTitle>
                <CarInfo>{inspectionDay}</CarInfo>
              </CarInfoBx>

              <InputBx>
                <Input
                  name="insuranceDate"
                  content="保險到期日"
                  error={errors?.insuranceDate}
                  require={{ required: true }}
                  type="date"
                  setStyle={{ position: "top" }}
                />
              </InputBx>
              <ErrorMsg>{errors.insuranceDate && "尚未填寫"}</ErrorMsg>
              <BtnBx>
                <EditBtn onClick={handleSubmit(editCarHandler)}>確定</EditBtn>
                <DeleteBtn onClick={callConfirm}>刪除</DeleteBtn>
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
