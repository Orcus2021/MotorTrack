import React, { HTMLAttributes } from "react";
import styled from "styled-components/macro";

const Wrapper = styled.div<{
  $width: number | undefined;
  $height: number | undefined;
  $hover: boolean;
  $isSelect: boolean;
  $boxShadow: boolean;
}>`
  width: ${(props) => (props.$width ? props.$width + "px" : "100%")};

  height: ${(props) => (props.$height ? props.$height + "px" : "auto")};
  padding: 9px 7px 7px 9px;
  border-radius: 8px;
  backdrop-filter: blur(5px);

  background: rgba(255, 255, 255, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-right: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  cursor: ${(props) => props.$hover && "pointer"};

  /* box-shadow: ${(props) =>
    props.$hover ? "" : "3px 3px 15px rgb(0, 0, 0)"}; */
  box-shadow: ${(props) => props.$boxShadow && "3px 3px 15px rgb(0, 0, 0)"};

  ${(props) => {
    if (props.$isSelect) {
      return "border: 2px solid var(--lightColor);   box-shadow: 0px 0px 10px  var(--lightColor);padding: 8px; ";
    }
  }}

  ${(props) => {
    if (props.$hover) {
      return "&:hover{border: 2px solid var(--lightColor);    box-shadow: 0px 0px 10px  var(--lightColor); padding: 8px; }";
    }
  }}
`;

export interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  hover?: boolean;
  boxShadow?: boolean;
  isSelect?: boolean;
  children?: React.ReactNode;
  handleClick?: () => void;
}

const Card: React.FC<Props> = ({
  children = <p>Card</p>,
  width,
  height,
  hover = false,
  isSelect = false,
  boxShadow = false,
  handleClick,
}) => {
  return (
    <Wrapper
      $width={width}
      $height={height}
      $hover={hover}
      $isSelect={isSelect}
      $boxShadow={boxShadow}
      onClick={handleClick}
    >
      {children}
    </Wrapper>
  );
};

export default Card;
