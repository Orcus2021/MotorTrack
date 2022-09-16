import React, { useState } from "react";
import styled from "styled-components/macro";
import { Outlet, useNavigate } from "react-router-dom";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import { useAppSelector, useAppDispatch } from "../../store";
import { carActions } from "../../store/car/carReducer";
import { userActions } from "../../store/user/userReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import { Img } from "../../components/style";
import { NeonText } from "../../components/style";
import SubCarsBox from "./SubCarsBox";
import CarsBox from "./CarsBox";

import barIcon from "../../assets/icon/bar.png";
import chartIcon from "../../assets/icon/chart.png";
import recordIcon from "../../assets/icon/paper.png";
import addIcon from "../../assets/icon/plus.png";
import setIcon from "../../assets/icon/setting.png";
import bikeIcon from "../../assets/icon/motorbike.png";
import backImg from "../../assets/img/back-bike3.jpg";
import navIcon from "../../assets/icon/triangle.png";

const RecordContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
`;
const Navigation = styled.div<{ $isNav: boolean }>`
  width: ${(props) => (props.$isNav ? "256px" : "65px")};
  min-height: 100vh;
  position: fixed;
  top: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--deepColor);
  transition: 0.5s;
  overflow: hidden;
  z-index: 5;
  @media screen and (max-width: 701px) {
    width: ${(props) => (props.$isNav ? "256px" : "0px")};
  }
`;
const NavWrapper = styled.ul`
  width: 100%;
  height: calc(100vh - 157px);
`;
const Nav = styled.li`
  position: relative;
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  overflow: hidden;
  cursor: pointer;

  padding: 5px 20px;
  &:hover {
    background-color: #b4b4b41f;
  }
`;
const RecordLink = styled.p`
  position: relative;
  display: flex;
  width: 100%;
  color: white;
  white-space: nowrap;
`;
const MainWrapper = styled.div<{ $isNav: boolean }>`
  width: ${(props) =>
    props.$isNav ? "calc(100% - 256px)" : "calc(100% - 65px)"};
  margin-left: ${(props) => (props.$isNav ? "256px" : "65px")};
  /* background: #f5f5f5; */
  transition: 0.5s;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  min-height: 100vh;

  background: url(${backImg}) no-repeat;
  padding-top: 68px;

  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  @media screen and (max-width: 701px) {
    width: 100%;
    margin-left: 0px;
  }
`;

const UserImg = styled.img<{ $isNav: boolean }>`
  width: ${(props) => (props.$isNav ? "50%" : "80%")};
  object-fit: cover;
  position: relative;
  border-radius: 50%;
  margin: 30px 0 10px 0;
  cursor: pointer;
`;
const ImgBx = styled.div`
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  margin-right: 20px;
  cursor: pointer;
`;

const BikeNav = styled(Nav)<{ $isNav: boolean }>`
  ${(props) => props.$isNav && "justify-content: center"};
  overflow: unset;
  cursor: default;

  &:hover {
    background-color: ${(props) => (props.$isNav ? "transparent" : "")};
  }
`;
const Title = styled(NeonText)`
  display: inline-block;
  font-size: 16px;
  white-space: nowrap;
  text-align: center;
  color: #fff;
  width: 100%;
`;
const NavIcon = styled.li<{ $isNav: boolean }>`
  position: relative;
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.5s;

  padding: ${(props) => (props.$isNav ? "5px 20px 5px 210px" : "5px 20px")};
  &:hover {
    background-color: #b4b4b41f;
  }
`;
const NavImg = styled(Img)<{ $isNav: boolean }>`
  transition: 0.5s;
  transform: ${(props) => (props.$isNav ? "rotate(-90deg)" : "rotate(90deg)")};
`;

const Manage = () => {
  const dispatch = useAppDispatch();
  const isNav = useAppSelector((state) => state.user.isNav);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showCars, setShowCars] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);

  const selectCartHandler = async (id: string, ownerId: string) => {
    setIsFormLoading(true);
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    await dispatch(asyncRecordAction.getAllRecords(id));
    setTimeout(() => {
      setIsFormLoading(false);
    }, 1000);
  };

  const showCarsHandler = () => {
    if (isNav) return;
    setShowCars((pre) => !pre);
  };

  const navToPage = (path: string) => {
    navigate(path);
  };

  const navHandler = () => {
    dispatch(userActions.showNav(!isNav));
  };

  return (
    <RecordContainer>
      <Navigation $isNav={isNav}>
        <UserImg
          src={user.userImg}
          $isNav={isNav}
          onClick={() => {
            navToPage("/profile");
          }}
        />
        <NavWrapper>
          <Nav
            onClick={() => {
              navToPage("/status");
            }}
          >
            <ImgBx>
              <Img src={barIcon} />
            </ImgBx>
            <RecordLink>車輛狀態表</RecordLink>
          </Nav>
          <Nav
            onClick={() => {
              navToPage("/car_manage/record");
            }}
          >
            <ImgBx
              onClick={() => {
                navToPage("/car_manage/record");
              }}
            >
              <Img src={recordIcon} />
            </ImgBx>
            <RecordLink>車輛紀錄表</RecordLink>
          </Nav>
          <Nav
            onClick={() => {
              navToPage("/car_manage/chart");
            }}
          >
            <ImgBx>
              <Img src={chartIcon} />
            </ImgBx>
            <RecordLink>費用統計圖</RecordLink>
          </Nav>
          <Nav
            onClick={() => {
              navToPage("/car_manage/edit");
            }}
          >
            <ImgBx>
              <Img src={setIcon} />
            </ImgBx>
            <RecordLink>車輛設定</RecordLink>
          </Nav>
          <Nav
            onClick={() => {
              navToPage("/car_manage/add");
            }}
          >
            <ImgBx>
              <Img src={addIcon} />
            </ImgBx>
            <RecordLink>新增車輛</RecordLink>
          </Nav>
          <BikeNav $isNav={isNav} onClick={showCarsHandler}>
            {isNav ? (
              <Title>My Motors</Title>
            ) : (
              <ImgBx>
                <Img src={bikeIcon} />
              </ImgBx>
            )}
          </BikeNav>

          {isNav && <CarsBox onSelect={selectCartHandler} />}
          <NavIcon onClick={navHandler} $isNav={isNav}>
            <ImgBx>
              <NavImg src={navIcon} $isNav={isNav} />
            </ImgBx>
          </NavIcon>
        </NavWrapper>
      </Navigation>
      {!isNav && (
        <SubCarsBox showCars={showCars} onSelect={selectCartHandler} />
      )}

      <MainWrapper $isNav={isNav}>
        <Outlet context={isFormLoading} />
      </MainWrapper>
    </RecordContainer>
  );
};

export default Manage;
