export type partType = {
  recordID: string;
  category: string;
  spec: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  mileage: number;
  startMileage: number;
  endMileage: number;
  price: number;
  qty: number;
  subtotal: number;
  note: string;
  name: string;
};
export type partsType = {
  [index: string]: partType[];
};
export type repairType = {
  id: string;
  title: string;
  date: string;
  mileage: number;
  amount: number;
  note: string;
  category: string;
  records: partType[];
};
export type feeType = {
  id: string;
  title: string;
  date: string;
  mileage: number;
  amount: number;
  category: string;
  note: string;
};
export type expensesType = {
  allExpenses: number;
  feeExpenses: number;
  repairExpenses: number;
  refuelExpenses: number;
  selectYear: string;
};
