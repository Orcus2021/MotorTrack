import React, { FC } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import MarkerContent from "./MarkerContent";
import { markerType } from "../../../types/mapType";

type Props = {
  markers: markerType[];
  setSelectEditMarkerID: React.Dispatch<React.SetStateAction<string>>;
  selectEditMarkerID: string;
};

const ScheduleMarker: FC<Props> = (props) => {
  const { markers, setSelectEditMarkerID, selectEditMarkerID } = props;
  return (
    <>
      {markers.map((marker) => (
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
    </>
  );
};

export default ScheduleMarker;
