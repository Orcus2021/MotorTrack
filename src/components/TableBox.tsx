import React, { FC, HTMLAttributes, ReactNode } from "react";
import styled from "styled-components/macro";

const TitleBx = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
`;
const SubTitle = styled.th<{ $width: string }>`
  background-color: var(--deepColor);
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
  /* &:nth-child(1) {
    width: 50px;
  }
  &:nth-child(2) {
    width: 100px;
  }
  &:nth-child(3) {
    width: 120px;
  }
  &:nth-child(4) {
    flex-grow: 1;
  }
  &:nth-child(5) {
    width: 50px;
  }
  &:nth-child(6) {
    width: 150px;

    border-radius: 0 4px 0 0;
  } */
`;
const TableBx = styled.div`
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
        {titles.map((title) => (
          <SubTitle $width={title.width}>{title.title}</SubTitle>
        ))}
      </TitleBx>
      <TableBx>{children}</TableBx>
    </>
  );
};

export default TableBox;
