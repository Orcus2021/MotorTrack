import React, { useEffect } from "react";
import styled from "styled-components/macro";
import parts from "../../../../utils/parts";
import { partType } from "../../../../types/recordType";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../../../../components/Input/Input";
import SelectCategory from "./SelectCategory";
import InputBox from "../../../../components/Input/InputBox";
import Textarea from "../../../../components/Textarea";
import Button from "../../../../components/Button/Button";

const PartContainer = styled.div`
  width: 400px;
  padding: 10px;
  background-color: var(--thirdBack);
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 701px) {
    width: 100%;
  }
`;
const HeaderBx = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 10px;
  &:nth-child(3) {
    margin-right: 0;
  }
`;

const SpecBx = styled.div`
  width: 50%;
  margin-right: 10px;
`;
const ButtonBx = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
`;

const MileageColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  @media screen and (max-width: 701px) {
    flex-wrap: wrap;
  }
`;
const MileageBox = styled(BoxWrapper)`
  @media screen and (max-width: 701px) {
    width: 100%;
    margin-right: 0;
  }
`;
const TimeBox = styled(BoxWrapper)`
  @media screen and (max-width: 701px) {
    width: calc((100% - 10px) / 2);
  }
`;

const PartForm: React.FC<{
  onAddPart: (part: partType) => void;
  onClose: () => void;
  part: partType;
}> = (props) => {
  const { onAddPart, onClose, part } = props;
  const methods = useForm<partType>({ mode: "all" });
  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (part) {
      reset(part);
    } else {
      reset({
        category: "engineOil",
        year: parts.get("engineOil")?.expirationYear,
        month: parts.get("engineOil")?.expirationMonth,
        mileage: parts.get("engineOil")?.mileage,
        qty: 1,
        price: 0,
        subtotal: 0,
      });
    }
  }, [part, reset]);

  const submitPart = (part: partType) => {
    const partName = parts.get(watch("category"));
    if (!partName) return;
    part.name = partName.name;
    part.price = Number(part.price);

    onAddPart(part);
    onClose();
  };
  const closeFormHandler = () => {
    onClose();
  };

  return (
    <PartContainer>
      <FormProvider {...methods}>
        <HeaderBx>
          <SpecBx>
            <Input
              name="spec"
              content="規格"
              error={typeof errors?.spec?.type === "string"}
              type="text"
            />
          </SpecBx>
          <SelectCategory />
        </HeaderBx>
        <InputWrapper>
          <BoxWrapper>
            <InputBox
              message={errors.price && "單價錯誤"}
              name="price"
              content="單價"
              error={typeof errors?.price?.type === "string"}
              type="number"
              require={{
                required: true,
                min: 1,
                onBlur: (e: { target: { value: number } }) => {
                  setValue("subtotal", e.target.value * watch("qty"));
                },
              }}
            />
          </BoxWrapper>
          <BoxWrapper>
            <InputBox
              name="qty"
              content="數量"
              error={typeof errors?.qty?.type === "string"}
              type="number"
              require={{
                required: true,
                onBlur: (e: { target: { value: number } }) => {
                  setValue("subtotal", e.target.value * watch("price"));
                },
              }}
              message={errors.qty && "數量錯誤"}
            />
          </BoxWrapper>
          <BoxWrapper>
            <InputBox
              name="subtotal"
              content="總額"
              error={typeof errors?.subtotal?.type === "string"}
              type="number"
              require={{
                required: true,
                onBlur: (e: { target: { value: number } }) => {
                  setValue("price", e.target.value / watch("qty"));
                },
              }}
              message={errors.subtotal && "總額錯誤"}
            />
          </BoxWrapper>
        </InputWrapper>
        <MileageColumn>
          <MileageBox>
            <InputBox
              name="mileage"
              content="使用里程"
              error={typeof errors?.mileage?.type === "string"}
              require={{ required: true, min: 0 }}
              type="number"
              message={errors.mileage && "里程數錯誤"}
            />
          </MileageBox>

          <TimeBox>
            <InputBox
              name="year"
              content="年"
              error={typeof errors?.year?.type === "string"}
              require={{
                required: true,
                valueAsNumber: true,
                min: 0,
                validate: {
                  positive: (v: number) => v % 1 === 0,
                },
              }}
              type="number"
              message={errors.year && "使用年限錯誤(年)"}
            />
          </TimeBox>

          <TimeBox>
            <InputBox
              name="month"
              content="月"
              error={typeof errors?.month?.type === "string"}
              require={{
                required: true,
                valueAsNumber: true,
                min: 0,
                validate: {
                  positive: (v: number) => v % 1 === 0,
                },
              }}
              type="number"
              message={errors.month && "使用年限錯誤(月)"}
            />
          </TimeBox>
        </MileageColumn>
        <Textarea content="備註" name="note" height={80} />

        <ButtonBx>
          <Button label="取消" type="cancel" handleClick={closeFormHandler} />
          <Button
            label="新增"
            type="primary"
            handleClick={handleSubmit(submitPart)}
          />
        </ButtonBx>
      </FormProvider>
    </PartContainer>
  );
};

export default PartForm;
