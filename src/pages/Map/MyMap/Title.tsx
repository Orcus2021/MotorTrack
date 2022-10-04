import React, { FC } from "react";
import styled from "styled-components/macro";
import { NeonText } from "../../../components/style";
import Button from "../../../components/Button/Button";
import { myMapContentType } from "../../../types/mapType";

import markerIcon from "../../../assets/icon/marker.png";
import friendIcon from "../../../assets/icon/friends.png";
import editIcon from "../../../assets/icon/add-record.png";

const TitleWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const PageTitle = styled(NeonText)`
  font-size: 22px;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const ToolBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ImgBox = styled.div<{ $isSelect: boolean }>`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelect ? " var(--mainColor)" : "var(--thirdBack)"};
  &:hover {
    background-color: var(--mainColor);
  }
`;
const Img = styled.img`
  width: 22px;
  height: 22px;
  object-fit: cover;
`;
type PropType = {
  isSelf: boolean;
  myMapContent: myMapContentType;
  isEdit: boolean;
  showMarkerBox: boolean;
  isJoin: boolean;
  showFriends: boolean;
  onReturn: () => void;
  onSubmit: () => void;
  onJoin: () => void;
  onLeave: () => void;
  onEdit: () => void;
  onShowMarkerBox: () => void;
  onShowFriendsBox: () => void;
};
const Title: FC<PropType> = (props) => {
  const {
    isSelf,
    myMapContent,
    isEdit,
    isJoin,
    showMarkerBox,
    showFriends,
    onReturn,
    onSubmit,
    onJoin,
    onLeave,
    onEdit,
    onShowMarkerBox,
    onShowFriendsBox,
  } = props;

  const editHandler = () => {
    onEdit();
  };

  return (
    <TitleWrapper>
      <ToolBar>
        <ImgBox onClick={onShowMarkerBox} $isSelect={showMarkerBox}>
          <Img src={markerIcon} />
        </ImgBox>
        <ImgBox onClick={onShowFriendsBox} $isSelect={showFriends}>
          <Img src={friendIcon} />
        </ImgBox>

        {isSelf && !isJoin && (
          <ImgBox onClick={editHandler} $isSelect={isEdit}>
            <Img src={editIcon} />
          </ImgBox>
        )}
      </ToolBar>
      <PageTitle>{!isSelf && `${myMapContent.name}的地圖`}</PageTitle>
      <ButtonWrapper>
        {isEdit && (
          <>
            <Button label="取消" type="cancel" handleClick={onReturn} />
            <Button label="確認" type="primary" handleClick={onSubmit} />
          </>
        )}
        {!isEdit && !isJoin && (
          <Button label="加入" type="primary" handleClick={onJoin} />
        )}
        {!isEdit && isJoin && (
          <Button label="離開" type="reject" handleClick={onLeave} />
        )}
      </ButtonWrapper>
    </TitleWrapper>
  );
};

export default Title;
