import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components/macro";
import Input from "../../../components/Input";
import { Img } from "../../../components/style";
import brands, { brandsMapType } from "../../../utils/brands";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/index";
import { useForm } from "react-hook-form";
import asyncCarAction from "../../../store/car/asyncCarAction";
import { carType } from "../../../types/carType";
import { createMessage } from "../../../utils/calcFunc";

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

const LogoWrapper = styled.div`
  width: 250px;
  height: 100px;

  border-radius: 4px;
  /* background-color: #ffffff8b; */
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`;

const LogoBx = styled.div`
  width: 100%;

  height: 100%;
  position: relative;
  overflow: hidden;
`;
const LogoImg = styled.img`
  position: absolute;
  object-fit: contain;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
`;
const ErrorMsg = styled.p`
  text-align: left;
  height: 10px;
  font-size: 10px;
  margin-bottom: 15px;
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
    watch,
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
          <LogoWrapper>
            <LogoBx>
              <LogoImg src={brands.get(brandName.key)?.img || logoIcon} />
            </LogoBx>
          </LogoWrapper>

          <InputBx>
            <Input
              register={register}
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
              register={register}
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
              register={register}
              setValue={setValue}
              watch={watch}
              name="licenseDate"
              content="行照發照日"
              error={errors?.licenseDate}
              require={{ required: true }}
              type="date"
            />
          </InputBx>
          <ErrorMsg>{errors.licenseDate && "尚未填寫"}</ErrorMsg>
          <InputBx>
            <Input
              register={register}
              setValue={setValue}
              watch={watch}
              name="insuranceDate"
              content="保險到期日"
              error={errors?.insuranceDate}
              require={{ required: true }}
              type="date"
            />
          </InputBx>
          <ErrorMsg>{errors.insuranceDate && "尚未填寫"}</ErrorMsg>
          <AddBtn onClick={handleSubmit(createCar)}>新增</AddBtn>
        </RightBx>
      </AddWrapper>
    </AddContainer>
  );
};

export default AddCar;
