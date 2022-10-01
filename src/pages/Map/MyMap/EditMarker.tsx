import React, { FC, useState } from "react";
import styled from "styled-components/macro";
import { markerType, markerContentType } from "../../../types/mapType";
import InfoContent from "./InfoContent";

import markerIcon from "../../../assets/icon/marker.png";
import editIcon from "../../../assets/icon/add-record.png";
import trashIcon from "../../../assets/icon/trash.png";

const EditWrapper = styled.div`
  position: absolute;
  background-color: var(--secondBack);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 10px;
  top: 10px;
  left: 10px;
`;
const MarkerTitle = styled.p`
  font-size: 16px;
  text-align: center;
`;
const MarkerItemWrapper = styled.div`
  overflow: overlay;
`;
const MarkerItemBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const MarkerItemOrder = styled.p`
  font-size: 14px;
  margin-right: 5px;
`;

const MarkerItemImg = styled.img`
  height: 14px;
  width: 14px;
  object-fit: cover;
  margin-right: 5px;
`;
const MarkerItemName = styled.p`
  font-size: 14px;
`;
const MarkerEditWrapper = styled.div`
  position: absolute;
  /* background-color: var(--secondBack); */
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 200px; */
  padding: 10px;
  top: 10px;
  left: 220px;
`;
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
`;
const Input = styled.input`
  width: 100px;
  font-size: 14px;
  outline: none;
  border: 1px solid var(--mainBack);
  border-radius: 8px;
  padding: 0 5px;
`;

type Prop = {
  password: string | undefined;
  setPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  markers: markerType[];
  onSubmitMarker: (index: number | null, content: markerType) => void;
  onRemove: (id: string) => void;
  onSelectMarker: (id: string) => void;
  onClear: () => void;
};

const EditMarker: FC<Prop> = (props) => {
  const {
    password,
    markers,
    onSubmitMarker,
    onRemove,
    onSelectMarker,
    isEdit,
    setPassword,
  } = props;
  const [showEditBox, setShowEditBox] = useState<boolean>(false);
  const [selectMarkerIndex, setSelectMarkerIndex] =
    useState<number | null>(null);
  const showEditBoxHandler = (index: number) => {
    setShowEditBox(true);
    setSelectMarkerIndex(index);
  };
  const closeEditBoxHandler = () => {
    setShowEditBox(false);
  };

  return (
    <>
      <EditWrapper>
        <MarkerTitle>{isEdit ? "編輯" : "標記"}</MarkerTitle>
        {isEdit && (
          <InputWrapper>
            <InputLabel>密碼 :</InputLabel>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={setPassword}
            />
          </InputWrapper>
        )}

        <MarkerItemWrapper>
          {markers.map((marker, index) => (
            <MarkerItemBox onClick={() => onSelectMarker(marker.id)}>
              <MarkerItemOrder>{marker.order}.</MarkerItemOrder>
              <MarkerItemImg src={markerIcon} />
              <MarkerItemName>{marker.title}</MarkerItemName>
              {isEdit && (
                <>
                  <MarkerItemImg
                    src={trashIcon}
                    onClick={() => onRemove(marker.id)}
                  />
                  <MarkerItemImg
                    src={editIcon}
                    onClick={() => showEditBoxHandler(index)}
                  />
                </>
              )}
            </MarkerItemBox>
          ))}
        </MarkerItemWrapper>
      </EditWrapper>
      {showEditBox && selectMarkerIndex !== null && (
        <MarkerEditWrapper>
          <InfoContent
            markerIndex={selectMarkerIndex}
            marker={markers[selectMarkerIndex]}
            onSubmitMarker={onSubmitMarker}
            onClear={closeEditBoxHandler}
          />
        </MarkerEditWrapper>
      )}
    </>
  );
};

export default EditMarker;
