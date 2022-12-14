import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import styled from "styled-components/macro";
import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";
import InputBox from "../../../../components/Input/InputBox";
import Textarea from "../../../../components/Input/Textarea";
import { partType } from "../../../../types/recordType";
import parts from "../../../../utils/parts";
import SelectCategory from "./SelectCategory";

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
const HeaderBox = styled.div`
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

const SpecBox = styled.div`
  width: 50%;
  margin-right: 10px;
`;
const ButtonBox = styled.div`
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
  part: partType | false;
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

  const submitPartHandler = (part: partType) => {
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
        <HeaderBox>
          <SpecBox>
            <Input
              name="spec"
              content="??????"
              error={typeof errors?.spec?.type === "string"}
              type="text"
              require={{
                maxLength: 20,
                onBlur: (e: { target: { value: string } }) => {
                  setValue("name", e.target.value.trim());
                },
              }}
            />
          </SpecBox>
          <SelectCategory />
        </HeaderBox>
        <InputWrapper>
          <BoxWrapper>
            <InputBox
              message={errors.price && "????????????"}
              name="price"
              content="??????"
              error={typeof errors?.price?.type === "string"}
              type="number"
              require={{
                required: true,
                min: 1,
                max: 9999999,
                onBlur: (e: { target: { value: number } }) => {
                  setValue("subtotal", e.target.value * watch("qty"));
                },
              }}
            />
          </BoxWrapper>
          <BoxWrapper>
            <InputBox
              name="qty"
              content="??????"
              error={typeof errors?.qty?.type === "string"}
              type="number"
              require={{
                required: true,
                min: 1,
                max: 99,
                onBlur: (e: { target: { value: number } }) => {
                  setValue("subtotal", e.target.value * watch("price"));
                },
              }}
              message={errors.qty && "????????????"}
            />
          </BoxWrapper>
          <BoxWrapper>
            <InputBox
              name="subtotal"
              content="??????"
              error={typeof errors?.subtotal?.type === "string"}
              type="number"
              require={{
                required: true,
                min: 1,
                max: 9999999,
                onBlur: (e: { target: { value: number } }) => {
                  setValue("price", e.target.value / watch("qty"));
                },
              }}
              message={errors.subtotal && "????????????"}
            />
          </BoxWrapper>
        </InputWrapper>
        <MileageColumn>
          <MileageBox>
            <InputBox
              name="mileage"
              content="????????????"
              error={typeof errors?.mileage?.type === "string"}
              require={{ required: true, min: 0, max: 99999 }}
              type="number"
              message={errors.mileage && "???????????????"}
            />
          </MileageBox>

          <TimeBox>
            <InputBox
              name="year"
              content="???"
              error={typeof errors?.year?.type === "string"}
              require={{
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 10,
                validate: {
                  positive: (v: number) => v % 1 === 0,
                },
              }}
              type="number"
              message={errors.year && "??????????????????(???)"}
            />
          </TimeBox>

          <TimeBox>
            <InputBox
              name="month"
              content="???"
              error={typeof errors?.month?.type === "string"}
              require={{
                required: true,
                valueAsNumber: true,
                min: 0,
                max: 11,
                validate: {
                  positive: (v: number) => v % 1 === 0,
                },
              }}
              type="number"
              message={errors.month && "??????????????????(???)"}
            />
          </TimeBox>
        </MileageColumn>
        <Textarea content="??????" name="note" height={80} />

        <ButtonBox>
          <Button label="??????" type="cancel" handleClick={closeFormHandler} />
          <Button
            label="??????"
            type="primary"
            handleClick={handleSubmit(submitPartHandler)}
          />
        </ButtonBox>
      </FormProvider>
    </PartContainer>
  );
};

export default PartForm;
