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
  background-color: var(--thirdBack);
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
    records = [...record.repair];
  } else if (selectCategory === "fee") {
    records = [...record.fee];
  } else if (selectCategory === "refuel") {
    records = [...record.refuel];
  } else {
    records = allRecords;
  }

  const sortRecords = records.sort(
    (recordA, recordB) =>
      new Date(recordB.date).getTime() - new Date(recordA.date).getTime()
  );

  return (
    <>
      <MessageTable>
        <tbody>
          {sortRecords.map((record) => (
            <RecordItem
              key={record.id}
              record={record}
              onUpdate={onUpdate}
            ></RecordItem>
          ))}
        </tbody>
      </MessageTable>
    </>
  );
};

export default RecordList;
