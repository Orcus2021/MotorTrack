import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/index";
import styled from "styled-components/macro";

import logoImg from "../assets/logo_white.png";
import { Img } from "../components/style";
import PersonIcon from "../assets/icon/person.png";

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--mainBack);
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
  padding: 0 20px;
`;
const Logo = styled.img`
  height: 48px;
  object-fit: cover;
  position: relative;
  cursor: pointer;
`;

const NavProfile = styled.div`
  height: 25px;
  width: 25px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
`;
const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;
const Nav = styled.p`
  cursor: pointer;
  margin-right: 10px;
`;
const NavRightBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = () => {
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.user.isAuth);

  const goHomePage = () => {
    if (isAuth) {
      navigate("/status");
    } else {
      navigate("/");
    }
  };
  const goCarRecord = () => {
    navigate(`/car_manage/record`);
  };
  const goProfile = () => {
    if (isAuth) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };
  return (
    <HeaderWrapper>
      <Logo src={logoImg} onClick={goHomePage} />
      <NavRightBx>
        <NavLink to="/test">Test</NavLink>
        {isAuth && <Nav onClick={goCarRecord}>車輛日誌</Nav>}
        <NavProfile onClick={goProfile}>
          <Img src={PersonIcon} />
        </NavProfile>
      </NavRightBx>
    </HeaderWrapper>
  );
};

export default Header;
