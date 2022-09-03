import React, { useState } from "react";
import Repair from "./Repair/Repair";
import Expenses from "./Expenses/Expenses";
import RecordList from "./RecordList";
import styled from "styled-components";
const CartBx = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;
const Card = styled.div`
  position: relative;
  background: var(--thirdBack);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;
const RecordDetail = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  padding-top: 0;
  min-height: 530px;
`;
const ExpenseText = styled.p`
  font-size: 16px;
`;
const DetailHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const DetailTitle = styled.p`
  font-size: 16px;
`;
const DetailRight = styled.div`
  display: flex;
  flex-direction: row;
`;

const Record = () => {
  const [recordCategory, setRecordCategory] = useState<string>("record");
  const [updateId, setUpdate] = useState<string>("");
  const recordCategoryHandler = (category: string) => {
    setRecordCategory(category);
    setUpdate("");
  };
  const updateRepairHandler = (id: string, category: string) => {
    if (category === "repair") {
      setRecordCategory(category);
    } else {
      setRecordCategory("fee");
    }

    setUpdate(id);
  };
  return (
    <>
      {recordCategory === "record" && (
        <>
          <CartBx>
            <Card>
              <ExpenseText>總費用</ExpenseText>
            </Card>
            <Card>
              <ExpenseText
                onClick={() => {
                  recordCategoryHandler("repair");
                }}
              >
                維修
              </ExpenseText>
            </Card>
            <Card>
              <ExpenseText
                onClick={() => {
                  recordCategoryHandler("fee");
                }}
              >
                加油
              </ExpenseText>
            </Card>
            <Card>
              <ExpenseText
                onClick={() => {
                  recordCategoryHandler("fee");
                }}
              >
                費用
              </ExpenseText>
            </Card>
          </CartBx>
          <RecordDetail>
            <DetailHeader>
              <DetailTitle>紀錄</DetailTitle>
              <DetailRight>
                <DetailTitle>全部</DetailTitle>
                <DetailTitle>維修</DetailTitle>
                <DetailTitle>加油</DetailTitle>
                <DetailTitle>費用</DetailTitle>
              </DetailRight>
            </DetailHeader>
            <RecordList onUpdate={updateRepairHandler} />
          </RecordDetail>
        </>
      )}
      {recordCategory === "repair" && (
        <Repair onClose={setRecordCategory} updateId={updateId} />
      )}
      {recordCategory === "fee" && (
        <Expenses onClose={setRecordCategory} updateId={updateId} />
      )}
    </>
  );
};

export default Record;
