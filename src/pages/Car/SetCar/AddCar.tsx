import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Img } from "../../../components/style";
import brands, { brandsMapType } from "../../../utils/brands";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm } from "react-hook-form";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";
import { userActions } from "../../../store/user/userReducer";
import { createMessage } from "../../../utils/calcFunc";

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
  margin-bottom: 10px;
`;

const Input = styled.input<{ $isError: undefined | object }>`
  background-color: transparent;
  font-size: 1rem;
  border: 1px solid
    ${(props) => (props.$isError ? "var(--errorColor)" : "#fff")};
  outline: none;
  color: #fff;
`;

const Label = styled.label`
  font-size: 16px;
`;
const AddBtn = styled.button`
  border: none;
  padding: 5px 10px;
  background-color: var(--mainColor);
  cursor: pointer;
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
const BrandInput = styled.input<{ $isError: undefined | object }>`
  background-color: transparent;
  font-size: 1rem;
  border: 1px solid
    ${(props) => (props.$isError ? "var(--errorColor)" : "#fff")};
  outline: none;
  color: #fff;
  text-align: center;
`;

const LogoBx = styled.div`
  height: 200px;
  width: 200px;
  position: relative;
  background-color: #ffffff8b;
  border-radius: 50%;
  overflow: hidden;
`;

const AddCar = () => {
  const user = useAppSelector((state) => state.user.user);
  const [brandName, setBrandName] = useState<{ name: string; key: string }>({
    name: "",
    key: "",
  });
  const allBrands = useRef<[string, brandsMapType][]>(Array.from(brands));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<carType>();

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

  const brandNameHandler = (name: string, key: string) => {
    setBrandName({ name, key });
  };

  return (
    <AddContainer>
      <AddWrapper>
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
          <LogoBx>
            <Img src={brands.get(brandName.key)?.img} />
          </LogoBx>
          <InputBx>
            <Label>名稱</Label>
            <Input
              type="text"
              required
              $isError={errors?.name}
              {...register("name", { required: true })}
            />
          </InputBx>

          {errors.name && <p>車輛名稱尚未填寫</p>}
          <InputBx>
            <Label>車牌</Label>
            <Input
              type="text"
              placeholder="車牌"
              $isError={errors?.plateNum}
              {...register("plateNum", {
                required: true,
                pattern: /[A-Z]{0,4}\d{0,4}-[A-Z]{0,4}\d{0,4}/,
              })}
            />
          </InputBx>
          {errors.plateNum?.type === "required" && <p>尚未填寫</p>}
          {errors.plateNum?.type === "pattern" && <p>格式錯誤</p>}
          <InputBx>
            <Label>行照發照日</Label>
            <Input
              type="date"
              placeholder="行照發照日"
              $isError={errors?.licenseDate}
              {...register("licenseDate", { required: true })}
            />
          </InputBx>
          <InputBx>
            <Label>保險到期日</Label>
            <Input
              type="date"
              placeholder="行照發照日"
              $isError={errors?.insuranceDate}
              {...register("insuranceDate", { required: true })}
            />
          </InputBx>
          <AddBtn onClick={handleSubmit(createCar)}>新增</AddBtn>
        </RightBx>
      </AddWrapper>
    </AddContainer>
  );
};

export default AddCar;
