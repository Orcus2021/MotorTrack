import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { createGlobalStyle } from "styled-components/macro";
import Footer from "./components/Layout/Footer";
import Header from "./components/Layout/Header";
import SlideMessage from "./components/SlideMessage";
import { useAppDispatch, useAppSelector } from "./store";
import asyncUserAction from "./store/user/asyncUserAction";
import { userActions } from "./store/user/userReducer";
import { createMessage, requestPermission } from "./utils/calcFunc";
import firebase from "./utils/firebase";

export const GlobalStyle = createGlobalStyle`

  *{
    box-sizing: border-box;
    margin: 0;
    padding:0;
    font-family: 'Noto Sans TC',  'Poppins', "sans-serif";
    user-select: none;
  }
  :root{
   
   
     --deepColor:#1d3557;        
     --mainColor:#4581ea;
     --lightColor:#a9c7fa;

     --secondColor:rgb(224, 195, 252);
    --textColor:#e6fdff;
    --textDeepColor:rgb(37, 87, 132);

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
    background: linear-gradient(var(--mainBack), var(--secondBack)); 
    width: 100%;
    min-height:100vh;
    padding-top:68px ;
    position:relative;
    min-width: 350px;

    
  }

`;

const App = () => {
  const isAuth = useAppSelector((state) => state.user.isAuth);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isMountedPWA = useRef<boolean>(true);
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
    if (pathName === "/" && !isAuth) {
      auth();
      return;
    }
    if (isAuth || pathName === "/login") return;
    auth();
  }, [isAuth, dispatch, navigate, location]);

  useEffect(() => {
    const onPWA = async () => {
      await firebase.onOffline().catch((msg) => {
        console.log(msg);
      });
    };

    if (isMountedPWA.current) {
      onPWA();
      isMountedPWA.current = false;
    }
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

  // useEffect(() => {
  //   if (isAuth) {
  //     firebase.onMessageFromFCM();
  //   }
  // }, [dispatch, isAuth]);

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
