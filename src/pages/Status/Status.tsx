import React, { useState } from "react";
import brands from "../../utils/brands";
import styled from "styled-components/macro";
import { useAppSelector, useAppDispatch } from "../../store";
import { carActions } from "../../store/car/carReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import asyncRecordAction from "../../store/record/asyncRecordAction";
import StatusInfo from "./StatusInfo";
import arrowImg from "../../assets/icon/arrow_down.png";
import { Img } from "../../components/style";

import motorImg from "../../assets/bike_blue_1.png";

const Container = styled.div`
  margin-top: 68px;
  width: 100%;
  height: calc(100vh - 68px);
  display: flex;
  flex-direction: row;
`;
const LeftWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  height: 100%;
  align-items: center;
  padding: 20px;
`;
const RightWrapper = styled.div`
  width: 500px;
  display: flex;
  padding: 0 10px 10px 0;
  flex-direction: column;
`;
const MotorImg = styled.img`
  position: absolute;
  top: 0;
  width: 95%;
  height: calc(100% - 18px);
  object-fit: contain;
`;

const SelectBx = styled.div`
  width: 200px;
  background-color: #fff;
  z-index: 2;
  /* height: 28px; */
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* overflow: hidden; */
`;
const Name = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 4px;
`;
const DownBx = styled.div`
  margin-top: 4px;
  position: relative;
  height: 20px;
  width: 20px;
  margin-right: 10px;
  align-self: flex-end;
`;
const ContentBx = styled.div<{ $isShow: boolean }>`
  width: 100%;
  position: relative;
  background-color: #fff;
  margin-top: 5px;
  border-radius: 4px;
  transition: 0.5s;
  overflow: hidden;
  height: ${(props) => (props.$isShow ? "auto" : "0")};
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
`;
const DisplayName = styled.div`
  height: 28px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px;
  justify-content: flex-start;
`;
const BrandBx = styled.div`
  height: 30px;
  width: 30px;
  position: relative;
`;

const CarName = styled.p`
  font-size: 14px;
  color: black;
`;
const Status = () => {
  const car = useAppSelector((state) => state.car.car);
  const cars = useAppSelector((state) => state.car.cars);
  const [showContent, setShowContent] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const selectMotorHandler = (id: string, ownerId: string) => {
    dispatch(carActions.selectCar(id));
    dispatch(asyncUserAction.updateUser(ownerId, { selectCar: id }));
    dispatch(asyncRecordAction.getAllRecords(id));
    setShowContent(false);
  };
  const showContentHandler = () => {
    setShowContent((pre) => !pre);
  };

  return (
    <Container>
      <LeftWrapper>
        <SelectBx>
          <Name>
            <DisplayName>
              <BrandBx>
                {car?.brand && <Img src={brands.get(car.brand)?.img} />}
              </BrandBx>
              <CarName>
                {car?.plateNum}: {car?.name}
              </CarName>
            </DisplayName>
          </Name>
          <DownBx onClick={showContentHandler}>
            <Img src={arrowImg} />
          </DownBx>
          <ContentBx $isShow={showContent}>
            {cars.map((car) => (
              <Content
                onClick={() => {
                  selectMotorHandler(car.id, car.ownerId);
                }}
              >
                <BrandBx>
                  <Img src={brands.get(car.brand)?.img} />
                </BrandBx>
                <CarName>
                  {car?.plateNum}: {car?.name}
                </CarName>
              </Content>
            ))}
          </ContentBx>
        </SelectBx>
        <MotorImg src={motorImg} />
      </LeftWrapper>
      <RightWrapper>
        <StatusInfo />
      </RightWrapper>
    </Container>
  );
};

export default Status;
