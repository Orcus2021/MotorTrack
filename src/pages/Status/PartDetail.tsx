import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import Progress from "../../components/Progress";
import { useAppSelector } from "../../store";
import { carType } from "../../types/carType";
import { partType } from "../../types/recordType";
import { datePercent, mileagePercent } from "../../utils/calcFunc";

import returnIcon from "../../assets/icon/return.png";

const PartDetailContainer = styled.div`
  width: 410px;
  max-width: 410px;
  height: 522.8px;

  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  @media screen and (max-width: 701px) {
    width: 322px;
    max-width: 322px;
  }
`;

const PartsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 10px 10px 0 10px;
`;
const PartsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 8px 8px;
  overflow: overlay;
  height: 317px;
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
const MessageBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Title = styled.p`
  font-size: 14px;
  width: 70px;
  color: var(--lightColor);
`;
const ListTitle = styled.p`
  font-size: 14px;

  padding: 10px;

  color: #fff;
`;
const MessageDetail = styled.p`
  font-size: 14px;
`;

const PartList = styled.div`
  background-color: var(--secondBack);
  border-radius: 8px;
  margin: 0 0 10px 0;
  padding: 10px;
  position: relative;
  cursor: pointer;
`;
const ListTitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const Line = styled.div`
  height: 1.8px;
  background-color: #ffffff76;
  width: calc(100% - 86px);
  border-radius: 5px;
`;
const ArrowImg = styled.img`
  width: 15px;
  height: 15px;
  top: 50%;
  right: 10px;

  transform: rotate(180deg) translateY(50%);
  position: absolute;
  object-fit: cover;
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
    <PartDetailContainer>
      <PartsWrapper>
        <MessageBox>
          <Title>規格</Title>
          <MessageDetail>{part[0].spec}</MessageDetail>
        </MessageBox>
        <MessageBox>
          <Title>費用</Title>
          <MessageDetail>{part[0].subtotal}</MessageDetail>
        </MessageBox>
        <MessageBox>
          <Title>{isMileage ? "使用里程" : "安裝里程"}</Title>
          <MessageDetail>
            {part[0].startMileage}公里~{part[0].endMileage}公里
          </MessageDetail>
        </MessageBox>
        <MessageBox>
          <Title>{isDate ? "使用期限" : "安裝日期"}</Title>
          <MessageDetail>
            {isDate
              ? `${part[0].startDate}~${part[0].endDate}`
              : `${part[0].startDate}`}
          </MessageDetail>
        </MessageBox>
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
            <MessageBox>
              <Title>安裝日期</Title>
              <MessageDetail>{part.startDate}</MessageDetail>
            </MessageBox>
            <MessageBox>
              <Title>安裝里程</Title>
              <MessageDetail>{part.startMileage}</MessageDetail>
            </MessageBox>
            <MessageBox>
              <Title>費用</Title>
              <MessageDetail>{part.subtotal}</MessageDetail>
            </MessageBox>
            <ArrowImg src={returnIcon} />
          </PartList>
        ))}
      </PartsList>
    </PartDetailContainer>
  );
};

export default PartDetail;
