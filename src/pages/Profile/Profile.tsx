import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import asyncUserAction from "../../store/user/asyncUserAction";
import { Img } from "../../components/style";
import { carActions } from "../../store/car/carReducer";
import { recordActions } from "../../store/record/recordReducer";
import { useAppDispatch, useAppSelector } from "../../store/index";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Upload from "./Upload";
import { userActions } from "../../store/user/userReducer";
import Loading from "../../components/Loading/Loading";

import banner from "../../assets/img/banner.JPG";
import camera from "../../assets/icon/camera.png";
import userImg from "../../assets/img/dog.jpg";
import logout from "../../assets/icon/logout.png";

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
  /* align-items: center; */
  justify-content: space-between;
`;
const UserBx = styled.div`
  display: flex;
  flex-direction: row;

  height: 100%;
`;
const UserImgBx = styled.div`
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
`;
const CarText = styled.p`
  font-size: 10px;
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
  font-size: 12px;
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
const EditCameraBx = styled.span`
  position: relative;
  width: 16px;
  height: 16px;
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
const LogoutBx = styled.span`
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
    console.log("profile");
    dispatch(userActions.loading(true));
    if (isAuth) {
      setTimeout(() => {
        dispatch(userActions.loading(false));
      }, 500);
    }
  }, [dispatch, isAuth]);

  const logoutHandler = () => {
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

  const remindHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let update;
    if (e.target.id === "inspection") {
      update = { inspectionRemind: e.target.checked };
    } else {
      update = { insuranceRemind: e.target.checked };
    }

    dispatch(asyncUserAction.updateUser(user.id, update));
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
              <EditCameraBx>
                <Img src={camera} />
              </EditCameraBx>
              編輯封面照片
            </BannerEdit>
          </Banner>
          <UserWrapper>
            <UserBx>
              <UserImgBx>
                <UserPic src={user.userImg || userImg} />
                <CameraIcon
                  src={camera}
                  onClick={() => {
                    uploadImgHandler("user");
                  }}
                />
              </UserImgBx>
              <NameWrapper>
                <NameText>{user.name}</NameText>
                <CarText>車輛數:{user.cars}</CarText>
              </NameWrapper>
            </UserBx>
            <Logout onClick={logoutHandler}>
              登出
              <LogoutBx>
                <Img src={logout} />
              </LogoutBx>
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
                id="inspection"
                onChange={remindHandler}
                checked={user.inspectionRemind}
              />
              <UserAccount>驗車到期</UserAccount>
              <CheckBox
                id="insurance"
                onChange={remindHandler}
                checked={user.insuranceRemind}
              />
              <UserAccount>保險到期</UserAccount>
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
