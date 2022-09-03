import React from "react";
import styled from "styled-components/macro";
import asyncUserAction from "../../store/user/asyncUserAction";
import { carActions } from "../../store/car/carReducer";
import { recordActions } from "../../store/record/recordReducer";
import { useAppDispatch, useAppSelector } from "../../store/index";

const ProfileContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileWrapper = styled.div`
  width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Banner = styled.div`
  width: 100%;
  height: 250px;
  background-color: var(--mainColor);
`;
const UserWrapper = styled.div`
  height: 100px;
  width: 100%;
  border: 1px solid #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const UserBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;
const UserImgBx = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  top: -30px;
  border-radius: 50%;
  background-color: #fff;
`;
const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;
const NameWrapper = styled.div``;
const NameText = styled.p`
  font-size: 16px;
`;
const CarText = styled.p`
  font-size: 12px;
`;
const Logout = styled.p`
  font-size: 16px;
`;
const UserInfoWrapper = styled.div`
  width: 100%;
`;
const UserAccount = styled.p`
  font-size: 16px;
`;

const Profile = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const logoutHandler = () => {
    dispatch(asyncUserAction.logout());
    dispatch(carActions.clear());
    dispatch(recordActions.clearAllRecord());
  };
  return (
    <ProfileContainer>
      <ProfileWrapper>
        <Banner></Banner>
        <UserWrapper>
          <UserBx>
            <UserImgBx></UserImgBx>
            <NameWrapper>
              <NameText>{user.name}</NameText>
              <CarText>車輛數:{user.cars}</CarText>
            </NameWrapper>
          </UserBx>
          <Logout onClick={logoutHandler}>登出</Logout>
        </UserWrapper>
        <UserInfoWrapper>
          <UserAccount>帳號:{user.email}</UserAccount>
          <UserAccount>密碼:</UserAccount>
        </UserInfoWrapper>
      </ProfileWrapper>
    </ProfileContainer>
  );
};

export default Profile;
