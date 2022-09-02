import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Link, Outlet } from "react-router-dom";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import { useAppSelector, useAppDispatch } from "../../store";

const RecordContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 68px;
  position: relative;
  width: 100%;
`;
const Navigation = styled.div`
  width: 256px;
  height: 100vh;
  background: var(--secondBack);
  transition: 0.5s;
  overflow: hidden;
`;
const NavWrapper = styled.ul`
  width: 100%;
`;
const Nav = styled.li`
  position: relative;
  width: 100%;
  list-style: none;
`;
const RecordLink = styled(Link)`
  position: relative;
  display: block;
  display: flex;
  text-decoration: none;
  width: 100%;
  color: white;
`;
const MainWrapper = styled.div`
  width: calc(100% - 256px);
  min-height: 100vh;
  /* background: #f5f5f5; */
  transition: 0.5s;
`;
const CarsWrapper = styled.div``;
const CarInfo = styled.p`
  font-size: 16px;
`;

const Manage = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector((state) => state.car.cars);
  const carId = useAppSelector((state) => state.car.car?.id);
  const record = useAppSelector((state) => state.record);
  useEffect(() => {
    if (carId) {
      dispatch(asyncRecordAction.getAllRecords(carId));
    }
  }, [carId]);

  return (
    <RecordContainer>
      <Navigation>
        <NavWrapper>
          <Nav>
            <RecordLink to="/car_manage/record">
              <span>車輛紀錄表</span>
            </RecordLink>
          </Nav>
          <Nav>
            <RecordLink to="#">
              <span>費用統計圖</span>
            </RecordLink>
          </Nav>
          <Nav>
            <RecordLink to="/car_manage/edit">
              <span>車輛設定</span>
            </RecordLink>
          </Nav>
          <Nav>
            <RecordLink to="/car_manage/add">
              <span>車輛新增</span>
            </RecordLink>
          </Nav>
          <CarsWrapper>
            {cars.map((car) => (
              <CarInfo>
                {car.brand}:{car.name}
              </CarInfo>
            ))}
          </CarsWrapper>
        </NavWrapper>
      </Navigation>
      <MainWrapper>
        <Outlet />
      </MainWrapper>
    </RecordContainer>
  );
};

export default Manage;
