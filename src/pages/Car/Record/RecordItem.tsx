import React from "react";
import styled from "styled-components/macro";
import { repairType, feeType } from "../../../types/recordType";

const ContentWrapper = styled.tr``;
const Content = styled.td`
  font-size: 16px;
  text-align: center;
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

  console.log(record);
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
