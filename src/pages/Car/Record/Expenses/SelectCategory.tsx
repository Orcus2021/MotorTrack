import React from "react";
import styled from "styled-components/macro";
import expenseCategory from "../../../../utils/expenseItem";

const Container = styled.div`
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(1, 0, 44, 0.2);
  border-radius: 8px;
  backdrop-filter: blur(5px);
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px;
`;
const CardBx = styled.div`
  flex-grow: 1;
`;
const Card = styled.div<{ $isSelect: boolean }>`
  height: 90px;
  width: 80px;
  padding: 5px;
  display: flex;
  border-radius: 4px;
  flex-direction: column;
  align-items: center;

  box-shadow: ${(props) =>
    props.$isSelect && "0px 0px 10px  var(--lightColor)"};
  border: 2px solid
    ${(props) => (props.$isSelect ? "var(--lightColor)" : "transparent")};
  cursor: pointer;
  &:hover {
    border: 2px solid var(--mainColor);
  }
`;
const Icon = styled.img`
  padding: 10px;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  object-fit: cover;
  /* background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); */
  background: linear-gradient(
    120deg,
    var(--secondColor) 0%,
    var(--mainColor) 100%
  ); ;
`;
const Category = styled.p`
  margin-top: 5px;
  font-size: 12px;
  color: #fff;
`;

const SelectCategory: React.FC<{
  onSelect: (key: string) => void;
  selectCategory: string;
}> = ({ onSelect, selectCategory }) => {
  const selectHandler = (key: string) => {
    onSelect(key);
  };

  const categories: JSX.Element[] = [];
  expenseCategory.forEach((value, key) => {
    categories.push(
      <CardBx key={value.name}>
        <Card
          $isSelect={selectCategory === key}
          onClick={() => selectHandler(key)}
        >
          <Icon src={value.icon} />
          <Category>{value.name}</Category>
        </Card>
      </CardBx>
    );
  });

  return <Container>{categories}</Container>;
};

export default SelectCategory;
