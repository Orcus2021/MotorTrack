import React, { useState, useEffect, FC } from "react";
import PartDetail from "./PartDetail";
import brands from "../../utils/brands";
import { Img } from "../../components/style";
import userIcon from "../../assets/img/dog.jpg";
import styled from "styled-components/macro";
import { useAppSelector, useAppDispatch } from "../../store";
import { compareDateAndMileage } from "../../utils/calcFunc";
import { partType, partsType } from "../../types/recordType";
import Progress from "../../components/Progress";
import { carType } from "../../types/carType";
import SelectBox from "../../components/SelectBox";
import { carActions } from "../../store/car/carReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import { useNavigate } from "react-router-dom";
import Skeleton from "../../components/Skeleton/Skeleton";

import returnIcon from "../../assets/icon/return.png";
import dashboardIcon from "../../assets/icon/dashborad_white.png";
import arrowImg from "../../assets/icon/arrow_down.png";
const Container = styled.div`
  width: 410px;
  max-width: 410px;
  height: 100%;
  /* margin-right: 30px; */
  overflow: hidden;

  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  /* background-color: var(--thirdBack); */
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
const DetailBx = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 10px 0;
  width: 100%;
  border-radius: 8px;
  @media screen and (max-width: 701px) {
    padding: 10px;
  }
`;
const ChartBx = styled.div`
  position: relative;
  height: 80px;
  width: 80px;

  background-color: var(--mainColor);
  border-radius: 50%;
  overflow: hidden;
  border-radius: 50%;
`;
const Detail = styled.div`
  flex-grow: 1;
  /* padding: 0 20px; */
`;
const MileageBx = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--mainColor);
  border-radius: 50px;
  padding: 2px 10px;
  margin-bottom: 10px;
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
  font-size: 16px;
`;
const MessageBx = styled.div`
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
  /* background-color: var(--thirdBack); */
  padding: 0 10px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 10px;
  height: 350px;
  overflow: overlay;
  /* box-shadow: 3px 3px 15px rgb(0, 0, 0); */
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
const LoadingBx = styled.div`
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
const UserBx = styled.div`
  height: 25px;
  width: 25px;
  position: relative;
  /* margin-right: 10px; */
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
  /* text-align: center; */
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
  width: 80%;
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

const StatusInfo: FC<{
  showContent: boolean;
  onShowSelectContent: (e: React.MouseEvent) => void;
  onCloseSelectContent: () => void;
}> = (props) => {
  const { showContent, onShowSelectContent, onCloseSelectContent } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const car = useAppSelector((state) => state.car.car);
  const cars = useAppSelector((state) => state.car.cars);
  const userImg = useAppSelector((state) => state.user.user.userImg);
  const [partStatus, setPartStatus] = useState<partType[][]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // const [showContent, setShowContent] = useState<boolean>(false);
  const [isBoxLoading, setIsBoxLoading] = useState<boolean>(false);
  const parts = useAppSelector((state) => state.record.parts);
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

  const setOptions = () => {
    const options = cars.map((car) => (
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
    ));
    return options;
  };
  const goRecordHandler = () => {
    navigate("/car_manage/record");
  };

  return (
    <Container>
      <InfoDetailWrapper $isDetail={showDetail}>
        <InfoWrapper>
          <DetailBx>
            <LeftBox>
              <ChartBx>
                <Img src={userImg || userIcon} />
              </ChartBx>
            </LeftBox>

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

              <NavWrapper>
                <SelectWrapper>
                  <SelectBox
                    options={setOptions()}
                    onShow={onShowSelectContent}
                    icon={arrowImg}
                    showContent={showContent}
                    width="200px"
                    border={false}
                  >
                    <DisplayName>
                      <UserBx>
                        {car?.brand && <Img src={brands.get(car.brand)?.img} />}
                      </UserBx>
                      <PlateNum>{car?.plateNum}:</PlateNum>
                      <CarName>{car?.name}</CarName>
                    </DisplayName>
                  </SelectBox>
                </SelectWrapper>
                <RecordBox onClick={goRecordHandler}>
                  <RecordText>記錄去</RecordText>
                </RecordBox>
              </NavWrapper>
            </Detail>
          </DetailBx>
          <Line />
          <PartsWrapper>
            {isBoxLoading && (
              <LoadingBx>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <Skeleton key={index} />
                  ))}
              </LoadingBx>
            )}
            {partStatus.length === 0 && !isBoxLoading && (
              <NoPartsWrapper>
                <RemindMessage>未登入零件紀錄</RemindMessage>
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
    </Container>
  );
};

export default StatusInfo;
