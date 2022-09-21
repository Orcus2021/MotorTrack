import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components/macro";
import { useAppSelector, useAppDispatch } from "../../store";
import { userActions } from "../../store/user/userReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import asyncCarAction from "../../store/car/asyncCarAction";
import StatusInfo from "./StatusInfo";
import Remind from "../../components/Remind";
import Modal from "../../components/Modal/Modal";
import { resultType } from "../../types/recordType";
import { carType } from "../../types/carType";
import { carAgeAndInspectionDay } from "../../utils/calcFunc";
import { getTodayMs } from "../../utils/calcFunc";
import Loading from "../../components/Loading/Loading";
import { useLocation, useNavigate } from "react-router-dom";
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

const compareDate = (cars: carType[]) => {
  const nowDate = getTodayMs();
  const twoDays = 1000 * 60 * 60 * 24 * 2;
  const result = cars.map((car) => {
    const insurance = new Date(`${car.insuranceDate} 00:00:00`).getTime();
    const inspect = new Date(`${car.inspectionDay} 00:00:00`).getTime();
    const isInsurance = nowDate >= insurance - twoDays || nowDate >= insurance;
    const isInspect = nowDate >= inspect - twoDays || nowDate >= inspect;
    let insuranceMsg = "保險即將到期";
    let inspectionMsg = "驗車時間即將到期";
    if (nowDate >= insurance) insuranceMsg = "保險已到期";
    if (nowDate >= inspect) inspectionMsg = "驗車時間已到期";

    if (isInsurance || isInspect) {
      return {
        plateNum: car.plateNum,
        insurance: isInsurance,
        insuranceMsg,
        inspection: isInspect,
        inspectionMsg,
      };
    } else {
      return null;
    }
  });

  return result;
};

const Status = () => {
  const cars = useAppSelector((state) => state.car.cars);
  const user = useAppSelector((state) => state.user.user);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const isMounted = useRef<boolean>(true);
  const firstLogin = useLocation().state;
  const navigate = useNavigate();

  const [showContent, setShowContent] = useState<boolean>(false);
  const [showRemind, setShowRemind] = useState<boolean>(false);
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [remindMessages, setRemindMessages] = useState<resultType>([]);
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
    if (
      firstLogin === "first" &&
      isMounted.current &&
      user.continueRemind &&
      (user.insuranceRemind || user.inspectionRemind)
    ) {
      const result = compareDate(cars);

      const found = result.every((result) => result === null);

      if (!found) {
        setShowRemind(true);
        setRemindMessages(result);
      }
      isMounted.current = false;
    }
  }, [cars, user, isMounted, firstLogin]);

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

  const closeRemindHandler = () => {
    setCloseEffect(true);
    setTimeout(() => {
      setShowRemind(false);
      setCloseEffect(false);
    }, 600);
  };

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
      {!isLoading && showRemind && (
        <Modal
          onClose={closeRemindHandler}
          closeEffect={closeEffect}
          containerWidth={400}
        >
          <Remind
            onClose={closeRemindHandler}
            remindMessages={remindMessages}
          />
        </Modal>
      )}
    </>
  );
};

export default Status;
