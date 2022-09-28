import React, { HTMLAttributes } from "react";
import styled from "styled-components/macro";

const Btn = styled.button<{ $type: string; $size: string }>`
  margin: 0 10px;
  position: relative;
  display: inline-block;
  line-height: 23.3px;

  padding: ${(props) => {
    if (props.$size === "medium") {
      if (props.$type === "cancel") return "2px 18px";
      return "4px 18px";
    } else if (props.$size === "small") {
      if (props.$type === "cancel") return "2px 5px";
      return "4px 5px";
    } else if (props.$size === "large") {
      if (props.$type === "cancel") return "4px 22px";
      return "6px 22px";
    }
  }};

  font-size: ${(props) => (props.$size === "small" ? "12px" : "16px")};

  ${(props) => {
    if (props.$type === "primary") {
      return "background:var(--mainColor);";
    } else if (props.$type === "reject") {
      return "background:var(--errorColor);";
    } else if (props.$type === "cancel") {
      return "background:rgba(0, 0, 0, 0.2);";
    }
  }}

  text-transform: uppercase;
  letter-spacing: 1px;

  border-radius: 8px;
  /* ${(props) => props.$type === "cancel" && "color: #fff;"} */
  color: #fff;
  border: ${(props) =>
    props.$type === "cancel" ? "2px solid var(--mainColor)" : "none"};

  cursor: pointer;
  &:hover {
    /* color: ${(props) =>
      props.$type === "cancel" ? "#fff" : "var(--mainBack)"}; */
    color: #fff;
    ${(props) => {
      if (props.$type === "primary") {
        return "box-shadow: 0px 0px 10px 2px rgba(224, 195, 252,0.5), 0px 0px 10px 2px rgba(110, 155, 233,0.5);";
      } else if (props.$type === "reject") {
        return "box-shadow: 0px 0px 10px 2px rgba(236, 89, 143, 0.506), 0px 0px 10px 2px rgba(225, 79, 222,0.5);";
      } else if (props.$type === "cancel") {
        return "box-shadow: 0px 0px 10px  var(--lightColor);";
      }
    }}
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

// const ImgBx = styled.span`
//   width: 20px;
//   height: 20px;
//   display: inline-block;
//   position: relative;
// `;

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  type: "primary" | "reject" | "cancel";
  size?: "small" | "medium" | "large";
  icon?: string;
  handleClick: () => void;
}

const Button: React.FC<Props> = ({
  label = "確認",
  type = "primary",
  size = "medium",
  // icon,
  handleClick,
}) => {
  return (
    <Btn $type={type} onClick={handleClick} $size={size}>
      {label}
      {/* {icon && (
        <ImgBx>
          <Img src={icon} />
        </ImgBx>
      )} */}
    </Btn>
  );
};

export default Button;
