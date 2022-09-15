import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/index";
import styled from "styled-components/macro";

import logoImg from "../assets/logo_white.png";
import { Img } from "../components/style";
import PersonIcon from "../assets/icon/person.png";

const HeaderWrapper = styled.div<{
  $isModify: boolean;
  $isNav: boolean;
  $isScroll: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: 0.5s;

  background-color: ${(props) =>
    props.$isScroll ? "rgba(255, 255, 255, 0.15)" : "transparent"};
  box-shadow: ${(props) => props.$isScroll && "0px 3px 15px rgb(0, 0, 0)"};
  backdrop-filter: ${(props) => props.$isScroll && "blur(10px)"};
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  padding: ${(props) =>
    props.$isNav && props.$isModify
      ? "0 20px 0 276px"
      : props.$isModify
      ? " 0 20px 0 85px"
      : "0 20px"};
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
  position: absolute;
  right: 0;
`;
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const scroll = useRef<number>();
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const isNav = useAppSelector((state) => state.user.isNav);
  // const [scrollShow, setScrollShow] = useState<boolean>(false);
  const isModify = location.pathname.includes("car_manage");

  // const scrollScreen = useCallback(() => {
  //   const lastScrollY = window.scrollY;

  //   if (lastScrollY > 0) {
  //     setScrollShow(true);
  //   } else if (lastScrollY === 0) {
  //     setScrollShow(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   window.addEventListener("scroll", scrollScreen);
  //   scrollScreen();
  //   return () => {
  //     window.removeEventListener("scroll", scrollScreen);
  //   };
  // }, [scrollScreen]);

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
    <HeaderWrapper $isModify={isModify} $isNav={isNav} $isScroll={false}>
      <Logo src={logoImg} onClick={goHomePage} />
      <NavRightBx>
        {isAuth && <Nav onClick={goCarRecord}>車輛日誌</Nav>}
        <NavProfile onClick={goProfile}>
          <Img src={PersonIcon} />
        </NavProfile>
      </NavRightBx>
    </HeaderWrapper>
  );
};

export default Header;
