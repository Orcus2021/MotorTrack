import React, { HTMLAttributes, FC } from "react";
import styled from "styled-components/macro";
import { Img } from "../style";

const CreateBx = styled.div`
  display: flex;
  padding: 2px 8px;
  background-color: #eca100;
  margin-right: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 50px;
  cursor: pointer;
  &:nth-child(2) {
    margin-right: 0px;
  }
`;

const CategoryText = styled.span`
  font-size: 16px;
`;
const IconBx = styled.div`
  position: relative;
  margin-top: 1px;
  width: 16px;
  height: 16px;
`;

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  icon: string;
  handleClick: () => void;
  label: string;
}

const IconButton: FC<Props> = ({ label, icon, handleClick }) => {
  return (
    <CreateBx onClick={handleClick}>
      <CategoryText>{label}</CategoryText>
      <IconBx>
        <Img src={icon} />
      </IconBx>
    </CreateBx>
  );
};

export default IconButton;
