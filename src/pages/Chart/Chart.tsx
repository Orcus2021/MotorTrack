import React, { useState } from "react";
import styled from "styled-components/macro";
import SelectBox from "../../components/SelectBox";
import { recordActions } from "../../store/record/recordReducer";
import { useAppSelector, useAppDispatch } from "../../store";
import PieChar from "./PieChar";
import BarChart from "./BarChart";

import arrowIcon from "../../assets/icon/arrow_down.png";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 640px;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
`;
const DetailWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(1, 0, 44, 0.2);

  backdrop-filter: blur(5px);
  overflow: hidden;
  /* height: */
`;
const PieChartWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const BarChartWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const SelectTitle = styled.p`
  font-size: 16px;
  width: 50px;
  text-align: center;
`;
const Option = styled.p`
  font-size: 16px;
  width: 100%;
  text-align: center;
  &:hover {
    background-color: var(--mainColor);
  }
`;

const TitleBox = styled.div`
  margin-top: 10px;
  background-color: var(--deepColor);
  border-radius: 10px 10px 0 0;
  padding: 5px 10px 2px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);

  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-left: 20px;
`;
const Title = styled.p`
  font-size: 16px;
`;
const ChartSelectBox = styled.div`
  border: 1px solid #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-top: 10px;
  overflow: hidden;
`;
const ChartOption = styled.p<{ $isSelectBar: boolean }>`
  font-size: 16px;
  text-align: center;
  padding: 2px 0;
  width: 102px;

  cursor: pointer;
  background-color: ${(props) => props.$isSelectBar && "var(--mainColor)"};
  color: ${(props) => (props.$isSelectBar ? "#fff" : "#d4d4d4")};
  &:nth-child(1) {
    border-right: 1px solid #fff;
  }
  &:hover {
    color: #fff;
    /* box-shadow: unset; */
  }
`;
const ChartWrapper = styled.div<{ $isSelectBar: string }>`
  /* position: absolute; */
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  width: 200%;
  transition: all 0.5s;
  transform: ${(props) =>
    props.$isSelectBar === "bar"
      ? "translateX(-319.5px)"
      : "translateX(319.5px)"};
  @media screen and (max-width: 701px) {
    transform: ${(props) =>
      props.$isSelectBar === "bar" ? "translateX(-25%)" : "translateX(25%)"};
  }
`;

const Chart = () => {
  const dispatch = useAppDispatch();
  const [select, setSelect] = useState<string>("全部");
  const [showContent, setShowContent] = useState<boolean>(false);
  const [selectChart, setSelectChart] = useState<string>("pie");
  const expensesAnnual = useAppSelector((state) => state.car.car?.recordAnnual);

  let annual = [];
  for (let key in expensesAnnual) {
    if (expensesAnnual[key] > 0) {
      annual.push(key);
    }
  }
  const selectAnnualHandler = (category: string) => {
    if (category === "all") {
      dispatch(recordActions.getAllExpense());
      setSelect("全部");
    } else {
      dispatch(recordActions.getYearExpense(category));
      setSelect(category);
    }
  };
  const showContentHandler = () => {
    setShowContent((pre) => !pre);
  };

  const options: JSX.Element[] = [
    <Option
      key="all"
      onClick={() => {
        selectAnnualHandler("all");
      }}
    >
      全部
    </Option>,
  ];
  annual.forEach((year) =>
    options.push(
      <Option
        key={year}
        onClick={() => {
          selectAnnualHandler(year);
        }}
      >
        {year}年
      </Option>
    )
  );

  return (
    <Container>
      <TitleBox>
        <Title>統計圖 :</Title>
        <SelectBox
          width="70px"
          options={options}
          showContent={showContent}
          onShow={showContentHandler}
          icon={arrowIcon}
          border={false}
        >
          <SelectTitle>{select}</SelectTitle>
        </SelectBox>
      </TitleBox>
      <DetailWrapper>
        <ChartSelectBox>
          <ChartOption
            onClick={() => setSelectChart("pie")}
            $isSelectBar={selectChart === "pie"}
          >
            圓餅圖
          </ChartOption>
          <ChartOption
            onClick={() => setSelectChart("bar")}
            $isSelectBar={selectChart === "bar"}
          >
            長條圖(每月)
          </ChartOption>
        </ChartSelectBox>

        <ChartWrapper $isSelectBar={selectChart}>
          <PieChartWrapper>
            <PieChar />
          </PieChartWrapper>
          <BarChartWrapper>
            <BarChart />
          </BarChartWrapper>
        </ChartWrapper>
      </DetailWrapper>
    </Container>
  );
};

export default Chart;
