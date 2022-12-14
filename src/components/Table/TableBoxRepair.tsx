import { FC, HTMLAttributes, ReactNode } from "react";
import styled from "styled-components/macro";

const TitleBox = styled.div`
  width: 100%;
  display: none;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  background-color: var(--deepColor);
  @media screen and (max-width: 801px) {
    display: flex;
  }
`;
const SubTitle = styled.div<{ $width: string }>`
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

const ContentBox = styled.div`
  min-height: 112px;
  display: none;
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
  @media screen and (max-width: 801px) {
    display: block;
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
      <TitleBox>
        {titles.map((title) => (
          <SubTitle key={title.title} $width={title.width}>
            {title.title}
          </SubTitle>
        ))}
      </TitleBox>
      <ContentBox>{children}</ContentBox>
    </>
  );
};

export default TableBox;
