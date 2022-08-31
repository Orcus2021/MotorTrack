import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import logoImg from "../assets/logo_white.png";

const HeaderWrapper = styled.div`
  height: 100px;
  border: solid 1px black;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Logo = styled.img`
  height: 48px;
  object-fit: cover;
  position: relative;
  cursor: pointer;
`;

const Profile = styled.div`
  height: 48px;
  width: 48px;
`;
const ProfileLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;
const Header = () => {
  const navigate = useNavigate();

  const goHomePage = () => {
    navigate("/");
  };
  return (
    <HeaderWrapper>
      <Logo src={logoImg} onClick={goHomePage} />
      <Profile>
        <ProfileLink to="/login">會員</ProfileLink>
      </Profile>
    </HeaderWrapper>
  );
};

export default Header;
