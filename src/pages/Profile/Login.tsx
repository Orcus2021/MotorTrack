import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import backImg from "../../assets/img/back-view2.jpg";
import Button from "../../components/Button/Button";
import InputBox from "../../components/Input/InputBox";
import Card from "../../components/Layout/Card";
import Loading from "../../components/Loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store/index";
import asyncUserAction from "../../store/user/asyncUserAction";
import { userActions } from "../../store/user/userReducer";

const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const BackImg = styled.img`
  position: absolute;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  filter: brightness(0.7);
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
  font-size: 14px;
  margin-bottom: 15px;
`;
const SignUpSpan = styled.span`
  font-size: 14px;
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
  overflow: ${(props) => (props.$isShow ? "unset" : "hidden")};
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
  const [closeLoading, setCloseLoading] = useState<boolean>(false);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fromPage = useLocation().state;

  const methods = useForm<userInfo>({ mode: "onBlur" });
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  useEffect(() => {
    reset({
      email: "eee@test.com",
      password: "1qaz2wsx",
    });
  }, [reset]);

  const showSingUpHandler = () => {
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
    } else if (!isSignUp && isAuth && fromPage === "/status") {
      navigate("/status", { state: "first" });
    } else if (!isSignUp && isAuth && fromPage) {
      navigate(fromPage);
    } else if (!isSignUp && isAuth) {
      navigate("/status", { state: "first" });
    }
  }, [isSignUp, isAuth, navigate, fromPage]);

  useEffect(() => {
    if (isLoading && !closeLoading) {
      setTimeout(() => {
        dispatch(userActions.loading(false));
      }, 1000);
    }
  }, [isLoading, dispatch, closeLoading]);

  const signIn = async (user: userInfo) => {
    setCloseLoading(true);
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
          <BackImg src={backImg} />
          <Card width={300} boxShadow={true}>
            <SignInWrapper>
              <Title>{isSignUp ? "??????" : "??????"}</Title>
              <NameBox $isShow={signUpEffect}>
                {isSignUp && (
                  <InputBox
                    message={
                      errors?.name?.type === "required"
                        ? "??????????????????"
                        : errors?.name?.type === "maxLength"
                        ? "????????????20??????"
                        : ""
                    }
                    type="text"
                    name="name"
                    content="??????"
                    error={typeof errors?.name?.type === "string"}
                    require={{
                      required: true,
                      maxLength: 20,
                      onBlur: (e: { target: { value: string } }) => {
                        setValue("name", e.target.value.trim());
                      },
                    }}
                  />
                )}
              </NameBox>
              <InputBox
                message={
                  errors?.email?.type === "required"
                    ? "??????????????????"
                    : errors?.email?.type === "pattern"
                    ? "??????????????????"
                    : ""
                }
                type="text"
                name="email"
                content="??????"
                error={typeof errors?.email?.type === "string"}
                require={{
                  required: true,
                  pattern:
                    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                  onBlur: (e: { target: { value: string } }) => {
                    setValue("email", e.target.value.trim());
                  },
                }}
              />
              <InputBox
                message={
                  errors?.password?.type === "required"
                    ? "??????????????????"
                    : errors?.password?.type === "minLength"
                    ? "??????????????????"
                    : "??????6??????"
                }
                type="password"
                name="password"
                content="??????"
                error={typeof errors?.password?.type === "string"}
                require={{
                  required: true,
                  minLength: 6,
                  onBlur: (e: { target: { value: string } }) => {
                    setValue("password", e.target.value.trim());
                  },
                }}
              />

              <SignUpTxt>
                {isSignUp ? "????????????????????????" : "??????????"}
                <SignUpSpan onClick={showSingUpHandler}>
                  {isSignUp ? "??????" : "??????"}
                </SignUpSpan>
              </SignUpTxt>
              <BtnBox>
                <Button
                  label="??????"
                  type="cancel"
                  handleClick={goHomePageHandler}
                />
                <Button
                  label={isSignUp ? "??????" : "??????"}
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
