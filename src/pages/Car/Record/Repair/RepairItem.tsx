import React from "react";
import styled from "styled-components/macro";
import { partType } from "../../../../types/recordType";

import trashIcon from "../../../../assets/trash.png";

const ContentWrapper = styled.tr``;
const Content = styled.td`
  font-size: 16px;
  text-align: center;
`;
const IconBx = styled.td`
  position: relative;
  height: 20px;
  width: 20px;
  cursor: pointer;
`;
const Icon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
type Props = {
  record: partType;
  onShow: () => void;
  onSelect: () => void;
  onDeletePart: (removePart: partType) => void;
};
const RepairItem: React.FC<Props> = (props) => {
  const { record, onShow, onSelect, onDeletePart } = props;

  const showPartFormHandler = () => {
    onShow();
    onSelect();
  };
  const deletePartHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeletePart(record);
  };

  return (
    <ContentWrapper onClick={showPartFormHandler}>
      <Content>{record.category}</Content>
      <Content>{record.spec}</Content>
      <Content>
        {record.year > 0 && `${record.year}年`}
        {record.month > 0 && `${record.month}月`}
      </Content>
      <Content>{record.mileage}</Content>
      <Content>{record.price}</Content>
      <Content>{record.qty}</Content>
      <Content>{record.subtotal}</Content>
      <Content>{record.note}</Content>
      <IconBx onClick={deletePartHandler}>
        <Icon src={trashIcon} />
      </IconBx>
    </ContentWrapper>
  );
};

export default RepairItem;
