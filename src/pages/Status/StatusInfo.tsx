import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import userIcon from "../../assets/img/dog.jpg";
import Progress from "../../components/Progress";
import SelectBox from "../../components/SelectBox";
import Skeleton from "../../components/Skeleton/Skeleton";
import { Img } from "../../components/style";
import { useAppDispatch, useAppSelector } from "../../store";
import { carActions } from "../../store/car/carReducer";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import asyncUserAction from "../../store/user/asyncUserAction";
import { carType } from "../../types/carType";
import { partsType, partType } from "../../types/recordType";
import brands from "../../utils/brands";
import { compareDateAndMileage } from "../../utils/calcFunc";
import PartDetail from "./PartDetail";

import arrowImg from "../../assets/icon/arrow_down.png";
import dashboardIcon from "../../assets/icon/dashborad_white.png";
import returnIcon from "../../assets/icon/return.png";
const InfoContainer = styled.div`
  width: 410px;
  max-width: 410px;
  height: 100%;
  overflow: hidden;

  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  border-radius: 8px;
  @media screen and (max-width: 701px) {
    width: 322px;
    max-width: 322px;
    margin-bottom: 80px;
  }
`;

const InfoWrapper = styled.div`
  width: 410px;
  max-width: 410px;
  height: 100%;

  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 701px) {
    width: 322px;
    max-width: 322px;
  }
`;
const DetailBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 10px 0;
  width: 100%;
  border-radius: 8px;
  @media screen and (max-width: 701px) {
    padding: 10px;
  }
`;
const ChartBox = styled.div`
  position: relative;
  height: 80px;
  width: 80px;
  background-color: var(--mainColor);
  border-radius: 50%;
  overflow: hidden;
  border-radius: 50%;
`;
const DetailWrapper = styled.div`
  flex-grow: 1;
`;
const MileageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--mainColor);
  border-radius: 50px;
  padding: 2px 10px;
  margin-bottom: 10px;
`;
const MileageIconBox = styled.div`
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
  font-size: 16px;
`;
const MessageBox = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 5px;
`;
const Message = styled.p`
  font-size: 14px;
