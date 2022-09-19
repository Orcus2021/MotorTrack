import React, { FC } from "react";
import styled from "styled-components/macro";
import { Img } from "../../components/style";
import { useAppSelector } from "../../store";
import brands from "../../utils/brands";

const SubCarsWrapper = styled.div<{ $isShow: boolean }>`
  left: ${(props) => (props.$isShow ? "65px" : " -100%")};
  width: 150px;
  position: absolute;
  top: 290px;
  backdrop-filter: blur(5px);
  border-radius: 0 8px 8px 0;
  /* background: rgba(255, 255, 255, 0.15); */
  background: var(--deepColor);
  overflow: overlay;
  z-index: 2;
  transition: all 0.5s;
`;
const SubCarWrapper = styled.div<{ $isSelect: boolean }>`
  width: 100%;
  padding: 5px;
  cursor: pointer;
  background-color: ${(props) => props.$isSelect && "var(--mainColor)"};
  &:hover {
    background-color: var(--mainColor);
  }
`;
const CarInfoBx = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const SubImgBx = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  margin-right: 5px;
  min-width: 20px;
`;

const SubCarNum = styled.p`
  font-size: 12px;
  min-width: 61px;
`;

const SubCarInfo = styled.p`
  font-size: 12px;
  flex-grow: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubCarsBox: FC<{
  showCars: boolean;
  onSelect: (id: string, ownerId: string) => Promise<void>;
  onShow: () => void;
}> = (props) => {
  const { showCars, onSelect, onShow } = props;
  const cars = useAppSelector((status) => status.car.cars);

  const carID = useAppSelector((state) => state.car.car?.id);

  return (
    <SubCarsWrapper $isShow={showCars}>
      {cars.map((car) => (
        <SubCarWrapper
          $isSelect={car.id === carID}
          key={car.id}
          onClick={() => {
            onSelect(car.id, car.ownerId);
            onShow();
          }}
        >
          <CarInfoBx>
            <SubImgBx>
              <Img src={brands.get(car.brand)?.img} />
            </SubImgBx>
            <SubCarNum>{car.plateNum}</SubCarNum>
            <SubCarInfo key={car.id}>{car.name}</SubCarInfo>
          </CarInfoBx>
        </SubCarWrapper>
      ))}
    </SubCarsWrapper>
  );
};

export default SubCarsBox;
