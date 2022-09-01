import React from "react";
import styled from "styled-components";
import { Link, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store";

const RecordContainer = styled.div`
  position: relative;
  width: 100%;
`;
const Navigation = styled.div`
  position: fixed;
  width: 256px;
  height: 100%;
  background: #000;
  transition: 0.5s;
  overflow: hidden;
`;
const NavWrapper = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
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
  position: absolute;
  width: calc(100% - 256px);
  left: 256px;
  min-height: 100vh;
  /* background: #f5f5f5; */
  transition: 0.5s;
`;
const CarsWrapper = styled.div``;
const CarInfo = styled.p`
  font-size: 16px;
`;

const Manage = () => {
  const cars = useAppSelector((state) => state.car.cars);
  return (
    <RecordContainer>
      <Navigation>
        <NavWrapper>
          <Nav>
            <RecordLink to="/car_manage/record">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span class="title">車輛紀錄表</span>
            </RecordLink>
          </Nav>
          <Nav>
            <RecordLink to="#">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span class="title">費用統計圖</span>
            </RecordLink>
          </Nav>
          <Nav>
            <RecordLink to="/car_manage/edit">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span class="title">車輛設定</span>
            </RecordLink>
          </Nav>
          <Nav>
            <RecordLink to="/car_manage/add">
              <span class="icon">
                <i class="fas fa-user"></i>
              </span>
              <span class="title">車輛新增</span>
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
