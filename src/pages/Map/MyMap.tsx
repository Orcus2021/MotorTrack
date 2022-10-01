import React, { useRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components/macro";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
import Loading from "../../components/Loading/Loading";
import EditMarker from "./MyMap/EditMarker";
import Circle from "../../components/Loading/Circle";
import Confirm from "./MyMap/Confirm";
import Button from "../../components/Button/Button";
import IconButton from "../../components/Button/IconButton";
import InfoContent from "./MyMap/InfoContent";
import MarkerContent from "./MyMap/MarkerContent";
import { NeonText } from "../../components/style";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import { createMessage } from "../../utils/calcFunc";
import firebase from "../../utils/firebase";
import {
  markerType,
  positionType,
  myMapContentType,
} from "../../types/mapType";

import personIcon from "../../assets/icon/marker-person.png";
import whitePlusIcon from "../../assets/icon/plus-white.png";

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;
const TitleWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MapWrapper = styled.div`
  position: relative;
  width: 90%;
  height: calc(100vh - 141px);
  border-radius: 8px;
  overflow: hidden;

  @media screen and (max-width: 701px) {
    height: calc(100vh - 201px);
    width: 95%;
  }
`;

const PageTitle = styled(NeonText)`
  font-size: 22px;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  right: 0;
`;
const libraries = ["places", "drawing"] as (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
  hide: true,
};

type GoogleMapType = google.maps.Map;

const dummyData = [
  { id: "1", name: "TEST1", position: { lat: 25.0385, lng: 121.5324 } },
  { id: "2", name: "TEST2", position: { lat: 25.0386, lng: 121.5325 } },
];
const center = {
  lat: 25.0385,
  lng: 121.5324,
};
const StoreMap = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const userState = useAppSelector((state) => state.user);
  const { isAuth, isOffline, user } = userState;
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectMarker, setSelectMarker] = useState<positionType | null>(null);
  const [markers, setMarkers] = useState<markerType[]>([]);
  const [selectEditMarkerID, setSelectEditMarkerID] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [map, setMap] = useState<GoogleMapType>();
  const [myMapContent, setMyMapContent] = useState<myMapContentType>({
    name: user.name,
    id: "",
    ownerID: user.id,
    password: "",
    markers: [],
    center: {} as positionType,
    zoom: 0,
  });
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const isSelf = params.userID === user.id && isAuth;
  const onMapLoad = useCallback((map: GoogleMapType) => {
    setMap(map);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
    libraries,
  });
  useEffect(() => {
    if (isLoaded && !isOffline) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else if (isOffline) {
      createMessage("error", dispatch, "無網路無法使用地圖功能");
      navigate(-1);
    }
  }, [isLoaded, dispatch, isOffline, navigate]);

  useEffect(() => {
    if (!isAuth) navigate("/login", { state: `/my_map/${params.userID}` });

    const getMap = async (id: string) => {
      const response = await firebase.getMapDoc(id).catch((e) => {
        console.log(e);
      });

      if (response && response.length > 0) {
        return response[0];
      } else {
        return null;
      }
    };

    const checkId = async () => {
      if (params.userID && user.id) {
        const myMap = await getMap(params.userID);

        if (myMap) {
          setMyMapContent(myMap);
          setMarkers(myMap.markers);
          if (params.userID !== user.id && myMap.password) {
            setIsPassword(true);
          }
        } else if (params.userID !== user.id) {
          navigate(`/my_map/${user.id}`);
        } else return;
      }
    };

    try {
      checkId();
    } catch (e) {
      console.log(e);
    }
  }, [params.userID, isAuth, user, navigate, isLoaded, isOffline, dispatch]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      const success = (pos: any) => {
        console.log(pos);
        const crd = pos.coords;
        // setLocation({
        //   lat: crd.latitude,
        //   lng: crd.longitude,
        // });
      };
      const error = (err: any) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      console.log("Geolocation is not supported for this Browser/OS.");
    }
  };

  const onMapBoundsChanged = useCallback(() => {
    // const latlongchange = map.getBounds();
    // const lat = latlongchange.Ua.i;
    // const lng = latlongchange.Ua.j;
    const latlongchange = map?.getBounds();
    const mapBounds = {
      hLat: latlongchange?.getNorthEast().lat(),
      lLat: latlongchange?.getSouthWest().lat(),
      hLng: latlongchange?.getNorthEast().lng(),
      lLng: latlongchange?.getSouthWest().lng(),
    };
  }, [map]);
  const outPosition = (mapBounds: any, user: any, center: any) => {
    const { hLat, lLat, hLng, lLng } = mapBounds;
    const { position } = user;
    const outLat = position.lat > hLat || position.lat < lLat;
    const outLng = position.lng > hLng || position.lng < lLng;
    let inDiffLat;
    let inDiffLng;
    let totalLat;
    let totalLng;

    if (outLat) {
      if (position.lat > hLat) {
        totalLat = position.lat - center.lat;
        inDiffLat = hLat - center.lat;
      } else {
        totalLat = center.lat - position.lat;
        inDiffLat = hLat - center.lat;
      }
    }
  };
  const getEditMarkerPosition = (e: any) => {
    const position = {
      lat: e.latLng.lat() as number,
      lng: e.latLng.lng() as number,
    };

    setSelectMarker(position);
    setSelectEditMarkerID("");
  };
  const clearEditMarkerHandler = () => {
    setSelectMarker(null);
  };
  const editHandler = () => {
    setIsEdit((pre) => !pre);
  };

  const submitHandler = async () => {
    if (!map) return;
    const center = {
      lat: map.getCenter()?.lat(),
      lng: map.getCenter()?.lng(),
    };
    const newMyMap = {
      ...myMapContent,
      center: center as positionType,
      zoom: map.getZoom() as number,
      markers,
    };
    let result;
    if (myMapContent.id) {
      const url = `maps/${myMapContent.id}`;
      firebase.updateDoc(url, newMyMap);
      result = newMyMap;
    } else {
      result = await firebase.setMapDoc(newMyMap);
    }
    const data = [
      { id: user.id, name: user.name, position: "", img: user.userImg },
    ];
    if (params.userID) {
      firebase.setUserMapRoom(params.userID, data);
    }

    setMyMapContent(result);
    setIsEdit((pre) => !pre);
  };

  const myMapContentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyMapContent((pre) => {
      console.log(pre);
      if (pre?.name) {
        const newMyMap = { ...pre, password: e.target.value };
        console.log(newMyMap);
        return newMyMap;
      }
      return pre;
    });
  };

  const returnHandler = () => {
    setIsEdit((pre) => !pre);
    setMarkers(myMapContent.markers);
  };

  const setMarkersHandler = (
    index: number | null,
    markerContent: markerType
  ) => {
    if (index !== null) {
      setMarkers((pre) => {
        const newMarkers = [...pre];
        newMarkers[index] = markerContent;
        return newMarkers;
      });
    } else if (selectMarker) {
      const marker = { ...markerContent, position: selectMarker };

      setMarkers([...markers, marker]);
      setSelectMarker(null);
    }
  };

  const removeMarkerHandler = (id: string) => {
    setMarkers((pre) => {
      const newMarkers = pre.filter((marker) => marker.id !== id);

      return newMarkers;
    });
  };
  const selectEditMarkerIDHandler = (id: string) => {
    setSelectEditMarkerID(id);
  };

  const closeConfirmHandler = () => {
    setIsPassword(false);
  };
  const joinMapHandler = () => {
    setIsJoin(true);
  };
  const leaveMapHandler = () => {
    setIsJoin(false);
  };
  return (
    <>
      {isLoading && <Loading />}

      <Container>
        {isPassword ? (
          <Confirm
            password={myMapContent.password}
            onClose={closeConfirmHandler}
          />
        ) : (
          <>
            <TitleWrapper>
              <PageTitle>
                {isSelf ? "我的地圖" : `${myMapContent.name}的地圖`}
              </PageTitle>
              <ButtonWrapper>
                {isEdit && (
                  <>
                    <Button
                      label="取消"
                      type="cancel"
                      handleClick={returnHandler}
                    />
                    <Button
                      label="確認"
                      type="primary"
                      handleClick={submitHandler}
                    />
                  </>
                )}
                {!isEdit && !isJoin && (
                  <Button
                    label="加入"
                    type="primary"
                    handleClick={joinMapHandler}
                  />
                )}
                {!isEdit && isJoin && (
                  <Button
                    label="離開"
                    type="reject"
                    handleClick={leaveMapHandler}
                  />
                )}
                {!isEdit && isSelf && !isJoin && (
                  <IconButton
                    label="編輯"
                    icon={whitePlusIcon}
                    handleClick={editHandler}
                  />
                )}
              </ButtonWrapper>
            </TitleWrapper>

            <MapWrapper>
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={
                    (myMapContent.center.lat && myMapContent.center) || center
                  }
                  zoom={(myMapContent.zoom !== 0 && myMapContent.zoom) || 15}
                  onLoad={onMapLoad}
                  onBoundsChanged={onMapBoundsChanged}
                  onClick={getEditMarkerPosition}
                  options={{
                    fullscreenControl: false,
                    zoomControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    styles: [
                      {
                        stylers: [
                          {
                            visibility: "on",
                          },
                          { gamma: 1 },
                          { lightness: 1 },
                        ],
                      },
                    ],
                  }}
                >
                  {/* {dummyData.map((user) => (
                  <Marker
                    position={user.position}
                    label={user.id}
                    icon={{
                      url: personIcon,
                      scaledSize: new window.google.maps.Size(30, 30),
                    }}
                  />
                ))} */}
                  <>
                    {markers.length > 0 &&
                      markers.map((marker) => (
                        <Marker
                          position={marker.position}
                          label={marker.order.toString()}
                          onClick={() => {
                            setSelectEditMarkerID(marker.id);
                          }}
                        >
                          {selectEditMarkerID === marker.id && (
                            <InfoWindow
                              position={marker.position}
                              onCloseClick={() => setSelectEditMarkerID("")}
                            >
                              <MarkerContent marker={marker} />
                            </InfoWindow>
                          )}
                        </Marker>
                      ))}
                  </>

                  {selectMarker && (
                    <>
                      <Marker position={selectMarker} />
                      {isEdit && (
                        <InfoWindow
                          onCloseClick={() => setSelectMarker(null)}
                          position={selectMarker}
                          options={{
                            pixelOffset: new window.google.maps.Size(0, -40),
                          }}
                        >
                          <InfoContent
                            markerIndex={null}
                            onSubmitMarker={setMarkersHandler}
                            onClear={clearEditMarkerHandler}
                            marker={null}
                          />
                        </InfoWindow>
                      )}
                    </>
                  )}
                </GoogleMap>
              )}
              <EditMarker
                password={myMapContent?.password}
                setPassword={myMapContentHandler}
                isEdit={isEdit}
                onClear={clearEditMarkerHandler}
                onSelectMarker={selectEditMarkerIDHandler}
                markers={markers}
                onSubmitMarker={setMarkersHandler}
                onRemove={removeMarkerHandler}
              />
            </MapWrapper>
          </>
        )}
      </Container>
    </>
  );
};

export default StoreMap;
