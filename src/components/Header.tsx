import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/index";
import styled from "styled-components/macro";
import { useAppDispatch } from "../store/index";
import { userActions } from "../store/user/userReducer";

import logoImg from "../assets/logo_white.png";
import { Img } from "../components/style";
import PersonIcon from "../assets/icon/person.png";
import menuIcon from "../assets/icon/hamburger.png";

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
  justify-content: flex-start;
  z-index: 5;
  padding: ${(props) =>
    props.$isNav && props.$isModify
      ? "0 40px 0 276px"
      : props.$isModify
      ? " 0 40px 0 85px"
      : "0 40px"};

  @media screen and (max-width: 701px) {
    justify-content: center;
    padding: ${(props) =>
      props.$isNav && props.$isModify
        ? "0 40px 0 276px"
        : props.$isModify
        ? " 0 40px 0 40px"
        : "0 40px"};
    /* min-width: 350px; */
  }
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

  position: relative;
  cursor: pointer;
`;

const Nav = styled.p`
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    color: var(--lightColor);
  }
  @media screen and (max-width: 701px) {
    display: none;
  }
`;
const NavRightBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 40px;
  @media screen and (max-width: 701px) {
    right: 20px;
  }
`;

const MemberBox = styled.div`
  /* width: 90px; */
  padding: 2px 10px;
  cursor: pointer;
  background-color: var(--mainColor);
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0px 0px 10px 2px rgba(224, 195, 252, 0.5),
      0px 0px 10px 2px rgba(110, 155, 233, 0.5);
    animation: btnScale linear 0.3s;
  }
  @keyframes btnScale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    80% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  @media screen and (max-width: 701px) {
    padding: 2px 10px;
  }
`;
const LoginMessage = styled.p<{ hideOnMobile: boolean }>`
  font-size: 16px;
  height: 25px;
  line-height: 25px;
  margin-left: 10px;
  @media screen and (max-width: 701px) {
    ${(props) => props.hideOnMobile && "display:none"}
  }
`;
const MenuImg = styled.img`
  position: absolute;
  left: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    width: 40px;
  }
`;
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const isNav = useAppSelector((state) => state.user.isNav);
  const [scrollShow, setScrollShow] = useState<boolean>(false);
  const isModify = location.pathname.includes("car_manage");

  const scrollScreen = useCallback(() => {
    const lastScrollY = window.scrollY;

    if (lastScrollY > 0) {
      setScrollShow(true);
    } else if (lastScrollY === 0) {
      setScrollShow(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollScreen);
    scrollScreen();
    return () => {
      window.removeEventListener("scroll", scrollScreen);
    };
  }, [scrollScreen]);

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
  const slideBarHandler = () => {
    dispatch(userActions.showNav(!isNav));
  };
  return (
    <HeaderWrapper $isModify={isModify} $isNav={isNav} $isScroll={scrollShow}>
      {isModify && <MenuImg src={menuIcon} onClick={slideBarHandler} />}

      <Logo src={logoImg} onClick={goHomePage} />

      <NavRightBx>
        {isAuth && <Nav onClick={goCarRecord}>摩特日誌</Nav>}

        <MemberBox onClick={goProfile}>
          <NavProfile>
            <Img src={PersonIcon} />
          </NavProfile>
          {!isAuth && <LoginMessage hideOnMobile>登入</LoginMessage>}
        </MemberBox>
      </NavRightBx>
    </HeaderWrapper>
  );
};

export default Header;
