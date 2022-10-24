import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import Loading from "../../components/Loading/Loading";
import { Img, NeonText } from "../../components/style";
import { useAppDispatch, useAppSelector } from "../../store";
import { carActions } from "../../store/car/carReducer";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import asyncUserAction from "../../store/user/asyncUserAction";
import { userActions } from "../../store/user/userReducer";
import CarsBox from "./CarsBox";
import SubCarsBox from "./SubCarsBox";
import { createMessage } from "../../utils/calcFunc";

import barIcon from "../../assets/icon/bar.png";
import chartWhiteIcon from "../../assets/icon/chart-white.png";
import chartIcon from "../../assets/icon/chart.png";
import bikeIcon from "../../assets/icon/motorbike.png";
import recordWhiteIcon from "../../assets/icon/paper-white.png";
import recordIcon from "../../assets/icon/paper.png";
import addWhiteIcon from "../../assets/icon/plus-white2.png";
import addIcon from "../../assets/icon/plus.png";
import setWhiteIcon from "../../assets/icon/setting-white.png";
import setIcon from "../../assets/icon/setting.png";
import navIcon from "../../assets/icon/triangle.png";
import backImg from "../../assets/img/back-bike3.jpg";
import logoIcon from "../../assets/icon/logo192.png";

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
  transition: 0.3s;
  overflow: hidden;
  z-index: 6;
  @media screen and (max-width: 701px) {
    width: ${(props) => (props.$isNav ? "256px" : "0px")};
  }
`;
const NavWrapper = styled.ul`
  width: 100%;
  height: calc(100vh - 157px);
`;
const Mask = styled.div<{ $isNav: boolean }>`
  display: none;
  @media screen and (max-width: 701px) {
    display: block;
    width: ${(props) => (props.$isNav ? "100%" : "0px")};
    min-height: 100vh;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    background: rgba(1, 0, 44, 0.7);
  }
`;
const Nav = styled.li<{ $selected: boolean }>`
  position: relative;
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${(props) => props.$selected && "#b4b4b41f"};
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
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  min-height: 100vh;
  padding: 0 10px;
  overflow: hidden;
  background: url(${backImg}) no-repeat;
  padding-top: 68px;

  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  @media screen and (max-width: 701px) {
    width: 100%;
    margin-left: 0px;
    padding-bottom: 60px;
    min-width: 350px;
  }
`;

const UserImg = styled.img<{ $isNav: boolean }>`
  width: ${(props) => (props.$isNav ? "50%" : "80%")};
  object-fit: cover;
  position: relative;
  aspect-ratio: 1;
  border-radius: 50%;
  margin: 30px 0 10px 0;
  transition: 0.3s;
  cursor: pointer;
`;
const ImgBx = styled.div`
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  margin-right: 20px;
  cursor: pointer;
  pointer-events: none;
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
const OpenNavBar = styled.li<{ $isNav: boolean }>`
  position: relative;
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  overflow: hidden;
  cursor: pointer;

  padding: ${(props) => (props.$isNav ? "5px 20px 5px 210px" : "5px 20px")};
  &:hover {
    background-color: #b4b4b41f;
  }
`;
const NavImg = styled(Img)<{ $isNav: boolean }>`
  transform: ${(props) => (props.$isNav ? "rotate(-90deg)" : "rotate(90deg)")};
`;

