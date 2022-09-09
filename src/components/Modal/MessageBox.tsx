import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { Img } from "../style";

import logoIcon from "../../assets/logo_white.png";
type styleType = {
  width: number;
  height: number;
};
const RemindContainer = styled.div<{ $style: styleType }>`
  width: ${(props) => props.$style.width}px;
  height: ${(props) => props.$style.height}px;
  padding: 10px;
  background-color: var(--thirdBack);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
`;

const LogoBx = styled.div`
  position: relative;
  width: 170px;
  height: 48px;
`;

const Remind: React.FC<{ children?: React.ReactNode; setStyle: styleType }> = (
  props
) => {
  const { setStyle } = props;
  return (
    <RemindContainer $style={setStyle}>
      <LogoBx>
        <Img src={logoIcon} />
      </LogoBx>
      {props.children}
    </RemindContainer>
  );
};

export default Remind;
