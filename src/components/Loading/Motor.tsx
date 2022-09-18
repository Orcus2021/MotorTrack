import React from "react";
import styled from "styled-components/macro";
import { Img } from "../style";
import loadingIcon from "../../assets/icon/logo-bike-blue.png";

const Wrapper = styled.div`
  position: relative;
  width: 150px;
  height: 75px;
  /* filter: drop-shadow(2px -6px 7px rgb(169, 199, 250)); */
  transform: translateY(-50%);
`;
const FrontLoader = styled.div`
  position: relative;
  display: inline-block;
  top: 42px;
  left: -5px;
  width: 43px;
  height: 43px;
  /* border: 1px solid #16181d; */
  overflow: hidden;
  border-radius: 50%;
  /* box-shadow: -1px -1px 1px rgba(255, 255, 255, 0.1),
    2px 2px 2px rgba(0, 0, 0, 0.4),
    inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.2),
    inset 1px 1px 1px rgba(0, 0, 0, 0.4); */
  &::before {
    content: "";
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 2;
    background: #2d313b;
    border-radius: 50%;
    border: 2px solid #2d313b;
    box-shadow: inset -0.5px -0.5px 1px rgba(255, 255, 255, 0.2),
      inset 1px 1px 1px rgba(0, 0, 0, 0.5);
  }
`;
const Border = styled.span`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;

  z-index: -1;
  background: linear-gradient(rgb(52, 168, 252), #38ccf1);
  filter: blur(5px);
  animation: runTire 0.5s linear infinite;
  @keyframes runTire {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;
const BackBorder = styled(Border)`
  animation: runTire 0.5s linear infinite -0.2s;
`;
const BackLoader = styled(FrontLoader)`
  top: 40px;
  right: -60px;
  left: auto;
`;

const Motor = () => {
  return (
    <Wrapper>
      <Img src={loadingIcon} />
      <FrontLoader>
        <Border />
        <Border />
      </FrontLoader>
      <BackLoader>
        <BackBorder />
        <BackBorder />
      </BackLoader>
    </Wrapper>
  );
};

export default Motor;
