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
import UserMarker from "./UserMarker";
import Confirm from "./Confirm";
import InfoContent from "./InfoContent";
import SearchBar from "./SearchBar";
import Title from "./Title";
import ScheduleMarker from "./ScheduleMarker";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store";
import { createMessage, getUserLocation } from "../../../utils/calcFunc";
import firebase, { database } from "../../../utils/firebase";
import { ref, onValue, onDisconnect } from "firebase/database";
import {
  markerType,
  positionType,
  myMapContentType,
  userType,
  boundType,
} from "../../../types/mapType";
import { disconnect } from "process";

const MyMapContainer = styled.div`
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
  const disconnectRef = useRef<ReturnType<typeof onDisconnect>>();
  const userPositionTimer = useRef<ReturnType<typeof setInterval>>();
  const [boundAndCenter, setBoundAndCenter] =
    useState<{ bounds: boundType; center: positionType }>();
  const userState = useAppSelector((state) => state.user);
  const { isAuth, isOffline, user } = userState;
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [directionResponse, setDirectionResponse] =
    useState<google.maps.DirectionsResult | null>(null);
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

  const onMapLoad = useCallback((map: GoogleMapType) => {
    setMap(map);
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAP as string,
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
      const response = await firebase.getMapDoc(id);
      if (response && response.length > 0) {
        return response[0];
      } else {
        return null;
      }
    };

    const initMyMapState = () => {
      setIsPassword(false);
      setDirectionResponse(null);
      setSelectMarker(null);
      setMarkers([]);
      setRoomUsers(null);
      setMyMapContent({
        name: user.name,
        id: "",
        ownerID: user.id,
        password: "",
        markers: [],
        center: {} as positionType,
        zoom: 0,
      });
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
        } else if (params.userID === user.id) {
          initMyMapState();
        }
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

  const getEditMarkerPosition = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const position = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setSelectMarker(position);
      setSelectEditMarkerID("");
    }
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

  const updateMap = (newMap: myMapContentType) => {
    const url = `maps/${myMapContent.id}`;
    firebase.updateDoc(url, newMap);
  };

  const setNewRoom = async (room: userType[]) => {
    if (params.userID) {
      await firebase.setUserMapRoom(params.userID, room);
    }
  };

  const submitMapHandler = async () => {
    if (!map) return;
    const center = {
      lat: map.getCenter()?.lat(),
      lng: map.getCenter()?.lng(),
    };
    let result = {
      ...myMapContent,
      center: center as positionType,
      zoom: map.getZoom() as number,
      markers,
    };
    const room: userType[] = [
      {
        id: user.id,
        name: user.name,
        position: "",
        img: user.userImg,
        onLine: false,
      },
    ];

    if (myMapContent.id) {
      updateMap(result);
    } else {
      result = await firebase.setMapDoc(result);
      setNewRoom(room);
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

  const listenOnDisconnect = (index: number) => {
    const url = `room/${params.userID}/users/${index}`;

    const usersRef = ref(database, url);

    disconnectRef.current = onDisconnect(usersRef);
    disconnectRef.current.update({ onLine: false });
  };

  useEffect(() => {
    if (userIndex.current !== null && !isDragMap && roomUsers) {
      map?.panTo(roomUsers[userIndex.current].position as positionType);
    }
  }, [isDragMap, roomUsers, map]);

  const autoGetPosition = () => {
    userPositionTimer.current = setInterval(async () => {
      const position = await getUserLocation(positionOptions).catch((e) => {
        console.log(e);
        clearInterval(userPositionTimer.current);
        autoGetPosition();
      });
      if (position && userIndex.current) {
        const url = `room/${params.userID}/users/${userIndex.current}`;
        firebase.updateUserMapRoom(url, { position: position });
      }
    }, 2000);
  };

  const updateRoomUser = async (userID: string, position: positionType) => {
    if (roomUsers) return;
    const users = await firebase.getUserMapRoom(userID);

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
      firebase.updateUserMapRoom(url, newUser);
    } else {
      const mySelf = {
        id: user.id,
        name: user.name,
        position: position,
        img: user.userImg,
        onLine: true,
      };
      userIndex.current = users.length;
      const newUsers = [...users, mySelf];
      firebase.setUserMapRoom(userID, newUsers);
    }
    return userIndex.current;
  };

  const joinMapHandler = async () => {
    if (!myMapContent.id) {
      const room: userType[] = [
        {
          id: user.id,
          name: user.name,
          position: "",
          img: user.userImg,
          onLine: true,
        },
      ];
      await setNewRoom(room);
    }
    try {
      const position: positionType = await getUserLocation(positionOptions);
      if (params.userID && map && position) {
        listenRoomUsers();
        const index = await updateRoomUser(params.userID, position);
        map.setCenter(position);
        autoGetPosition();
        if (index !== undefined) {
          listenOnDisconnect(index);
        }
      }
      setIsDragMap(false);
      setIsJoin(true);
    } catch (e) {
      console.log(e);
    }
  };
  const leaveMapHandler = () => {
    const url = `room/${params.userID}/users`;
    firebase.offUserMapRoom(url);
    const mySelf = {
      onLine: false,
    };
    const updateUrl = `room/${params.userID}/users/${userIndex.current}`;

    firebase.updateUserMapRoom(updateUrl, mySelf);
    disconnectRef.current?.cancel();
    userIndex.current = null;
    clearInterval(userPositionTimer.current);
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
  const directionRender = useCallback(
    (response: google.maps.DirectionsResult) => {
      if (response !== null) {
        setDirectionResponse(response);
      }
    },
    []
  );

  const setDirection = async () => {
    let dirOption: google.maps.DirectionsRequest | undefined = {
      travelMode: google.maps.TravelMode.DRIVING,
      origin: markers[0].position,
      destination: markers[markers.length - 1].position,
      avoidHighways: true,
    };
    if (markers.length > 2) {
      const viaArr = markers.slice(1, -1).map((marker) => {
        return { location: marker.position };
      });
      dirOption.waypoints = viaArr as google.maps.DirectionsWaypoint[];
    } else if (markers.length < 2) {
      createMessage("alert", dispatch, "請新增行程");
    }
    const directionService = new google.maps.DirectionsService();
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
      setDirection();
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <MyMapContainer>
        {isPassword ? (
          <Confirm
            password={myMapContent.password}
            onClose={closeConfirmHandler}
          />
        ) : (
          <>
            <Title
              showMarkerBox={showMarkerBox}
              myMapContent={myMapContent}
              isEdit={isEdit}
              isJoin={isJoin}
              showFriends={showFriends}
              onShowFriendsBox={showFriendsBoxHandler}
              onShowMarkerBox={showMarkerBoxHandler}
              onReturn={returnHandler}
              onSubmit={submitMapHandler}
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
                  {markers.length > 0 && (
                    <ScheduleMarker
                      markers={markers}
                      setSelectEditMarkerID={setSelectEditMarkerID}
                      selectEditMarkerID={selectEditMarkerID}
                    />
                  )}
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
      </MyMapContainer>
    </>
  );
};

export default StoreMap;
