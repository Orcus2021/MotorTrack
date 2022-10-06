import { useAppSelector } from "../store";

const useFindSecond = () => {
  const allRecord = useAppSelector((state) => [
    ...state.record.fee,
    ...state.record.refuel,
    ...state.record.repair,
  ]);
  const newArr = [...allRecord];
  newArr.sort((a, b) => {
    return b.mileage - a.mileage;
  });
  if (newArr.length >= 2) {
    return newArr[1].mileage;
  } else {
    return 0;
  }
};

export default useFindSecond;
