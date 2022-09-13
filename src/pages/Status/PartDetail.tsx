import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { useAppSelector } from "../../store";
import { partType } from "../../types/recordType";
import { compareDateAndMileage } from "../../utils/calcFunc";
import { mileagePercent, datePercent } from "../../utils/calcFunc";
import { carType } from "../../types/carType";
import { useNavigate } from "react-router-dom";
import Progress from "../../components/Progress";

import returnIcon from "../../assets/icon/return.png";

const InfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-right: 20px;
  border-radius: 8px;
`;

const PartsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--secondBack);
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
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
  /* box-shadow: 3px 3px 15px rgb(0, 0, 0); */
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
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
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

const PartDetail: React.FC<{ onShow: () => void; part: partType[] }> = (
  props
) => {
  const { onShow, part } = props;
  const navigate = useNavigate();
  const car = useAppSelector((state) => state.car.car);

  const { percent, message } = compareDateAndMileage(part[0], car as carType);

  const [isDate, setIsDate] = useState(true);

  useEffect(() => {
    const mileage = mileagePercent(part[0], car as carType);
    const date = datePercent(part[0]);
    if (!date) return;
    if (date.percent < mileage.percent) {
      setIsDate(false);
    }
  }, [part, car]);

  const goRecordHandler = (id: string) => {
    navigate(`/car_manage/record`, { state: id });
  };

  return (
    <InfoWrapper>
      <PartsWrapper>
        <Progress
          message={message}
          arrowDirection="back"
          category={part[0].category}
          returnIcon={returnIcon}
          percent={percent}
          handleClick={onShow}
        />
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
