export type markerContentType = {
  title: string;
  order: number;
  content: string;
};
export type positionType = {
  lat: number;
  lng: number;
};
export type markerType = {
  id: string;
  title: string;
  order: number;
  content: string;
  position: positionType;
};
export type userType = {
  id: string;
  name: string;
  position: positionType;
  img: string;
};
export type myMapContentType = {
  name: string;
  id: string;
  ownerID: string;
  password: string;
  markers: markerType[] | [];
  center: positionType;
  zoom: number;
};
