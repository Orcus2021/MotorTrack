import React, { useState, useRef } from "react";
import styled from "styled-components/macro";
import { Img } from "../../components/style";
import asyncUserAction from "../../store/user/asyncUserAction";
import { createMessage } from "../../utils/calcFunc";
import { useAppDispatch, useAppSelector } from "../../store";

import cancelIcon from "../../assets/icon/cancel.png";

const Container = styled.div`
  width: 400px;
  padding: 10px;
  background-color: var(--thirdBack);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Label = styled.label`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--mainColor);
  margin-bottom: 10px;
`;
const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  filter: alpha(opacity=0);
  top: 0;
  right: 0;
  width: 100%;
  cursor: pointer;
  flex-grow: 1;
  height: 100%;
  font-size: 16px;
  outline: none;
  padding-left: 10px;
  /* border: 1px solid #cccccc; */
`;

const FileBx = styled.div<{ $isBanner: boolean }>`
  width: ${(props) => (props.$isBanner ? "360px" : "200px")};
  height: ${(props) => (props.$isBanner ? "157.5px" : "200px")};
  border-radius: 4px;
  background-color: #fff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  overflow: hidden;
`;

const BtnBx = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const Confirm = styled.button`
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  background-color: var(--mainColor);
  border-radius: 4px;
  margin: 0 10px;
  cursor: pointer;
`;
const Cancel = styled.button`
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  background-color: var(--errorColor);
  border-radius: 4px;
  margin: 0 10px;
  cursor: pointer;
`;
const Mask = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  border-radius: 50%;
  box-sizing: content-box;
  pointer-events: none;
  border: 100px solid #1515155c;
  /* background-color: red; */
  top: -100px;
  left: -100px;
`;
const CancelIcon = styled(Img)<{ $isBanner: boolean }>`
  width: 25px;
  height: 25px;
  background-color: var(--errorColor);
  padding: 1px;
  border-radius: 50%;
  left: auto;
  right: ${(props) => (props.$isBanner ? "10px" : "85px")};
  top: 35px;

  z-index: 2;
  cursor: pointer;
`;

const Upload: React.FC<{ imageType: string; onClose: () => void }> = (
  props
) => {
  const { imageType, onClose } = props;
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>("");
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.user.id);

  const imageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    setImage(e.target.files[0]);
    const ImgUrl = URL.createObjectURL(e.target.files[0]);
    setImageUrl(ImgUrl);
  };

  const removeHandler = () => {
    setImageUrl("");
    setImage(undefined);
  };
  const uploadHandler = () => {
    if (image) {
      dispatch(asyncUserAction.uploadImage(userId, imageType, image));
      onClose();
    } else {
      createMessage("error", dispatch, "尚未選擇照片");
    }
  };

  return (
    <Container>
      <Label>圖片上傳</Label>
      {imageUrl && (
        <CancelIcon
          src={cancelIcon}
          onClick={removeHandler}
          $isBanner={imageType === "banner"}
        />
      )}

      <FileBx $isBanner={imageType === "banner"}>
        <FileInput
          id="image"
          type="file"
          accept="image/*"
          onChange={imageHandler}
        />
        {imageUrl && (
          <>
            <Img src={imageUrl} />
            {imageType === "user" && <Mask />}
          </>
        )}
      </FileBx>
      <BtnBx>
        <Cancel onClick={onClose}>取消</Cancel>
        <Confirm onClick={uploadHandler}>上傳</Confirm>
      </BtnBx>
    </Container>
  );
};

export default Upload;
