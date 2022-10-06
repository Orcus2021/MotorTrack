import React, { useRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components/macro";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import Loading from "../../../components/Loading/Loading";
import EditMarker from "./EditMarker";
import Circle from "../../../components/Loading/Circle";
import UserMarker from "./UserMarker";
import Confirm from "./Confirm";
import InfoContent from "./InfoContent";
import MarkerContent from "./MarkerContent";
import SearchBar from "./SearchBar";
import Title from "./Title";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store";
import { createMessage, getUserLocation } from "../../../utils/calcFunc";
import firebase, { database } from "../../../utils/firebase";
import { ref, onValue } from "firebase/database";
import {
  markerType,
  positionType,
  myMapContentType,
  userType,
  boundType,
} from "../../../types/mapType";

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
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

const BackToPosition = styled.p`
  position: absolute;
  bottom: 10px;
  left: 50%;
  padding: 5px 20px;
  border-radius: 20px;
  font-size: 14px;
  transform: translateX(-50%);
  color: #fff;
  background-color: var(--mainColor);
  cursor: pointer;
  &:hover {
    background-color: var(--deepColor);
  }
`;
const mapOption = {
  fullscreenControl: false,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: "all",
      stylers: [{ visibility: "off" }],
    },
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
};
const libraries = ["places"] as (
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
const center = {
  lat: 25.0385,
  lng: 121.5324,
};
const positionOptions = {
  enableHighAccuracy: false,
  timeout: 1500,
  maximumAge: 0,
};
const StoreMap = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const userIndex = useRef<number | null>(null);
  const userPositionTimer = useRef<ReturnType<typeof setInterval>>();
  const [boundAndCenter, setBoundAndCenter] =
    useState<{ bounds: boundType; center: positionType }>();
  const userState = useAppSelector((state) => state.user);
  const { isAuth, isOffline, user } = userState;
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectMarker, setSelectMarker] = useState<positionType | null>(null);
  const [markers, setMarkers] = useState<markerType[]>([]);
  const [selectEditMarkerID, setSelectEditMarkerID] = useState<string>("");
  const [isDragMap, setIsDragMap] = useState<boolean>(false);
  const [roomUsers, setRoomUsers] = useState<userType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMarkerBox, setShowMarkerBox] = useState<boolean>(false);
  const [showFriends, setShowFriends] = useState<boolean>(false);
  const [map, setMap] = useState<GoogleMapType>();
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const [myMapContent, setMyMapContent] = useState<myMapContentType>({
    name: user.name,
    id: "",
    ownerID: user.id,
    password: "",
    markers: [],
    center: {} as positionType,
    zoom: 0,
  });
  const isSelf = params.userID === user.id && isAuth;
  const onMapLoad = useCallback((map: GoogleMapType) => {
    setMap(map);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "",
    libraries,
  });
  //AIzaSyA7KmYl-KuklJQftsDDrWPoLrkOjY7nmGI
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

  const onMapBoundsChanged = useCallback(() => {
    if (!map) return;
    const latLngChange = map.getBounds();
    const bounds = {
      hLat: latLngChange?.getNorthEast().lat(),
      lLat: latLngChange?.getSouthWest().lat(),
      hLng: latLngChange?.getNorthEast().lng(),
      lLng: latLngChange?.getSouthWest().lng(),
    };
    const center = { lat: map.getCenter()?.lat(), lng: map.getCenter()?.lng() };

    setBoundAndCenter({ bounds, center: center as positionType });
  }, [map]);

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
    if (!isEdit) {
      setShowMarkerBox(true);
    }
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
      const room: userType[] = [
        {
          id: user.id,
          name: user.name,
          position: "",
          img: user.userImg,
          onLine: false,
        },
      ];
      if (params.userID) {
        firebase.setUserMapRoom(params.userID, room);
      }
      result = await firebase.setMapDoc(newMyMap);
    }

    setMyMapContent(result);
    setIsEdit((pre) => !pre);
  };

  const myMapContentHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyMapContent((pre) => {
      if (pre?.name) {
        const newMyMap = { ...pre, password: e.target.value };

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
    if (markers.length >= 10) return;
    if (index !== null) {
      setMarkers((pre) => {
        const newMarkers = [...pre];
        newMarkers[index] = markerContent;
        const sortMarkers = newMarkers.sort((marker1, marker2) => {
          return marker1.order - marker2.order;
        });
        return sortMarkers;
      });
    } else if (selectMarker) {
      const marker = { ...markerContent, position: selectMarker };

      const sortMarkers = [...markers, marker].sort((marker1, marker2) => {
        return marker1.order - marker2.order;
      });

      setMarkers(sortMarkers);
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
    setIsDragMap(true);
  };

  const closeConfirmHandler = () => {
    setIsPassword(false);
  };
  const listenRoomUsers = () => {
    const usersRef = ref(database, "room/" + params.userID + "/users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      setRoomUsers(data);
    });
  };
  useEffect(() => {
    if (userIndex.current !== null && !isDragMap && roomUsers) {
      map?.panTo(roomUsers[userIndex.current].position as positionType);
    }
  }, [isDragMap, roomUsers, map]);

  const autoGetPosition = () => {
    userPositionTimer.current = setInterval(async () => {
      const position = await getUserLocation(positionOptions);
      const url = `room/${params.userID}/users/${userIndex.current}`;

      firebase.updateUserMapRoom(url, { position: position });
    }, 2000);
  };

  const updateFirebase = async (userID: string, position: positionType) => {
    const users = await firebase.getUserMapRoom(userID);

    if (roomUsers) return;
    userIndex.current = users.findIndex(
      (initUser: userType) => user.id === initUser.id
    );

    if (userIndex.current >= 0 && userIndex.current !== null) {
      const newUser = {
        ...users[userIndex.current],
        position,
        onLine: true,
        img: user.userImg,
      };
      const url = `room/${userID}/users/${userIndex.current}`;
      if (newUser) {
        firebase.updateUserMapRoom(url, newUser);
      }
    } else {
      const mySelf = {
        id: user.id,
        name: user.name,
        position: position,
        img: user.userImg,
        onLine: true,
      };

      userIndex.current = users.length;
      if (mySelf) {
        const newUsers = [...users, mySelf];
        firebase.setUserMapRoom(userID, newUsers);
      }
    }
  };

  const joinMapHandler = async () => {
    if (params.userID) {
      listenRoomUsers();

      const position: positionType = await getUserLocation(positionOptions);
      updateFirebase(params.userID, position);
      map?.setCenter(position);
      autoGetPosition();
    }
    setIsDragMap(false);
    setIsJoin(true);
  };
  const leaveMapHandler = () => {
    const url = `room/${params.userID}/users`;
    firebase.offUserMapRoom(url);
    const mySelf = {
      onLine: false,
    };
    const updateUrl = `room/${params.userID}/users/${userIndex.current}`;
    firebase.updateUserMapRoom(updateUrl, mySelf);
    userIndex.current = null;
    clearInterval(userPositionTimer.current);
    console.log("r");
    setRoomUsers(null);
    setIsJoin(false);
  };
  const clearAutoPanto = () => {
    setIsDragMap(true);
  };
  const backToCurrentPosition = () => {
    setIsDragMap(false);
    if (userIndex.current !== null && roomUsers !== null) {
      map?.panTo(roomUsers[userIndex.current].position as positionType);
    }
  };
  const directionRender = useCallback((response: any) => {
    if (response !== null) {
      setDirectionResponse(response);
    }
  }, []);

  const calculateDirection = async () => {
    let dirOption: google.maps.DirectionsRequest | undefined;
    if (markers.length === 2) {
      dirOption = {
        travelMode: google.maps.TravelMode.DRIVING,
        origin: markers[0].position,
        destination: markers[1].position,
        avoidHighways: true,
      };
    } else if (markers.length > 2) {
      const viaArr = markers.slice(1, -1).map((marker) => {
        return { location: marker.position };
      });

      dirOption = {
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: viaArr as google.maps.DirectionsWaypoint[],
        origin: markers[0].position,
        destination: markers[markers.length - 1].position,
        avoidHighways: true,
      };
    } else if (markers.length < 2) return;

    const directionService = new google.maps.DirectionsService();
    if (!dirOption) return;
    const result = await directionService.route(dirOption);
    directionRender(result);
  };
  const showMarkerBoxHandler = () => {
    setShowMarkerBox((pre) => !pre);
  };

  const showFriendsBoxHandler = () => {
    setShowFriends((pre) => !pre);
  };
  const directionHandler = () => {
    if (directionResponse) {
      setDirectionResponse(null);
    } else {
      calculateDirection();
    }
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
            <Title
              showMarkerBox={showMarkerBox}
              isSelf={isSelf}
              myMapContent={myMapContent}
              isEdit={isEdit}
              isJoin={isJoin}
              showFriends={showFriends}
              onShowFriendsBox={showFriendsBoxHandler}
              onShowMarkerBox={showMarkerBoxHandler}
              onReturn={returnHandler}
              onSubmit={submitHandler}
              onJoin={joinMapHandler}
              onLeave={leaveMapHandler}
              onEdit={editHandler}
            />
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
                  onDragStart={clearAutoPanto}
                  options={mapOption}
                >
                  {directionResponse && (
                    <DirectionsRenderer
                      directions={directionResponse}
                      options={{ suppressMarkers: true }}
                    />
                  )}

                  <SearchBar
                    isDirection={directionResponse !== null}
                    onMarker={setSelectMarker}
                    onDirection={directionHandler}
                  />
                  <UserMarker
                    map={map}
                    onClearPanto={clearAutoPanto}
                    showFriends={showFriends}
                    roomUsers={roomUsers}
                    boundAndCenter={boundAndCenter}
                  />
                  {markers.length > 0 &&
                    markers.map((marker) => (
                      <Marker
                        key={marker.id}
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
                            from="map"
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
                showMarkerBox={showMarkerBox}
                password={myMapContent?.password}
                setPassword={myMapContentHandler}
                isEdit={isEdit}
                onClear={clearEditMarkerHandler}
                onSelectMarker={selectEditMarkerIDHandler}
                markers={markers}
                onSubmitMarker={setMarkersHandler}
                onRemove={removeMarkerHandler}
              />
              {isDragMap && isJoin && (
                <BackToPosition onClick={backToCurrentPosition}>
                  返回原來位置
                </BackToPosition>
              )}
            </MapWrapper>
          </>
        )}
      </Container>
    </>
  );
};

export default StoreMap;
