import React, { useEffect } from "react";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { useAppDispatch, useAppSelector } from "./store";
import asyncUserAction from "./store/user/asyncUserAction";
import { Outlet } from "react-router-dom";
import firebase from "./utils/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { createMessage, requestPermission } from "./utils/calcFunc";
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
    user-select: none;
  }
  :root{
   
    --thirdColor:#2196f3;
    /* --deepColor:#02697f;      */
     --deepColor:#1d3557;
     /* --deepColor:#051e34; */

    
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
  input,textarea{
    -webkit-user-select:auto; /*webkit瀏覽器*/  
    user-select:auto;
    -o-user-select:auto;
    -ms-user-select:auto; 
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
        console.log("onAuth App");
        dispatch(asyncUserAction.signIn(userId));
      }
    };
    const pathName = location.pathname;
    if (pathName === "/" && !isAuth) {
      auth();
      return;
    }
    if (isAuth || pathName === "/login") return;
    auth();
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
          let token = await firebase.getMessageToken().catch(async (e) => {
            console.log(e);
          });

          console.log(token);
          if (token) {
            const found = user.pushToken.find(
              (initToken) => initToken === token
            );
            let update;
            if (found) {
              update = { continueRemind: true };
            } else {
              const newTokenArr = [...user.pushToken, token];
              update = {
                continueRemind: true,
                pushToken: newTokenArr,
              };
            }

            dispatch(asyncUserAction.updateUser(user.id, update));
          }
        } else if (permission === "denied") {
          // FIXME filter token
          // const token = await getMessageToken();

          const update = { continueRemind: false };

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
