import React from "react";
import styled from "styled-components";
import RecordItem from "./RecordItem";
import { useAppSelector } from "../../../store";
import { repairType, feeType } from "../../../types/recordType";

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

const RecordList: React.FC<{
  onUpdate: (id: string, category: string) => void;
}> = (props) => {
  const { onUpdate } = props;
  const record = useAppSelector((state) => state.record);
  const allRecords: (repairType | feeType)[] = [
    ...record.fee,
    ...record.refuel,
    ...record.repair,
  ];

  return (
    <MessageTable>
      <tr>
        <SubTitle>類別</SubTitle>
        <SubTitle>日期</SubTitle>
        <SubTitle>里程數(公里)</SubTitle>
        <SubTitle>標題</SubTitle>
        <SubTitle>總額</SubTitle>
        <SubTitle>備註</SubTitle>
      </tr>
      <tbody>
        {allRecords.map((record) => (
          <RecordItem record={record} onUpdate={onUpdate}></RecordItem>
        ))}
      </tbody>
    </MessageTable>
  );
};

export default RecordList;
