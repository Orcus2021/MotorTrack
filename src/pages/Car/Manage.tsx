import React from "react";
import uuid from "react-uuid";
import styled from "styled-components/macro";
import { Link, Outlet } from "react-router-dom";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import { useAppSelector, useAppDispatch } from "../../store";
import { carActions } from "../../store/car/carReducer";
import { userActions } from "../../store/user/userReducer";
import asyncUserAction from "../../store/user/asyncUserAction";

const RecordContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
`;
const Navigation = styled.div`
  width: 256px;
  min-height: calc(100vh - 68px);
  /* position: fixed; */
  /* top: 68px; */
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

  /* background: #f5f5f5; */
  transition: 0.5s;
`;
const CarsWrapper = styled.div``;
const CarInfo = styled.p`
  font-size: 16px;
  cursor: pointer;
`;

const Manage = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector((state) => state.car.cars);

  const selectCartHandler = async (id: string, ownerId: string) => {
    dispatch(userActions.loading(true));
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    await dispatch(asyncRecordAction.getAllRecords(id));
    setTimeout(() => {
      dispatch(userActions.loading(false));
    }, 500);
  };

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
            <RecordLink to="/car_manage/chart">
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
              <CarInfo
                key={uuid()}
                onClick={() => selectCartHandler(car.id, car.ownerId)}
              >
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
