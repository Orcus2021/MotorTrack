import { FC } from "react";
import styled from "styled-components/macro";
import Card from "../../components/Layout/Card";
import { Img } from "../../components/style";
import { useAppSelector } from "../../store";
import brands from "../../utils/brands";

const CarsContainer = styled.div`
  border-radius: 8px;
  padding: 10px 20px;
  min-width: 256px;
  height: calc(100% - 285px);
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
  overflow: overlay;
`;

const CarWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const CarInfoBx = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ImgBox = styled.div`
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  margin-right: 20px;
  cursor: pointer;
`;

const CarNum = styled.p`
  font-size: 16px;
  min-width: 82px;
  color: var(--lightColor);
`;

const CarInfo = styled.p`
  font-size: 14px;
  flex-grow: 1;
  max-width: 69px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  onSelect: (id: string, ownerId: string) => Promise<void>;
};
const CarsBox: FC<Props> = (props) => {
  const { onSelect } = props;
  const cars = useAppSelector((status) => status.car.cars);
  const carID = useAppSelector((state) => state.car.car?.id);
  return (
    <CarsContainer>
      {cars.map((car) => (
        <CarWrapper key={car.id} onClick={() => onSelect(car.id, car.ownerId)}>
          <Card hover={true} isSelect={car.id === carID}>
            <CarInfoBx>
              <ImgBox>
                <Img src={brands.get(car.brand)?.img} />
              </ImgBox>
              <CarNum>{car.plateNum}</CarNum>
              <CarInfo key={car.id}>{car.name}</CarInfo>
            </CarInfoBx>
          </Card>
        </CarWrapper>
      ))}
    </CarsContainer>
  );
};

export default CarsBox;
