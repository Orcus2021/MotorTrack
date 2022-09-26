import React from "react";
import styled from "styled-components/macro";

const Wheel = styled.div`
  animation: spin 1s infinite linear;
  border: 2px solid rgba(30, 30, 30, 0.5);
  border-left: 2px solid #fff;
  border-top: 2px solid #fff;
  border-right: 2px solid #fff;
  border-radius: 50%;
  height: 100%;
  margin-bottom: 10px;
  width: 100%;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const Circle = () => {
  return <Wheel />;
};

export default Circle;
