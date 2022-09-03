import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;
`;
const LeftWrapper = styled.div`
  width: calc((100% -20px) / 2);
`;
const RightWrapper = styled.div`
  width: calc((100% -20px) / 2);
`;

const Chart = () => {
  return (
    <Container>
      <LeftWrapper>Left</LeftWrapper>
      <RightWrapper>Right</RightWrapper>
    </Container>
  );
};

export default Chart;
