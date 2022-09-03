import React, { useState } from "react";
import styled from "styled-components/macro";
import RepairItem from "./RepairItem";
import { partType } from "../../../../types/recordType";
import Modal from "../../../../components/Modal/Modal";
import PartForm from "./PartForm";
const HeaderBx = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const Title = styled.p`
  font-size: 16px;
  margin-right: 10px;
`;
const AddBx = styled.div`
  cursor: pointer;
`;
const MessageTable = styled.table`
  border: 1px solid black;
  width: 100%;
  border: 0;
  border-collapse: collapse;
`;
const SubTitle = styled.th`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

const RepairList: React.FC<{
  onAdd: (part: partType) => void;
  parts: partType[] | [];
  onDeletePart: (removePart: partType) => void;
}> = (props) => {
  const { onAdd, parts, onDeletePart } = props;

  const [showPartForm, setShowPartForm] = useState<boolean>(false);
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [selectPartIndex, setSelectPartIndex] = useState<number>(NaN);
  const showPartHandler = () => {
    setShowPartForm(true);
    setSelectPartIndex(NaN);
  };
  const closePartForm = () => {
    setCloseEffect(true);
    setSelectPartIndex(NaN);
    setTimeout(() => {
      setShowPartForm(false);
      setCloseEffect(false);
    }, 600);
  };
  const selectPartHandler = (index: number) => {
    setSelectPartIndex(index);
  };
  return (
    <>
      <HeaderBx>
        <Title>維修／保養項目</Title>
        <AddBx onClick={showPartHandler}>新增+</AddBx>
      </HeaderBx>
      <MessageTable>
        <thead>
          <tr>
            <SubTitle>零件／項目</SubTitle>
            <SubTitle>規格</SubTitle>
            <SubTitle>使用期限</SubTitle>
            <SubTitle>使用里程</SubTitle>
            <SubTitle>單價</SubTitle>
            <SubTitle>數量</SubTitle>
            <SubTitle>小記</SubTitle>
            <SubTitle>備註</SubTitle>
            <SubTitle>刪除</SubTitle>
          </tr>
        </thead>
        <tbody>
          {parts.map((record, index) => (
            <RepairItem
              record={record}
              onShow={showPartHandler}
              onSelect={() => selectPartHandler(index)}
              onDeletePart={onDeletePart}
            />
          ))}
        </tbody>
      </MessageTable>
      {showPartForm && (
        <Modal closeEffect={closeEffect} onClose={closePartForm}>
          <PartForm
            onAddPart={onAdd}
            onClose={closePartForm}
            part={parts[selectPartIndex]}
          />
        </Modal>
      )}
    </>
  );
};

export default RepairList;
