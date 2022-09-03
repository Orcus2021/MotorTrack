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
