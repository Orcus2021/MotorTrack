import { AppDispatch } from "../store";
import { userActions } from "../store/user/userReducer";
import { carType } from "../types/carType";
import { geolocationOptionType, positionType } from "../types/mapType";
import { feeType, partType, repairType } from "../types/recordType";
import firebase from "./firebase";

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
  if (part.startMileage === part.endMileage) return null;
  let message = "";
  const diffMileage = Number(part.endMileage) - Number(car?.mileage as number);
  let percent = 0;
  if (diffMileage > 0) {
    percent = Math.floor((diffMileage * 100) / part.mileage);
  }

  if (diffMileage <= 0) {
    message = `超過${diffMileage * -1}公里`;
  } else {
    message = `可用${diffMileage}公里`;
  }
  if (percent <= 0) percent = 0;

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
    (endMillisecond - nowMillisecond) / (1000 * 60 * 60 * 24 * 30)
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
type messageType = {
  percent: number;
  message: string;
};

export const compareDateAndMileage = (
  part: partType,
  car: carType
): messageType => {
  const mileage = mileagePercent(part, car);
  const date = datePercent(part);

  if (!date && !mileage) {
    return {
      percent: 0,
      message: "無法追蹤",
    };
  } else if (!date) {
    return mileage as messageType;
  } else if (!mileage) {
    return date;
  } else if (date.percent < mileage.percent) {
    return date;
  } else {
    return mileage;
  }
};

export const requestPermission = async () => {
  const permission = await Notification.requestPermission();
  return permission;
};
export const getMessageToken = async () => {
  try {
    const response = await firebase.getMessageToken().catch((msg) => {
      console.log(msg);
    });
    return response as string;
  } catch (err) {
    console.log(err);
  }
};
export const getUserLocation = (options: geolocationOptionType) => {
  return new Promise(
    async (
      resolve: (value: positionType) => void,
      reject: (value: string) => void
    ) => {
      if (navigator.geolocation) {
        const success = (pos: GeolocationPosition) => {
          const crd = pos.coords;
          const position: positionType = {
            lat: crd.latitude,
            lng: crd.longitude,
          };
          resolve(position);
        };
        const error = (err: any) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          reject(`ERROR(${err.code}): ${err.message}`);
        };
        navigator.geolocation.getCurrentPosition(success, error, options);
      } else {
        console.log("Geolocation is not supported for this Browser/OS.");
      }
    }
  );
};

export const calcDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: string
) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === "K") {
      dist = dist * 1.609344;
    }
    if (unit === "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
};
