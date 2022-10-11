import React, { FC, useState } from "react";
import styled from "styled-components/macro";
import { markerType } from "../../../types/mapType";
import InfoContent from "./InfoContent";

import editIcon from "../../../assets/icon/add-record.png";
import markerIcon from "../../../assets/icon/marker.png";
import trashIcon from "../../../assets/icon/trash.png";

const EditWrapper = styled.div<{ $isShow: boolean }>`
  position: absolute;
  background-color: var(--secondBack);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 5px 0 10px 0;
  top: 50px;
  transition: 0.5s;
  left: ${(props) => (props.$isShow ? "10px" : "-100%")};
`;
const MarkerTitle = styled.p`
  font-size: 16px;
  width: calc(100% - 20px);
  text-align: center;
  padding-bottom: 5px;
  border-bottom: 1.5px #dddddd solid;
`;
const MarkerItemWrapper = styled.div`
  overflow: overlay;
`;
const MarkerItemBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--mainColor);
  }
`;

const MarkerItemOrder = styled.p`
  font-size: 14px;
  margin-right: 5px;
`;

const MarkerItemImg = styled.img`
  height: 16px;
  width: 16px;
  object-fit: cover;
  margin-right: 5px;
`;
const MarkerItemName = styled.p<{ $isEdit: boolean }>`
  width: ${(props) => (props.$isEdit ? "95px" : "135px")};
  max-width: ${(props) => (props.$isEdit ? "95px" : "135px")};
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const MarkerEditWrapper = styled.div`
  position: absolute;
  background-color: var(--secondBack);
  /* background-color: #fff; */
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 200px; */
  padding: 10px;
  top: 50px;
  left: 10px;
`;
const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  margin-top: 5px;

  justify-content: flex-end;
`;
const InputLabel = styled.label`
  width: 40px;
  font-size: 14px;
`;
const Input = styled.input`
  width: 80px;
  font-size: 14px;
  outline: none;
  border: 1px solid var(--mainBack);
  border-radius: 8px;
  padding: 0 5px;
`;

type Props = {
  password: string | undefined;
  setPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  markers: markerType[];
  onSubmitMarker: (index: number | null, content: markerType) => void;
  onRemove: (id: string) => void;
  onSelectMarker: (id: string) => void;
  onClear: () => void;
  showMarkerBox: boolean;
};

const EditMarker: FC<Props> = (props) => {
  const {
    password,
    markers,
    onSubmitMarker,
    onRemove,
    onSelectMarker,
    isEdit,
    setPassword,
    showMarkerBox,
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
      {!showEditBox && (
        <EditWrapper $isShow={showMarkerBox}>
          <MarkerTitle>{isEdit ? "編輯" : "標記"}</MarkerTitle>
          {isEdit && (
            <InputWrapper>
              <InputLabel>密碼 :</InputLabel>
              <Input
                type="text"
                name="password"
                value={password}
                onChange={setPassword}
              />
            </InputWrapper>
          )}

          <MarkerItemWrapper>
            {markers.map((marker, index) => (
              <MarkerItemBox
                key={marker.id}
                onClick={() => onSelectMarker(marker.id)}
              >
                <MarkerItemOrder>{marker.order}.</MarkerItemOrder>
                <MarkerItemImg src={markerIcon} />
                <MarkerItemName $isEdit={isEdit}>{marker.title}</MarkerItemName>
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
      )}
      {showEditBox && selectMarkerIndex !== null && (
        <MarkerEditWrapper>
          <InfoContent
            from="editMarker"
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
