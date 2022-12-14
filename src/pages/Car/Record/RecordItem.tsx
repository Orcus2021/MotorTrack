import React from "react";
import styled from "styled-components/macro";
import { Img } from "../../../components/style";
import { feeType, repairType } from "../../../types/recordType";

import feeIcon from "../../../assets/icon/moneyBag.png";
import refuelIcon from "../../../assets/icon/refuel.png";
import repairIcon from "../../../assets/icon/repair.png";

const ContentWrapper = styled.tr`
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.4);
  }
  &:hover {
    background-color: var(--mainColor);
    color: black;
  }
  @media screen and (max-width: 801px) {
    display: none;
  }
`;
const ContentWrapperRwd = styled.div`
  display: none;
  flex-direction: row;
  align-items: center;
  height: 50px;
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.22);
  }
  &:hover {
    background-color: var(--mainColor);
    color: black;
  }
  @media screen and (max-width: 801px) {
    display: flex;
  }
`;
const Content = styled.td`
  font-size: 16px;
  text-align: center;
  height: 25px;
  padding: 2px 0;
  cursor: pointer;
  &:nth-child(1) {
    width: 50px;
  }
  &:nth-child(2) {
    width: 100px;
  }
  &:nth-child(3) {
    width: 120px;
  }

  &:nth-child(5) {
    width: 50px;
  }
  &:nth-child(6) {
    width: 150px;
  }
`;
const ContentCategory = styled.div`
  font-size: 16px;
  text-align: center;
  height: 25px;
  padding: 2px 0;
  cursor: pointer;
  width: 50px;
`;
const ContentDateAndTitle = styled(ContentCategory)`
  width: 120px;
`;
const ContentMileage = styled(ContentCategory)`
  width: 100px;
`;
const ContentAmount = styled(ContentCategory)`
  width: 50px;
`;

const IconBx = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  margin: 0 auto;
`;
const ContentBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
`;
type Props = {
  record: repairType | feeType;
  onUpdate: (id: string, category: string) => void;
  rwd: boolean;
};

const RecordItem: React.FC<Props> = (props) => {
  const { record, onUpdate, rwd } = props;
  const updateHandler = () => {
    onUpdate(record.id, record.category);
  };
  let iconSrc = feeIcon;
  if (record.category === "repair") {
    iconSrc = repairIcon;
  } else if (record.category === "refuel") {
    iconSrc = refuelIcon;
  }

  return (
    <>
      {!rwd && (
        <ContentWrapper onClick={updateHandler}>
          <Content>
            <IconBx>
              <Img src={iconSrc} />
            </IconBx>
          </Content>
          <Content>{record.date}</Content>
          <Content>{record.mileage}</Content>
          <Content>{record.title}</Content>
          <Content>{record.amount}</Content>
          <Content>{record.note || "---"}</Content>
        </ContentWrapper>
      )}
      {rwd && (
        <ContentWrapperRwd onClick={updateHandler}>
          <ContentCategory>
            <IconBx>
              <Img src={iconSrc} />
            </IconBx>
          </ContentCategory>
          <ContentBox>
            <ContentDateAndTitle>{record.date}</ContentDateAndTitle>
            <ContentDateAndTitle>{record.title}</ContentDateAndTitle>
          </ContentBox>
          <ContentMileage>{record.mileage}</ContentMileage>
          <ContentAmount>{record.amount}</ContentAmount>
        </ContentWrapperRwd>
      )}
    </>
  );
};

export default RecordItem;
