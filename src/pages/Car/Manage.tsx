import React, { useState } from "react";
import brands from "../../utils/brands";
import styled from "styled-components/macro";
import { Outlet, useNavigate } from "react-router-dom";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import { useAppSelector, useAppDispatch } from "../../store";
import { carActions } from "../../store/car/carReducer";
import { userActions } from "../../store/user/userReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import { Img } from "../../components/style";
import Card from "../../components/Card";
import { NeonText } from "../../components/style";

import barIcon from "../../assets/icon/bar.png";
import chartIcon from "../../assets/icon/chart.png";
import recordIcon from "../../assets/icon/paper.png";
import addIcon from "../../assets/icon/plus.png";
import setIcon from "../../assets/icon/setting.png";
import bikeIcon from "../../assets/icon/motorbike.png";

const RecordContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
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
  /* padding: 20px; */
`;
const NavWrapper = styled.ul`
  width: 100%;
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
`;
const CarsWrapper = styled.div`
  /* background-color: #9d9d9d1d; */
  border-radius: 8px;
  padding: 10px 20px;
  min-width: 256px;
  height: 200px;
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
  overflow: overlay;
`;

const SubCarsWrapper = styled.div<{ $isShow: boolean }>`
  left: ${(props) => (props.$isShow ? "65px" : " -100%")};
  width: 150px;
  position: absolute;
  top: 200px;
  backdrop-filter: blur(5px);
  border-radius: 0 8px 8px 0;
  background: rgba(255, 255, 255, 0.15);
  overflow: overlay;
  z-index: 2;
  transition: all 0.5s;
`;
const CarInfo = styled.p`
  font-size: 14px;
  flex-grow: 1;
  text-align: center;
`;
const SubCarInfo = styled.p`
  font-size: 12px;
  flex-grow: 1;
  text-align: center;
`;
const CarWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;
const SubCarWrapper = styled.div`
  width: 100%;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--mainColor);
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
const SubImgBx = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  margin-right: 5px;
`;
const CarInfoBx = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const CarNum = styled.p`
  font-size: 16px;
  color: var(--mainColor);
`;
const SubCarNum = styled.p`
  font-size: 12px;
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

const Manage = () => {
  const dispatch = useAppDispatch();
  const cars = useAppSelector((state) => state.car.cars);
  const carID = useAppSelector((state) => state.car.car?.id);
  const isNav = useAppSelector((state) => state.user.isNav);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showCars, setShowCars] = useState<boolean>(false);

  const selectCartHandler = async (id: string, ownerId: string) => {
    dispatch(userActions.loading(true));
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    await dispatch(asyncRecordAction.getAllRecords(id));
    setTimeout(() => {
      dispatch(userActions.loading(false));
    }, 500);
  };

  const showCarsHandler = () => {
    if (isNav) return;
    setShowCars((pre) => !pre);
  };

  const navToPage = (path: string) => {
    navigate(path);
  };

  // const navHandler = () => {
  //   dispatch(userActions.showNav(!isNav));
  // };

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

          {isNav && (
            <CarsWrapper>
              {cars.map((car) => (
                <CarWrapper key={car.id}>
                  <Card hover={true} isSelect={car.id === carID}>
                    <CarInfoBx>
                      <ImgBx>
                        <Img src={brands.get(car.brand)?.img} />
                      </ImgBx>
                      <CarNum>{car.plateNum}</CarNum>
                      <CarInfo
                        key={car.id}
                        onClick={() => selectCartHandler(car.id, car.ownerId)}
                      >
                        {car.name}
                      </CarInfo>
                    </CarInfoBx>
                  </Card>
                </CarWrapper>
              ))}
            </CarsWrapper>
          )}
        </NavWrapper>
      </Navigation>
      {!isNav && (
        <SubCarsWrapper $isShow={showCars}>
          {cars.map((car) => (
            <SubCarWrapper key={car.id}>
              <CarInfoBx>
                <SubImgBx>
                  <Img src={brands.get(car.brand)?.img} />
                </SubImgBx>
                <SubCarNum>{car.plateNum}</SubCarNum>
                <SubCarInfo
                  key={car.id}
                  onClick={() => selectCartHandler(car.id, car.ownerId)}
                >
                  {car.name}
                </SubCarInfo>
              </CarInfoBx>
            </SubCarWrapper>
          ))}
        </SubCarsWrapper>
      )}

      <MainWrapper $isNav={isNav}>
        <Outlet />
      </MainWrapper>
    </RecordContainer>
  );
};

export default Manage;
