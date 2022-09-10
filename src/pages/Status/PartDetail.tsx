import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { useAppSelector } from "../../store";
import { partType } from "../../types/recordType";
import parts from "../../utils/parts";
import { Img } from "../../components/style";
import { mileagePercent, datePercent } from "../../utils/calcFunc";
import { carType } from "../../types/carType";
import { useNavigate } from "react-router-dom";

import returnIcon from "../../assets/icon/return.png";

const InfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-right: 20px;
  border-radius: 8px;
`;
const PartsBx = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 8px 8px 0 0;
  /* background: linear-gradient(#49505e 0%, #20232a 10%, #222); */

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
  width: 40px;
  height: 40px;
  /* text-align: right;
  color: #fff;
  margin-top: -2px;
  text-transform: uppercase; */
`;
const Percent = styled.div<{ $isAlert: boolean }>`
  position: relative;
  width: 100%;
  height: 15px;

  border-radius: 10px;
  box-shadow: inset 0 0 10px #000;

  overflow: hidden;
  ${(props) => (props.$isAlert ? "animation: alert 2s infinite;" : "")};

  @keyframes alert {
    0%,
    100% {
      box-shadow: inset 0 0 10px #000;
    }
    50% {
      box-shadow: inset 0 0 10px rgb(184, 1, 22);
    }
  }
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
  animation: grow 4s ease-in-out forwards;
  background: linear-gradient(45deg, var(--mainColor), #673ab7);
  overflow: hidden;
  @keyframes grow {
    from {
      width: 0;
    }
  }
  &::after {
    content: "";
    background-color: #ffffff86;
    box-shadow: 0px 0px 12px 4px #ffffff;
    width: 1px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    animation: progressLight 6s ease-in-out infinite;
  }
  @keyframes progressLight {
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
const Value = styled.span`
  position: relative;
  width: 40px;
  text-align: left;
  color: #fff;
  margin-top: -2px;
  text-transform: uppercase;
`;
const Message = styled.p`
  font-size: 12px;
  padding-left: 5px;
  margin-bottom: 5px;
`;
const PercentBx = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;
const PartsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--secondBack);
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
`;
const PartsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--secondBack);
  border-radius: 0 0 8px 8px;
  overflow-y: scroll;
  height: 310px;
  padding: 0 10px 10px 10px;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(68, 68, 68, 0.3);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
`;
const MessageBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Title = styled.p`
  font-size: 12px;
  width: 60px;
  color: var(--mainColor);
`;
const ListTitle = styled.p`
  font-size: 12px;
  border-radius: 8px 8px 0 0;
  width: 100%;
  padding: 10px;
  color: var(--mainColor);
  background-color: var(--secondBack);
`;
const MessageDetail = styled.p`
  font-size: 12px;
`;

const PartList = styled.div`
  background-color: var(--thirdBack);
  border-radius: 8px;
  margin: 0 0 10px 0;
  padding: 10px;
`;

const Return = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  cursor: pointer;
`;

const PartDetail: React.FC<{ onShow: () => void; part: partType[] }> = (
  props
) => {
  const { onShow, part } = props;
  const navigate = useNavigate();
  const car = useAppSelector((state) => state.car.car);
  const [partDetail, setPartDetail] = useState<{
    message: string;
    percent: number;
  }>({
    message: "",
    percent: 0,
  });

  const [isDate, setIsDate] = useState(true);

  useEffect(() => {
    const compareDateAndMileage = () => {
      const mileage = mileagePercent(part[0], car as carType);
      const date = datePercent(part[0]);

      if (!date) {
        setPartDetail(mileage);
      } else if (date.percent < mileage.percent) {
        setPartDetail(date);
        setIsDate(false);
      } else {
        setPartDetail(mileage);
      }
    };
    compareDateAndMileage();
  }, [part, car]);

  const goRecordHandler = (id: string) => {
    navigate(`/car_manage/record`, { state: id });
  };

  return (
    <InfoWrapper>
      <PartsWrapper>
        <Return onClick={onShow}>
          <Img src={returnIcon} />
        </Return>
        <PartsBx>
          <IconBx>
            <Img src={parts.get(part[0].category)?.icon} />
          </IconBx>
          <PercentBx>
            <Message>
              {part[0].name}: {partDetail.message}
            </Message>
            <Percent $isAlert={partDetail.percent === 0}>
              <Progress $length={partDetail.percent}></Progress>
            </Percent>
          </PercentBx>
          <Value>{partDetail.percent}%</Value>
        </PartsBx>
        <MessageBx>
          <Title>規格</Title>
          <MessageDetail>{part[0].spec}</MessageDetail>
        </MessageBx>
        <MessageBx>
          <Title>費用</Title>
          <MessageDetail>{part[0].subtotal}</MessageDetail>
        </MessageBx>
        <MessageBx>
          <Title>使用里程</Title>
          <MessageDetail>
            {part[0].startMileage}公里~{part[0].endMileage}公里
          </MessageDetail>
        </MessageBx>
        <MessageBx>
          <Title>{isDate ? "使用期限" : "安裝日期"}</Title>
          <MessageDetail>
            {isDate
              ? `${part[0].startDate}~${part[0].endDate}`
              : `${part[0].startDate}`}
          </MessageDetail>
        </MessageBx>
      </PartsWrapper>
      <ListTitle>安裝紀錄</ListTitle>
      <PartsList>
        {part.map((part) => (
          <PartList
            key={part.recordID}
            onClick={() => goRecordHandler(part.recordID)}
          >
            <MessageBx>
              <Title>安裝日期</Title>
              <MessageDetail>{part.startDate}</MessageDetail>
            </MessageBx>
            <MessageBx>
              <Title>安裝里程</Title>
              <MessageDetail>{part.startMileage}</MessageDetail>
            </MessageBx>
            <MessageBx>
              <Title>費用</Title>
              <MessageDetail>{part.subtotal}</MessageDetail>
            </MessageBx>
          </PartList>
        ))}
      </PartsList>
    </InfoWrapper>
  );
};

export default PartDetail;
