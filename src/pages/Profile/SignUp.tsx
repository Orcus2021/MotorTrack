import React from "react";
import styled from "styled-components";

const LoginContainer = styled.div`
  width: 100%;
  height: calc(100vh -100px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SignUpWrapper = styled.div`
  border: 2px solid var(--mainColor);
  width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  width: 300px;
  outline: none;
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
  margin-bottom: 10px;
`;
const SubmitBtn = styled.button`
  border: none;
  background-color: var(--mainColor);
  padding: 5px;
  cursor: pointer;
`;

const SignUpTxt = styled.p`
  font-size: 8px;
`;
const SignUpSpan = styled.span`
  color: var(--mainColor);
  cursor: pointer;
`;

const SignUp: React.FC<{
  name: string;
  email: string;
  password: string;
  onSignUp: () => void;
  onInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowSignUP: () => void;
}> = (props) => {
  const { name, email, password, onSignUp, onInput, onShowSignUP } = props;
  return (
    <LoginContainer>
      <SignUpWrapper>
        <Input
          id="name"
          type="text"
          placeholder="姓名"
          value={name}
          onChange={onInput}
        />
        <Input
          id="email"
          type="text"
          placeholder="帳號"
          value={email}
          onChange={onInput}
        />
        <Input
          id="password"
          type="password"
          placeholder="密碼"
          value={password}
          onChange={onInput}
        />
        <SignUpTxt>
          已申請帳號<SignUpSpan onClick={onShowSignUP}>登入</SignUpSpan>
        </SignUpTxt>
        <SubmitBtn onClick={onSignUp}>註冊</SubmitBtn>
      </SignUpWrapper>
    </LoginContainer>
  );
};

export default SignUp;
