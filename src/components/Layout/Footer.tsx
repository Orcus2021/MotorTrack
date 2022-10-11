import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import { useAppSelector } from "../../store";

import addRecordIcon from "../../assets/icon/add-record.png";
import statusIcon from "../../assets/icon/chart-white.png";
import mapIcon from "../../assets/icon/map.png";
import feeIcon from "../../assets/icon/moneyBag-plus.png";
import recordIcon from "../../assets/icon/paper-white.png";
import refuelIcon from "../../assets/icon/refuel-plus.png";
import repairIcon from "../../assets/icon/repair-plus.png";
import shopIcon from "../../assets/icon/shop.png";
import stopWatchIcon from "../../assets/icon/stopwatch.png";

const FooterContainer = styled.div<{ $isAuth: boolean }>`
  position: relative;
  display: none;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: var(--mainBack);

  justify-content: center;
  align-items: center;
  @media screen and (max-width: 701px) {
    display: ${(props) => props.$isAuth && "flex"};
    min-width: 350px;
  }
`;
const NavWrapper = styled.ul`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
`;
const Nav = styled.li<{ $isSelect: boolean }>`
  position: relative;
  height: 35px;
  z-index: 2;
  width: ${(props) => (props.$isSelect ? "120px" : "30px")};
  list-style: none;
  overflow: hidden;
  display: flex;
  border-radius: 50px;
  padding: ${(props) => (props.$isSelect ? "5px" : "0px")};
  background-color: ${(props) =>
    props.$isSelect ? "var(--mainColor)" : "var(--mainBack)"};
  align-items: center;
  justify-content: flex-start;
  transition: 0.5s;
  cursor: pointer;
`;
const IconBox = styled.span`
  display: block;
  flex-shrink: 0;
  height: 30px;
  width: 30px;
  margin-right: 10px;
  position: relative;
  &:hover {
    animation: iconJump 1s infinite;
  }
  @keyframes iconJump {
    0%,
    100% {
      transform: rotate(0);
    }
    30% {
      transform: rotate(-15deg);
    }
    60% {
      transform: rotate(15deg);
    }
  }
`;

const IconText = styled.p`
  white-space: nowrap;
  display: flex;
  position: relative;
  flex-grow: 1;
`;
const Img = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const EditWrapper = styled.div<{ $isShow: boolean }>`
  position: absolute;
  right: 20px;
  bottom: 60px;
  transition: 0.3s;
  overflow: hidden;
  max-height: 0;
  max-height: ${(props) => props.$isShow && "102px"};
`;
const EditBox = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--deepColor);
  border-radius: 20px;
  margin-bottom: 5px;
  padding: 2px 10px;
  cursor: pointer;
  &:hover {
    background-color: #3464a5;
  }
`;
const EditIconBox = styled.span`
  display: block;
  flex-shrink: 0;
  height: 25px;
  width: 25px;
  margin-left: 10px;
  position: relative;
`;

const Footer = () => {
  const [selectPage, setSelectPage] = useState<string>("status");
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const userID = useAppSelector((state) => state.user.user.id);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const onPathSelect = useCallback((path: string) => {
    if (path.includes("status")) {
      setSelectPage("status");
    } else if (path.includes("car_manage")) {
      setSelectPage("record");
    } else if (path.includes("store")) {
      setSelectPage("store");
    } else if (path.includes("mileage")) {
      setSelectPage("mileage");
    } else if (path.includes("my_map")) {
      setSelectPage("myMap");
    }
  }, []);

  useEffect(() => {
    onPathSelect(path);
  }, [onPathSelect, path]);
  const selectHandler = (str: string) => {
    setSelectPage(str);
    if (str === "status") {
      navigate("/status");
    } else if (str === "record") {
      navigate("/car_manage/record");
    } else if (str === "store") {
      navigate("/store");
    } else if (str === "mileage") {
      navigate("/mileage");
    } else if (str === "myMap") {
      navigate(`/my_map/${userID}`);
    }
  };

  const selectCategoryHandler = (category: string) => {
    if (category === "fee") {
      navigate("/car_manage/record", { state: "fee" });
    } else if (category === "repair") {
      navigate("/car_manage/record", { state: "repair" });
    }
    setShowEdit(false);
  };

  const selectRecordHandler = () => {
    selectHandler("addRecord");
    setShowEdit((pre) => {
      if (pre) {
        onPathSelect(path);
      }
      return !pre;
    });
  };
  return (
    <FooterContainer $isAuth={isAuth}>
      <NavWrapper>
        <Nav
          $isSelect={selectPage === "status"}
          onClick={() => {
            selectHandler("status");
            setShowEdit(false);
          }}
        >
          <IconBox>
            <Img src={statusIcon} />
          </IconBox>
          <IconText>儀錶板</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "record"}
          onClick={() => {
            selectHandler("record");
            setShowEdit(false);
          }}
        >
          <IconBox>
            <Img src={recordIcon} />
          </IconBox>
          <IconText>摩托日誌</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "myMap"}
          onClick={() => {
            selectHandler("myMap");
            setShowEdit(false);
          }}
        >
          <IconBox>
            <Img src={mapIcon} />
          </IconBox>
          <IconText>我的地圖</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "store"}
          onClick={() => {
            selectHandler("store");
            setShowEdit(false);
          }}
        >
          <IconBox>
            <Img src={shopIcon} />
          </IconBox>
          <IconText>商家地圖</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "mileage"}
          onClick={() => {
            selectHandler("mileage");
            setShowEdit(false);
          }}
        >
          <IconBox>
            <Img src={stopWatchIcon} />
          </IconBox>
          <IconText>里程紀錄</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "addRecord"}
          onClick={selectRecordHandler}
        >
          <IconBox>
            <Img src={addRecordIcon} />
          </IconBox>
          <IconText>新增紀錄</IconText>
        </Nav>

        <EditWrapper $isShow={showEdit}>
          <EditBox
            onClick={() => {
              selectCategoryHandler("repair");
            }}
          >
            <IconText>新增維修</IconText>
            <EditIconBox>
              <Img src={repairIcon} />
            </EditIconBox>
          </EditBox>
          <EditBox
            onClick={() => {
              selectCategoryHandler("fee");
            }}
          >
            <IconText>新增加油</IconText>
            <EditIconBox>
              <Img src={refuelIcon} />
            </EditIconBox>
          </EditBox>
          <EditBox
            onClick={() => {
              selectCategoryHandler("fee");
            }}
          >
            <IconText>新增費用</IconText>
            <EditIconBox>
              <Img src={feeIcon} />
            </EditIconBox>
          </EditBox>
        </EditWrapper>
      </NavWrapper>
    </FooterContainer>
  );
};

export default Footer;
