import React from "react";
import styled from "styled-components/macro";
import MessageBox from "../../../components/Modal/MessageBox";
import Button from "../../../components/Button";

const BtnBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
`;

const Message = styled.p`
  width: 100%;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
`;

const Confirm: React.FC<{ onClose: () => void; onDelete: () => void }> = (
  props
) => {
  const { onClose, onDelete } = props;
  const rejectHandler = () => {
    onClose();
  };
  const deleteHandler = () => {
    onDelete();
  };

  return (
    <MessageBox setStyle={{ width: 400, height: 200 }}>
      <Message>確定要刪除嗎?</Message>
      <BtnBx>
        <Button label="刪除" type="reject" handleClick={deleteHandler} />
        <Button label="取消" type="cancel" handleClick={rejectHandler} />
      </BtnBx>
    </MessageBox>
  );
};

export default Confirm;
