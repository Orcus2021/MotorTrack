import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/index";
import styled from "styled-components/macro";
import logoImg from "../assets/logo_white.png";

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--mainBack);
  height: 68px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 5;
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
const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
`;
const Nav = styled.p`
  cursor: pointer;
`;
const NavRightBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);

  const goHomePage = () => {
    navigate("/status");
  };
  const goCarRecord = () => {
    navigate(`/car_manage/record`);
  };
  return (
    <HeaderWrapper>
      <Logo src={logoImg} onClick={goHomePage} />
      <NavRightBx>
        <NavLink to="/test">Test</NavLink>
        <Nav onClick={goCarRecord}>車輛日誌</Nav>
        <Profile>
          <NavLink to="/login">會員</NavLink>
        </Profile>
      </NavRightBx>
    </HeaderWrapper>
  );
};

export default Header;
