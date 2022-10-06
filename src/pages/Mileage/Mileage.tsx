import { ChangeEvent, useRef, useState } from "react";
import styled from "styled-components/macro";
import Button from "../../components/Button/Button";
import Ripple from "../../components/Loading/Ripple";
import MessageBox from "../../components/Modal/MessageBox";
import Modal from "../../components/Modal/Modal";
import { NeonText } from "../../components/style";
import { useAppDispatch, useAppSelector } from "../../store";
import asyncCarAction from "../../store/car/asyncCarAction";
import { positionType } from "../../types/mapType";
import {
  calcDistance,
  createMessage,
  getUserLocation,
} from "../../utils/calcFunc";

const MileageContainer = styled.div`
  width: 100vw;
  height: calc(100vh - 68px);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
`;

const MileageWrapper = styled.div`
  position: relative;
  max-width: 410px;
  width: 100%;
  height: 500px;
  padding: 20px;
  margin-top: 20px;
  border: var(--lightColor) solid 4px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const Title = styled(NeonText)`
  font-size: 22px;
  text-align: center;
  margin-bottom: 10px;
`;
const CarNumTitle = styled.p`
  font-size: 16px;
  text-align: center;
  margin-bottom: 5px;
  font-weight: 400;
`;
const MileagesContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 100px;
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
  color: #777777;
`;
const BtnBox = styled.div`
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
const InitMileageBox = styled.div`
  display: flex;
  align-items: center;
  width: 130px;
  margin-bottom: 10px;
`;
const InitMileageTitle = styled.label`
  font-size: 16px;
  min-width: 60px;
`;
const InitMileage = styled.input`
  outline: none;
  border: 1px solid #fff;
  border-radius: 8px;
  width: 77px;
  background-color: transparent;
  color: #fff;
  padding: 0 5px;
  font-size: 16px;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;
const LoadingBox = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  top: 310px;
  left: 50%;
  transform: translateX(-50%);
`;

const Mileage = () => {
  const car = useAppSelector((state) => state.car.car);
  const timerGPS = useRef<ReturnType<typeof setInterval>>();
  const dispatch = useAppDispatch();
  const [mileages, setMileages] = useState<number>(0);
  const [startRecord, setStartRecord] = useState<boolean>(false);
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const carMileage = car?.mileage || 0;
  const [initMileage, setInitMileage] = useState<number | "">(carMileage);
  const LonAndLat = useRef<{ latBefore: number | ""; lonBefore: number | "" }>({
    latBefore: "",
    lonBefore: "",
  });

  const distanceHandler = (position: positionType) => {
    const { lat, lng } = position;
    if (LonAndLat.current?.latBefore && LonAndLat.current?.lonBefore) {
      const dist = calcDistance(
        LonAndLat.current.latBefore,
        LonAndLat.current.lonBefore,
        lat,
        lng,
        "K"
      );
      setMileages((pre) => pre + dist);
    }
    LonAndLat.current.latBefore = lat;
    LonAndLat.current.lonBefore = lng;
  };

  const initMileageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const changeMileage = Number(e.target.value);
    setInitMileage(changeMileage);
  };

  const getIntervalPosition = async () => {
    const options = {
      enableHighAccuracy: false,
      timeout: 4000,
      maximumAge: 0,
    };
    if (navigator.geolocation) {
      if (timerGPS.current) clearTimeout(timerGPS.current);
      const position = await getUserLocation(options);
      distanceHandler(position);
      timerGPS.current = setInterval(async () => {
        const position = await getUserLocation(options);
        distanceHandler(position);
      }, 5000);
      setStartRecord(true);
    } else {
      createMessage("error", dispatch, "GPS不支援");
    }
  };
  const startRecordHandler = async () => {
    if (car && initMileage < car.mileage) {
      createMessage("error", dispatch, "低於原里程數");
      return;
    }
    getIntervalPosition();
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
  const clearCalcDistanceContent = () => {
    LonAndLat.current = {
      latBefore: "",
      lonBefore: "",
    };
    setMileages(0);
  };
  const updateMileageHandler = () => {
    if (car?.id && initMileage !== "") {
      const newMileage = initMileage + Math.round(mileages);
      dispatch(asyncCarAction.updateCar(car.id, { mileage: newMileage }));
      setInitMileage(newMileage);
    }

    clearCalcDistanceContent();
    closePartForm();
  };
  const cancelHandler = () => {
    clearCalcDistanceContent();
    closePartForm();
  };
  const clearZeroHandler = () => {
    setInitMileage((pre: number | "") => {
      if (pre === 0) {
        return "";
      } else {
        return pre;
      }
    });
  };
  return (
    <>
      <MileageContainer>
        <MileageWrapper>
          <Title>紀錄里程數</Title>
          <CarNumTitle>車牌 : {car?.plateNum}</CarNumTitle>
          <InitMileageBox>
            <InitMileageTitle>里程數 : </InitMileageTitle>
            <InitMileage
              type="number"
              value={initMileage}
              onChange={initMileageHandler}
              onFocus={clearZeroHandler}
            />
          </InitMileageBox>
          {startRecord && (
            <LoadingBox>
              <Ripple />
            </LoadingBox>
          )}

          <MileagesContentWrapper>
            <MileagesContent>{mileages.toFixed(2)}</MileagesContent>
            <Unit>公里(Kilometer)</Unit>
          </MileagesContentWrapper>

          {startRecord ? (
            <Button
              label="完成"
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
      </MileageContainer>
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
            <BtnBox>
              <Button label="取消" type="cancel" handleClick={cancelHandler} />
              <Button
                label="確認"
                type="primary"
                handleClick={updateMileageHandler}
              />
            </BtnBox>
          </MessageBox>
        </Modal>
      )}
    </>
  );
};

export default Mileage;
