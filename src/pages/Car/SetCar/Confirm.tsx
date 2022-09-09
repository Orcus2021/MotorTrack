import React from "react";
import styled from "styled-components/macro";
import MessageBox from "../../../components/Modal/MessageBox";

const BtnBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ConfirmBtn = styled.button`
  border: none;
  background-color: var(--errorColor);
  padding: 5px 10px;
  cursor: pointer;
`;
const RejectBtn = styled.button`
  border: none;
  background-color: var(--mainColor);
  padding: 5px 10px;
  cursor: pointer;
`;
const Message = styled.p`
  width: 100%;
  font-size: 16px;
  text-align: center;
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
        <ConfirmBtn onClick={deleteHandler}>刪除</ConfirmBtn>
        <RejectBtn onClick={rejectHandler}>取消</RejectBtn>
      </BtnBx>
    </MessageBox>
  );
};

export default Confirm;
