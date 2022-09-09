import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { useAppDispatch, useAppSelector } from "../store";
import asyncUserAction from "../store/user/asyncUserAction";
import { resultType } from "../types/recordType";
import MessageBox from "../components/Modal/MessageBox";

const Message = styled.p`
  font-size: 16px;
`;
const ConfirmBtn = styled.button`
  border: none;
  background-color: var(--mainColor);
`;
const RejectBx = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const RejectRemind = styled.input.attrs({ type: "checkbox" })`
  width: 12px;
  height: 12px;
  margin-right: 5px;
`;
const RejectLabel = styled.label`
  font-size: 12px;
`;

const Remind: React.FC<{ onClose: () => void; remindMessages: resultType }> = (
  props
) => {
  const { onClose, remindMessages } = props;
  const user = useAppSelector((state) => state.user.user);
  const [messages, setMessages] = useState<string[]>();
  const [rejectRemind, setRejectRemind] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let messages: string[] = [];
    if (user.insuranceRemind) {
      remindMessages.forEach((data) => {
        if (data?.insurance) {
          messages.push(`車牌:${data.plateNum}，保險即將到期`);
        }
      });
    }
    if (user.inspectionRemind) {
      remindMessages.forEach((data) => {
        if (data?.inspection) {
          messages.push(`車牌:${data.plateNum}，驗車即將到期`);
        }
      });
    }
    setMessages(messages);
  }, [remindMessages, user]);

  const closeRemindHandler = () => {
    if (rejectRemind) {
      dispatch(asyncUserAction.updateUser(user.id, { continueRemind: false }));
    }
    onClose();
  };
  const rejectRemindHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRejectRemind(e.target.checked);
  };

  return (
    <MessageBox setStyle={{ width: 400, height: 200 }}>
      {messages?.map((msg) => (
        <Message>{msg}</Message>
      ))}
      <RejectBx>
        <RejectRemind checked={rejectRemind} onChange={rejectRemindHandler} />
        <RejectLabel>到期前不在提醒</RejectLabel>
      </RejectBx>

      <ConfirmBtn onClick={closeRemindHandler}>確認</ConfirmBtn>
    </MessageBox>
  );
};

export default Remind;
