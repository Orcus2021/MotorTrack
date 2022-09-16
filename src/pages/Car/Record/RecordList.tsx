import React from "react";
import styled from "styled-components/macro";
import RecordItem from "./RecordItem";
import { useAppSelector } from "../../../store";
import { repairType, feeType } from "../../../types/recordType";
import { NeonText } from "../../../components/style";

const MessageTable = styled.table`
  border: 1px solid black;
  width: 100%;
  border: 0;
  border-collapse: collapse;
  background: rgba(1, 0, 44, 0.4);
  backdrop-filter: blur(5px);
  @media screen and (max-width: 701px) {
    display: none;
  }
`;
const NoRecordMsg = styled(NeonText)`
  font-size: 25px;
  line-height: 105px;
  font-weight: 400;

  opacity: 0.7;
  text-align: center;
`;
const MessageTableRwd = styled.div`
  display: none;
  border: 1px solid black;
  width: 100%;
  border: 0;
  /* border-collapse: collapse; */
  background: rgba(1, 0, 44, 0.4);
  backdrop-filter: blur(5px);
  @media screen and (max-width: 701px) {
    display: block;
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
      {sortRecords.length > 0 ? (
        <>
          <MessageTable>
            <tbody>
              {sortRecords.map((record) => (
                <RecordItem
                  key={record.id}
                  record={record}
                  onUpdate={onUpdate}
                />
              ))}
            </tbody>
          </MessageTable>
          <MessageTableRwd>
            {sortRecords.map((record) => (
              <RecordItem key={record.id} record={record} onUpdate={onUpdate} />
            ))}
          </MessageTableRwd>
        </>
      ) : (
        <NoRecordMsg>還沒開始紀錄...</NoRecordMsg>
      )}
    </>
  );
};

export default RecordList;
