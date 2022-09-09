import React, { useEffect, useState, useRef } from "react";
import { userActions } from "../../store/user/userReducer";
import { useAppDispatch, useAppSelector } from "../../store";
import Loading from "../../components/Loading/Loading";
import SlideMessage from "../../components/SlideMessage";

const Home = () => {
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const [showMessage, setShowMessage] = useState(false);
  const TimerId = useRef<number>(NaN);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(userActions.loading(true));
    setTimeout(() => {
      dispatch(userActions.loading(false));
    }, 1000);
  }, [dispatch]);

  const showHandler = () => {
    TimerId.current = window.setTimeout(() => {
      dispatch(
        userActions.showNotification({
          status: false,
          type: "",
          message: "",
          timerId: "",
        })
      );
    }, 3000);
    dispatch(
      userActions.showNotification({
        status: true,
        type: "error",
        message: "開心",
        timerId: TimerId.current,
      })
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      <div onClick={showHandler}>Home</div>
    </>
  );
};

export default Home;
