import React from "react";
import styled from "styled-components/macro";
import LogoFlicker from "./LogoFlicker";

const Back = styled.div`
  position: fixed;
  z-index: 200;
  top: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(var(--mainBack), var(--secondBack));
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 701px) {
    min-height: 500px;
  }
`;

const Loading = () => {
  return (
    <Back>
      <LogoFlicker />
    </Back>
  );
};

export default Loading;
