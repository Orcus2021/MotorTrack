import React from "react";
import styled from "styled-components/macro";
import cancelIcon from "../assets/icon/cancel-black.png";
import { Img } from "./style";
import { userActions } from "../store/user/userReducer";
import { useAppSelector, useAppDispatch } from "../store";
import { useDispatch } from "react-redux";

const Container = styled.div<{
  $isShow: boolean | undefined;
  $isError: boolean;
}>`
  position: fixed;
  height: 50px;
  top: 68px;
  right: -100%;
  ${(props) => props.$isShow && "right: 10px;"}
  background-color:${(props) =>
    props.$isError ? "var(--errorColor)" : "var(--lightColor)"};
  border-radius: 4px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: 0.7s ease-out;
`;
const Message = styled.p`
  color: var(--mainBack);
  position: relative;
  top: -5px;
`;
// mix-blend-mode: screen;
const IconBx = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  cursor: pointer;
  align-self: flex-end;
`;
const Icon = styled(Img)``;
const SlideMessage = () => {
  const notification = useAppSelector((state) => state.user.notification);
  const dispatch = useAppDispatch();
  console.log(notification?.type);
  const closeHandler = () => {
    clearTimeout(notification?.timerId);
    dispatch(
      userActions.showNotification({ status: false, type: "", message: "" })
    );
  };

  return (
    <Container
      $isShow={notification?.status}
      $isError={notification?.type === "error"}
    >
      <IconBx onClick={closeHandler}>
        <Icon src={cancelIcon} />
      </IconBx>
      <Message>{notification?.message}</Message>
    </Container>
  );
};

export default SlideMessage;
