import React, { useRef, useState, useCallback } from "react";

import {
  GoogleMap,
  useJsApiLoader,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
const re = [
  {
    business_status: "OPERATIONAL",
    geometry: {
      location: {
        lat: 25.0478291,
        lng: 121.5402672,
      },
      viewport: {
        northeast: {
          lat: 25.04917847989272,
          lng: 121.5416673798927,
        },
        southwest: {
          lat: 25.04647882010728,
          lng: 121.5389677201073,
        },
      },
    },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/shopping-71.png",
    icon_background_color: "#4B96F3",
    icon_mask_base_uri:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v2/shopping_pinlet",
    more_opening_hours: [],
    name: "萬興機車行",
    opening_hours: {
      open_now: true,
    },
    photos: [
      {
        height: 3024,
        html_attributions: [
          '<a href="https://maps.google.com/maps/contrib/118357593794100794913">trsyeh</a>',
        ],
        photo_reference:
          "AcYSjRi27MP-vgWrFZ5cOmj2yt8oD0_Nd4OevFNnpfObj4iFiGRpwu3beirg-odO_7cANiehBP2RqyQgQfpC23ZSkVlTMrotlXL9PkWp6Nm2SG0bTiMMwX62AG8J5-guz_ZAR6BNJvt5ENoxPEZyjR7MchZnVpE-PEckuk6gi26Zsf3q1BAa",
        width: 4032,
      },
    ],
    place_id: "ChIJ96TpLNmrQjQRwxKrPMXmiDU",
    plus_code: {
      compound_code: "2GXR+44 Zhongshan District, Taipei City, Taiwan",
      global_code: "7QQ32GXR+44",
    },
    rating: 5,
    reference: "ChIJ96TpLNmrQjQRwxKrPMXmiDU",
    scope: "GOOGLE",
    types: ["point_of_interest", "store", "establishment"],
    user_ratings_total: 7,
    vicinity: "No. 16號, Long Jiang Rd, Zhongshan District",
  },
];
const markers = [
  {
    id: 1,
    name: "Chicago, Illinois",
    position: { lat: 41.881832, lng: -87.623177 },
  },
  {
    id: 2,
    name: "Denver, Colorado",
    position: { lat: 39.739235, lng: -104.99025 },
  },
  {
    id: 3,
    name: "Los Angeles, California",
    position: { lat: 34.052235, lng: -118.243683 },
  },
  {
    id: 4,
    name: "New York, New York",
    position: { lat: 40.712776, lng: -74.005974 },
  },
];
const libraries = ["places"];
const mapContainerStyle = {
  width: "400px",
  height: "400px",
};

const MyMap = () => {
  const mapRef = useRef();
  const [location, setLocation] = useState({
    lat: 25.0385,
    lng: 121.5324,
  });
  const [selected, setSelected] = useState();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA4Xik7PsmlsZ4UPc154GTLZjxL4aVEBSM",
    libraries,
  });
  const getUserLocation = () => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported!");
      const options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      };
      function success(pos) {
        const crd = pos.coords;
        setLocation({
          lat: crd.latitude,
          lng: crd.longitude,
        });
      }
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      console.log("Geolocation is not supported for this Browser/OS.");
    }
  };

  const getNearBy = async () => {
    console.log(location);
    const response = await fetch(
      `http://localhost:5001/motortrack-97569/us-central1/getUserNearby?lat=${location.lat}&lng=${location.lng}`
    );
    const result = await response.json();
    console.log(result);
  };

  return (
    <>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location}
          zoom={16}
          onClick={(event) => {
            console.log(event.latLng.lat());
          }}
          onLoad={onMapLoad}
        >
          <Marker
            position={location}
            icon={{
              url: "./logo192.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelected("time");
            }}
          />
          {selected ? (
            <InfoWindow
              position={location}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
                <h2>motortrack</h2>
              </div>
            </InfoWindow>
          ) : null}
          {/* {markers.map(({ id, name, position }) => (
            <Marker
              key={id}
              position={position}
              onClick={() => handleActiveMarker(id)}
            >
              {activeMarker === id ? (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div>{name}</div>
                </InfoWindow>
              ) : null}
            </Marker>
          ))} */}
        </GoogleMap>
      )}

      <button onClick={getUserLocation}>Get</button>
      <button onClick={getNearBy}>Fetch</button>
    </>
  );
};

export default MyMap;
