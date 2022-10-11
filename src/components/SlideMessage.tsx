import styled from "styled-components/macro";
import cancelIcon from "../assets/icon/cancel-black.png";
import { useAppDispatch, useAppSelector } from "../store";
import { userActions } from "../store/user/userReducer";
import { Img } from "./style";

const SlideContainer = styled.div<{
  $isShow: boolean | undefined;
  $isError: boolean;
  $isAlert: boolean;
}>`
  position: fixed;
  height: 50px;
  top: 68px;
  right: -100%;

  ${(props) => props.$isShow && "right: 10px;"}
  background-color:${(props) => {
    if (props.$isError) return "var(--errorColor)";
    if (props.$isAlert) return "#ffee8b";
    return "var(--lightColor)";
  }};
  border-radius: 4px;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: 0.7s ease-out;
  z-index: 101;
`;
const Message = styled.p`
  color: var(--mainBack);
  position: relative;
  top: -5px;
`;
const IconBox = styled.div`
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

  const closeHandler = () => {
    clearTimeout(notification?.timerId);
    dispatch(
      userActions.showNotification({ status: false, type: "", message: "" })
    );
  };

  return (
    <SlideContainer
      $isShow={notification?.status}
      $isError={notification?.type === "error"}
      $isAlert={notification?.type === "alert"}
    >
      <IconBox onClick={closeHandler}>
        <Icon src={cancelIcon} />
      </IconBox>
      <Message>{notification?.message}</Message>
    </SlideContainer>
  );
};

export default SlideMessage;
