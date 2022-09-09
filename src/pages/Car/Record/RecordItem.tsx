import React from "react";
import styled from "styled-components/macro";
import { repairType, feeType } from "../../../types/recordType";
import { Img } from "../../../components/style";

import repairIcon from "../../../assets/icon/repair.png";
import feeIcon from "../../../assets/icon/moneyBag.png";
import refuelIcon from "../../../assets/icon/refuel.png";

const ContentWrapper = styled.tr`
  &:hover {
    background-color: var(--mainColor);
  }
`;
const Content = styled.td`
  font-size: 16px;
  text-align: center;
  height: 25px;
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
const IconBx = styled.div`
  width: 16px;
  height: 16px;
  position: relative;
  margin: 0 auto;
`;

const RecordItem: React.FC<{
  record: repairType | feeType;
  onUpdate: (id: string, category: string) => void;
}> = (props) => {
  const { record, onUpdate } = props;
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
      <Content>{record.note}</Content>
    </ContentWrapper>
  );
};

export default RecordItem;
