import engineOil from "../assets/parts/oil.png";
const parts = new Map([
  [
    "engineOil",
    {
      name: "機油",
      icon: engineOil,
      mileage: 1000,
      expirationMonth: 6,
      expirationYear: 0,
    },
  ],
  [
    "oilFilter",
    {
      name: "機油芯",
      icon: engineOil,
      mileage: 3000,
      expirationMonth: 0,
      expirationYear: 1,
    },
  ],
  [
    "airFilter",
    {
      name: "空氣濾芯",
      icon: engineOil,
      mileage: 5000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "frontWheel",
    {
      name: "前輪",
      icon: engineOil,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "backWheel",
    {
      name: "後輪",
      icon: engineOil,
      mileage: 8000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "chain",
    {
      name: "鍊條",
      icon: engineOil,
      mileage: 40000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "belt",
    {
      name: "皮帶",
      icon: engineOil,
      mileage: 20000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "coolingWater",
    {
      name: "水箱水",
      icon: engineOil,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 1,
    },
  ],
  [
    "sparkPlug",
    {
      name: "火星塞",
      icon: engineOil,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "battery",
    {
      name: "電瓶",
      icon: engineOil,
      mileage: 0,
      expirationMonth: 0,
      expirationYear: 2,
    },
  ],
  [
    "transmissionOil",
    {
      name: "變速箱油",
      icon: engineOil,
      mileage: 3000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "gearOil",
    {
      name: "齒輪油",
      icon: engineOil,
      mileage: 3000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "brakeOil",
    {
      name: "煞車油",
      icon: engineOil,
      mileage: 20000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "frontBrakeLining",
    {
      name: "煞車/來令片(前)",
      icon: engineOil,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "backBrakeLining",
    {
      name: "煞車/來令片(後)",
      icon: engineOil,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "frontShockAbsorber",
    {
      name: "避震器(前)",
      icon: engineOil,
      mileage: 100000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "backShockAbsorber",
    {
      name: "避震器(後)",
      icon: engineOil,
      mileage: 100000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "pulley",
    {
      name: "皮帶輪",
      icon: engineOil,
      mileage: 20000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "other",
    {
      name: "其他",
      icon: engineOil,
      mileage: 0,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
]);
export type partsMapType = {
  name: string;
  icon: string;
  mileage: number;
  expirationMonth: number;
  expirationYear: number;
};
export default parts;
