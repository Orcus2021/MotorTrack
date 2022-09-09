import React, { useEffect, useCallback, useState } from "react";
import parts from "../../utils/parts";
import { Img } from "../../components/style";
import styled from "styled-components/macro";
import { partType } from "../../types/recordType";
import { useAppSelector } from "../../store";
import { mileagePercent, datePercent } from "../../utils/calcFunc";
import { carType } from "../../types/carType";

const PartsBx = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  padding: 5px 10px;
  /* background: linear-gradient(#49505e 0%, #20232a 10%, #222); */
  background-color: #20232a;
  border-radius: 8px;
  overflow: hidden;
  /* border: 2px solid #000; */
  transition: 0.5s;
  /* &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 10;
  } */
  cursor: pointer;
`;

const IconBx = styled.span`
  position: relative;
  width: 40px;
  height: 40px;
  /* text-align: right;
  color: #fff;
  margin-top: -2px;
  text-transform: uppercase; */
`;
const Percent = styled.div<{ $isAlert: boolean }>`
  position: relative;
  width: 100%;
  height: 20px;

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
    background-color: #ffffff3a;
    box-shadow: 0px 0px 20px 4px #ffffffd1;
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

  // const mileagePercent = useCallback(() => {
  //   let message = "";
  //   const diffMileage =
  //     Number(part[0].endMileage) - Number(car?.mileage as number);
  //   const percent = Math.floor((diffMileage * 100) / part[0].mileage);
  //   if (diffMileage <= 0) {
  //     message = `超過${diffMileage}公里`;
  //   } else {
  //     message = `可用${diffMileage}公里`;
  //   }

  //   return { percent, message };
  // }, [car, part]);

  // const datePercent = useCallback(() => {
  //   if (part[0].month === 0 && part[0].year) return null;
  //   let message = "";
  //   const startMillisecond = new Date(part[0].startDate).getTime();
  //   const endMillisecond = new Date(part[0].endDate).getTime();
  //   const nowMillisecond = new Date().getTime();
  //   const diffMillisecond = endMillisecond - startMillisecond;
  //   let percent = Math.floor(
  //     ((endMillisecond - nowMillisecond) * 100) / diffMillisecond
  //   );
  //   const months = Math.ceil((diffMillisecond / 1000) * 60 * 60 * 24 * 30);
  //   if (diffMillisecond <= 0) {
  //     message = "使用期限已到";
  //   } else if (months >= 12) {
  //     message = `可用${Math.floor(months / 12)}年${months % 12}個月`;
  //   } else {
  //     message = `可用${months}個月`;
  //   }

  //   return { percent, message };
  // }, [part]);

  useEffect(() => {
    const compareDateAndMileage = () => {
      const mileage = mileagePercent(part[0], car as carType);
      const date = datePercent(part[0]);
      if (!date) {
        setPartDetail(mileage);
      } else if (date.percent < mileage.percent) {
        setPartDetail(date);
      } else {
        setPartDetail(mileage);
      }
    };
    compareDateAndMileage();
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
          <Progress $length={partDetail.percent}></Progress>
        </Percent>
      </PercentBx>

      <Value>{partDetail.percent}%</Value>
    </PartsBx>
  );
};

export default PartStatus;