`;
const PartsWrapper = styled.div`
  padding: 0 10px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 10px;
  height: 350px;
  overflow: overlay;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(161, 161, 161, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
`;
const LoadingBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100px;
  @media screen and (max-width: 701px) {
    display: none;
  }
`;
const DisplayName = styled.div`
  height: 28px;
  width: 165px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  justify-content: flex-start;
`;
const UserBox = styled.div`
  height: 25px;
  width: 25px;
  position: relative;
`;
const CarName = styled.p`
  width: 65px;
  font-size: 14px;
  flex-grow: 1;
  color: #fff;
  padding: 0;
  height: 17px;
  line-height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  &:hover p {
    color: #fff;
  }
`;

const SelectBrand = styled.div`
  height: 30px;
  width: 30px;
  margin-left: 10px;
  position: relative;
`;

const SelectWrapper = styled.div`
  flex-grow: 1;
  border: 1px solid #fff;
  border-radius: 30px;
  padding: 0 10px;
`;

const PlateNum = styled.p`
  font-size: 14px;
  width: 85px;
  margin-left: 5px;
  line-height: 17px;
  color: #fff;
`;
const NavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;

const RecordText = styled.p`
  font-size: 16px;
`;
const RecordBox = styled.div`
  width: 70px;
  background-color: var(--mainColor);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  height: 30px;
  border-radius: 30px;
  cursor: pointer;
  margin-left: 10px;
  &:hover {
    box-shadow: 0px 0px 10px 2px rgba(224, 195, 252, 0.5),
      0px 0px 10px 2px rgba(110, 155, 233, 0.5);
    animation: btnScale linear 0.3s;
  }
  @keyframes btnScale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    80% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`;
const Line = styled.div`
  height: 1.8px;
  background-color: #ffffff76;
  width: calc(100% - 20px);
  border-radius: 5px;
`;
const InfoDetailWrapper = styled.div<{ $isDetail: boolean }>`
  display: flex;
  align-items: center;
  transition: 0.5s;
  width: 820px;
  transform: ${(props) => (props.$isDetail ? "translateX(-410px)" : "")};
  @media screen and (max-width: 701px) {
    width: 644px;
    max-width: 644px;
    transform: ${(props) => (props.$isDetail ? "translateX(-322px)" : "")};
  }
`;

const NoPartsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RemindMessage = styled.p`
  font-size: 22px;
  opacity: 0.5;
`;
type progressDetailType = {
  index: number;
  percent: number;
  message: string;
};

type Props = {
  showContent: boolean;
  onShowSelectContent: (e: React.MouseEvent) => void;
  onCloseSelectContent: () => void;
};

const StatusInfo: FC<Props> = (props) => {
  const { showContent, onShowSelectContent, onCloseSelectContent } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const car = useAppSelector((state) => state.car.car);
  const cars = useAppSelector((state) => state.car.cars);
  const userImg = useAppSelector((state) => state.user.user.userImg);
  const parts = useAppSelector((state) => state.record.parts);
  const [partStatus, setPartStatus] = useState<partType[][]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [isBoxLoading, setIsBoxLoading] = useState<boolean>(false);
  const [progressDetail, setProgressDetail] = useState<progressDetailType>();

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
  const showDetailHandler = () => {
    setShowDetail((pre) => !pre);
  };

  const selectPartHandler = (
    index: number,
    percent: number,
    message: string
  ) => {
    const progressDetail = {
      index,
      percent,
      message,
    };
    setProgressDetail(progressDetail);
  };

  const selectMotorHandler = async (id: string, ownerId: string) => {
    setIsBoxLoading(true);
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    await dispatch(asyncRecordAction.getAllRecords(id));
    onCloseSelectContent();
    setTimeout(() => {
      setIsBoxLoading(false);
    }, 1000);
  };

  const goRecordHandler = () => {
    navigate("/car_manage/record");
  };

  return (
    <InfoContainer>
      <InfoDetailWrapper $isDetail={showDetail}>
        <InfoWrapper>
          <DetailBox>
            <LeftBox>
              <ChartBox>
                <Img src={userImg || userIcon} />
              </ChartBox>
            </LeftBox>

            <DetailWrapper>
              <MileageBox>
                <MileageIconBox>
                  <MileageIcon src={dashboardIcon} />
                </MileageIconBox>
                <MileageMsg>{car?.mileage}??????</MileageMsg>
              </MileageBox>
              <MessageBox>
                <Message>??????:</Message>
                <Message>{car?.age}</Message>
              </MessageBox>
              <MessageBox>
                <Message>????????????:</Message>
                <Message>{car?.inspectionDay}</Message>
              </MessageBox>
              <MessageBox>
                <Message>????????????:</Message>
                <Message>{car?.insuranceDate}</Message>
              </MessageBox>

              <NavWrapper>
                <SelectWrapper>
                  <SelectBox
                    options={cars.map((car) => (
                      <Content
                        onClick={() => {
                          selectMotorHandler(car.id, car.ownerId);
                        }}
                        key={car.id}
                      >
                        <SelectBrand>
                          <Img src={brands.get(car.brand)?.img} />
                        </SelectBrand>
                        <PlateNum>{car?.plateNum}:</PlateNum>
                        <CarName> {car?.name}</CarName>
                      </Content>
                    ))}
                    onShow={onShowSelectContent}
                    icon={arrowImg}
                    showContent={showContent}
                    width="200px"
                    border={false}
                  >
                    <DisplayName>
                      <UserBox>
                        {car?.brand && <Img src={brands.get(car.brand)?.img} />}
                      </UserBox>
                      <PlateNum>{car?.plateNum}:</PlateNum>
                      <CarName>{car?.name}</CarName>
                    </DisplayName>
                  </SelectBox>
                </SelectWrapper>
                <RecordBox onClick={goRecordHandler}>
                  <RecordText>?????????</RecordText>
                </RecordBox>
              </NavWrapper>
            </DetailWrapper>
          </DetailBox>
          <Line />
          <PartsWrapper>
            {isBoxLoading && (
              <LoadingBox>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton key={index} />
                  ))}
              </LoadingBox>
            )}
            {partStatus.length === 0 && !isBoxLoading && (
              <NoPartsWrapper>
                <RemindMessage>?????????????????????</RemindMessage>
              </NoPartsWrapper>
            )}
            {!isBoxLoading &&
              partStatus.map((part: partType[], index) => {
                const { percent, message } = compareDateAndMileage(
                  part[0],
                  car as carType
                );
                return (
                  <Progress
                    key={part[0].name}
                    message={message}
                    arrowDirection="go"
                    category={part[0].category}
                    returnIcon={returnIcon}
                    percent={percent}
                    handleClick={() => {
                      selectPartHandler(index, percent, message);
                      showDetailHandler();
                    }}
                  />
                );
              })}
          </PartsWrapper>
        </InfoWrapper>
        {progressDetail && partStatus[progressDetail.index] && (
          <PartDetail
            onShow={showDetailHandler}
            part={partStatus[progressDetail.index]}
            percent={progressDetail.percent}
            message={progressDetail.message}
          />
        )}
      </InfoDetailWrapper>
    </InfoContainer>
  );
};

export default StatusInfo;
