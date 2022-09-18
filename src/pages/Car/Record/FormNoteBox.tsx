import React, { FC } from "react";
import styled from "styled-components/macro";
import Textarea from "../../../components/Textarea";
import Button from "../../../components/Button/Button";

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
  return (
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
            handleClick={onDeleteRepair}
          />
        )}
        <Button
          label={updateId ? "更新" : "新增"}
          type="primary"
          size="medium"
          handleClick={onSubmit}
        />
      </ButtonBx>
    </Container>
  );
};

export default FormNoteBox;
