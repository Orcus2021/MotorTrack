import { repairType, feeType, partType } from "../types/recordType";
import { carType } from "../types/carType";
import { userActions } from "../store/user/userReducer";
import { AppDispatch } from "../store";

export const formatDate = (date: Date) => {
  const padTo2Digits = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
};

export const carAgeAndInspectionDay = (date: string) => {
  const dateArr = date.split("-");
  const nowDate = new Date();
  const year = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];
  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth() + 1;
  const nowDay = nowDate.getDate();
  const ageYear = nowYear - Number(year);
  const ageMonth = nowMonth - Number(month);
  const ageDay = nowDay - Number(day);
  let months;
  if (ageDay >= 0) {
    months = ageYear * 12 + ageMonth;
  } else {
    months = ageYear * 12 + ageMonth - 1;
  }
  let age;
  if (months >= 12 && months % 12 === 0) {
    age = `${Math.floor(months / 12)}年`;
  } else if (months >= 12 && months % 12 !== 0) {
    age = `${Math.floor(months / 12)}年${months % 12}個月`;
  } else if (months <= 0) {
    age = "0個月";
  } else {
    age = `${months}個月`;
  }
  let inspectionDay: string = "";
  if (Math.floor(months / 12) < 5) {
    inspectionDay = `${nowYear + 5}-${month}-${day}`;
  } else if (Math.floor(months / 12) >= 5 && ageMonth >= 0 && ageDay >= 0) {
    inspectionDay = `${nowYear}-${month}-${day}`;
  } else if (
    (Math.floor(months / 12) >= 5 && ageMonth < 0) ||
    (Math.floor(months / 12) >= 5 && ageMonth === 0 && ageDay <= 0)
  ) {
    inspectionDay = `${nowYear + 1}-${month}-${day}`;
  }
  return { age, inspectionDay };
};

export const selectAnnualExpenses = (
  records: (repairType | feeType)[],
  year: string | undefined
) => {
  let expenses: number;
  if (year) {
    expenses = records
      .filter((record) => {
        const dateArr = record.date.split("-");
        return dateArr[0] === year;
      })
      .reduce((total, { amount }: { amount: number }) => total + amount, 0);
  } else {
    expenses = records.reduce(
      (total, { amount }: { amount: number }) => total + amount,
      0
    );
  }

  return expenses;
};

export const mileagePercent = (part: partType, car: carType) => {
  let message = "";
  const diffMileage = Number(part.endMileage) - Number(car?.mileage as number);
  let percent = Math.floor((diffMileage * 100) / part.mileage);
  if (diffMileage <= 0) {
    message = `超過${diffMileage}公里`;
  } else {
    message = `可用${diffMileage}公里`;
  }
  if (percent < 0) percent = 0;

  return { percent, message };
};

export const datePercent = (part: partType) => {
  if (part.month === 0 && part.year === 0) return null;
  let message = "";
  const startMillisecond = new Date(part.startDate).getTime();
  const endMillisecond = new Date(part.endDate).getTime();
  const nowMillisecond = new Date().getTime();
  const diffMillisecond = endMillisecond - startMillisecond;

  let percent = Math.floor(
    ((endMillisecond - nowMillisecond) * 100) / diffMillisecond
  );
  const months = Math.ceil(
    ((endMillisecond - nowMillisecond) / 1000) * 60 * 60 * 24 * 30
  );
  if (endMillisecond - nowMillisecond <= 0) {
    message = "使用期限已到";
  } else if (months >= 12) {
    message = `可用${Math.floor(months / 12)}年${months % 12}個月`;
  } else {
    message = `可用${months}個月`;
  }
  if (percent <= 0) percent = 0;

  return { percent, message };
};

export const getTodayMs = () => {
  const nowDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  ).getTime();
  return nowDate;
};

export const createMessage = (
  type: string,
  dispatch: AppDispatch,
  message: string
) => {
  const timerID = window.setTimeout(() => {
    dispatch(
      userActions.showNotification({
        status: false,
        type: "",
        message: "",
        timerId: "",
      })
    );
  }, 3000);
  dispatch(
    userActions.showNotification({
      status: true,
      type: type,
      message: message,
      timerId: timerID,
    })
  );
};
