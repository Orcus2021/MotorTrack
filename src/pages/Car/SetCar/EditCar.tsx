import React, { useEffect, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import brands, { brandsMapType } from "../../../utils/brands";
import Brands from "./Brands";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm } from "react-hook-form";
import { carAgeAndInspectionDay } from "../../../utils/calcFunc";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";
import { Img } from "../../../components/style";
import Modal from "../../../components/Modal/Modal";
import Confirm from "./Confirm";

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
  background-color: var(--errorColor);
  cursor: pointer;
`;
const CarInfo = styled.p`
  font-size: 16px;
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
  margin-bottom: 10px;
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
  height: 200px;
  width: 200px;
  position: relative;
  background-color: #ffffff8b;
  border-radius: 50%;
  overflow: hidden;
`;
const ConFirmWrapper = styled.div`
  width: 400px;
  height: 400px;
  background: var(--secondBack);
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

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<carType>();

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

  const editCar = (editCar: carType) => {
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
            <LogoBx>
              <Img src={brands.get(brandName.key)?.img} />
            </LogoBx>
            <CarInfo>暱稱</CarInfo>
            <Input
              type="text"
              placeholder="暱稱"
              {...register("name", { required: true })}
            />
            <CarInfo>車牌</CarInfo>
            <Input type="text" placeholder="車牌" {...register("plateNum")} />
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
            <BtnBx>
              <EditBtn onClick={handleSubmit(editCar)}>確定</EditBtn>
              <DeleteBtn onClick={callConfirm}>刪除</DeleteBtn>
            </BtnBx>
          </RightBx>
        </EditWrapper>
      </EditContainer>
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
