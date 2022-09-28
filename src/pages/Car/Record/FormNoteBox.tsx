import React, { FC, useState } from "react";
import styled from "styled-components/macro";
import Textarea from "../../../components/Input/Textarea";
import Button from "../../../components/Button/Button";
import Modal from "../../../components/Modal/Modal";
import Confirm from "../../../components/Modal/Confirm";
const Container = styled.div`
  position: relative;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(1, 0, 44, 0.2);
  backdrop-filter: blur(5px);
  padding: 20px 10px 5px 10px;
  border-radius: 8px;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  margin: 20px 0;
`;
const ButtonBx = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

type Props = {
  onCloseRepair: () => void;
  onDeleteRepair: () => void;
  updateId: string;
  onSubmit: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

const FormNoteBox: FC<Props> = ({
  onCloseRepair,
  onDeleteRepair,
  updateId,
  onSubmit,
}) => {
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const callConfirm = () => {
    setShowConfirm(true);
  };
  const closePartForm = () => {
    setCloseEffect(true);

    setTimeout(() => {
      setShowConfirm(false);
      setCloseEffect(false);
    }, 600);
  };
  return (
    <>
      <Container>
        <Textarea content="備註" name="note" height={150} />
        <ButtonBx>
          <Button
            label="取消"
            type="cancel"
            size="medium"
            handleClick={onCloseRepair}
          />
          {updateId && (
            <Button
              label="刪除"
              type="reject"
              size="medium"
              handleClick={callConfirm}
            />
          )}
          <Button
            label={updateId ? "更新" : "新增"}
            type="primary"
            size="medium"
            handleClick={onSubmit}
          />
        </ButtonBx>
        {showConfirm && (
          <Modal
            closeEffect={closeEffect}
            onClose={closePartForm}
            containerWidth={400}
          >
            <Confirm onClose={closePartForm} onDelete={onDeleteRepair} />
          </Modal>
        )}
      </Container>
    </>
  );
};

export default FormNoteBox;
