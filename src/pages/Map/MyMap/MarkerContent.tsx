import React, { FC } from "react";
import styled from "styled-components/macro";
import { markerType } from "../../../types/mapType";

const Container = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.p`
  width: 100%;
  border: 1px solid #000;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
  color: #000;
  text-align: center;
`;
const Content = styled.p`
  margin-top: 5px;
  padding: 0 5px;
  width: 100%;
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