const Manage = () => {
  const dispatch = useAppDispatch();
  const isNav = useAppSelector((state) => state.user.isNav);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const car = useAppSelector((state) => state.car.car);
  const recordPage = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [showCars, setShowCars] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
  const [selectNav, setSelectNav] = useState<string>("record");
  const [recordCategory, setRecordCategory] = useState<string>("record");

  const selectCartHandler = async (id: string, ownerId: string) => {
    setIsFormLoading(true);
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    await dispatch(asyncRecordAction.getAllRecords(id));
    setTimeout(() => {
      setIsFormLoading(false);
    }, 1000);
  };
  useEffect(() => {
    if (isAuth) {
      setTimeout(() => {
        dispatch(userActions.loading(false));
      }, 1000);
    } else {
      dispatch(userActions.loading(true));
      navigate("/login", { state: "/car_manage/record" });
    }
  }, [dispatch, isAuth, navigate]);
  useEffect(() => {
    if (path.includes("record")) {
      setSelectNav("record");
    }
  }, [path]);

  const showSlideCarsBoxHandler = () => {
    if (isNav) return;
    setShowCars((pre) => !pre);
  };
  const closeSlideCarsBoxHandler = () => {
    setShowCars(false);
  };

  const navHandler = () => {
    if (isNav) {
      setShowCars(false);
    }
    dispatch(userActions.showNav(!isNav));
  };
  const recordCategoryHandler = useCallback((category: string) => {
    setRecordCategory(category);
  }, []);

  const navBarHandler = (str: string) => {
    if (!recordPage.current) return;
    const isMobile = recordPage.current.clientWidth <= 701;

    if (str === "profile") {
      navigate("/profile");
      navHandler();
    } else if (str === "status") {
      navigate("/status");
      setSelectNav("status");
      navHandler();
    } else if (str === "record") {
      navigate("/car_manage/record");
      setSelectNav("record");
      setRecordCategory("record");
      if (isMobile) {
        navHandler();
      }
    } else if (str === "chart") {
      navigate("/car_manage/chart");
      setSelectNav("chart");
      if (isMobile) {
        navHandler();
      }
    } else if (str === "edit") {
      navigate("/car_manage/edit");
      setSelectNav("edit");
      if (isMobile) {
        navHandler();
      }
    } else if (str === "add") {
      navigate("/car_manage/add");
      setSelectNav("add");
      if (isMobile) {
        navHandler();
      }
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <RecordContainer ref={recordPage}>
        <Navigation $isNav={isNav}>
          <UserImg
            src={user.userImg || logoIcon}
            $isNav={isNav}
            onClick={() => {
              navBarHandler("profile");
            }}
          />
          <NavWrapper>
            <Nav
              $selected={selectNav === "status"}
              onClick={() => {
                navBarHandler("status");
              }}
            >
              <ImgBx>
                <Img src={barIcon} />
              </ImgBx>
              <RecordLink>儀表板</RecordLink>
            </Nav>
            <Nav
              $selected={selectNav === "record"}
              onClick={() => {
                navBarHandler("record");
              }}
            >
              <ImgBx>
                <Img
                  src={selectNav === "record" ? recordWhiteIcon : recordIcon}
                />
              </ImgBx>
              <RecordLink>摩托紀錄表</RecordLink>
            </Nav>
            <Nav
              $selected={selectNav === "chart"}
              onClick={() => {
                navBarHandler("chart");
              }}
            >
              <ImgBx>
                <Img src={selectNav === "chart" ? chartWhiteIcon : chartIcon} />
              </ImgBx>
              <RecordLink>費用統計圖</RecordLink>
            </Nav>
            <Nav
              $selected={selectNav === "edit"}
              onClick={() => {
                if (car && car.id) {
                  navBarHandler("edit");
                } else {
                  createMessage("alert", dispatch, "尚未有車輛紀錄");
                }
              }}
            >
              <ImgBx>
                <Img src={selectNav === "edit" ? setWhiteIcon : setIcon} />
              </ImgBx>
              <RecordLink>車輛設定</RecordLink>
            </Nav>
            <Nav
              $selected={selectNav === "add"}
              onClick={() => {
                navBarHandler("add");
              }}
            >
              <ImgBx>
                <Img src={selectNav === "add" ? addWhiteIcon : addIcon} />
              </ImgBx>
              <RecordLink>新增車輛</RecordLink>
            </Nav>
            <BikeNav
              $isNav={isNav}
              $selected={false}
              onMouseEnter={showSlideCarsBoxHandler}
            >
              {isNav ? (
                <Title>My Motors</Title>
              ) : (
                <ImgBx>
                  <Img src={bikeIcon} />
                </ImgBx>
              )}
            </BikeNav>

            {isNav && <CarsBox onSelect={selectCartHandler} />}
            <OpenNavBar onClick={navHandler} $isNav={isNav}>
              <ImgBx>
                <NavImg src={navIcon} $isNav={isNav} />
              </ImgBx>
            </OpenNavBar>
          </NavWrapper>
        </Navigation>
        {!isNav && (
          <SubCarsBox
            showCars={showCars}
            onSelect={selectCartHandler}
            onShow={showSlideCarsBoxHandler}
            onClose={closeSlideCarsBoxHandler}
          />
        )}
        {isNav && <Mask $isNav={isNav} onClick={navHandler} />}
        <MainWrapper $isNav={isNav}>
          <Outlet
            context={{
              isFormLoading,
              recordCategory,
              onRecord: recordCategoryHandler,
            }}
          />
        </MainWrapper>
      </RecordContainer>
    </>
  );
};

export default Manage;
