import React, { useState, useEffect } from "react";
import PartDetail from "./PartDetail";
import PartStatus from "./PartStatus";
import { Img } from "../../components/style";
import userIcon from "../../assets/img/dog.jpg";
import styled from "styled-components/macro";
import { useAppSelector } from "../../store";
import { partType, partsType } from "../../types/recordType";
import Motor from "../../components/Loading/Motor";
import Progress from "../../components/Progress";

import dashboardIcon from "../../assets/icon/dashborad_white.png";

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin-right: 30px;

  border-radius: 8px;
`;

const InfoWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin-right: 20px;
  border-radius: 8px;
`;
const DetailBx = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  background-color: var(--thirdBack);
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
`;
const ChartBx = styled.div`
  position: relative;
  height: 100px;
  width: 100px;
  margin-left: 10px;
  background-color: var(--mainColor);
  border-radius: 50%;
  overflow: hidden;
  border-radius: 50%;
`;
const Detail = styled.div`
  flex-grow: 1;
  padding: 0 20px;
`;
const MileageBx = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--mainColor);
  border-radius: 50px;
  padding: 5px 10px;
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
  background-color: var(--thirdBack);
  padding: 0 10px;
  width: 100%;
  margin-top: 10px;
  border-radius: 10px;
  height: 350px;
  overflow-y: scroll;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
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
const LoadingBx = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusInfo: React.FC<{ isBoxLoading: boolean }> = (props) => {
  const { isBoxLoading } = props;
  const car = useAppSelector((state) => state.car.car);
  const userImg = useAppSelector((state) => state.user.user.userImg);
  const [partStatus, setPartStatus] = useState<partType[][]>([]);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const parts = useAppSelector((state) => state.record.parts);
  const [partsIndex, setPartsIndex] = useState<number>(NaN);

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
  const selectPartHandler = (index: number) => {
    setPartsIndex(index);
  };
  return (
    <Container>
      {showDetail ? (
        <PartDetail onShow={showDetailHandler} part={partStatus[partsIndex]} />
      ) : (
        <InfoWrapper>
          <DetailBx>
            <ChartBx>
              <Img src={userImg || userIcon} />
            </ChartBx>
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
            {isBoxLoading && (
              <LoadingBx>
                <Motor />
              </LoadingBx>
            )}
            {partStatus.map((part: partType[], index) => (
              <PartStatus
                onSelect={() => {
                  selectPartHandler(index);
                }}
                onShow={showDetailHandler}
                key={part[0].name}
                part={part}
              />
            ))}
            {/* {partStatus.map((part: partType[], index) => {
              
              
              
              return(
              <Progress
                onSelect={() => {
                  selectPartHandler(index);
                }}`
                onShow={showDetailHandler}
                key={part[0].name}
                part={part}
              />
            )})} */}
          </PartsWrapper>
        </InfoWrapper>
      )}
    </Container>
  );
};

export default StatusInfo;
