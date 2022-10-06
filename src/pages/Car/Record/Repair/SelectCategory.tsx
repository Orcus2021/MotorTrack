import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import styled from "styled-components/macro";
import SelectBox from "../../../../components/SelectBox";
import { Img } from "../../../../components/style";
import parts from "../../../../utils/parts";

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
  flex-basis: 20px;
  height: 20px;
  width: 20px;
  position: relative;
`;
const DisplayBrandBox = styled.div`
  height: 20px;
  width: 20px;
  margin-right: 5px;
  position: relative;
`;

const CarName = styled.p`
  font-size: 16px;
  margin-left: 5px;
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
  const selectPartHandler = useCallback(
    (key: string, name: string) => {
      setValue("category", key);
      setPartName(name);
      setValue("mileage", parts.get(key)?.mileage as number);
      setValue("month", parts.get(key)?.expirationMonth as number);
      setValue("year", parts.get(key)?.expirationYear as number);
    },
    [setValue]
  );

  const partsList = useMemo(() => {
    const options: JSX.Element[] = [];
    parts.forEach((value, key) => {
      options.push(
        <Content
          onClick={() => selectPartHandler(key, value.name)}
          key={value.name}
        >
          <BrandBx>
            <Img src={value.icon} />
          </BrandBx>
          <CarName>{value.name}</CarName>
        </Content>
      );
    });
    return options;
  }, [selectPartHandler]);
  return (
    <>
      <SelectBox
        options={partsList}
        icon={arrowIcon}
        onShow={showContentHandler}
        showContent={showContent}
        width="50%"
      >
        <DisplayBrandBox>
          <Img src={parts.get(watch("category"))?.icon} />
        </DisplayBrandBox>
        <DisplayName>{partName}</DisplayName>
        <PartInput readOnly {...register("category", { required: true })} />
      </SelectBox>
    </>
  );
};

export default Select;
