import React, { useEffect, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import brands, { brandsMapType } from "../../../utils/brands";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm } from "react-hook-form";
import { carAgeAndInspectionDay } from "../../../utils/calcFunc";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";
import { Img } from "../../../components/style";

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
  background-color: var(--errorColor);
  cursor: pointer;
`;
const CarInfo = styled.p`
  font-size: 16px;
`;
const BrandWrapper = styled.div`
  width: 50%;
  /* background-color: var(--mainColor); */
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
const BrandBx = styled.div`
  border: 1px solid #fff;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;

  overflow-y: auto;
`;
const BrandCard = styled.div<{ $isSelected: boolean }>`
  width: 90px;
  height: 115px;
  border-radius: 10px;
  margin: 5px;
  background-color: ${(props) =>
    props.$isSelected ? "var(--mainColor)" : "var(--thirdBack)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  cursor: pointer;
`;
const ImgBx = styled.div`
  width: 80px;
  height: 80px;
  background-color: #ffffff8b;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  margin-bottom: 5px;
`;
const BrandImg = styled(Img)`
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  object-fit: contain;
`;
const Name = styled.p`
  font-size: 10px;
`;
const EditCar = () => {
  const car = useAppSelector((state) => state.car.car);
  const cars = useAppSelector((state) => state.car.cars);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const allBrands = useRef<[string, brandsMapType][]>(Array.from(brands));
  const [brandName, setBrandName] = useState<{ name: string; key: string }>({
    name: "",
    key: "",
  });
  const [carAge, setCarAge] = useState<string>(car?.age || "0");
  const [inspectionDay, setInspectionDay] = useState<string>(
    car?.inspectionDay || "0"
  );
  const {
    register,
    handleSubmit,
    watch,
    reset,
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

  const editCar = (editCar: carType) => {
    editCar.age = carAge;
    editCar.inspectionDay = inspectionDay;

    dispatch(asyncCarAction.updateCar(car?.id as string, editCar));
    navigate("/car_manage/record");
  };

  const deleteCarHandler = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(asyncCarAction.deleteCar(car?.id as string, user, cars));
    navigate("/car_manage/record");
  };
  const brandNameHandler = (name: string, key: string) => {
    setBrandName({ name, key });
  };
  return (
    <EditContainer>
      <EditWrapper onSubmit={handleSubmit(editCar)}>
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
          <BrandBx>
            {allBrands.current.map((brand) => {
              return (
                <BrandCard
                  key={brand[1].name}
                  $isSelected={brand[1].name === brandName.name}
                  onClick={() => {
                    brandNameHandler(brand[1].name, brand[0]);
                  }}
                >
                  <ImgBx>
                    <BrandImg src={brand[1].img} />
                  </ImgBx>
                  <Name>{brand[1].name}</Name>
                </BrandCard>
              );
            })}
          </BrandBx>
        </BrandWrapper>
        <RightBx>
          <Input type="text" placeholder="車牌" {...register("plateNum")} />
          <Input
            type="text"
            placeholder="車輛名稱"
            {...register("name", { required: true })}
          />
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
