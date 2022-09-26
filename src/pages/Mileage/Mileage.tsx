import React, { useState, useRef } from "react";
import styled from "styled-components/macro";
import { NeonText } from "../../components/style";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import MessageBox from "../../components/Modal/MessageBox";
import asyncCarAction from "../../store/car/asyncCarAction";
import { useAppDispatch, useAppSelector } from "../../store";

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
`;

const MileageWrapper = styled.div`
  max-width: 410px;
  width: 100%;
  height: 500px;
  padding: 20px;
  margin-top: 20px;
  border: var(--lightColor) solid 4px;
  /* background-color: var(--thirdBack); */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(NeonText)`
  font-size: 22px;
  text-align: center;
  margin-bottom: 10px;
`;
const CarNumTitle = styled.p`
  font-size: 16px;
  text-align: center;

  font-weight: 400;
`;
const MileagesContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;
const MileagesContent = styled(NeonText)`
  font-size: 80px;
  text-align: center;
  margin-bottom: 10px;
`;
const Unit = styled.p`
  font-weight: 700;
  font-size: 22px;
  text-align: center;
  margin-bottom: 10px;
  color: var(--thirdBack);
`;
const BtnBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
`;

const Message = styled.p`
  width: 100%;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
`;

type positionType = {
  latitude: number;
  longitude: number;
};

const Mileage = () => {
  const car = useAppSelector((state) => state.car.car);
  const dispatch = useAppDispatch();
  const [mileages, setMileages] = useState<number>(0);
  const [startRecord, setStartRecord] = useState<boolean>(false);
  const timerGPS = useRef<any>("");
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const LonAndLat = useRef<{ latBefore: number; lonBefore: number }>({
    latBefore: NaN,
    lonBefore: NaN,
  });

  const calcDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: string
  ) => {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };
  const distanceHandler = (position: positionType) => {
    const { latitude, longitude } = position;
    if (LonAndLat.current?.latBefore && LonAndLat.current?.lonBefore) {
      const dist = calcDistance(
        LonAndLat.current.latBefore,
        LonAndLat.current.lonBefore,
        latitude,
        longitude,
        "K"
      );
      setMileages((pre) => pre + dist);
    }
    LonAndLat.current.latBefore = latitude;
    LonAndLat.current.lonBefore = longitude;
  };

  const success = (pos: any) => {
    const crd = pos.coords;
    console.log(pos);
    distanceHandler(crd);
  };

  const error = (err: any) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const startRecordHandler = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      if (timerGPS.current) clearTimeout(timerGPS.current);
      navigator.geolocation.getCurrentPosition(success, error, options);
      timerGPS.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(success, error, options);
      }, 10000);
    } else {
      console.log("Geolocation is not supported for this Browser/OS.");
    }
    setStartRecord(true);
  };
  const endRecordHandler = () => {
    setShowConfirm(true);
    clearInterval(timerGPS.current);

    setStartRecord(false);
  };
  const closePartForm = () => {
    setCloseEffect(true);

    setTimeout(() => {
      setShowConfirm(false);
      setCloseEffect(false);
    }, 600);
  };
  const updateMileageHandler = () => {
    if (car?.id) {
      const newMileage = car.mileage + Math.round(mileages);
      // dispatch(
      //   asyncCarAction.updateCar(car.id, { mileage: newMileage })
      // );
      console.log(newMileage);
    }

    LonAndLat.current = {
      latBefore: NaN,
      lonBefore: NaN,
    };
    setMileages(0);
    closePartForm();
  };
  const cancelHandler = () => {
    LonAndLat.current = {
      latBefore: NaN,
      lonBefore: NaN,
    };
    setMileages(0);
    closePartForm();
  };
  return (
    <>
      <Container>
        <MileageWrapper>
          <Title>紀錄里程數</Title>
          <CarNumTitle>車牌 : {car?.plateNum}</CarNumTitle>
          <MileagesContentWrapper>
            <MileagesContent>{mileages.toFixed(2)}</MileagesContent>
            <Unit>公里(Kilometer)</Unit>
          </MileagesContentWrapper>

          {startRecord ? (
            <Button
              label="結束"
              type="reject"
              size="large"
              handleClick={endRecordHandler}
            />
          ) : (
            <Button
              label="開始"
              type="primary"
              size="large"
              handleClick={startRecordHandler}
            />
          )}
        </MileageWrapper>
      </Container>
      {showConfirm && (
        <Modal
          closeEffect={closeEffect}
          onClose={closePartForm}
          containerWidth={400}
        >
          <MessageBox setStyle={{ width: 400, height: 200 }}>
            <Message>{`增加${Math.round(mileages)}公里至${
              car?.plateNum
            }里程數`}</Message>
            <BtnBx>
              <Button label="取消" type="cancel" handleClick={cancelHandler} />
              <Button
                label="確認"
                type="primary"
                handleClick={updateMileageHandler}
              />
            </BtnBx>
          </MessageBox>
        </Modal>
      )}
    </>
  );
};

export default Mileage;
