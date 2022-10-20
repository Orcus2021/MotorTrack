import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import { Img } from "../../components/style";
import { carActions } from "../../store/car/carReducer";
import { useAppDispatch, useAppSelector } from "../../store/index";
import { recordActions } from "../../store/record/recordReducer";
import asyncUserAction from "../../store/user/asyncUserAction";
import { userActions } from "../../store/user/userReducer";
import { getMessageToken, requestPermission } from "../../utils/calcFunc";
import Upload from "./Upload";

import camera from "../../assets/icon/camera.png";
import logoIcon from "../../assets/icon/logo192.png";
import logout from "../../assets/icon/logout.png";
import banner from "../../assets/img/banner.JPG";

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileWrapper = styled.div`
  height: calc(100vh - 68px);
  min-height: 554px;
  padding-bottom: 20px;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--secondBack);
  @media screen and (max-width: 701px) {
    height: calc(100vh + 60px);
  }
`;

const Banner = styled.div`
  width: 100%;
  min-height: 350px;
  height: 350px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  position: relative;
  background-color: var(--secondBack);
`;
const UserWrapper = styled.div`
  height: 80px;
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const UserBox = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
`;
const UserImgBox = styled.div`
  position: relative;
  border: 4px solid var(--secondBack);
  width: 120px;
  height: 120px;
  top: -40px;
  border-radius: 50%;
  background-color: #fff;
  background-color: var(--mainBack);
`;

const NameWrapper = styled.div`
  margin-top: 10px;
  padding-left: 10px;
`;
const NameText = styled.p`
  font-size: 20px;
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const CarText = styled.p`
  font-size: 14px;
`;
const Logout = styled.p`
  font-size: 16px;
  display: flex;
  align-items: center;
  padding-right: 10px;
  cursor: pointer;
`;
const UserInfo = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
`;
const UserAccount = styled.p`
  font-size: 16px;
  margin-right: 10px;
`;
const BannerEdit = styled.p`
  position: relative;
  color: var(--mainBack);
  padding: 5px;
  border-radius: 4px;
  display: flex;
  margin: 10px;
  align-items: center;
  flex-direction: row;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
`;

const CameraIcon = styled.img`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  right: 3px;
  bottom: 0;
  padding: 5px;
  object-fit: cover;
  background-color: var(--mainColor);
  cursor: pointer;
`;
const EditCameraBox = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  top: 1px;
`;

const UserPic = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
  border-radius: 50%;
`;
const LogoutBox = styled.span`
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
`;
const Title = styled.p`
  font-size: 16px;
  width: 80px;
  color: var(--mainColor);
`;
const Dot = styled.div`
  margin-left: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
`;
const InfoWrapper = styled.div`
  width: 100%;
  padding: 0 30px;
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
  width: 12px;
  height: 12px;
`;

const Profile = () => {
  const userState = useAppSelector((state) => state.user);
  const { user, isAuth, isLoading } = userState;
  const [uploadImg, setUploadImg] = useState<string>("");
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userActions.loading(true));
    if (isAuth) {
      setTimeout(() => {
        dispatch(userActions.loading(false));
      }, 500);
    }
  }, [dispatch, isAuth]);

  const logoutHandler = async () => {
    dispatch(asyncUserAction.logout());
    dispatch(carActions.clear());
    dispatch(recordActions.clearAllRecord());
    navigate("/");
  };
  const uploadImgHandler = (type: string) => {
    setUploadImg(type);
  };

  const closeUploadHandler = () => {
    setCloseEffect(true);
    setTimeout(() => {
      setUploadImg("");
      setCloseEffect(false);
    }, 600);
  };

  const updateTokenAndRemind = (token: string) => {
    if (user.pushToken) {
      const found = user.pushToken.find((initToken) => initToken === token);
      if (found) {
        return { continueRemind: true };
      } else {
        const newTokenArr = [...user.pushToken, token];
        return {
          continueRemind: true,
          pushToken: newTokenArr,
        };
      }
    } else {
      const newTokenArr = [token];
      return {
        continueRemind: true,
        pushToken: newTokenArr,
      };
    }
  };

  const remindHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const permission = await requestPermission();

      if (permission === "granted") {
        const token = await getMessageToken();
        if (!token) return;
        const update = updateTokenAndRemind(token);
        dispatch(asyncUserAction.updateUser(user.id, update));
      } else if (permission === "denied") {
        const update = { continueRemind: false };
        dispatch(asyncUserAction.updateUser(user.id, update));
      } else if (permission === "default") {
        console.log("notification default");
      }
    } else {
      const update = { continueRemind: false };
      dispatch(asyncUserAction.updateUser(user.id, update));
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <ProfileContainer>
        <ProfileWrapper>
          <Banner>
            <Img src={user.bannerImg || banner} />
            <BannerEdit
              onClick={() => {
                uploadImgHandler("banner");
              }}
            >
              <EditCameraBox>
                <Img src={camera} />
              </EditCameraBox>
              編輯封面照片
            </BannerEdit>
          </Banner>
          <UserWrapper>
            <UserBox>
              <UserImgBox>
                <UserPic src={user.userImg || logoIcon} />
                <CameraIcon
                  src={camera}
                  onClick={() => {
                    uploadImgHandler("user");
                  }}
                />
              </UserImgBox>
              <NameWrapper>
                <NameText>{user.name}</NameText>
                <CarText>車輛數:{user.cars}</CarText>
              </NameWrapper>
            </UserBox>
            <Logout onClick={logoutHandler}>
              登出
              <LogoutBox>
                <Img src={logout} />
              </LogoutBox>
            </Logout>
          </UserWrapper>
          <InfoWrapper>
            <UserInfo>
              <Title>帳號</Title>
              <UserAccount>{user.email}</UserAccount>
            </UserInfo>
            <UserInfo>
              <Title>密碼</Title>
              {Array(6)
                .fill(null)
                .map((_, index) => (
                  <Dot key={index}></Dot>
                ))}
            </UserInfo>
            <UserInfo>
              <Title>開啟提醒</Title>
              <CheckBox
                onChange={remindHandler}
                checked={user.continueRemind}
              />
              <UserAccount>保險及驗車到期通知</UserAccount>
            </UserInfo>
          </InfoWrapper>
        </ProfileWrapper>
      </ProfileContainer>
      {uploadImg && (
        <Modal
          closeEffect={closeEffect}
          onClose={closeUploadHandler}
          containerWidth={400}
        >
          <Upload imageType={uploadImg} onClose={closeUploadHandler} />
        </Modal>
      )}
    </>
  );
};

export default Profile;
