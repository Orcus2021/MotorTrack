import React from "react";
import styled from "styled-components";

// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   min-height: calc(100vh - 68px);
//   background: linear-gradient(var(--mainBack), var(--secondBack));
//   padding: 10px 100px 30px 100px;
//   flex-direction: column;
//   z-index: 9990;
//   @media screen and (max-width: 701px) {
//     min-height: 500px;
//     height: calc(100vh - 68px);
//   }
// `;

const Text = styled.span`
  position: relative;
  font-size: 50px;
  font-weight: 800;
  font-family: "Kanit", sans-serif;
  color: rgba(255, 255, 255, 0.466);
  &:nth-child(1) {
    animation: sparkLoading 2.5s linear infinite 0s;
  }
  &:nth-child(1) {
    animation: sparkLoading 2.5s linear infinite 0s;
  }
  &:nth-child(2) {
    animation: sparkLoading 2.5s linear infinite 0.25s;
  }
  &:nth-child(3) {
    animation: sparkLoading 2.5s linear infinite 0.5s;
  }
  &:nth-child(4) {
    animation: sparkLoading 2.5s linear infinite 0.75s;
  }
  &:nth-child(5) {
    animation: sparkLoading 2.5s linear infinite 1s;
  }
  &:nth-child(6) {
    animation: sparkLoading 2.5s linear infinite 1.25s;
  }
  &:nth-child(7) {
    animation: sparkLoading 2.5s linear infinite 1.5s;
  }
  &:nth-child(8) {
    animation: sparkLoading 2.5s linear infinite 1.75s;
  }
  &:nth-child(9) {
    animation: sparkLoading 2.5s linear infinite 2s;
  }
  &:nth-child(10) {
    animation: sparkLoading 2.5s linear infinite 2.25s;
  }

  @keyframes sparkLoading {
    0%,
    100% {
      text-shadow: 0 0 10px var(--mainColor), 0 0 20px var(--mainColor),
        0 0 40px var(--mainColor), 0 0 60px var(--mainColor),
        0 0 80px var(--mainColor), 0 0 120px var(--mainColor);
    }
    10%,
    90% {
      text-shadow: unset;
    }
  }
`;
const BackTextBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 100px 30px 100px;
`;

const LogoFlicker = () => {
  return (
    <BackTextBox>
      <Text>M</Text>
      <Text>o</Text>
      <Text>t</Text>
      <Text>o</Text>
      <Text>r</Text>
      <Text>T</Text>
      <Text>r</Text>
      <Text>a</Text>
      <Text>c</Text>
      <Text>K</Text>
    </BackTextBox>
  );
};

export default LogoFlicker;
