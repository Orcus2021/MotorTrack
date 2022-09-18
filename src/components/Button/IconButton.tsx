import React, { HTMLAttributes, FC } from "react";
import styled from "styled-components/macro";
import { Img } from "../style";

const CreateBx = styled.div`
  display: flex;
  padding: 2px 8px;
  background-color: rgb(236, 161, 0);
  margin-right: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 50px;
  cursor: pointer;
  transition: 0.5s;
  &:nth-child(2) {
    margin-right: 0px;
  }
  &:hover {
    box-shadow: 0px 0px 10px 2px rgba(236, 161, 0, 0.5);
    animation: btnScale linear 0.3s;
  }
  @keyframes btnScale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    80% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const CategoryText = styled.span`
  font-size: 16px;
`;
const IconBx = styled.div`
  position: relative;
  /* margin-top: 1px; */
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
