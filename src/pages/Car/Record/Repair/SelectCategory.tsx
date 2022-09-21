import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Img } from "../../../../components/style";
import parts from "../../../../utils/parts";
import { useFormContext } from "react-hook-form";
import SelectBox from "../../../../components/SelectBox";

import arrowIcon from "../../../../assets/icon/arrow_down.png";

const Content = styled.div`
  height: 28px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px;
  justify-content: flex-start;
  cursor: pointer;
  &:hover {
    background-color: var(--mainColor);
  }
`;
const DisplayName = styled.p`
  width: 120px;
  @media screen and (max-width: 701px) {
    flex-grow: 1;
    width: auto;
  }
`;

const BrandBx = styled.div`
  flex-basis: 15px;
  height: 15px;
  width: 15px;
  position: relative;
`;
const DisplayBrandBx = styled.div`
  height: 20px;
  width: 20px;
  margin-right: 5px;
  position: relative;
`;

const CarName = styled.p`
  font-size: 12px;
  color: #fff;
`;
const PartInput = styled.input`
  outline: none;
  border: none;

  width: 0;
  height: 100%;
  background-color: transparent;
  color: #fff;
`;

const Select = () => {
  const methods = useFormContext();
  const { register, setValue, watch } = methods;
  const initName = parts.get(watch("category"))?.name as string;

  const [showContent, setShowContent] = useState<boolean>(false);
  const [partName, setPartName] = useState<string>("");

  useEffect(() => {
    setPartName(initName);
  }, [initName]);

  const showContentHandler = () => {
    setShowContent((pre) => !pre);
  };
  const selectPartHandler = (key: string, name: string) => {
    setValue("category", key);
    setPartName(name);
    setValue("mileage", parts.get(key)?.mileage as number);
    setValue("month", parts.get(key)?.expirationMonth as number);
    setValue("year", parts.get(key)?.expirationYear as number);
    showContentHandler();
  };

  const options: JSX.Element[] = [];
  parts.forEach((value, key) => {
    options.push(
      <Content
        onClick={() => selectPartHandler(key, value.name)}
        key={value.name}
      >
        <BrandBx>
          <Img src={parts.get(key)?.icon} />
        </BrandBx>
        <CarName>{value.name}</CarName>
      </Content>
    );
  });
  return (
    <>
      <SelectBox
        options={options}
        icon={arrowIcon}
        onShow={showContentHandler}
        showContent={showContent}
        width="50%"
      >
        <DisplayBrandBx>
          <Img src={parts.get(watch("category"))?.icon} />
        </DisplayBrandBx>
        <DisplayName>{partName}</DisplayName>
        <PartInput readOnly {...register("category", { required: true })} />
      </SelectBox>
    </>
  );
};

export default Select;
