import React from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import reset from "styled-reset";
import { createGlobalStyle } from "styled-components/macro";
import SlideMessage from "./components/SlideMessage";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Poppins&display=swap');

  *{
    box-sizing: border-box;
    margin: 0;
    padding:0;
    font-family: 'Noto Sans TC',  'Poppins', "sans-serif";
  }
  :root{
/*    
    --mainColor:#2196f3; */
    --deepColor:#02697f;
    --lightColor:#93f1f9;
     --mainColor:#0ac3cf;

    --thirdColor:#00bcd4;
    --secColor:#61dafb;
    --secondColor:#00dfc4;

    --errorColor:#ec5990;

    --mainBack:#16181d;
    --secondBack:#282c34;
    --thirdBack:#353a46;
    --lightBack:#ffffff8b;
  }
  body{
   color:#fff;
  }
  #root{
    background:var(--mainBack);
    width: 100%;
    min-height:100vh;
    padding-top:68px ;
    position:relative;
    
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
      <SlideMessage />
    </>
  );
};

export default App;
