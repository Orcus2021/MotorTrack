import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import Loading from "../../components/Loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store";
import asyncCarAction from "../../store/car/asyncCarAction";
import asyncUserAction from "../../store/user/asyncUserAction";
import { userActions } from "../../store/user/userReducer";
import { carAgeAndInspectionDay, getTodayMs } from "../../utils/calcFunc";
import HomeBack from "../Home/HomeBack";
import StatusInfo from "./StatusInfo";

import backImg from "../../assets/img/status-back.jpg";

const StatusContainer = styled.div`
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cars = useAppSelector((state) => state.car.cars);
  const user = useAppSelector((state) => state.user.user);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const [showContent, setShowContent] = useState<boolean>(false);

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
      <StatusContainer onClick={closeDetailHandler}>
        <BackView />
        <HomeBack />
        <StatusInfo
          showContent={showContent}
          onShowSelectContent={showContentHandler}
          onCloseSelectContent={closeDetailHandler}
        />
      </StatusContainer>
      {isLoading && <Loading />}
    </>
  );
};

export default Status;
