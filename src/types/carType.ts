export type recordAnnualType = {
  [index: string]: number;
};

export type carType = {
  ownerId: string;
  id: string;
  name: string;
  brand: string;
  mileage: number;
  plateNum: string;
  insuranceDate: string;
  licenseDate: string;
  age: string;
  inspectionDay: string;
  recordAnnual: recordAnnualType;
};
