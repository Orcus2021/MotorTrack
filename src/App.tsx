import React, { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAppDispatch, useAppSelector } from "./store";
import asyncUserAction from "./store/user/asyncUserAction";
import { Outlet } from "react-router-dom";
import firebase from "./utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import {
  createMessage,
  requestPermission,
  getMessageToken,
} from "./utils/calcFunc";
import { Reset } from "styled-reset";
import { createGlobalStyle } from "styled-components/macro";
import SlideMessage from "./components/SlideMessage";
import { userActions } from "./store/user/userReducer";

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
     --deepColor:rgb(29, 53, 87);

    
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
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const auth = async () => {
      const userId = await firebase.onAuth().catch((msg) => {
        createMessage("error", dispatch, "尚未登入");
        dispatch(userActions.loading(false));
      });
      if (userId) {
        dispatch(asyncUserAction.signIn(userId));
      }
    };
    const pathName = location.pathname;
    if (pathName === "/") {
      auth();
      return;
    }
    if (isAuth || pathName === "/login") return;
    auth();
    // navigate("/login");
  }, [isAuth, dispatch, navigate, location]);

  useEffect(() => {
    const onPWA = async () => {
      const response = await firebase.onOffline().catch((msg) => {
        console.log(msg);
      });
    };
    onPWA();
  }, []);

  useEffect(() => {
    if (navigator.onLine) {
      dispatch(userActions.setOffline(false));
    } else {
      dispatch(userActions.setOffline(true));
    }
  }, [navigator.onLine, dispatch]);

  useEffect(() => {
    const getNotification = async () => {
      if (Notification.permission === "default") {
        const permission = await requestPermission();
        if (permission === "granted") {
          const token = await getMessageToken();
          console.log(token, "Token");
          const newTokenArr = [...user.pushToken, token];
          const update = {
            continueRemind: true,
            pushToken: newTokenArr,
          };
          console.log("granted");
          dispatch(asyncUserAction.updateUser(user.id, update));
        } else if (permission === "denied") {
          // FIXME filter token
          const token = await getMessageToken();
          console.log(token, "Token");
          const update = { continueRemind: false };
          console.log("denied");
          dispatch(asyncUserAction.updateUser(user.id, update));
        } else if (permission === "default") {
          console.log("notification default");
        }
      }
    };
    if (isAuth) {
      getNotification();
    }
  }, [dispatch, user, isAuth]);

  useEffect(() => {
    if (isAuth) {
      firebase.onMessageFromFCM();
    }
  }, [dispatch, isAuth]);

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
