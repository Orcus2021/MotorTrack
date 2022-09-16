import React, { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../../store";
import { Img } from "../../../components/style";
import Repair from "./Repair/Repair";
import Expenses from "./Expenses/Expenses";
import RecordList from "./RecordList";
import styled from "styled-components/macro";
import Motor from "../../../components/Loading/Motor";
import { useLocation, useOutletContext } from "react-router-dom";
import { NeonText } from "../../../components/style";
import { userActions } from "../../../store/user/userReducer";
import TableBox from "../../../components/TableBox";
import IconButton from "../../../components/Button/IconButton";
import SkeletonForm from "../../../components/SkeletonForm";
import TableBoxRecord from "../../../components/TableBoxRecord";

import allIcon from "../../../assets/icon/chart-white.png";
import plusIcon from "../../../assets/icon/plus.png";
import whitePlusIcon from "../../../assets/icon/plus-white.png";
import repairIcon from "../../../assets/icon/repair.png";
import refuelIcon from "../../../assets/icon/refuel.png";
import feeIcon from "../../../assets/icon/moneyBag.png";

const RecordContainer = styled.div`
  max-width: 1280px;
  width: 100%;
`;

const CartWrapper = styled.div`
  position: relative;
  width: 100%;
  /* max-width: 1280px; */
  padding: 0 20px 20px 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  @media screen and (max-width: 701px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardBx = styled.div`
  position: relative;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(1, 0, 44, 0.2);
  backdrop-filter: blur(5px);
  padding: 5px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const RecordDetail = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  padding-top: 0;
  @media screen and (max-width: 701px) {
    padding: 10px;
  }

  /* min-height: 500px; */
`;
const ExpenseText = styled.p`
  font-size: 12px;
`;
const DetailHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const DetailTitle = styled.p`
  font-size: 16px;
  margin-right: 20px;
  cursor: pointer;
  &:nth-child(4) {
    margin-right: 0px;
  }
`;
const DetailRight = styled.div<{ $category: string }>`
  /* background-color: var(--thirdBack); */
  position: relative;
  /* background: rgba(1, 0, 44, 0.2); */
  background-color: var(--deepColor);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  display: flex;
  padding: 5px 10px 2px 10px;
  margin-left: 20px;
  border-radius: 10px 10px 0 0;
  flex-direction: row;
  overflow: hidden;

  &::before {
    transition: 0.5s;
    content: "";
    background-color: var(--mainColor);
    position: absolute;
    top: 6px;
    left: ${(props) => {
      if (props.$category === "all") {
        return "5px";
      } else if (props.$category === "repair") {
        return "57px";
      } else if (props.$category === "refuel") {
        return "109px";
      } else if (props.$category === "fee") {
        return "161px";
      }
    }};
    width: 42px;
    height: 24px;
    border-radius: 24px;
    z-index: -1;
  }
`;
const CreateRecordWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* padding: 0 20px 10px 20px; */
`;

const Title = styled(NeonText)`
  font-size: 20px;
  padding: 15px 0 15px 25px;
  font-weight: 400;
`;

const ExpenseNum = styled.p`
  font-size: 22px;
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImgBx = styled.div`
  height: 40px;
  width: 40px;
  position: relative;
  margin-right: 10px;
`;

const SkeletonBox = styled.div`
  width: 100%;
  height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const tableTitles = [
  { title: "類別", width: "50px" },
  { title: "日期", width: "100px" },
  { title: "里程數(公里)", width: "120px" },
  { title: "標題", width: "auto" },
  { title: "總額", width: "50px" },
  { title: "備註", width: "150px" },
];
const tableTitlesRwd = [
  { title: "類別", width: "50px" },
  { title: "日期", width: "120px" },
  { title: "標題", width: "120px" },
  { title: "里程數(公里)", width: "100px" },
  { title: "總額", width: "50px" },
];

const Record = () => {
  const [recordCategory, setRecordCategory] = useState<string>("record");
  const [selectCategory, setSelectCategory] = useState<string>("all");
  const [updateId, setUpdate] = useState<string>("");
  const recordId = useLocation().state as string;
  const dispatch = useAppDispatch();
  const isFormLoading = useOutletContext<boolean>();
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const expenses = useAppSelector((state) => state.record.expenses);
  const isNav = useAppSelector((state) => state.user.isNav);

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

  const navHandler = () => {
    dispatch(userActions.showNav(!isNav));
  };

  const CardInfo = [
    { title: "總費用", icon: allIcon, expense: expenses.allExpenses },
    { title: "維修", icon: repairIcon, expense: expenses.repairExpenses },
    { title: "加油", icon: refuelIcon, expense: expenses.refuelExpenses },
    { title: "費用", icon: feeIcon, expense: expenses.feeExpenses },
  ];

  return (
    <>
      {recordCategory === "record" && (
        <RecordContainer>
          <Title onClick={navHandler}>車輛紀錄</Title>
          <CartWrapper>
            {CardInfo.map((card) => (
              <CardBx key={card.title}>
                <ImgBx>
                  <Img src={card.icon} />
                </ImgBx>
                <TextBox>
                  <ExpenseNum>${card.expense}</ExpenseNum>
                  <ExpenseText>{card.title}</ExpenseText>
                </TextBox>
              </CardBx>
            ))}
          </CartWrapper>

          <RecordDetail>
            <DetailHeader>
              <DetailRight $category={selectCategory}>
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
              <CreateRecordWrapper>
                <IconButton
                  label="維修"
                  icon={whitePlusIcon}
                  handleClick={() => {
                    recordCategoryHandler("repair");
                  }}
                />
                <IconButton
                  label="加油/充電/費用"
                  icon={whitePlusIcon}
                  handleClick={() => {
                    recordCategoryHandler("fee");
                  }}
                />
              </CreateRecordWrapper>
            </DetailHeader>
            <TableBox titles={tableTitles}>
              {isFormLoading ? (
                <SkeletonBox>
                  {Array(3)
                    .fill(null)
                    .map((_, index) => (
                      <SkeletonForm key={index} />
                    ))}
                </SkeletonBox>
              ) : (
                <RecordList
                  onUpdate={updateRepairHandler}
                  selectCategory={selectCategory}
                  rwd={false}
                />
              )}
            </TableBox>
            <TableBoxRecord titles={tableTitlesRwd}>
              {isFormLoading ? (
                <SkeletonBox>
                  {Array(3)
                    .fill(null)
                    .map((_, index) => (
                      <SkeletonForm key={index} />
                    ))}
                </SkeletonBox>
              ) : (
                <RecordList
                  onUpdate={updateRepairHandler}
                  selectCategory={selectCategory}
                  rwd={true}
                />
              )}
            </TableBoxRecord>
          </RecordDetail>
        </RecordContainer>
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
