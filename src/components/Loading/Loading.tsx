import React from "react";
import styled from "styled-components/macro";
import Motor from "./Motor";

const Back = styled.div`
  position: fixed;
  z-index: 200;
  top: 68px;
  width: 100%;
  height: calc(100vh - 68px);
  background-color: #16181dcf;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Loading = () => {
  return (
    <Back>
      <Motor />
    </Back>
  );
};

export default Loading;
