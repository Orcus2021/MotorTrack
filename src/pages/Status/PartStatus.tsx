import React, { useEffect, useCallback, useState } from "react";
import parts from "../../utils/parts";
import { Img } from "../../components/style";
import styled from "styled-components/macro";
import { partType } from "../../types/recordType";
import { useAppSelector } from "../../store";
import { mileagePercent, datePercent } from "../../utils/calcFunc";
import { carType } from "../../types/carType";
import { compareDateAndMileage } from "../../utils/calcFunc";

import returnIcon from "../../assets/icon/return.png";

const PartsBx = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  padding: 5px 10px;

  background-color: #20232a;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.5s;
  cursor: pointer;
`;

const IconBx = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
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
  animation: animate 4s ease-in-out forwards;
  background: linear-gradient(45deg, var(--mainColor), #673ab7);
  overflow: hidden;
  @keyframes animate {
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
    animation: run 6s ease-in-out infinite;
  }
  @keyframes run {
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

const Return = styled.div`
  width: 15px;
  height: 15px;
  position: relative;
  transform: rotate(180deg);
  cursor: pointer;
`;

const PartStatus: React.FC<{
  part: partType[];
  onShow: () => void;
  onSelect: () => void;
}> = (props) => {
  const car = useAppSelector((state) => state.car.car);
  const [partDetail, setPartDetail] = useState<{
    message: string;
    percent: number;
  }>({
    message: "",
    percent: 0,
  });
  const { part, onShow, onSelect } = props;

  useEffect(() => {
    const message = compareDateAndMileage(part[0], car as carType);
    setPartDetail(message);
  }, [part, car]);

  const showDetailHandler = () => {
    onShow();
    onSelect();
  };

  return (
    <PartsBx onClick={showDetailHandler}>
      <IconBx>
        <Img src={parts.get(part[0].category)?.icon} />
      </IconBx>
      <PercentBx>
        <Message>
          {part[0].name}: {partDetail.message}
        </Message>
        <Percent $isAlert={partDetail.percent === 0}>
          <Progress $length={partDetail.percent} />
        </Percent>
      </PercentBx>

      <Value>{partDetail.percent}%</Value>
      <Return>
        <Img src={returnIcon} />
      </Return>
    </PartsBx>
  );
};

export default PartStatus;
