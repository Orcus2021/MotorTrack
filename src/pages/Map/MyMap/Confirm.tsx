import React, { FC, useState } from "react";
import styled from "styled-components/macro";
import Button from "../../../components/Button/Button";
import { createMessage } from "../../../utils/calcFunc";
import { useAppDispatch } from "../../../store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  width: 200px;
  font-size: 14px;
  padding: 5px 5px;
  outline: none;
  border-radius: 8px;
  border: 2px solid #fff;
  color: #fff;
  background-color: transparent;
  margin: 20px;
  &:focus {
    border-color: #66afe9;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(102, 175, 233, 0.6);
  }
`;
type Props = {
  password: string;
  onClose: () => void;
};

const Confirm: FC<Props> = (props) => {
  const { password, onClose } = props;
  const [selfPassword, setSelfPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const passwordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelfPassword(e.target.value);
  };
  const checkHandler = () => {
    if (selfPassword === password) {
      onClose();
    } else {
      createMessage("error", dispatch, "密碼錯誤");
    }
  };
  return (
    <Container>
      <Input type="text" placeholder="請輸入密碼" onChange={passwordHandler} />
      <Button label="確認" type="primary" handleClick={checkHandler} />
    </Container>
  );
};

export default Confirm;
