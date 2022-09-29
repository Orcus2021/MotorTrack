import React from "react";
import styled from "styled-components/macro";

const Container = styled.div`
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
  font-size: 20vw;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
  color: #e1e0e0;
  animation: textFlash 0.5s linear infinite;
  @keyframes textFlash {
    0%,
    100% {
      text-shadow: -3px -3px 0 #0ff, 3px 3px #f00;
    }
    25% {
      text-shadow: 3px 3px 0 #0ff, -3px -3px #f00;
    }
    50% {
      text-shadow: 3px -3px 0 #0ff, -3px 3px #f00;
    }
    75% {
      text-shadow: -3px 3px 0 #0ff, 3px -3px #f00;
    }
  }
`;
const SubTitle = styled.p`
  margin: 0;
  font-size: 10vw;
  font-weight: 600;
  font-family: "Kanit", sans-serif;
  color: #e1e0e0;
`;

const NotFound = () => {
  return (
    <Container>
      <Title>404</Title>
      <SubTitle>Not Found</SubTitle>
    </Container>
  );
};

export default NotFound;
