import React, { useRef } from "react";
import styled from "styled-components/macro";
import Card from "../../../components/Layout/Card";
import { Img } from "../../../components/style";
import brands, { brandsMapType } from "../../../utils/brands";

const BrandsContainer = styled.div`
  border: 2px solid #a9c7fae1;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  margin: 10px;
  display: grid;
  justify-content: space-evenly;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-auto-rows: 125px;
  overflow-y: scroll;
  gap: 10px;
  padding: 10px;
  background: #a9c7fa1a;
  &::-webkit-scrollbar {
    width: 7px;
    position: fixed;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(136, 136, 136, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
  @media screen and (max-width: 701px) {
    height: 290px;
  }
`;

const BrandCard = styled.div<{ $isSelected: boolean }>`
  height: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;
const ImgBox = styled.div`
  width: 80px;
  height: 80px;
  background-color: #ffffff8b;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  margin-bottom: 5px;
`;
const BrandImg = styled(Img)`
  width: 90%;
  height: 90%;
  top: 5%;
  left: 5%;
  object-fit: contain;
`;
const Name = styled.p`
  font-size: 12px;
`;

type Props = {
  onBrand: (name: string, key: string) => void;
  brandName: brandType;
};

type brandType = { name: string; key: string };
const Brands: React.FC<Props> = (props) => {
  const { onBrand, brandName } = props;
  const allBrands = useRef<[string, brandsMapType][]>(Array.from(brands));
  return (
    <BrandsContainer>
      {allBrands.current.map((brand) => {
        return (
          <Card
            key={brand[1].name}
            width={100}
            isSelect={brand[1].name === brandName.name}
            hover={true}
            boxShadow={true}
          >
            <BrandCard
              $isSelected={brand[1].name === brandName.name}
              onClick={() => {
                onBrand(brand[1].name, brand[0]);
              }}
            >
              <ImgBox>
                <BrandImg src={brand[1].img} />
              </ImgBox>
              <Name>{brand[1].name}</Name>
            </BrandCard>
          </Card>
        );
      })}
    </BrandsContainer>
  );
};

export default Brands;
