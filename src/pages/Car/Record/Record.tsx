import React, { useState } from "react";
import { useAppSelector } from "../../../store";
import { Img } from "../../../components/style";
import plusIcon from "../../../assets/icon/plus.png";
import Repair from "./Repair/Repair";
import Expenses from "./Expenses/Expenses";
import RecordList from "./RecordList";
import styled from "styled-components/macro";
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
`;
const RecordDetail = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  padding-top: 0;

  /* min-height: 500px; */
`;
const ExpenseText = styled.p`
  font-size: 16px;
`;
const DetailHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const DetailTitle = styled.p`
  font-size: 16px;
  margin-right: 10px;
  cursor: pointer;
`;
const DetailRight = styled.div`
  background-color: var(--thirdBack);
  display: flex;
  padding: 5px 0 5px 10px;
  margin-left: 20px;
  border-radius: 10px 10px 0 0;
  flex-direction: row;
`;
const CreateRecordWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px 10px 20px;
`;
const CreateBx = styled.div`
  display: flex;
  padding: 5px 10px;
  background-color: var(--thirdBack);
  margin-right: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;
const IconBx = styled.div`
  position: relative;
  width: 16px;
  height: 16px;
`;
const CategoryText = styled.span`
  font-size: 16px;
`;

const Record = () => {
  const [recordCategory, setRecordCategory] = useState<string>("record");
  const [selectCategory, setSelectCategory] = useState<string>("all");
  const [updateId, setUpdate] = useState<string>("");
  const expenses = useAppSelector((state) => state.record.expenses);
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

  const selectCategoryHandler = (category: string) => {
    setSelectCategory(category);
  };
  return (
    <>
      {recordCategory === "record" && (
        <>
          <CartBx>
            <Card>
              <ExpenseText>總費用:${expenses.allExpenses}</ExpenseText>
            </Card>
            <Card>
              <ExpenseText>維修:${expenses.repairExpenses}</ExpenseText>
            </Card>
            <Card>
              <ExpenseText>加油:${expenses.refuelExpenses}</ExpenseText>
            </Card>
            <Card>
              <ExpenseText>費用:${expenses.feeExpenses}</ExpenseText>
            </Card>
          </CartBx>
          <CreateRecordWrapper>
            <CreateBx
              onClick={() => {
                recordCategoryHandler("repair");
              }}
            >
              <CategoryText>維修</CategoryText>
              <IconBx>
                <Img src={plusIcon} />
              </IconBx>
            </CreateBx>
            <CreateBx
              onClick={() => {
                recordCategoryHandler("fee");
              }}
            >
              <CategoryText>加油/充電/費用</CategoryText>
              <IconBx>
                <Img src={plusIcon} />
              </IconBx>
            </CreateBx>
          </CreateRecordWrapper>

          <RecordDetail>
            <DetailHeader>
              <DetailRight>
                <DetailTitle onClick={() => selectCategoryHandler("all")}>
                  全部
                </DetailTitle>
                <DetailTitle onClick={() => selectCategoryHandler("repair")}>
                  維修
                </DetailTitle>
                <DetailTitle onClick={() => selectCategoryHandler("refuel")}>
                  加油
                </DetailTitle>
                <DetailTitle onClick={() => selectCategoryHandler("fee")}>
                  費用
                </DetailTitle>
              </DetailRight>
            </DetailHeader>
            <RecordList
              onUpdate={updateRepairHandler}
              selectCategory={selectCategory}
            />
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
