import React, { FC, useEffect, useState } from "react";
import styled from "styled-components/macro";
import uuid from "react-uuid";
import { markerContentType, markerType } from "../../../types/mapType";

const Container = styled.div``;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  justify-content: flex-end;
`;
const InputLabel = styled.label`
  width: 40px;
  font-size: 14px;
  color: #000;
`;
const Input = styled.input`
  width: 100px;
  font-size: 14px;
  outline: none;
  border: 1px solid var(--mainBack);
  border-radius: 8px;
  padding: 0 5px;
`;
const Textarea = styled.textarea`
  resize: none;
  width: 100px;
  height: 50px;
  font-size: 14px;
  outline: none;
  border: 1px solid var(--mainBack);
  border-radius: 8px;
  padding: 0 5px;
`;
const Button = styled.div`
  width: 20px;
  height: 20px;
  color: #000;
`;
type PropType = {
  onSubmitMarker: (index: number | null, content: markerType) => void;
  onClear: () => void;
  marker: null | markerType;
  markerIndex: number | null;
};

const InfoContent: FC<PropType> = (props) => {
  const { onSubmitMarker, onClear, marker, markerIndex } = props;

  const [markerContent, setMarkerContent] = useState<markerContentType>({
    title: "",
    order: 0,
    content: "",
  });
  useEffect(() => {
    if (marker) {
      const initMarker = {
        title: marker.title,
        order: marker.order,
        content: marker.content,
      };
      setMarkerContent(initMarker);
    }
  }, [marker]);

  const contentHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.name === "title") {
      setMarkerContent((pre) => {
        const newContent = { ...pre };
        newContent.title = e.target.value;
        return newContent;
      });
    } else if (e.target.name === "order") {
      setMarkerContent((pre) => {
        const newContent = { ...pre };
        newContent.order = Number(e.target.value);
        return newContent;
      });
    } else if (e.target.name === "content") {
      setMarkerContent((pre) => {
        const newContent = { ...pre };
        newContent.content = e.target.value;
        return newContent;
      });
    }
  };
  const submitHandler = () => {
    if (marker) {
      const newMarker = { ...marker, ...markerContent };

      onSubmitMarker(markerIndex, newMarker);
      onClear();
    } else {
      const marker = {
        ...markerContent,
        position: { lat: 0, lng: 0 },
        id: uuid(),
      };
      onSubmitMarker(null, marker);
    }
  };

  return (
    <Container>
      <InputWrapper>
        <InputLabel>標題 :</InputLabel>
        <Input
          type="text"
          name="title"
          value={markerContent.title}
          onChange={contentHandler}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>排序 :</InputLabel>
        <Input
          type="number"
          name="order"
          onFocus={() => {
            setMarkerContent((pre) => {
              const newContent = { ...pre };
              newContent.order = NaN;
              return newContent;
            });
          }}
          value={markerContent.order}
          onChange={contentHandler}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel>內容 :</InputLabel>
        <Textarea
          name="content"
          value={markerContent.content}
          onChange={contentHandler}
        />
      </InputWrapper>
      <InputWrapper>
        <Button onClick={onClear}>X</Button>
        <Button onClick={submitHandler}>V</Button>
      </InputWrapper>
    </Container>
  );
};

export default InfoContent;
