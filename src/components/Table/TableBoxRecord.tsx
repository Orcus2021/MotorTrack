import React, { FC, HTMLAttributes, ReactNode } from "react";
import styled from "styled-components/macro";

const TitleBx = styled.div`
  width: 100%;
  display: none;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  background-color: var(--deepColor);
  @media screen and (max-width: 701px) {
    display: flex;
  }
`;
const SubTitle = styled.th<{ $width: string }>`
  ${(props) => {
    if (props.$width === "auto") {
      return "flex-grow:1;";
    } else {
      return `width:${props.$width};`;
    }
  }}
  font-weight: 500;
  font-size: 16px;
  height: 25px;
  text-align: center;
`;
const SubTitleBox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TableBx = styled.div`
  display: none;
  min-height: 112px;
  max-height: calc(100vh - 285px);
  background: rgba(1, 0, 44, 0.2);
  backdrop-filter: blur(5px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  /* overflow-y: scroll; */
  overflow: overlay;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  &::-webkit-scrollbar {
    width: 7px;
    position: fixed;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(136, 136, 136, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
  border-radius: 0 0 8px 8px;

  @media screen and (max-width: 701px) {
    display: flex;
  }
`;
type titleType = {
  title: string;
  width: string;
};

export interface Props extends HTMLAttributes<HTMLDivElement> {
  titles: titleType[];
  children: ReactNode;
}

const TableBox: FC<Props> = ({ titles, children }) => {
  return (
    <>
      <TitleBx>
        <SubTitle key={titles[0].title} $width={titles[0].width}>
          {titles[0].title}
        </SubTitle>
        <SubTitleBox>
          <SubTitle key={titles[1].title} $width={titles[1].width}>
            {titles[1].title}
          </SubTitle>
          <SubTitle key={titles[2].title} $width={titles[2].width}>
            {titles[2].title}
          </SubTitle>
        </SubTitleBox>
        <SubTitle key={titles[3].title} $width={titles[3].width}>
          {titles[3].title}
        </SubTitle>
        <SubTitle key={titles[4].title} $width={titles[4].width}>
          {titles[4].title}
        </SubTitle>
      </TitleBx>
      <TableBx>{children}</TableBx>
    </>
  );
};

export default TableBox;
