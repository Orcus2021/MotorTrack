import styled from "styled-components";
import ReactDOM from "react-dom";
import React from "react";

const Back = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
`;
const ModalBx = styled.div<{ $isClose: boolean }>`
  top: 30vh;
  left: calc(50% - 250px);
  z-index: 101;
  animation: ${(props) =>
    props.$isClose
      ? "slide-up 500ms ease-out forwards;"
      : "slide-down 500ms ease-out forwards;"};
  position: fixed;
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-10rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slide-up {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10rem);
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ModalOverlay: React.FC<{
  closeEffect: boolean;
  children?: React.ReactNode;
}> = (props) => {
  const { closeEffect } = props;

  return (
    <ModalBx $isClose={closeEffect}>
      <ModalContent>{props.children}</ModalContent>
    </ModalBx>
  );
};
const Backdrop: React.FC<{
  onClose: () => void;
  children?: React.ReactNode;
}> = (props) => {
  return <Back onClick={props.onClose}></Back>;
};
type Props = {
  closeEffect: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<Props> = (props: Props) => {
  const { onClose, closeEffect } = props;

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={onClose}>{props.children}</Backdrop>,
        document.getElementById("overlay") as HTMLElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay closeEffect={closeEffect}>{props.children}</ModalOverlay>,
        document.getElementById("overlay") as HTMLElement
      )}
    </>
  );
};
export default Modal;
