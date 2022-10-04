import React, { useRef, FC, useCallback, useState } from "react";
import { positionType } from "../../../types/mapType";
import styled from "styled-components/macro";
import { Autocomplete } from "@react-google-maps/api";

import searchIcon from "../../../assets/icon/search.png";
import directionIcon from "../../../assets/icon/direction.png";
import directionBlackIcon from "../../../assets/icon/direction-black.png";

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 10px rgb(0, 0, 0);
  border-radius: 8px;
`;
const Input = styled.input`
  font-size: 16px;
  outline: none;
  border: 1px #fff solid;
  border-radius: 8px 0 0 8px;
  padding: 5px 26px 5px 5px;
  box-shadow: none;
`;
const DirectionIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: cover;
`;
const SearchIcon = styled.img`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  object-fit: cover;
`;
const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const DirectionWrapper = styled.div<{ $isDirection: boolean }>`
  height: 35.33px;
  padding: 5px 7px;
  border-radius: 0 8px 8px 0;
  background-color: ${(props) =>
    props.$isDirection ? "var(--mainColor)" : "#fff"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #fff; */
  &:hover {
    background-color: var(--mainColor);
  }
`;
type PropType = {
  onMarker: React.Dispatch<React.SetStateAction<positionType | null>>;
  onDirection: () => void;
  isDirection: boolean;
};

const SearchBar: FC<PropType> = (props) => {
  const { onMarker, onDirection, isDirection } = props;
  const searchBar = useRef<HTMLInputElement | null>(null);
  const searchResult = useRef<google.maps.places.PlaceResult | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const autocompleteOnLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    if (autocomplete !== null) {
      autocompleteRef.current = autocomplete;
    }
  };
  const getPlaceDetail = useCallback(() => {
    if (autocompleteRef.current !== null) {
      searchResult.current = autocompleteRef.current.getPlace();
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  }, []);

  const markerResultHandler = () => {
    const position = {
      lat: searchResult.current?.geometry?.location?.lat(),
      lng: searchResult.current?.geometry?.location?.lng(),
    };
    if (!position.lat || !position.lng) return;

    onMarker(position as positionType);
    if (searchBar.current) {
      searchBar.current.value = "";
    }
  };
  return (
    <Container>
      <InputWrapper>
        <Autocomplete
          onLoad={autocompleteOnLoad}
          onPlaceChanged={getPlaceDetail}
        >
          <Input type="text" placeholder="搜尋Google地圖" ref={searchBar} />
        </Autocomplete>
        <SearchIcon src={searchIcon} onClick={markerResultHandler} />
      </InputWrapper>
      <DirectionWrapper onClick={onDirection} $isDirection={isDirection}>
        <DirectionIcon src={directionBlackIcon} />
      </DirectionWrapper>
    </Container>
  );
};

export default SearchBar;
