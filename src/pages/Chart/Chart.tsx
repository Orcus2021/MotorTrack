import React, { useState } from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import { recordActions } from "../../store/record/recordReducer";
import { useAppSelector, useAppDispatch } from "../../store";
import PieChar from "./PieChar";
import BarChart from "./BarChart";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const DetailWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const PieChartWrapper = styled.div`
  width: 50%;
`;
const Select = styled.select``;
const BarChartWrapper = styled.div`
  width: 50%;
`;
const Title = styled.p`
  font-size: 20px;
`;

const Chart = () => {
  const dispatch = useAppDispatch();
  const expensesAnnual = useAppSelector((state) => state.car.car?.recordAnnual);

  let annual = [];
  for (let key in expensesAnnual) {
    if (expensesAnnual[key] > 0) {
      annual.push(key);
    }
  }
  const selectAnnualHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "all") dispatch(recordActions.getAllExpense());
    dispatch(recordActions.getYearExpense(e.target.value));
  };
  return (
    <Container>
      <DetailWrapper>
        <PieChartWrapper>
          <Select onChange={selectAnnualHandler}>
            <option key="all" value="all">
              全部
            </option>
            {annual.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <PieChar />
        </PieChartWrapper>
        <BarChartWrapper>
          <BarChart />
        </BarChartWrapper>
      </DetailWrapper>
    </Container>
  );
};

export default Chart;
