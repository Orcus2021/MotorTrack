import engineOil from "../assets/parts/oil.png";
import oilFilter from "../assets/parts/oil_filter_white.png";
import airFilter from "../assets/parts/engine_filter_white.png";
import wheel from "../assets/parts/tire_white.png";
import chain from "../assets/parts/timing_belt_white.png";
import belt from "../assets/parts/combo_belt_white.png";
import coolingWater from "../assets/parts/coolant_white.png";
import sparkPlug from "../assets/parts/spark_plug_white.png";
import battery from "../assets/parts/battery_white.png";
import transmissionOil from "../assets/parts/at_oil_white.png";
import gearOil from "../assets/parts/gear_oil_whtie.png";
import brakeOil from "../assets/parts/brake_fluid_white.png";
import brakeLining from "../assets/parts/brake_lining_white.png";
import shockAbsorber from "../assets/parts/shock_absorber_white.png";
import pulley from "../assets/parts/pulley_balls_white.png";
import other from "../assets/parts/custom_white.png";

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
      icon: oilFilter,
      mileage: 3000,
      expirationMonth: 0,
      expirationYear: 1,
    },
  ],
  [
    "airFilter",
    {
      name: "空氣濾芯",
      icon: airFilter,
      mileage: 5000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "frontWheel",
    {
      name: "前輪",
      icon: wheel,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "backWheel",
    {
      name: "後輪",
      icon: wheel,
      mileage: 8000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "chain",
    {
      name: "鍊條",
      icon: chain,
      mileage: 40000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "belt",
    {
      name: "皮帶",
      icon: belt,
      mileage: 20000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "coolingWater",
    {
      name: "水箱水",
      icon: coolingWater,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 1,
    },
  ],
  [
    "sparkPlug",
    {
      name: "火星塞",
      icon: sparkPlug,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "battery",
    {
      name: "電瓶",
      icon: battery,
      mileage: 0,
      expirationMonth: 0,
      expirationYear: 2,
    },
  ],
  [
    "transmissionOil",
    {
      name: "變速箱油",
      icon: transmissionOil,
      mileage: 3000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "gearOil",
    {
      name: "齒輪油",
      icon: gearOil,
      mileage: 3000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "brakeOil",
    {
      name: "煞車油",
      icon: brakeOil,
      mileage: 20000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "frontBrakeLining",
    {
      name: "煞車/來令片(前)",
      icon: brakeLining,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "backBrakeLining",
    {
      name: "煞車/來令片(後)",
      icon: brakeLining,
      mileage: 10000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "frontShockAbsorber",
    {
      name: "避震器(前)",
      icon: shockAbsorber,
      mileage: 100000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "backShockAbsorber",
    {
      name: "避震器(後)",
      icon: shockAbsorber,
      mileage: 100000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "pulley",
    {
      name: "皮帶輪",
      icon: pulley,
      mileage: 20000,
      expirationMonth: 0,
      expirationYear: 0,
    },
  ],
  [
    "other",
    {
      name: "其他",
      icon: other,
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
