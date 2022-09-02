import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import parts, { partsMapType } from "../../../../utils/parts";
import { partType } from "../../../../types/recordType";
import { useForm } from "react-hook-form";

const PartContainer = styled.form`
  width: 400px;
  padding: 10px;
  background-color: var(--secondBack);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HeaderBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Select = styled.select``;
const Input = styled.input`
  width: 100%;
  outline: none;
  height: 25px;
`;
const InputBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;
const Note = styled.textarea`
  resize: none;
  width: 100%;
  height: 150px;
`;
const Btn = styled.button`
  border: 2px solid var(--mainColor);
  background-color: var(--mainColor);
  color: black;
  cursor: pointer;
`;

const PartForm: React.FC<{
  onAddPart: (part: partType) => void;
  onClose: () => void;
  part: partType;
}> = (props) => {
  const { onAddPart, onClose, part } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<partType>({ mode: "onBlur" });
  useEffect(() => {
    if (part) reset(part);
  }, [part, reset]);

  const [category, setCategory] = useState<string>(
    part?.category || "engineOil"
  );

  const options: JSX.Element[] = [];
  parts.forEach((value, key) => {
    options.push(<option value={key}>{value.name}</option>);
  });

  const categoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const submitPart = (part: partType) => {
    part.category = category;
    const partName = parts.get(category) as partsMapType;
    part.name = partName.name;
    onAddPart(part);
    onClose();
  };
  const closeFormHandler = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };
  return (
    <PartContainer onSubmit={handleSubmit(submitPart)}>
      <HeaderBx>
        <Input type="text" placeholder="零件項目" value={category} />
        <Select onChange={categoryHandler} value={category}>
          {options}
        </Select>
      </HeaderBx>
      <Input
        type="text"
        placeholder="規格"
        {...register("spec", { required: true })}
      />
      <InputBx>
        <Input
          type="number"
          placeholder="單價"
          {...register("price", { required: true })}
        />
        <Input
          type="number"
          placeholder="數量"
          {...register("qty", { required: true })}
        />
        <Input
          type="number"
          placeholder="總額"
          {...register("subtotal", { required: true })}
        />
      </InputBx>
      <InputBx>
        <Input
          type="text"
          placeholder="使用里程"
          {...register("mileage", { required: true })}
        />
        <Input
          type="number"
          placeholder="年"
          {...register("year", { required: true })}
        />
        <Input
          type="number"
          placeholder="月"
          {...register("month", { required: true })}
        />
      </InputBx>
      <Note placeholder="備註" {...register("note")} />
      <Btn>新增</Btn>
      <Btn onClick={closeFormHandler}>取消</Btn>
    </PartContainer>
  );
};

export default PartForm;
