import React, { useState, useEffect, useRef } from "react";
import brands from "../../utils/brands";
import styled from "styled-components/macro";
import { useAppSelector, useAppDispatch } from "../../store";
import { carActions } from "../../store/car/carReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import asyncCarAction from "../../store/car/asyncCarAction";
import StatusInfo from "./StatusInfo";
import Remind from "../../components/Remind";
import { Img } from "../../components/style";
import Modal from "../../components/Modal/Modal";
import { resultType } from "../../types/recordType";
import { carType } from "../../types/carType";
import { carAgeAndInspectionDay } from "../../utils/calcFunc";
import { getTodayMs } from "../../utils/calcFunc";
import Loading from "../../components/Loading/Loading";

import arrowImg from "../../assets/icon/arrow_down.png";
import motorImg from "../../assets/bike_blue_1.png";
import { userActions } from "../../store/user/userReducer";

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 68px);
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const LeftWrapper = styled.div`
  position: relative;
  width: 60%;
  height: 100%;
  align-items: center;
  padding: 20px;
`;
const RightWrapper = styled.div`
  width: 40%;
  display: flex;
  padding: 0 20px 10px 0;
  flex-direction: column;
`;
const MotorImg = styled.img`
  position: absolute;
  top: 0;
  width: 92%;
  height: calc(100% - 18px);
  object-fit: contain;
`;

const SelectBx = styled.div`
  width: 200px;
  background-color: #fff;
  z-index: 2;
  /* height: 28px; */
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* overflow: hidden; */
`;
const Name = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 4px;
`;
const DownBx = styled.div`
  margin-top: 4px;
  position: relative;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  align-self: flex-end;
`;
const ContentBx = styled.div<{ $isShow: boolean }>`
  width: 100%;
  position: relative;
  background-color: #fff;
  margin-top: 5px;
  border-radius: 4px;
  transition: 0.5s;
  overflow: hidden;
  height: ${(props) => (props.$isShow ? "auto" : "0")};
`;

const Content = styled.div`
  height: 28px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px;
  justify-content: flex-start;
  cursor: pointer;
  &:hover {
    background-color: var(--mainColor);
  }
`;
const DisplayName = styled.div`
  height: 28px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px;
  justify-content: flex-start;
`;
const BrandBx = styled.div`
  height: 30px;
  width: 30px;
  position: relative;
`;

const CarName = styled.p`
  font-size: 14px;
  color: black;
`;
let isMounted = true;

const compareDate = (cars: carType[]) => {
  const nowDate = getTodayMs();
  const twoDays = 1000 * 60 * 60 * 24 * 2;
  const result = cars.map((car) => {
    const insurance = new Date(`${car.insuranceDate} 00:00:00`).getTime();
    const inspect = new Date(`${car.inspectionDay} 00:00:00`).getTime();
    const isInsurance = nowDate >= insurance - twoDays || nowDate >= insurance;
    const isInspect = nowDate >= inspect - twoDays || nowDate >= inspect;

    if (isInsurance || isInspect) {
      return {
        plateNum: car.plateNum,
        insurance: isInsurance,
        inspection: isInspect,
      };
    } else {
      return null;
    }
  });

  return result;
};
const Status = () => {
  const car = useAppSelector((state) => state.car.car);
  const cars = useAppSelector((state) => state.car.cars);
  const user = useAppSelector((state) => state.user.user);
  const isLoading = useAppSelector((state) => state.user.isLoading);

  const [showContent, setShowContent] = useState<boolean>(false);
  const [showRemind, setShowRemind] = useState<boolean>(false);
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [remindMessages, setRemindMessages] = useState<resultType>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      isMounted &&
      user.continueRemind &&
      (user.insuranceRemind || user.inspectionRemind)
    ) {
      const result = compareDate(cars);
      const found = result.every((result) => result === null);

      if (!found) {
        setShowRemind(true);
        setRemindMessages(result);
      }
      isMounted = false;
    }
  }, [cars, user]);

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

  const selectMotorHandler = async (id: string, ownerId: string) => {
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    await dispatch(asyncRecordAction.getAllRecords(id));
    setShowContent(false);
  };
  const showContentHandler = () => {
    setShowContent((pre) => !pre);
  };
  console.log(isLoading);

  return (
    <>
      <Container>
        <LeftWrapper>
          <SelectBx>
            <Name>
              <DisplayName>
                <BrandBx>
                  {car?.brand && <Img src={brands.get(car.brand)?.img} />}
                </BrandBx>
                <CarName>
                  {car?.plateNum}: {car?.name}
                </CarName>
              </DisplayName>
            </Name>
            <DownBx onClick={showContentHandler}>
              <Img src={arrowImg} />
            </DownBx>
            <ContentBx $isShow={showContent}>
              {cars.map((car) => (
                <Content
                  onClick={() => {
                    selectMotorHandler(car.id, car.ownerId);
                  }}
                >
                  <BrandBx>
                    <Img src={brands.get(car.brand)?.img} />
                  </BrandBx>
                  <CarName>
                    {car?.plateNum}: {car?.name}
                  </CarName>
                </Content>
              ))}
            </ContentBx>
          </SelectBx>
          <MotorImg src={motorImg} />
        </LeftWrapper>
        <RightWrapper>
          {isLoading && <Loading />}
          <StatusInfo />
        </RightWrapper>
      </Container>
      {showRemind && (
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
