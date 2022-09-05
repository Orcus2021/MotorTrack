import React, { useState, useEffect } from "react";
import uuid from "react-uuid";
import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../../store";
import { partType, partsType } from "../../types/recordType";

import dashboardIcon from "../../assets/dashborad_white.png";

const InfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-right: 20px;

  border-radius: 8px;
`;
const DetailBx = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
`;
const ChartBx = styled.div`
  height: 200px;
  width: 200px;
  background-color: var(--mainColor);
  border-radius: 50%;
`;
const Detail = styled.div`
  flex-grow: 1;
`;
const MileageBx = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--thirdBack);
  border-radius: 50px;
  padding: 10px;
`;
const MileageIconBx = styled.div`
  width: 30px;
  height: 30px;
  position: relative;
`;
const MileageIcon = styled.img`
  position: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const MileageMsg = styled.p`
  font-size: 1.1rem;
`;
const MessageBx = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
`;
const Message = styled.p`
  font-size: 0.8rem;
`;
const PartsWrapper = styled.div`
  /* background-color: var(--thirdBack); */
  padding: 10px;
  width: 100%;
  border-radius: 10px;
`;

const PartsBx = styled.div`
  position: relative;
  display: flex;
  margin: 20px 0;
  padding: 15px 10px;
  /* background: linear-gradient(#49505e 0%, #20232a 10%, #222); */
  background-color: #20232a;
  border-radius: 8px;
  overflow: hidden;
  /* border: 2px solid #000; */
  transition: 0.5s;
  /* &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 10;
  } */
`;

const IconBx = styled.span`
  position: relative;
  width: 110px;
  text-align: right;
  color: #fff;
  margin-top: -2px;
  text-transform: uppercase;
`;
const Value = styled.span`
  position: relative;
  width: 40px;
  text-align: left;
  color: #fff;
  margin-top: -2px;
  text-transform: uppercase;
`;
const Percent = styled.div`
  position: relative;
  width: calc(100% - 150px);
  height: 20px;
  margin: 0 10px;
  border-radius: 10px;
  box-shadow: inset 0 0 10px #000;
  overflow: hidden;
`;
const Progress = styled.div<{ $length: number }>`
  position: absolute;
  width: ${(props) => `${props.$length}%;`};
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: inset 0 0 2px #000;
  animation: animate 4s ease-in-out forwards;
  background: linear-gradient(45deg, var(--mainColor), #673ab7);
  overflow: hidden;
  @keyframes animate {
    from {
      width: 0;
    }
  }
  &::after {
    content: "";
    background-color: #ffffff3a;
    box-shadow: 0px 0px 20px 4px #ffffffd1;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    animation: run 6s ease-in-out infinite;
  }
  @keyframes run {
    0% {
      left: -5%;
    }
    70% {
      left: 110%;
    }
    100% {
      left: 110%;
    }
  }
`;

const StatusInfo = () => {
  const car = useAppSelector((state) => state.car.car);
  const [partStatus, setPartStatus] = useState<partType[][]>([]);
  const parts = useAppSelector((state) => state.record.parts);

  useEffect(() => {
    let arr = [];
    const JSONParts = JSON.stringify(parts);
    const newParts = JSON.parse(JSONParts) as partsType;
    for (let key in newParts) {
      if (newParts[key].length >= 2) {
        const newArr = newParts[key].sort((a: partType, b: partType) => {
          return b.startMileage - a.startMileage;
        });
        arr.push(newArr);
      } else if (newParts[key].length === 1) {
        arr.push(newParts[key]);
      }
    }
    setPartStatus(arr);
  }, [parts]);
  return (
    <InfoWrapper>
      <DetailBx>
        <ChartBx></ChartBx>
        <Detail>
          <MileageBx>
            <MileageIconBx>
              <MileageIcon src={dashboardIcon} />
            </MileageIconBx>
            <MileageMsg>{car?.mileage}公里</MileageMsg>
          </MileageBx>
          <MessageBx>
            <Message>車齡:</Message>
            <Message>{car?.age}</Message>
          </MessageBx>
          <MessageBx>
            <Message>驗車時間:</Message>
            <Message>{car?.inspectionDay}</Message>
          </MessageBx>
          <MessageBx>
            <Message>保險時間:</Message>
            <Message>{car?.insuranceDate}</Message>
          </MessageBx>
        </Detail>
      </DetailBx>
      <PartsWrapper>
        {partStatus.map((data: partType[]) => {
          const percent = Math.floor(
            ((Number(data[0].endMileage) - Number(car?.mileage as number)) *
              100) /
              data[0].mileage
          );
          return (
            <PartsBx key={uuid()}>
              <IconBx>{data[0].category}</IconBx>
              <Percent>
                <Progress $length={percent}></Progress>
              </Percent>
              <Value>{percent}%</Value>
            </PartsBx>
          );
        })}
      </PartsWrapper>
    </InfoWrapper>
  );
};

export default StatusInfo;
