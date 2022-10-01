import React, { FC } from "react";
import styled from "styled-components/macro";
import { markerType } from "../../../types/mapType";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.p`
  font-size: 16px;
  color: #000;
  text-align: center;
`;
const Content = styled.p`
  font-size: 14px;
  color: #000;
`;
type PropType = {
  marker: markerType;
};

const MarkerContent: FC<PropType> = (props) => {
  const { marker } = props;
  return (
    <Container>
      <Title>{marker.title}</Title>
      <Content>{marker.content}</Content>
    </Container>
  );
};

export default MarkerContent;
