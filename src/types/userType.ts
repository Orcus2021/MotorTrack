export type userType = {
  id: string;
  name: string;
  email: string;
  userImg: string;
  cars: number;
  bannerImg: string;
  selectCar: string;
  insuranceRemind: boolean;
  inspectionRemind: boolean;
  continueRemind: boolean;
};

export type userLogin = {
  email: string;
  password: string;
  name?: string;
};
export type notificationType = {
  status: boolean;
  type: string;
  message: string;
  timerId: number;
};
