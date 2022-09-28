import React, { useState } from "react";
import styled from "styled-components/macro";
import TableBox from "../../../../components/Table/TableBox";
import RepairItem from "./RepairItem";
import MessageBox from "../../../../components/Modal/MessageBox";
import { partType } from "../../../../types/recordType";
import Modal from "../../../../components/Modal/Modal";
import PartForm from "./PartForm";
import IconButton from "../../../../components/Button/IconButton";
import { Img } from "../../../../components/style";
import TableBoxRepair from "../../../../components/Table/TableBoxRepair";

import circlePlusIcon from "../../../../assets/icon/circle-plus-white.png";

import plusIconWhite from "../../../../assets/icon/plus-white.png";
const HeaderBx = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.p`
  font-size: 16px;
  margin-left: 20px;
  background-color: var(--deepColor);
  border-radius: 10px 10px 0 0;
  padding: 5px 10px 2px 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
`;

const MessageTable = styled.table`
  border: 1px solid black;
  width: 100%;
  border: 0;
  border-collapse: collapse;
`;
const ImgBx = styled.div`
  position: relative;
  margin-top: 10px;
  width: 80px;
  height: 80px;
  opacity: 0.5;
`;
const ImgWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const tableTitle = [
  { title: "零件/項目", width: "100px" },
  { title: "規格", width: "80px" },
  { title: "使用期限", width: "100px" },
  { title: "使用里程", width: "auto" },
  { title: "單價", width: "80px" },
  { title: "數量", width: "50px" },
  { title: "小計", width: "80px" },
  { title: "備註", width: "80px" },
  { title: "刪除", width: "50px" },
];
const tableTitleRwd = [
  { title: "零件/項目", width: "100px" },
  { title: "小計", width: "100px" },
  { title: "備註", width: "auto" },
  { title: "刪除", width: "50px" },
];

const RepairList: React.FC<{
  onAdd: (part: partType) => void;
  parts: partType[] | [];
  onDeletePart: (removePart: partType) => void;
}> = (props) => {
  const { onAdd, parts, onDeletePart } = props;

  const [showPartForm, setShowPartForm] = useState<boolean>(false);
  const [closeEffect, setCloseEffect] = useState<boolean>(false);
  const [selectPartIndex, setSelectPartIndex] = useState<number>(NaN);
  const showPartHandler = () => {
    setShowPartForm(true);
    setSelectPartIndex(NaN);
  };
  const closePartForm = () => {
    setCloseEffect(true);
    setSelectPartIndex(NaN);
    setTimeout(() => {
      setShowPartForm(false);
      setCloseEffect(false);
    }, 600);
  };
  const selectPartHandler = (index: number) => {
    setSelectPartIndex(index);
  };

  return (
    <>
      <HeaderBx>
        <Title>維修/保養項目</Title>
        <IconButton
          label="新增"
          icon={plusIconWhite}
          handleClick={showPartHandler}
        />
      </HeaderBx>
      <TableBox titles={tableTitle}>
        {parts.length > 0 && (
          <MessageTable>
            <tbody>
              {parts.map((record, index) => (
                <RepairItem
                  key={record.recordID}
                  record={record}
                  onShow={showPartHandler}
                  onSelect={() => selectPartHandler(index)}
                  onDeletePart={onDeletePart}
                  rwd={false}
                />
              ))}
            </tbody>
          </MessageTable>
        )}
        {parts.length === 0 && (
          <ImgWrapper onClick={showPartHandler}>
            <ImgBx>
              <Img src={circlePlusIcon} />
            </ImgBx>
          </ImgWrapper>
        )}
      </TableBox>
      <TableBoxRepair titles={tableTitleRwd}>
        {parts.length > 0 && (
          <MessageTable>
            <tbody>
              {parts.map((record, index) => (
                <RepairItem
                  key={record.recordID + "rwd"}
                  record={record}
                  onShow={showPartHandler}
                  onSelect={() => selectPartHandler(index)}
                  onDeletePart={onDeletePart}
                  rwd={true}
                />
              ))}
            </tbody>
          </MessageTable>
        )}
        {parts.length === 0 && (
          <ImgWrapper onClick={showPartHandler}>
            <ImgBx>
              <Img src={circlePlusIcon} />
            </ImgBx>
          </ImgWrapper>
        )}
      </TableBoxRepair>
      {showPartForm && (
        <Modal
          closeEffect={closeEffect}
          onClose={closePartForm}
          containerWidth={400}
        >
          <MessageBox setStyle={{ height: "auto", width: 400 }}>
            <PartForm
              onAddPart={onAdd}
              onClose={closePartForm}
              part={parts[selectPartIndex]}
            />
          </MessageBox>
        </Modal>
      )}
    </>
  );
};

export default RepairList;
