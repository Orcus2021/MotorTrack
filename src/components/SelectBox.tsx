import React, { HTMLAttributes, FC, ReactNode } from "react";
import styled from "styled-components/macro";
import { Img } from "./style";

const Container = styled.div<{
  $width: string;
  $isBorder: boolean | undefined;
}>`
  width: ${(props) => props.$width};
  /* padding: 6px 10px; */
  z-index: 2;
  border: ${(props) =>
    props.$isBorder ? "1px solid rgba(255, 255, 255, 0.25)" : "none"};
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  /* overflow: hidden; */
`;
const Name = styled.div<{ $isBorder: boolean }>`
  padding: ${(props) => (props.$isBorder ? " 6px 0 6px 10px" : "0px")};
  /* width: calc(100% - 28px); */

  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  @media screen and (max-width: 701px) {
    flex-grow: 1;
  }
`;
const DownBx = styled.div`
  height: 15px;
  width: 15px;
  position: relative;
  margin-right: 5px;
  cursor: pointer;
`;
const ContentBx = styled.div<{ $isShow: boolean }>`
  width: 100%;
  position: absolute;
  background-color: #fff;
  overflow: overlay;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }

  border-radius: 4px;
  top: calc(100% + 5px);
  left: 0;
  background-color: var(--thirdBack);

  /* overflow-y: scroll; */
  max-height: 0;
  max-height: ${(props) => props.$isShow && "250px"};
  transition: 0.5s;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  cursor: pointer;
`;

export interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  options: JSX.Element[];
  icon: string;
  showContent: boolean;
  onShow: () => void;
  width: string;
  border?: boolean;
}
const SelectBox: FC<Props> = ({
  children,
  options,
  icon,
  onShow,
  showContent,
  width,
  border = true,
}) => {
  return (
    <Container $width={width} $isBorder={border}>
      <Name $isBorder={border}>{children}</Name>
      <DownBx onClick={onShow}>
        <Img src={icon} />
      </DownBx>
      <ContentBx $isShow={showContent}>{options}</ContentBx>
    </Container>
  );
};

export default SelectBox;
