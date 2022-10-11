import React, { HTMLAttributes } from "react";
import styled from "styled-components/macro";
import { Img } from "../style";

import logoIcon from "../../assets/logo_white.png";
type styleType = {
  width: number;
  height: number | string;
};
const RemindContainer = styled.div<{ $style: styleType }>`
  width: ${(props) => props.$style.width}px;
  height: ${(props) => props.$style.height}px;
  padding: 10px;
  background-color: var(--thirdBack);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  @media screen and (max-width: 701px) {
    width: 100%;
  }
`;

const LogoBox = styled.div`
  position: relative;
  width: 170px;
  height: 48px;
`;

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  setStyle: styleType;
}

const Remind: React.FC<Props> = ({ setStyle, children }) => {
  return (
    <RemindContainer $style={setStyle}>
      <LogoBox>
        <Img src={logoIcon} />
      </LogoBox>
      {children}
    </RemindContainer>
  );
};

export default Remind;
