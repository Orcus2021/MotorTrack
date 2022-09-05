import React from "react";
import styled from "styled-components/macro";
import { repairType, feeType } from "../../../types/recordType";

const ContentWrapper = styled.tr`
  &:hover {
    background-color: var(--mainColor);
  }
`;
const Content = styled.td`
  font-size: 16px;
  text-align: center;
  height: 25px;
  cursor: pointer;
`;

const RecordItem: React.FC<{
  record: repairType | feeType;
  onUpdate: (id: string, category: string) => void;
}> = (props) => {
  const { record, onUpdate } = props;
  const updateHandler = () => {
    onUpdate(record.id, record.category);
  };

  return (
    <ContentWrapper onClick={updateHandler}>
      <Content>{record.category}</Content>
      <Content>{record.date}</Content>
      <Content>{record.mileage}</Content>
      <Content>{record.title}</Content>
      <Content>{record.amount}</Content>
      <Content>{record.note}</Content>
    </ContentWrapper>
  );
};

export default RecordItem;
