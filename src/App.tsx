import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAppDispatch, useAppSelector } from "./store";
import asyncUserAction from "./store/user/asyncUserAction";
import { Outlet } from "react-router-dom";
import firebase from "./utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { createMessage } from "./utils/calcFunc";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components/macro";
import SlideMessage from "./components/SlideMessage";

export const GlobalStyle = createGlobalStyle`

  *{
    box-sizing: border-box;
    margin: 0;
    padding:0;
    font-family: 'Noto Sans TC',  'Poppins', "sans-serif";
  }
  :root{
   
    --thirdColor:#2196f3;
    --deepColor:#02697f;
    /* --lightColor:#93f1f9;    */
     /* --secondColor:#0ac3cf; */

     /* --deepColor:#24334d; */
     --deepColor:rgb(29, 53, 87);

     /* --mainColor:#457b9d; */
     /* --mainColor:#548ae6; */
     --mainColor:#4581ea;
     --lightColor:#a9c7fa;

     --secondColor:rgb(224, 195, 252);
     /* --secondColor:#84fab0; */

     --textColor:#e6fdff;
    --textDeepColor:rgb(37, 87, 132);


    /* --thirdColor:#00bcd4;
    --secColor:#61dafb;
    --secondColor:#00dfc4; */

    --errorColor:#ec5990;
    --errorSecondColor:rgb(225, 79, 222);
   

    --mainBack:#16181d;
    --secondBack:#282c34;
    --thirdBack:#353a46;
    --lightBack:#ffffff8b;
  }
  body{
   color:#fff;
   &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
  overflow: overlay;

  }

  #root{
    background:var(--mainBack);  
    width: 100%;
    min-height:100vh;
    padding-top:68px ;
    position:relative;
    min-width: 350px;

    
  }
  #root[data-theme="light"] {
    background:#fff; 
}
`;

const App = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const auth = async () => {
      const userId = await firebase.onAuth().catch((msg) => {
        navigate("/");
        createMessage("error", dispatch, "尚未登入");
      });
      if (userId) {
        dispatch(asyncUserAction.signIn(userId));
        //  if(navigator.onLine){

        //  }
      }
    };
    const pathName = location.pathname;
    if (isAuth || pathName === "/" || pathName === "/login") return;
    auth();
  }, [isAuth, dispatch, navigate, location]);

  useEffect(() => {
    const onPWA = async () => {
      const response = await firebase.onOffline().catch((msg) => {
        console.log(msg);
      });
      console.log(response);
    };
    onPWA();
  }, []);

  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
      <Footer />
      <SlideMessage />
    </>
  );
};

export default App;
