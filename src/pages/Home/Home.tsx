import { useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import HomeLoading from "../../components/Loading/HomeLoading";

import bikeImg from "../../assets/img/bike_blue_1.png";
import { useAppSelector } from "../../store";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 68px);
  background: linear-gradient(var(--mainBack), var(--secondBack));
  padding: 10px 100px 30px 100px;
  flex-direction: column;

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
  transform-style: preserve-3d;
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
`;
const Text = styled.span`
  font-size: 16vw;
  font-weight: 700;
  font-family: "Kanit", sans-serif;
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
      text-shadow: 0 0 10px var(--lightColor), 0 0 20px var(--lightColor),
        0 0 40px var(--lightColor), 0 0 60px var(--lightColor),
        0 0 80px var(--lightColor), 0 0 120px var(--lightColor);
    }
    10%,
    90% {
      text-shadow: unset;
    }
  }
`;

const title = "MotorTrack";

const Home = () => {
  const navigate = useNavigate();
  const home = useRef<HTMLDivElement>(null);
  const isAuth = useAppSelector((statue) => statue.user.isAuth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHomePage, setShowHomePage] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 4200);
    setTimeout(() => {
      setShowHomePage(true);
    }, 500);
  }, []);

  const goLoginHandler = () => {
    if (isAuth) {
      navigate("/car_manage/record");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {isLoading && <HomeLoading />}
      {showHomePage && (
        <Container ref={home}>
          <BackTextBox>
            {title.split("").map((letter, index) => (
              <Text key={index}>{letter}</Text>
            ))}
          </BackTextBox>
          <Content>
            <Title>READY TO TRACK</Title>
            <Button onClick={goLoginHandler}>????????????</Button>
            <BackImg src={bikeImg} />
          </Content>
        </Container>
      )}
    </>
  );
};

export default Home;
