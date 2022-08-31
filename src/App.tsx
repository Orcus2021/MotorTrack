import React from "react";
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
    --mainColor:#11efcf;
  }
  body{
   color:#fff;
  }
  #root{
    background: #2e2e2e;
    width: 100vw;
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
