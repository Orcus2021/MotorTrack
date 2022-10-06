import { InfoBox } from "@react-google-maps/api";
import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { boundType, positionType, userType } from "../../../types/mapType";
import { calcDistance } from "../../../utils/calcFunc";
import FriendsBox from "./FriendsBox";

const Container = styled.div``;

const UserImage = styled.img<{ $isOut: boolean | undefined }>`
  width: 40px;
  height: 40px;
  padding: 5px;
  object-fit: cover;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$isOut ? "var(--errorColor)" : "var(--mainColor)"};
`;
type Props = {
  roomUsers: userType[] | null;
  showFriends: boolean;
  map: google.maps.Map | undefined;
  onClearPanto: () => void;
  boundAndCenter:
    | {
        bounds: boundType;
        center: positionType;
      }
    | undefined;
};

const UserMarker: FC<Props> = (props) => {
  const { roomUsers, boundAndCenter, showFriends, onClearPanto, map } = props;

  const [usersInfoBoxes, setUsersInfoBoxes] = useState<userType[] | null>(null);

  const outPosition = (
    mapBounds: boundType,
    user: userType,
    center: positionType
  ) => {
    const { hLat, lLat, hLng, lLng } = mapBounds;
    const { position } = user;
    if (!hLat || !lLat || !hLng || !lLng || !position) return;
    const higherLat = position.lat > hLat;
    const lowerLat = position.lat < lLat;
    const higherLng = position.lng > hLng;
    const lowerLng = position.lng < lLng;

    const diffCenterLat = position.lat - center.lat;
    const diffCenterLng = position.lng - center.lng;

    const outLat = higherLat || lowerLat;
    const outLng = higherLng || lowerLng;

    if (outLat || outLng) {
      // Don't know Lng,so sub lat
      let result1;
      let result2;
      let finalResult;

      if (diffCenterLat > 0) {
        const ratio = Math.abs(
          (hLat - center.lat) / (position.lat - center.lat)
        );
        const newDiffLng = (position.lng - center.lng) * ratio;
        const newLng = center.lng + newDiffLng;
        result1 = { lat: hLat, lng: newLng };
      } else if (diffCenterLat < 0) {
        const ratio = Math.abs(
          (lLat - center.lat) / (position.lat - center.lat)
        );
        const newDiffLng = (position.lng - center.lng) * ratio;
        const newLng = center.lng + newDiffLng;
        result1 = { lat: lLat, lng: newLng };
      } else {
        if (diffCenterLng > 0) {
          return (finalResult = { lat: center.lat, lng: hLng });
        } else {
          return (finalResult = { lat: center.lat, lng: lLng });
        }
      }
      // Don't know Lat,so sub lng
      if (diffCenterLng > 0) {
        const ratio = Math.abs(
          (hLng - center.lng) / (position.lng - center.lng)
        );
        const newDiffLat = (position.lat - center.lat) * ratio;
        const newLat = center.lat + newDiffLat;
        result2 = { lat: newLat, lng: hLng };
      } else if (diffCenterLng < 0) {
        const ratio = Math.abs(
          (hLng - center.lng) / (position.lng - center.lng)
        );
        const newDiffLat = (position.lat - center.lat) * ratio;
        const newLat = center.lat + newDiffLat;
        result2 = { lat: newLat, lng: lLng };
      } else {
        if (diffCenterLat > 0) {
          return (finalResult = { lat: hLat, lng: center.lng });
        } else {
          return (finalResult = { lat: lLat, lng: center.lng });
        }
      }
      const distance1 = calcDistance(
        result1.lat,
        result1.lng,
        center.lat,
        center.lng,
        "k"
      );
      const distance2 = calcDistance(
        result2.lat,
        result2.lng,
        center.lat,
        center.lng,
        "k"
      );
      if (distance1 > distance2) {
        finalResult = result2;
      } else if (distance1 < distance2) {
        finalResult = result1;
      } else {
        finalResult = result1;
      }
      return finalResult;
    } else {
      return null;
    }
  };
  const checkUserPosition = useCallback(() => {
    if (!boundAndCenter || !roomUsers) {
      return null;
    }

    const jsonUsers = JSON.stringify(roomUsers);
    const newRoomUsers = JSON.parse(jsonUsers) as userType[];

    const newUsers = newRoomUsers
      .filter((user) => user.onLine)
      .map((user) => {
        user.out = false;
        const newPosition = outPosition(
          boundAndCenter.bounds,
          user,
          boundAndCenter.center
        );

        if (newPosition) {
          user.position = newPosition;
          user.out = true;
        }

        return user;
      });
    return newUsers;
  }, [boundAndCenter, roomUsers]);

  useEffect(() => {
    const newUsers = checkUserPosition();
    if (newUsers) {
      setUsersInfoBoxes(newUsers);
    } else {
      setUsersInfoBoxes(null);
    }
  }, [checkUserPosition, boundAndCenter]);

  return (
    <>
      <Container>
        {usersInfoBoxes &&
          usersInfoBoxes.length > 0 &&
          usersInfoBoxes.map((user: userType) => (
            <InfoBox
              key={user.id}
              position={user.position as any}
              options={{
                closeBoxURL: "",
                pixelOffset: new google.maps.Size(-20, -20),
              }}
            >
              <UserImage src={user.img} $isOut={user.out} />
            </InfoBox>
          ))}
      </Container>
      <FriendsBox
        map={map}
        usersInfoBoxes={usersInfoBoxes}
        showFriends={showFriends}
        onClearPanto={onClearPanto}
      />
    </>
  );
};
export default UserMarker;
