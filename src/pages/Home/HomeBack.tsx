import React from "react";
import styled from "styled-components/macro";

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
  /* text-shadow: 0 0 10px var(--lightColor), 0 0 20px var(--lightColor),
    0 0 40px var(--lightColor), 0 0 60px var(--lightColor),
    0 0 80px var(--lightColor), 0 0 120px var(--lightColor); */
  text-shadow: 0 0 10px #82a0d3, 0 0 20px #82a0d3, 0 0 40px #82a0d3,
    0 0 60px #82a0d3, 0 0 80px #82a0d3;

  font-family: "Kanit", sans-serif;

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

const HomeBack = () => {
  return (
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
  );
};

export default HomeBack;
