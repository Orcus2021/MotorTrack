import React, { useEffect } from "react";
import { userActions } from "../../store/user/userReducer";
import { useAppDispatch, useAppSelector } from "../../store";
import Loading from "../../components/Loading/Loading";
import styled from "styled-components/macro";
import { useNavigate } from "react-router-dom";

import bikeImg from "../../assets/img/bike_blue_1.png";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 68px);
  background: linear-gradient(var(--mainBack), var(--secondBack));
  padding: 10px 100px 30px 100px;
  flex-direction: column;

  /* &::before {
    content: "MotorTrack";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16vw;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.25);
    text-shadow: 0 0 10px var(--lightColor), 0 0 20px var(--lightColor),
      0 0 40px var(--lightColor), 0 0 60px var(--lightColor),
      0 0 80px var(--lightColor), 0 0 120px var(--lightColor);
  } */
  @media screen and (max-width: 701px) {
    min-height: 500px;
    height: calc(100vh - 68px);
  }
`;
const Content = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* margin-top: 100px; */
  z-index: 1;
  @media screen and (max-width: 701px) {
    transform: translateY(-30px);
    /* min-width: 300px; */
  }
`;
const Title = styled.p`
  position: relative;
  font-size: 48px;
  font-weight: 500;
  letter-spacing: 5px;
  font-family: "Bebas Neue", sans-serif;
  @media screen and (max-width: 701px) {
    font-size: 36px;
    transform: translateY(-30px);
  }
`;
const Button = styled.button`
  border: none;
  color: #fff;
  padding: 8px 36px;
  /* margin-top: 10px; */
  border-radius: 50px;
  font-size: 16px;
  background-color: var(--mainColor);
  transition: 0.25s;
  transform: translateY(10px);
  cursor: pointer;
  &:hover {
    letter-spacing: 4px;
  }
  @media screen and (max-width: 701px) {
    font-size: 16px;
    padding: 8px 18px;
    transform: translateY(-30px);
  }
`;
const BackImg = styled.img`
  max-width: 80%;
  min-width: 600px;
  object-fit: contain;
  @media screen and (max-width: 701px) {
    max-width: 90%;
    min-width: 300px;
  }
`;
const BackTextBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 100px 30px 100px;
  /* background-color: red; */
`;
const Text = styled.span`
  font-size: 16vw;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.25);
  text-shadow: 0 0 10px var(--lightColor), 0 0 20px var(--lightColor),
    0 0 40px var(--lightColor), 0 0 60px var(--lightColor),
    0 0 80px var(--lightColor), 0 0 120px var(--lightColor);

  &:nth-child(1) {
    animation: spark 2.5s linear infinite 0s;
  }
  &:nth-child(1) {
    animation: spark 2.5s linear infinite 0s;
  }
  &:nth-child(2) {
    animation: spark 2.5s linear infinite 0.25s;
  }
  &:nth-child(3) {
    animation: spark 2.5s linear infinite 0.5s;
  }
  &:nth-child(4) {
    animation: spark 2.5s linear infinite 0.75s;
  }
  &:nth-child(5) {
    animation: spark 2.5s linear infinite 1s;
  }
  &:nth-child(6) {
    animation: spark 2.5s linear infinite 1.25s;
  }
  &:nth-child(7) {
    animation: spark 2.5s linear infinite 1.5s;
  }
  &:nth-child(8) {
    animation: spark 2.5s linear infinite 1.75s;
  }
  &:nth-child(9) {
    animation: spark 2.5s linear infinite 2s;
  }
  &:nth-child(10) {
    animation: spark 2.5s linear infinite 2.25s;
  }

  @keyframes spark {
    0%,
    100% {
      /* text-shadow: 0 0 10px var(--mainColor), 0 0 20px var(--mainColor),
        0 0 40px var(--mainColor), 0 0 60px var(--mainColor),
        0 0 80px var(--mainColor), 0 0 120px var(--mainColor); */
      text-shadow: 0 0 10px var(--lightColor), 0 0 20px var(--lightColor),
        0 0 40px var(--lightColor), 0 0 60px var(--lightColor),
        0 0 80px var(--lightColor), 0 0 120px var(--lightColor);
    }
    10%,
    90% {
      /* text-shadow: 0 0 10px var(--lightColor), 0 0 20px var(--lightColor),
        0 0 40px var(--lightColor), 0 0 60px var(--lightColor),
        0 0 80px var(--lightColor), 0 0 120px var(--lightColor); */
      text-shadow: unset;
    }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(userActions.loading(true));
    setTimeout(() => {
      dispatch(userActions.loading(false));
    }, 500);
  }, [dispatch]);

  const goLoginHandler = () => {
    navigate("/login");
  };

  return (
    <>
      {isLoading && <Loading />}
      <Container>
        <BackTextBox>
          <Text>M</Text>
          <Text>o</Text>
          <Text>t</Text>
          <Text>o</Text>
          <Text>r</Text>
          <Text>T</Text>
          <Text>r</Text>
          <Text>a</Text>
          <Text>c</Text>
          <Text>K</Text>
        </BackTextBox>
        <Content>
          <Title>READY TO TRACK</Title>
          <Button onClick={goLoginHandler}>開始記錄</Button>
          <BackImg src={bikeImg} />
        </Content>
      </Container>
    </>
  );
};

export default Home;
