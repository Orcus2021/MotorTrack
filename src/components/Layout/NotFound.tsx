import React from "react";
import styled from "styled-components/macro";
import { useNavigate } from "react-router-dom";

const NotFoundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(#16181d, #282c34);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.p`
  letter-spacing: 10px;
  margin: 0;
  font-size: 10vw;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
  color: #e1e0e0;
  transform: scale(2);
  animation: textFlash 0.5s linear infinite;
  @keyframes textFlash {
    0%,
    100% {
      text-shadow: -1.5px -1.5px 0 #0ff, 1.5px 1.5px #f00;
    }
    25% {
      text-shadow: 1.5px 1.5px 0 #0ff, -1.5px -1.5px #f00;
    }
    50% {
      text-shadow: 1.5px -1.5px 0 #0ff, -1.5px 1.5px #f00;
    }
    75% {
      text-shadow: -1.5px 1.5px 0 #0ff, 1.5px -1.5px #f00;
    }
  }
`;

const Button = styled.div`
  font-size: 16px;
  background-color: #4581ea;
  font-family: "Noto Sans TC", "Poppins", "sans-serif";
  color: #e1e0e0;
  border-radius: 20px;
  padding: 5px 20px;

  cursor: pointer;
  &:hover {
    background-color: #2b6fe6;
  }
`;

const SubTitle = styled.p`
  margin: 0;
  padding: 0;
  font-size: 10vw;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
  color: #e1e0e0;
`;

const NotFound = () => {
  const navigate = useNavigate();
  const navHomeHandler = () => {
    navigate("/");
  };
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <SubTitle>Not Found</SubTitle>
      <Button onClick={navHomeHandler}>返回首頁</Button>
    </NotFoundContainer>
  );
};

export default NotFound;
