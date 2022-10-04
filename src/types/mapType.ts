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
  position: positionType | "";
  img: string;
  onLine: boolean;
  out?: boolean;
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

export type boundType = {
  hLat: number | undefined;
  lLat: number | undefined;
  hLng: number | undefined;
  lLng: number | undefined;
};

export type geolocationOptionType = {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
};
