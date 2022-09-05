import React from "react";
import { useAppSelector } from "./store";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import reset from "styled-reset";
import styled, { createGlobalStyle } from "styled-components/macro";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Poppins&display=swap');

  *{
    box-sizing: border-box;
    margin: 0;
    padding:0;
    font-family: 'Noto Sans TC',  'Poppins', "sans-serif";
  }
  :root{
    --mainColor:#2196f3;
    --thirdColor:#00bcd4;
    --secColor:#61dafb;
    --borderColor:#00dfc4;

    --mainBack:#16181d;
    --secondBack:#20232a;
    --thirdBack:#282c34;
  }
  body{
   color:#fff;
  }
  #root{
    background:var(--mainBack);
    width: 100%;
    min-height: calc(100vh - 68px);
    position:relative;
    margin-top: 68px;
  }

`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
    </>
  );
};

export default App;
