import React from "react";
import { useAppSelector } from "./store";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import reset from "styled-reset";
import styled, { createGlobalStyle } from "styled-components/macro";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Poppins&display=swap');
  ${reset}
  *{
    box-sizing: border-box;
    margin: 0;
    padding:0;
    font-family: 'Noto Sans TC',  'Poppins', "sans-serif";
  }
  :root{
    --mainColor:#61dafb;
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
    min-height: 100vh;
    position:relative;
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
