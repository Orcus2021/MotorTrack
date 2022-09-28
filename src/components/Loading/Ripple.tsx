import React from "react";
import styled from "styled-components/macro";

const RippleWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
  & div {
    position: absolute;
    border: 4px solid var(--lightColor);
    opacity: 1;
    border-radius: 50%;
    box-shadow: 0px 0px 10px var(--lightColor);
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  & div:nth-child(2) {
    box-shadow: 0px 0px 10px var(--lightColor);
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% {
      top: 100px;
      left: 100px;
      width: 0;
      height: 0;
      opacity: 0;
    }
    4.9% {
      top: 100px;
      left: 100px;
      width: 0;
      height: 0;
      opacity: 0;
    }
    5% {
      top: 100px;
      left: 100px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
`;

const Ripple = () => {
  return (
    <RippleWrapper>
      <div></div>
      <div></div>
    </RippleWrapper>
  );
};

export default Ripple;
