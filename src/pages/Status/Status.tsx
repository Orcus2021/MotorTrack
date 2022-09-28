import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { useAppSelector, useAppDispatch } from "../../store";
import { userActions } from "../../store/user/userReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import asyncCarAction from "../../store/car/asyncCarAction";
import StatusInfo from "./StatusInfo";
import { carAgeAndInspectionDay } from "../../utils/calcFunc";
import { getTodayMs } from "../../utils/calcFunc";
import Loading from "../../components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import HomeBack from "../Home/HomeBack";

import backImg from "../../assets/img/status-back.jpg";

const Container = styled.div`
  position: relative;
  width: 100%;

  min-height: calc(100vh - 68px);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  @media screen and (max-width: 701px) {
    padding-bottom: 0;
  }
`;

const BackView = styled.div`
  position: fixed;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  top: 0;
  left: 0;
  filter: brightness(0.4);
  background: no-repeat url(${backImg});
  background-size: cover;
  background-position: center;
`;

const Status = () => {
  const cars = useAppSelector((state) => state.car.cars);
  const user = useAppSelector((state) => state.user.user);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const navigate = useNavigate();

  const [showContent, setShowContent] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userActions.loading(true));
    if (isAuth) {
      setTimeout(() => {
        dispatch(userActions.loading(false));
      }, 1000);
    } else {
      navigate("/login", { state: "/status" });
    }
  }, [dispatch, isAuth, navigate]);

  useEffect(() => {
    if (isAuth) {
      dispatch(userActions.loading(true));
      setTimeout(() => {
        dispatch(userActions.loading(false));
      }, 1000);
    }
  }, [dispatch, isAuth]);

  useEffect(() => {
    const nowDate = getTodayMs();
    cars.forEach((car) => {
      const inspect = new Date(`${car.inspectionDay} 00:00:00`).getTime();
      if (nowDate > inspect) {
        const { age, inspectionDay } = carAgeAndInspectionDay(
          car.licenseDate as string
        );
        dispatch(
          asyncCarAction.updateCar(car?.id as string, { age, inspectionDay })
        );
        dispatch(asyncUserAction.updateUser(user.id, { continueRemind: true }));
      }
    });
  }, [cars, dispatch, user]);

  const showContentHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContent((pre) => !pre);
  };
  const closeDetailHandler = () => {
    setShowContent(false);
  };

  return (
    <>
      <Container onClick={closeDetailHandler}>
        <BackView />
        <HomeBack />
        <StatusInfo
          showContent={showContent}
          onShowSelectContent={showContentHandler}
          onCloseSelectContent={closeDetailHandler}
        />
      </Container>
      {isLoading && <Loading />}
    </>
  );
};

export default Status;
