import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import InputBox from "../../components/Input/InputBox";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import asyncUserAction from "../../store/user/asyncUserAction";
import { useAppDispatch, useAppSelector } from "../../store/index";
import styled from "styled-components";
import Loading from "../../components/Loading/Loading";
import { useForm, FormProvider } from "react-hook-form";
import backImg from "../../assets/img/back-view2.jpg";

const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  background-image: url(${backImg});
  background-size: cover;
  background-position: center center;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SignInWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.p`
  font-weight: 600;
  font-size: 22px;
  margin-top: 5px;
  letter-spacing: 2px;
  margin-bottom: 25px;
`;

const SignUpTxt = styled.p`
  font-size: 12px;
  margin-bottom: 15px;
`;
const SignUpSpan = styled.span`
  color: var(--mainColor);
  cursor: pointer;
`;
const BtnBox = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`;
const NameBox = styled.div<{ $isShow: boolean }>`
  position: relative;
  max-height: ${(props) => (props.$isShow ? "63px" : "0")};
  width: 100%;
  overflow: hidden;
  transition: 0.5s;
`;

type userInfo = {
  email: string;
  password: string;
  name?: string;
};

const Login = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [signUpEffect, setSignEffect] = useState<boolean>(false);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const methods = useForm<userInfo>({ mode: "onBlur" });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;

  const showSingUp = () => {
    if (isSignUp) {
      setTimeout(() => {
        setIsSignUp((pre) => !pre);
      }, 600);
    } else {
      setIsSignUp((pre) => !pre);
    }
    setSignEffect((pre) => !pre);
    reset();
    setValue("name", "");
    setValue("email", "");
    setValue("password", "");
  };

  useEffect(() => {
    if (isSignUp && isAuth) {
      navigate("/profile");
    } else if (!isSignUp && isAuth) {
      navigate("/status", { state: "first" });
    }
  }, [isSignUp, isAuth, navigate]);

  const signIn = async (user: userInfo) => {
    if (user.name) {
      await dispatch(asyncUserAction.signUp(user));
    } else {
      await dispatch(asyncUserAction.signIn(user));
    }
  };
  const goHomePageHandler = () => {
    navigate("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 || e.key === "Enter") {
      handleSubmit(signIn)();
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <FormProvider {...methods}>
        <LoginContainer onKeyDown={handleKeyDown}>
          <Card width={300} boxShadow={true}>
            <SignInWrapper>
              <Title>{isSignUp ? "註冊" : "登入"}</Title>

              <NameBox $isShow={signUpEffect}>
                {isSignUp && (
                  <InputBox
                    message={errors?.password && "尚未填寫姓名"}
                    type="text"
                    name="name"
                    content="姓名"
                    error={typeof errors?.name?.type === "string"}
                    require={{ required: true }}
                  />
                )}
              </NameBox>
              <InputBox
                message={
                  errors?.email?.type === "required"
                    ? "尚未填寫信箱"
                    : errors?.email?.type === "pattern"
                    ? "信箱格式錯誤"
                    : ""
                }
                type="text"
                name="email"
                content="信箱"
                error={typeof errors?.email?.type === "string"}
                require={{
                  required: true,
                  pattern:
                    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                }}
              />
              <InputBox
                message={
                  errors?.password?.type === "required"
                    ? "尚未填寫密碼"
                    : errors?.password?.type === "minLength"
                    ? "密碼長度不足"
                    : "最少6字元"
                }
                type="password"
                name="password"
                content="密碼"
                error={typeof errors?.password?.type === "string"}
                require={{ required: true, minLength: 6 }}
              />

              <SignUpTxt>
                {isSignUp ? "已經有帳號了嗎？" : "新朋友?"}
                <SignUpSpan onClick={showSingUp}>
                  {isSignUp ? "登入" : "註冊"}
                </SignUpSpan>
              </SignUpTxt>
              <BtnBox>
                <Button
                  label="返回"
                  type="cancel"
                  handleClick={goHomePageHandler}
                />
                <Button
                  label={isSignUp ? "註冊" : "登入"}
                  type="primary"
                  handleClick={handleSubmit(signIn)}
                />
              </BtnBox>
            </SignInWrapper>
          </Card>
        </LoginContainer>
      </FormProvider>
    </>
  );
};

export default Login;
