import React, { HTMLAttributes } from "react";
import styled from "styled-components/macro";
import Input from "./Input";

const ErrorMsg = styled.p`
  text-align: left;
  height: 10px;
  font-size: 10px;
  padding-left: 10px;
`;
const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
`;

export interface Props extends HTMLAttributes<HTMLDivElement> {
  message?: string | false;
  type: "text" | "number" | "date" | "password";
  name: string;
  content: string;
  error?: boolean;
  require?: object;
  readOnly?: boolean;
  value?: string | number;
  width?: number;
  calendarPosition?: "top" | "bottom";
}

const InputBox: React.FC<Props> = ({
  message,
  type,
  name,
  content,
  require,
  error,
  readOnly,
  value,
  width,
  calendarPosition,
}) => {
  return (
    <Container>
      <Input
        type={type}
        name={name}
        content={content}
        require={require}
        error={error}
        readOnly={readOnly}
        value={value}
        width={width}
        calendarPosition={calendarPosition}
      />
      <ErrorMsg>{message}</ErrorMsg>
    </Container>
  );
};

export default InputBox;
