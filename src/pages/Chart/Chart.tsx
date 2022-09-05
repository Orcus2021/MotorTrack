import React, { useState } from "react";
import styled from "styled-components";
import uuid from "react-uuid";
import { recordActions } from "../../store/record/recordReducer";
import { useAppSelector, useAppDispatch } from "../../store";
import PieChar from "./PieChar";
import BarChart from "./BarChart";
const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;
const PieChartWrapper = styled.div`
  width: 50%;
`;
const Select = styled.select``;
const BarChartWrapper = styled.div`
  width: 50%;
`;

const Chart = () => {
  const dispatch = useAppDispatch();
  const expensesAnnual = useAppSelector((state) => state.car.car?.recordAnnual);
  console.log(expensesAnnual);
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
      <PieChartWrapper>
        <Select onChange={selectAnnualHandler}>
          <option key={uuid()} value="all">
            全部
          </option>
          {annual.map((year) => (
            <option key={uuid()} value={year}>
              {year}
            </option>
          ))}
        </Select>
        <PieChar />
      </PieChartWrapper>
      <BarChartWrapper>
        <BarChart />
      </BarChartWrapper>
    </Container>
  );
};

export default Chart;
