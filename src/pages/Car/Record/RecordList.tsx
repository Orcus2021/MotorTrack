import React from "react";
import styled from "styled-components";
import RecordItem from "./RecordItem";
import uuid from "react-uuid";
import { useAppSelector } from "../../../store";
import { repairType, feeType } from "../../../types/recordType";

const MessageTable = styled.table`
  border: 1px solid black;
  width: 100%;
  border: 0;
  border-collapse: collapse;
  background-color: var(--thirdBack);
`;
const SubTitle = styled.th`
  background-color: var(--mainColor);
  font-weight: 500;
  font-size: 16px;
  height: 25px;
  text-align: center;
  &:nth-child(1) {
    width: 50px;
  }
  &:nth-child(2) {
    width: 100px;
  }
  &:nth-child(3) {
    width: 120px;
  }
  &:nth-child(5) {
    width: 50px;
  }
  &:nth-child(6) {
    width: 150px;
  }
`;

const RecordList: React.FC<{
  onUpdate: (id: string, category: string) => void;
  selectCategory: string;
}> = (props) => {
  const { onUpdate, selectCategory } = props;
  const record = useAppSelector((state) => state.record);
  const allRecords: (repairType | feeType)[] = [
    ...record.fee,
    ...record.refuel,
    ...record.repair,
  ];
  let records;
  if (selectCategory === "repair") {
    records = record.repair;
  } else if (selectCategory === "fee") {
    records = record.fee;
  } else if (selectCategory === "refuel") {
    records = record.refuel;
  } else {
    records = allRecords;
  }

  return (
    <MessageTable>
      <thead>
        <tr>
          <SubTitle>類別</SubTitle>
          <SubTitle>日期</SubTitle>
          <SubTitle>里程數(公里)</SubTitle>
          <SubTitle>標題</SubTitle>
          <SubTitle>總額</SubTitle>
          <SubTitle>備註</SubTitle>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <RecordItem
            key={uuid()}
            record={record}
            onUpdate={onUpdate}
          ></RecordItem>
        ))}
      </tbody>
    </MessageTable>
  );
};

export default RecordList;
