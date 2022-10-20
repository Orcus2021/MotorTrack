import { useEffect, useState } from "react";
import { useAppSelector } from "../../../store";

import { useLocation, useOutletContext } from "react-router-dom";
import styled from "styled-components/macro";
import IconButton from "../../../components/Button/IconButton";
import SkeletonForm from "../../../components/Skeleton/SkeletonForm";
import { Img, NeonText } from "../../../components/style";
import TableBox from "../../../components/Table/TableBox";
import TableBoxRecord from "../../../components/Table/TableBoxRecord";
import Expenses from "./Expenses/Expenses";
import RecordList from "./RecordList";
import Repair from "./Repair/Repair";

import allIcon from "../../../assets/icon/chart-white.png";
import feeIcon from "../../../assets/icon/moneyBag.png";
import whitePlusIcon from "../../../assets/icon/plus-white.png";
import refuelIcon from "../../../assets/icon/refuel.png";
import repairIcon from "../../../assets/icon/repair.png";

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
  @media screen and (max-width: 801px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CardBox = styled.div`
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
const RecordDetailWrapper = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  padding-top: 0;
  @media screen and (max-width: 801px) {
    padding: 10px;
  }
`;
const ExpenseText = styled.p`
  font-size: 14px;
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
  @media screen and (max-width: 701px) {
    display: none;
  }
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

const ImgBox = styled.div`
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
  const [selectCategory, setSelectCategory] = useState<string>("all");
  const [updateId, setUpdate] = useState<string>("");
  const location = useLocation().state as string;
  const outletProps =
    useOutletContext<{
      isFormLoading: boolean;
      recordCategory: string;
      onRecord: (str: string) => void;
    }>();
  const { isFormLoading, recordCategory, onRecord } = outletProps;

  const expenses = useAppSelector((state) => state.record.expenses);

  useEffect(() => {
    if (location === "repair") {
      onRecord("repair");
    } else if (location === "fee") {
      onRecord("fee");
    } else if (location) {
      setUpdate(location);
      onRecord("repair");
    } else {
      onRecord("record");
    }
  }, [location, onRecord]);

  const recordCategoryHandler = (category: string) => {
    onRecord(category);
    setUpdate("");
  };
  const updateRepairHandler = (id: string, category: string) => {
    if (category === "repair") {
      onRecord(category);
    } else {
      onRecord("fee");
    }
    setUpdate(id);
  };

  const selectCategoryHandler = (category: string) => {
    setSelectCategory(category);
  };

  const clearUpdateIdHandler = () => {
    setUpdate("");
  };
  console.log(expenses);
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
          <Title>車輛紀錄</Title>
          <CartWrapper>
            {CardInfo.map((card) => (
              <CardBox key={card.title}>
                <ImgBox>
                  <Img src={card.icon} />
                </ImgBox>
                <TextBox>
                  <ExpenseNum>${card.expense}</ExpenseNum>
                  <ExpenseText>{card.title}</ExpenseText>
                </TextBox>
              </CardBox>
            ))}
          </CartWrapper>
          <RecordDetailWrapper>
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
          </RecordDetailWrapper>
        </RecordContainer>
      )}
      {recordCategory === "repair" && (
        <Repair
          onClose={onRecord}
          updateId={updateId}
          onClear={clearUpdateIdHandler}
        />
      )}
      {recordCategory === "fee" && (
        <Expenses onClose={onRecord} updateId={updateId} />
      )}
    </>
  );
};

export default Record;
