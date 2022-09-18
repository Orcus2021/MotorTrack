import React, { HTMLAttributes, FC } from "react";
import styled from "styled-components/macro";
import Button, { Props as buttonType } from "./Button";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export interface Props extends HTMLAttributes<HTMLButtonElement> {
  buttons: buttonType[];
}
const ButtonBox: FC<Props> = ({ buttons }) => {
  return (
    <Container>
      {buttons.map((button) => (
        <Button
          label={button.label}
          type={button.type}
          handleClick={button.handleClick}
        />
      ))}
    </Container>
  );
};

export default ButtonBox;
