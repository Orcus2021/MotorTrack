import { FC } from "react";
import styled from "styled-components/macro";
import { Img } from "../../components/style";
import { useAppSelector } from "../../store";
import brands from "../../utils/brands";

const SubCarsContainer = styled.div<{ $isShow: boolean }>`
  left: ${(props) => (props.$isShow ? "65px" : " -100%")};
  width: 150px;
  position: absolute;
  top: 290px;
  backdrop-filter: blur(5px);
  border-radius: 0 8px 8px 0;
  background: var(--deepColor);
  overflow: overlay;
  z-index: 2;
  transition: all 0.5s;
  box-shadow: 0px 2px 8px rgb(0, 0, 0);
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
const CarInfoBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const SubImgBox = styled.div`
  width: 22px;
  height: 22px;
  position: relative;
  margin-right: 5px;
  min-width: 22px;
`;

const SubCarNum = styled.p`
  font-size: 14px;
  min-width: 71px;
  width: 71px;
`;

const SubCarInfo = styled.p`
  font-size: 14px;
  flex-grow: 1;
  padding-left: 5px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  showCars: boolean;
  onSelect: (id: string, ownerId: string) => Promise<void>;
  onShow: () => void;
  onClose: () => void;
};

const SubCarsBox: FC<Props> = (props) => {
  const { showCars, onSelect, onShow, onClose } = props;
  const cars = useAppSelector((status) => status.car.cars);

  const carID = useAppSelector((state) => state.car.car?.id);

  return (
    <SubCarsContainer $isShow={showCars} onMouseLeave={onClose}>
      {cars.map((car) => (
        <SubCarWrapper
          $isSelect={car.id === carID}
          key={car.id}
          onClick={() => {
            onSelect(car.id, car.ownerId);
            onShow();
          }}
        >
          <CarInfoBox>
            <SubImgBox>
              <Img src={brands.get(car.brand)?.img} />
            </SubImgBox>
            <SubCarNum>{car.plateNum}</SubCarNum>
            <SubCarInfo key={car.id}>{car.name}</SubCarInfo>
          </CarInfoBox>
        </SubCarWrapper>
      ))}
    </SubCarsContainer>
  );
};

export default SubCarsBox;
