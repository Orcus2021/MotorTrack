import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../store";
import { Img } from "../../../components/style";
import Repair from "./Repair/Repair";
import Expenses from "./Expenses/Expenses";
import RecordList from "./RecordList";
import styled from "styled-components/macro";
import Motor from "../../../components/Loading/Motor";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import plusIcon from "../../../assets/icon/plus.png";
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
  padding: 5px 0 0px 10px;
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
const TableBx = styled.div`
  height: 320px;
  /* overflow-y: scroll; */
  overflow: overlay;
  background-color: var(--thirdBack);
  &::-webkit-scrollbar {
    width: 7px;
    position: fixed;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(136, 136, 136, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
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
  &:nth-child(4) {
    flex-grow: 1;
  }
  &:nth-child(5) {
    width: 50px;
  }
  &:nth-child(6) {
    width: 150px;

    border-radius: 0 4px 0 0;
  }
`;
const TitleBx = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
`;
const LoadingBx = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Record = () => {
  const [recordCategory, setRecordCategory] = useState<string>("record");
  const [selectCategory, setSelectCategory] = useState<string>("all");
  const [updateId, setUpdate] = useState<string>("");
  const recordId = useLocation().state as string;

  const isLoading = useAppSelector((state) => state.user.isLoading);
  const recordState = useAppSelector((state) => state.record);
  const { expenses, fee, refuel, repair } = recordState;

  useEffect(() => {
    if (recordId) {
      setUpdate(recordId);
      setRecordCategory("repair");
    }
  }, [recordId]);

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

  const clearUpdateId = () => {
    setUpdate("");
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
            <TitleBx>
              <SubTitle>類別</SubTitle>
              <SubTitle>日期</SubTitle>
              <SubTitle>里程數(公里)</SubTitle>
              <SubTitle>標題</SubTitle>
              <SubTitle>總額</SubTitle>
              <SubTitle>備註</SubTitle>
            </TitleBx>
            <TableBx>
              {isLoading ? (
                <LoadingBx>
                  <Motor />
                </LoadingBx>
              ) : (
                <RecordList
                  onUpdate={updateRepairHandler}
                  selectCategory={selectCategory}
                />
              )}
            </TableBx>
          </RecordDetail>
        </>
      )}
      {recordCategory === "repair" && (
        <Repair
          onClose={setRecordCategory}
          updateId={updateId}
          onClear={clearUpdateId}
        />
      )}
      {recordCategory === "fee" && (
        <Expenses onClose={setRecordCategory} updateId={updateId} />
      )}
    </>
  );
};

export default Record;
