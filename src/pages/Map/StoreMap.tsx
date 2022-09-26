import React, { useRef, useState, useCallback, useEffect } from "react";
import styled from "styled-components/macro";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
import { NeonText } from "../../components/style";
import Loading from "../../components/Loading/Loading";
import Circle from "../../components/Loading/Circle";

import personIcon from "../../assets/icon/marker-person.png";

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: calc(100vh - 68px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
`;
const SearchButton = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  width: 164px;
  transform: translateX(-50%);
  font-size: 16px;
  padding: 5px 10px;
  background-color: var(--deepColor);
  border-radius: 8px;
  z-index: 1;
  box-shadow: 0px 0px 5px rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: #3464a5;
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
    top: 10px;
  }
  & .gm-ui-hover-effect {
    display: none !important;
  }
  & .gm-style .gm-style-iw-tc {
    display: none;
  }

  @media screen and (max-width: 701px) {
    height: calc(100vh - 201px);
    width: 95%;
  }
`;
const ListWrapper = styled.div`
  position: absolute;
  width: 176px;
  max-height: calc(100% - 143px);
  border-radius: 8px;
  padding: 10px;
  /* background-color: var(--deepColor); */
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  box-shadow: 3px 3px 15px rgb(0, 0, 0);
  top: 113px;
  left: calc(5% + 20px);
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(82, 82, 82, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
  overflow: overlay;
`;
const List = styled.div<{ $isSelected: boolean }>`
  width: 100%;
  padding: 5px;
  height: 63px;
  margin-bottom: 10px;
  /* background-color: var(--lightColor); */
  background: ${(props) =>
    props.$isSelected
      ? "rgba(125, 124, 124, 0.4)"
      : "rgba(125, 124, 124, 0.2)"};
  backdrop-filter: blur(5px);
  border-radius: 8px;
  letter-spacing: 1px;
  cursor: pointer;

  &:hover {
    background: rgba(125, 124, 124, 0.4);
  }
`;

const Title = styled.p`
  font-size: 14px;
  max-width: 145px;
  /* color: var(--deepColor); */
  color: #fff;
  padding: 0 5px;
  background-color: var(--deepColor);

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const OpenStore = styled.p`
  font-size: 12px;
  color: var(--thirdBack);
`;

const NavToGoogle = styled.div`
  font-size: 10px;
  color: var(--mainColor);
  white-space: nowrap;
  cursor: pointer;
`;
const PageTitle = styled(NeonText)`
  font-size: 22px;
  margin-bottom: 10px;
`;
const NoStoreContent = styled.p`
  font-size: 16px;
  text-align: center;
  color: var(--deepColor);
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
type locationMap = {
  lat: number;
  lng: number;
};

const StoreMap = () => {
  const mapRef = useRef();
  const [location, setLocation] = useState<locationMap | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [markers, setMarkers] = useState<{ [index: string]: any }>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA4Xik7PsmlsZ4UPc154GTLZjxL4aVEBSM",
    libraries,
  });
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoaded]);
  const getUserLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      const success = (pos: any) => {
        const crd = pos.coords;
        setLocation({
          lat: crd.latitude,
          lng: crd.longitude,
        });
        getNearBy(crd.latitude, crd.longitude);
      };
      const error = (err: any) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      };
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      console.log("Geolocation is not supported for this Browser/OS.");
    }
  };

  const selectMarkerHandler = (id: string | null) => {
    setSelected(id);
  };

  const getNearBy = async (lat: string, lng: string) => {
    const response = await fetch(
      `https://us-central1-motortrack-97569.cloudfunctions.net/getUserNearby?lat=${lat}&lng=${lng}`
    );
    const result = await response.json();
    console.log(result);

    if (result.results.length > 0) {
      setMarkers(result.results);
    } else {
      setMarkers([{ name: "無店家營業" }]);
    }
    setSearchLoading(false);
  };
  const searchStoreHandler = () => {
    setSearchLoading(true);
    getUserLocation();
  };

  const goGoogleMap = (str: string) => {
    if (!location) return;
    const url = `https://www.google.com/maps/dir/${location.lat},${location.lng}/${str}`;
    window.open(url);
  };

  return (
    <>
      {isLoading && <Loading />}
      <Container>
        <PageTitle>機車維修店地圖</PageTitle>
        <SearchButton onClick={searchStoreHandler}>
          {searchLoading ? (
            <LoadingWrapper>
              <Circle />
            </LoadingWrapper>
          ) : (
            "搜尋附近營業中店家"
          )}
        </SearchButton>
        <MapWrapper>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={
                location || {
                  lat: 25.0385,
                  lng: 121.5324,
                }
              }
              zoom={14}
              onLoad={onMapLoad}
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
                markers.map((marker: { [index: string]: any }) => {
                  if (marker?.place_id) {
                    const { place_id, geometry, name, vicinity } = marker;
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
                        {/* {selected === place_id ? (
                          <InfoWindow
                            onCloseClick={() => selectMarkerHandler(null)}
                            position={geometry.location}
                          >
                            <>
                              <Title>{name}</Title>
                              <NavToGoogle
                                onClick={() => {
                                  goGoogleMap(vicinity + name);
                                }}
                              >
                                開啟Google地圖導航路線
                              </NavToGoogle>
                            </>
                          </InfoWindow>
                        ) : null} */}
                      </Marker>
                    );
                  } else {
                    return "";
                  }
                })}
            </GoogleMap>
          )}
        </MapWrapper>
        {markers.length > 0 && (
          <ListWrapper>
            {markers.map((marker: { [index: string]: any }) => {
              if (marker?.place_id) {
                const { name, place_id, vicinity } = marker;
                return (
                  <List
                    key={place_id}
                    $isSelected={place_id === selected}
                    onClick={() => {
                      selectMarkerHandler(place_id);
                    }}
                  >
                    <Title>{name}</Title>
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
              } else {
                return (
                  <List $isSelected={false}>
                    <NoStoreContent>{marker.name}</NoStoreContent>
                  </List>
                );
              }
            })}
          </ListWrapper>
        )}
      </Container>
    </>
  );
};

export default StoreMap;
