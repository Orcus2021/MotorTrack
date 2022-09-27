import refuelIcon from "../assets/icon/fuel-black.png";
import washIcon from "../assets/expense/shower.png";
import parkIcon from "../assets/expense/parking.png";
import taxesIcon from "../assets/expense/taxes.png";
import feeIcon from "../assets/expense/coin.png";
import insuranceIcon from "../assets/expense/insurance.png";
import transportIcon from "../assets/expense/plane.png";
import journeyIcon from "../assets/expense/luggage.png";
import otherIcon from "../assets/expense/custom_1.png";

const expenseCategory = new Map([
  ["refuel", { name: "加油/充電", icon: refuelIcon }],
  ["wash", { name: "洗車", icon: washIcon }],
  ["park", { name: "停車", icon: parkIcon }],
  ["taxes", { name: "稅費", icon: taxesIcon }],
  ["fee", { name: "規費", icon: feeIcon }],
  ["insurance", { name: "保險", icon: insuranceIcon }],
  ["transport", { name: "交通", icon: transportIcon }],
  ["journey", { name: "旅程", icon: journeyIcon }],
  ["other", { name: "其他", icon: otherIcon }],
]);

export default expenseCategory;
