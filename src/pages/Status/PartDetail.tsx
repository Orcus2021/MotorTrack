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
  width: 410px;
  max-width: 410px;
  height: 522.8px;

  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* background-color: var(--thirdBack); */
  @media screen and (max-width: 701px) {
    width: 322px;
    max-width: 322px;
  }
`;

const PartsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* background-color: var(--secondBack); */
  border-radius: 8px;

  padding: 10px 10px 0 10px;
  /* box-shadow: 3px 3px 15px rgb(0, 0, 0); */
`;
const PartsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  /* background-color: var(--secondBack); */
  border-radius: 0 0 8px 8px;
  overflow: overlay;
  height: 317px;
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

  padding: 10px;
  color: var(--mainColor);
`;
const MessageDetail = styled.p`
  font-size: 12px;
`;

const PartList = styled.div`
  background-color: var(--secondBack);
  border-radius: 8px;
  margin: 0 0 10px 0;
  padding: 10px;
`;
const ListTitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const Line = styled.div`
  height: 1.8px;
  background-color: #ffffff76;
  width: 80%;
  border-radius: 5px;
  @media screen and (max-width: 701px) {
    width: 75%;
  }
`;

const PartDetail: React.FC<{
  onShow: () => void;
  part: partType[];
  percent: number;
  message: string;
}> = (props) => {
  const { onShow, part, percent, message } = props;

  const navigate = useNavigate();
  const car = useAppSelector((state) => state.car.car);

  const [isDate, setIsDate] = useState(true);
  const [isMileage, setIsMileage] = useState(true);

  useEffect(() => {
    const mileage = mileagePercent(part[0], car as carType);
    const date = datePercent(part[0]);

    if (!date) {
      console.log("rest");
      setIsDate(false);
    } else {
      setIsDate(true);
    }
    if (!mileage) {
      setIsMileage(false);
    } else {
      setIsMileage(true);
    }
  }, [part, car]);

  const goRecordHandler = (id: string) => {
    navigate(`/car_manage/record`, { state: id });
  };

  return (
    <InfoWrapper>
      <PartsWrapper>
        <MessageBx>
          <Title>規格</Title>
          <MessageDetail>{part[0].spec}</MessageDetail>
        </MessageBx>
        <MessageBx>
          <Title>費用</Title>
          <MessageDetail>{part[0].subtotal}</MessageDetail>
        </MessageBx>
        <MessageBx>
          <Title>{isMileage ? "使用里程" : "安裝里程"}</Title>
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
        <Progress
          message={message}
          arrowDirection="back"
          category={part[0].category}
          returnIcon={returnIcon}
          percent={percent}
          handleClick={onShow}
        />
      </PartsWrapper>
      <ListTitleBox>
        <ListTitle>安裝紀錄</ListTitle>
        <Line />
      </ListTitleBox>

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
