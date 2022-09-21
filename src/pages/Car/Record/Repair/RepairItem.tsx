import React from "react";
import styled from "styled-components/macro";
import { partType } from "../../../../types/recordType";
import parts from "../../../../utils/parts";

import trashIcon from "../../../../assets/trash.png";

const ContentWrapper = styled.tr`
  height: 28px;
  cursor: pointer;
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.22);
  }
  &:hover {
    background-color: var(--mainColor);
    color: black;
  }
`;
const Content = styled.td<{ $width: string }>`
  font-size: 16px;
  text-align: center;
  width: ${(props) => props.$width};
  max-width: ${(props) => props.$width};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const IconWrapper = styled.td`
  position: relative;
  width: 50px;
  text-align: center;
  vertical-align: middle;
`;
const IconBox = styled.span`
  position: relative;
  display: inline-block;
  margin-top: 2px;
  height: 20px;
  width: 20px;
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
  rwd: boolean;
};
const RepairItem: React.FC<Props> = (props) => {
  const { record, onShow, onSelect, onDeletePart, rwd } = props;
  const { category, spec, year, month, mileage, price, qty, subtotal, note } =
    record;

  const showPartFormHandler = () => {
    onShow();
    onSelect();
  };
  const deletePartHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeletePart(record);
  };

  const deadline = () => {
    let msg: string = "";
    if (year > 0) {
      msg += `${year}年`;
    } else if (month > 0) {
      msg += `${month}月`;
    } else if (year === 0 && month === 0) {
      msg = "---";
    }
    return msg;
  };

  const tableContent = [
    { content: parts.get(category)?.name, width: "100px" },
    { content: spec, width: "80px" },
    { content: deadline(), width: "100px" },
    { content: mileage, width: "auto" },
    { content: price, width: "80px" },
    { content: qty, width: "50px" },
    { content: subtotal, width: "80px" },
    { content: note, width: "80px" },
  ];
  const tableContentRwd = [
    { content: parts.get(category)?.name, width: "100px" },
    { content: subtotal, width: "100px" },
    { content: note, width: "auto" },
  ];

  return (
    <ContentWrapper onClick={showPartFormHandler}>
      {!rwd &&
        tableContent.map((content, index) => (
          <Content key={content.content + `${index}`} $width={content.width}>
            {content.content}
          </Content>
        ))}
      {rwd &&
        tableContentRwd.map((content) => (
          <Content key={content.content + "rwd"} $width={content.width}>
            {content.content}
          </Content>
        ))}
      <IconWrapper onClick={deletePartHandler}>
        <IconBox>
          <Icon src={trashIcon} />
        </IconBox>
      </IconWrapper>
    </ContentWrapper>
  );
};

export default RepairItem;
