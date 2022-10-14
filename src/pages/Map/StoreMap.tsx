import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components/macro";
import Circle from "../../components/Loading/Circle";
import Loading from "../../components/Loading/Loading";
import { useAppDispatch, useAppSelector } from "../../store";
import { positionType } from "../../types/mapType";
import { createMessage, getUserLocation } from "../../utils/calcFunc";

import personIcon from "../../assets/icon/marker-person.png";

const StoreContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;
const SearchButton = styled.div`
  width: 164px;

  font-size: 16px;
  padding: 5px 10px;
  background-color: var(--mainColor);
  border-radius: 8px;
  z-index: 1;
  margin-bottom: 10px;
  box-shadow: 0px 0px 5px rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #3464a5;
  }
  @media screen and (max-width: 701px) {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
`;
const MapWrapper = styled.div`
  width: 90%;
  height: calc(100vh - 141px);
  border-radius: 8px;
  overflow: hidden;
  & .gm-style .gm-style-iw-c {
    background-color: transparent;
    padding: 0;
    top: -27px;
  }
  & .gm-ui-hover-effect {
    display: none !important;
  }
  & .gm-style .gm-style-iw-tc {
    display: none;
  }

  @media screen and (max-width: 701px) {
    height: calc(100vh - 161px);
    width: 95%;
  }
`;

const List = styled.div<{ $isSelected: boolean }>`
  position: absolute;
  margin-bottom: 10px;
  top: 60px;
  left: calc(5% + 20px);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 8px;
  letter-spacing: 1px;
  overflow: hidden;
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  cursor: pointer;

  &:hover {
    background: rgb(255, 255, 255);
  }
  @media screen and (max-width: 701px) {
    left: 50%;
    transform: translateX(-50%);
    top: 64px;
  }
`;

const Title = styled.p`
  font-size: 14px;
  max-width: 145px;
  color: #fff;
  padding: 0 5px;
  background-color: var(--deepColor);

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const SelectTitle = styled.p`
  font-size: 16px;
  width: 100%;
  max-width: 182.26px;
  background-color: var(--deepColor);

  padding: 2px 5px;
  text-align: center;
`;
const OpenStore = styled.p`
  font-size: 14px;
  padding: 2px 5px;
  color: var(--thirdBack);
`;
const CloseStore = styled.p`
  font-size: 16px;
  letter-spacing: 1px;
  text-align: center;
  color: var(--errorColor);
  padding: 20px;
`;

const NavToGoogle = styled.div`
  font-size: 14px;
  color: var(--mainColor);
  white-space: nowrap;
  padding: 2px 5px;
  cursor: pointer;
`;

const LoadingWrapper = styled.div`
  width: 22px;
  height: 22px;
`;

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
const initMapCenter = {
  lat: 25.0385,
  lng: 121.5324,
};
const mapOption = {
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
};

type GoogleMapType = google.maps.Map;
type markerType = {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  vicinity: string;
};

const StoreMap = () => {
  const mapRef = useRef<GoogleMapType>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isOffline = useAppSelector((state) => state.user.isOffline);
  const [location, setLocation] = useState<positionType | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [markers, setMarkers] = useState<markerType[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNoStore, setShowNoStore] = useState<boolean>(false);

  const onMapLoad = useCallback((map: GoogleMapType) => {
    mapRef.current = map;
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

  const selectMarkerHandler = (id: string | null) => {
    setSelected(id);
  };

  const getNearBy = async (lat: number, lng: number) => {
    const response = await fetch(
      `https://us-central1-motortrack-97569.cloudfunctions.net/getUserNearby?lat=${lat}&lng=${lng}`
    );

    if (response.ok) {
      const result: { results: markerType[] } = await response.json();

      if (result.results.length > 0) {
        setMarkers(result.results);
        setShowNoStore(false);
      } else {
        setShowNoStore(true);
      }
      setSearchLoading(false);
    }
  };
  const searchStoreHandler = async () => {
    setSearchLoading(true);
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0,
    };
    const position = await getUserLocation(options);
    if (position.lat && position.lng) {
      setLocation(position);
      getNearBy(position.lat, position.lng);
    }
  };

  const goGoogleMap = (str: string) => {
    if (!location) return;
    const url = `https://www.google.com/maps/dir/${location.lat},${location.lng}/${str}`;
    window.open(url);
  };

  return (
    <>
      {isLoading && <Loading />}
      <StoreContainer>
        <SearchButton onClick={searchStoreHandler}>
          {searchLoading ? (
            <LoadingWrapper>
              <Circle />
            </LoadingWrapper>
          ) : (
            "搜尋附近營業中商家"
          )}
        </SearchButton>
        <MapWrapper>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location || initMapCenter}
              zoom={15}
              onLoad={onMapLoad}
              options={mapOption}
            >
              {location && (
                <Marker
                  position={location}
                  icon={{
                    url: personIcon,
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              )}
              {markers.length > 0 &&
                markers.map((marker: markerType) => {
                  if (marker?.place_id) {
                    const { place_id, geometry, name } = marker;
                    return (
                      <Marker
                        key={place_id}
                        position={geometry.location}
                        onClick={() => selectMarkerHandler(place_id)}
                        animation={
                          (selected === place_id &&
                            google.maps.Animation.BOUNCE) ||
                          google.maps.Animation.DROP
                        }
                      >
                        <InfoWindow position={geometry.location}>
                          <Title>{name}</Title>
                        </InfoWindow>
                      </Marker>
                    );
                  } else {
                    return "";
                  }
                })}
            </GoogleMap>
          )}
        </MapWrapper>

        {markers.length > 0 &&
          markers
            .filter((marker: markerType) => marker.place_id === selected)
            .map((marker: markerType) => {
              const { name, place_id, vicinity } = marker;
              return (
                <List
                  key={place_id}
                  $isSelected={place_id === selected}
                  onClick={() => {
                    selectMarkerHandler(place_id);
                  }}
                >
                  <SelectTitle>{name}</SelectTitle>
                  <OpenStore>營業中</OpenStore>
                  <NavToGoogle
                    onClick={() => {
                      goGoogleMap(`${vicinity}${name}`);
                    }}
                  >
                    開啟Google地圖導航路線
                  </NavToGoogle>
                </List>
              );
            })}
        {showNoStore && (
          <List $isSelected={false}>
            <CloseStore>附近店家尚未營業</CloseStore>
          </List>
        )}
      </StoreContainer>
    </>
  );
};

export default StoreMap;
