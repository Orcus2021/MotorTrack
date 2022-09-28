import React, { HTMLAttributes } from "react";
import parts from "../utils/parts";
import { Img } from "../components/style";
import styled from "styled-components/macro";

const PartsBx = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  padding: 5px 10px;

  background-color: var(--secondBack);
  border-radius: 8px;
  overflow: hidden;
  transition: 0.5s;
  cursor: pointer;
`;

const IconBx = styled.span`
  position: relative;
  width: 30px;
  height: 30px;
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
const ProgressBar = styled.div<{
  $length: number;
  $startColor: string | undefined;
  $endColor: string | undefined;
}>`
  position: absolute;
  width: ${(props) => `${props.$length}%;`};
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 10px;
  background: #fff;
  box-shadow: inset 0 0 2px #000;
  animation: animate 4s ease-in-out forwards;
  background: linear-gradient(
    45deg,
    ${(props) => (props.$startColor ? props.$startColor : "var(--mainColor)")},
    ${(props) => (props.$endColor ? props.$endColor : "#673ab7")}
  );
  overflow: hidden;
  @keyframes animate {
    from {
      width: 0;
    }
  }
  &::after {
    content: "";
    background-color: #ffffff7b;
    box-shadow: 0px 0px 12px 4px #ffffff;
    width: 0px;
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
const Value = styled.span<{ $isAlert: boolean }>`
  position: relative;
  width: 40px;
  text-align: left;
  color: #fff;
  margin-top: -2px;
  text-transform: uppercase;
  ${(props) => (props.$isAlert ? "animation: valueAlert 2s infinite;" : "")};
  @keyframes valueAlert {
    0%,
    100% {
      color: #fff;
    }
    50% {
      color: rgb(184, 1, 22);
    }
  }
`;
const Message = styled.p`
  font-size: 14px;
  padding-left: 5px;
  margin-bottom: 5px;
`;
const PercentBx = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;

const Return = styled.div<{ $direction: string }>`
  width: 15px;
  height: 15px;
  position: relative;
  margin-top: 2px;
  margin-left: 3px;
  transform: ${(props) => (props.$direction === "go" ? "rotate(180deg)" : "")};
  cursor: pointer;
`;

export interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string;
  category: string;
  returnIcon: string;
  percent: number;
  arrowDirection: "go" | "back";
  startColor?: string;
  endColor?: string;
  handleClick?: () => void;
}

const Progress: React.FC<Props> = ({
  message,
  category,
  returnIcon,
  percent,
  arrowDirection,
  startColor,
  endColor,
  handleClick,
}) => {
  return (
    <PartsBx onClick={handleClick}>
      <IconBx>
        <Img src={parts.get(category)?.icon} />
      </IconBx>
      <PercentBx>
        <Message>
          {parts.get(category)?.name}: {message}
        </Message>
        <Percent $isAlert={percent === 0}>
          <ProgressBar
            $length={percent}
            $startColor={startColor}
            $endColor={endColor}
          />
        </Percent>
      </PercentBx>

      <Value $isAlert={percent === 0}>{percent}%</Value>
      <Return $direction={arrowDirection}>
        <Img src={returnIcon} />
      </Return>
    </PartsBx>
  );
};

export default Progress;
