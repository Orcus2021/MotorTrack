import React from "react";
import styled from "styled-components/macro";
import { partType } from "../../../../types/recordType";
const ContentWrapper = styled.tr``;
const Content = styled.td`
  font-size: 16px;
  text-align: center;
`;
type Props = {
  record: partType;
  onShow: () => void;
  onSelect: () => void;
};
const RepairItem: React.FC<Props> = (props) => {
  const { record, onShow, onSelect } = props;
  const showPartFormHandler = () => {
    onShow();
    onSelect();
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
    </ContentWrapper>
  );
};

export default RepairItem;
