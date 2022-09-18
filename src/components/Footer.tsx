import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";

import statusIcon from "../assets/icon/chart-white.png";
import recordIcon from "../assets/icon/paper-white.png";
import repairIcon from "../assets/icon/repair-plus.png";
import feeIcon from "../assets/icon/moneyBag-plus.png";
import refuelIcon from "../assets/icon/refuel-plus.png";

const Container = styled.div<{ $isAuth: boolean }>`
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
  height: 35px;
  z-index: 2;
  width: ${(props) => (props.$isSelect ? "120px" : "30px")};
  list-style: none;
  overflow: hidden;
  display: flex;
  border-radius: 50px;
  padding: ${(props) => (props.$isSelect ? "5px" : "0px")};
  background-color: ${(props) =>
    props.$isSelect ? "var(--deepColor)" : "var(--mainBack)"};
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

const Footer = () => {
  const [selectPage, setSelectPage] = useState<string>("status");
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  useEffect(() => {
    if (path.includes("status")) {
      setSelectPage("status");
    } else if (path.includes("car_manage")) {
      setSelectPage("record");
    }
  }, [path]);
  const selectHandler = (str: string) => {
    setSelectPage(str);
    if (str === "status") {
      navigate("/status");
    } else if (str === "record") {
      navigate("/car_manage/record");
    } else if (str === "repair") {
      navigate("/car_manage/record", { state: "repair" });
    } else if (str === "refuel") {
      navigate("/car_manage/record", { state: "fee" });
    } else if (str === "fee") {
      navigate("/car_manage/record", { state: "fee" });
    }
  };
  return (
    <Container $isAuth={isAuth}>
      <NavWrapper>
        <Nav
          $isSelect={selectPage === "status"}
          onClick={() => {
            selectHandler("status");
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
          }}
        >
          <IconBox>
            <Img src={recordIcon} />
          </IconBox>
          <IconText>摩特日誌</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "repair"}
          onClick={() => {
            selectHandler("repair");
          }}
        >
          <IconBox>
            <Img src={repairIcon} />
          </IconBox>
          <IconText>維修新增</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "refuel"}
          onClick={() => {
            selectHandler("refuel");
          }}
        >
          <IconBox>
            <Img src={refuelIcon} />
          </IconBox>
          <IconText>加油新增</IconText>
        </Nav>
        <Nav
          $isSelect={selectPage === "fee"}
          onClick={() => {
            selectHandler("fee");
          }}
        >
          <IconBox>
            <Img src={feeIcon} />
          </IconBox>
          <IconText>費用新增</IconText>
        </Nav>
      </NavWrapper>
    </Container>
  );
};

export default Footer;
