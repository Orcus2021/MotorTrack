import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import asyncUserAction from "../../store/user/asyncUserAction";
import { useAppDispatch, useAppSelector } from "../../store/index";
import styled from "styled-components";
import SignUp from "./SignUp";
import Loading from "../../components/Loading/Loading";

const LoginContainer = styled.div`
  margin-top: 68px;
  width: 100%;
  height: calc(100vh -68px);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LoginWrapper = styled.div`
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

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (user.isAuth && !name) {
  //     navigate("/status");
  //   }
  // }, [user.isAuth, navigate, name]);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "name") {
      setName(e.target.value);
    } else if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };

  const showSingUp = () => {
    setIsSignUp((pre) => !pre);
  };

  const signUp = async () => {
    const user = {
      email,
      password,
      name,
    };
    await dispatch(asyncUserAction.signUp(user));
    navigate("/profile");
  };
  const signIn = async () => {
    const user = {
      email,
      password,
    };
    await dispatch(asyncUserAction.signIn(user));
    navigate("/status", { state: "first" });
  };

  return (
    <>
      {isLoading && <Loading />}
      {!isSignUp && (
        <LoginContainer>
          <LoginWrapper>
            <Input
              id="email"
              type="text"
              placeholder="帳號"
              value={email}
              onChange={inputHandler}
            />
            <Input
              id="password"
              type="password"
              placeholder="密碼"
              value={password}
              onChange={inputHandler}
            />
            <SignUpTxt>
              尚未註冊請點擊<SignUpSpan onClick={showSingUp}>註冊</SignUpSpan>
            </SignUpTxt>
            <SubmitBtn onClick={signIn}>登入</SubmitBtn>
          </LoginWrapper>
        </LoginContainer>
      )}
      {isSignUp && (
        <SignUp
          name={name}
          email={email}
          password={password}
          onInput={inputHandler}
          onSignUp={signUp}
          onShowSignUP={showSingUp}
        />
      )}
    </>
  );
};

export default Login;
