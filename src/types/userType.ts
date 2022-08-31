export type userType = {
  id: string;
  name: string;
  email: string;
  userImg: string;
  cars: number;
  bannerImg: string;
  selectCar: string;
};
export type userLogin = {
  email: string;
  password: string;
  name?: string;
};
export type notificationType = {
  status: string;
  title: string;
  message: string;
};
