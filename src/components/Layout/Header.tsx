import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { useAppDispatch, useAppSelector } from "../../store/index";
import { userActions } from "../../store/user/userReducer";
import { createMessage } from "../../utils/calcFunc";
import { Img } from "../style";

import menuIcon from "../../assets/icon/hamburger.png";
import logoIcon from "../../assets/icon/logo192.png";
import PersonIcon from "../../assets/icon/person.png";
import logoImg from "../../assets/logo_white.png";

const HeaderContainer = styled.div<{
  $isModify: boolean;
  $isNav: boolean;
  $isScroll: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: 0.3s;

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

const Nav = styled.p<{ $isSelected: boolean }>`
  cursor: pointer;
  margin-right: 10px;
  color: ${(props) => (props.$isSelected ? "var(--lightColor)" : "#fff")};
  border-top: transparent;
  padding: 2px 0;
  border-bottom: solid 2px
    ${(props) => (props.$isSelected ? "var(--lightColor)" : "transparent")};
  &:hover {
    color: var(--lightColor);
    border-bottom: solid 2px var(--lightColor);
  }
  @media screen and (max-width: 701px) {
    display: none;
  }
`;
const NavRightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  right: 40px;
  @media screen and (max-width: 701px) {
    right: 20px;
  }
  @media screen and (max-width: 400px) {
    right: 5px;
  }
`;

const MemberWrapper = styled.div<{ $isOffline: boolean }>`
  padding: 2px 10px;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isOffline ? "#ff5555" : "var(--mainColor)"};
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
const Offline = styled.p`
  font-size: 16px;
  border-radius: 20px;
  letter-spacing: 1px;
  @media screen and (max-width: 701px) {
    font-size: 14px;
  }
`;
const UserImg = styled.img<{ $isOffline: boolean }>`
  position: relative;
  z-index: 1;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  overflow: hidden;
  cursor: pointer;
  padding: 2px;
  background-color: ${(props) =>
    props.$isOffline ? "#ff5555" : "transparent"};
  @media screen and (max-width: 701px) {
    height: 40px;
    width: 40px;
  }
`;

const OfflineBox = styled.div`
  background-color: #ff5555;
  border-radius: 0 20px 20px 0;
  padding: 2px 5px;
  transform: translateX(-4px);
  @media screen and (max-width: 701px) {
    transform: translateX(-5px);
  }
`;
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const { isAuth, isNav, isOffline } = user;
  const [scrollShow, setScrollShow] = useState<boolean>(false);
  const isModify = location.pathname.includes("car_manage");
  const pathname = location.pathname;
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
    navigate("/");
  };
  const goOtherPage = (url: string) => {
    navigate(url);
  };
  const goProfile = () => {
    if (isAuth) {
      navigate("/profile");
    } else if (!isAuth && isOffline) {
      createMessage("error", dispatch, "????????????????????????");
    } else if (!isOffline) {
      navigate("/login");
    }
  };
  const slideBarHandler = () => {
    dispatch(userActions.showNav(!isNav));
  };
  return (
    <HeaderContainer $isModify={isModify} $isNav={isNav} $isScroll={scrollShow}>
      {isModify && <MenuImg src={menuIcon} onClick={slideBarHandler} />}
      <Logo src={logoImg} onClick={goHomePage} />
      <NavRightWrapper>
        {isAuth && (
          <>
            <Nav
              onClick={() => goOtherPage(`/status`)}
              $isSelected={pathname.includes("status")}
            >
              ?????????
            </Nav>
            <Nav
              onClick={() => goOtherPage(`/car_manage/record`)}
              $isSelected={pathname.includes("car_manage")}
            >
              ????????????
            </Nav>
            <Nav
              onClick={() => goOtherPage(`/my_map/${user.user.id}`)}
              $isSelected={pathname.includes("my_map")}
            >
              ????????????
            </Nav>
          </>
        )}
        <Nav
          onClick={() => goOtherPage(`/store`)}
          $isSelected={pathname.includes("store")}
        >
          ????????????
        </Nav>
        {isAuth && (
          <>
            <Nav
              onClick={() => goOtherPage(`/mileage`)}
              $isSelected={pathname.includes("mileage")}
            >
              ????????????
            </Nav>
            <UserImg
              src={user.user.userImg || logoIcon}
              onClick={goProfile}
              $isOffline={isOffline}
            />
            {isOffline && (
              <OfflineBox>
                <Offline>??????</Offline>
              </OfflineBox>
            )}
          </>
        )}
        {!isAuth && (
          <MemberWrapper onClick={goProfile} $isOffline={isOffline}>
            <NavProfile>
              <Img src={PersonIcon} />
            </NavProfile>
            {isOffline && <Offline>??????</Offline>}
            {!isAuth && !isOffline && (
              <LoginMessage hideOnMobile>??????</LoginMessage>
            )}
          </MemberWrapper>
        )}
      </NavRightWrapper>
    </HeaderContainer>
  );
};

export default Header;
