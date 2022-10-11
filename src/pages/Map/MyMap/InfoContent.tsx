import React, { FC, useEffect, useState } from "react";
import uuid from "react-uuid";
import styled from "styled-components/macro";
import { markerContentType, markerType } from "../../../types/mapType";

import doneIcon from "../../../assets/icon/done.png";
import cancelWhiteIcon from "../../../assets/icon/multiply.png";

const Container = styled.div<{ $from: boolean }>`
  background-color: ${(props) => (props.$from ? "var(--secondBack)" : "#fff")};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InputWrapper = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  justify-content: flex-end;
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;
const InputLabel = styled.label<{ $from: boolean }>`
  width: 40px;
  height: 22px;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => (props.$from ? "#fff" : "#000")};
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const TextLabel = styled.label<{ $from: boolean }>`
  width: 40px;
  height: 22px;
  font-size: 14px;
  line-height: 22px;
  color: ${(props) => (props.$from ? "#fff" : "#000")};
  display: flex;
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
`;
const Input = styled.input<{ $from: boolean }>`
  width: 160px;
  font-size: 14px;
  outline: none;
  color: ${(props) => (props.$from ? "#fff" : "#000")};
  border: 1px solid ${(props) => (props.$from ? "#fff" : "var(--mainBack)")};
  border-radius: 8px;
  padding: 0 5px;
  background-color: transparent;
`;
const Textarea = styled.textarea<{ $from: boolean }>`
  resize: none;
  width: 160px;
  height: 50px;
  font-size: 14px;
  outline: none;
  color: ${(props) => (props.$from ? "#fff" : "#000")};
  border: 1px solid ${(props) => (props.$from ? "#fff" : "var(--mainBack)")};
  border-radius: 8px;
  padding: 0 5px;
  background-color: transparent;
`;

const Img = styled.img<{ $from: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 2px;
  margin-left: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) =>
      props.$from ? "var(--thirdBack)" : "#a3a3a3"};
  }
`;

const Title = styled.p<{ $from: boolean }>`
  font-size: 16px;
  width: 100%;
  color: ${(props) => (props.$from ? "#fff" : "var(--secondBack)")};
  text-align: center;
  margin-bottom: 5px;
`;

type Props = {
  onSubmitMarker: (index: number | null, content: markerType) => void;
  onClear: () => void;
  marker: null | markerType;
  markerIndex: number | null;
  from: string;
};

const InfoContent: FC<Props> = (props) => {
  const { onSubmitMarker, onClear, marker, markerIndex, from } = props;

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
    <Container $from={from === "editMarker"}>
      <Title $from={from === "editMarker"}>編輯</Title>
      <InputWrapper>
        <InputLabel $from={from === "editMarker"}>標題</InputLabel>
        <Input
          $from={from === "editMarker"}
          type="text"
          name="title"
          value={markerContent.title}
          onChange={contentHandler}
        />
      </InputWrapper>
      <InputWrapper>
        <InputLabel $from={from === "editMarker"}>排序</InputLabel>
        <Input
          $from={from === "editMarker"}
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
        <TextLabel $from={from === "editMarker"}>內容</TextLabel>
        <Textarea
          $from={from === "editMarker"}
          name="content"
          value={markerContent.content}
          onChange={contentHandler}
        />
      </InputWrapper>
      <ButtonWrapper>
        <Img
          onClick={onClear}
          src={cancelWhiteIcon}
          $from={from === "editMarker"}
        />
        <Img
          onClick={submitHandler}
          src={doneIcon}
          $from={from === "editMarker"}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default InfoContent;
