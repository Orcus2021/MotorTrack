import React, { useRef } from "react";
import styled from "styled-components/macro";
import brands, { brandsMapType } from "../../../utils/brands";
import { Img } from "../../../components/style";

const BrandBx = styled.div`
  border: 1px solid #fff;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  overflow-y: auto;
`;

const BrandCard = styled.div<{ $isSelected: boolean }>`
  width: 90px;
  height: 115px;
  border-radius: 10px;
  margin: 5px;
  background-color: ${(props) =>
    props.$isSelected ? "var(--mainColor)" : "var(--thirdBack)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5px;
  cursor: pointer;
`;
const ImgBx = styled.div`
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
  font-size: 10px;
`;
type brandType = { name: string; key: string };
const Brands: React.FC<{
  onBrand: (name: string, key: string) => void;
  brandName: brandType;
}> = (props) => {
  const { onBrand, brandName } = props;
  const allBrands = useRef<[string, brandsMapType][]>(Array.from(brands));
  return (
    <BrandBx>
      {allBrands.current.map((brand) => {
        return (
          <BrandCard
            key={brand[1].name}
            $isSelected={brand[1].name === brandName.name}
            onClick={() => {
              onBrand(brand[1].name, brand[0]);
            }}
          >
            <ImgBx>
              <BrandImg src={brand[1].img} />
            </ImgBx>
            <Name>{brand[1].name}</Name>
          </BrandCard>
        );
      })}
    </BrandBx>
  );
};

export default Brands;
