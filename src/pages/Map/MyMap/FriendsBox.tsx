import { FC } from "react";
import styled from "styled-components/macro";
import { positionType, userType } from "../../../types/mapType";

const Container = styled.div<{ $isShow: boolean }>`
  position: absolute;
  right: ${(props) => (props.$isShow ? "10px" : "-100%")};
  transition: 0.5s;
  top: 50px;
  border-radius: 8px;
  background-color: var(--secondBack);
  width: 140px;
  padding: 5px 0 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.p`
  font-size: 16px;
  width: calc(100% - 20px);
  text-align: center;
  padding-bottom: 5px;
  border-bottom: 1.5px #dddddd solid;
`;
const UsersBox = styled.div`
  overflow: overlay;
  width: 100%;
  padding: 2.5px 10px 0 10px;
  max-height: calc(100vh - 285px);
  &::-webkit-scrollbar {
    width: 7px;
    position: fixed;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    background-color: rgba(136, 136, 136, 0.5);
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: var(--mainColor);
  }
  @media screen and (max-width: 701px) {
    max-height: calc(100vh - 345px);
    width: 95%;
  }
`;

const UserWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  padding: 2.5px 5px;
  border-radius: 4px;
  &:hover {
    background-color: #575757;
  }
`;
const UserImage = styled.img<{ $isOut: boolean | undefined }>`
  width: 35px;
  height: 35px;
  padding: 5px;
  object-fit: cover;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$isOut ? "var(--errorColor)" : "var(--mainColor)"};
`;
const UserName = styled.div`
  font-size: 14px;
  margin-left: 10px;
  width: 80px;
`;
const NoUser = styled.p`
  font-size: 14px;
  text-align: center;
  opacity: 0.5;
  width: 100%;
`;

type Props = {
  usersInfoBoxes: userType[] | null;
  map: google.maps.Map | undefined;
  showFriends: boolean;
  onClearPanto: () => void;
};

const FriendsBox: FC<Props> = (props) => {
  const { usersInfoBoxes, showFriends, onClearPanto, map } = props;

  const pantoUserHandler = (position: positionType) => {
    if (usersInfoBoxes && usersInfoBoxes.length > 0) {
      onClearPanto();
      map?.panTo(position);
    }
  };

  return (
    <Container $isShow={showFriends}>
      <Title>成員</Title>
      <UsersBox>
        {usersInfoBoxes && usersInfoBoxes.length > 0 ? (
          usersInfoBoxes.map((user) => (
            <UserWrapper
              onClick={() =>
                pantoUserHandler(user.initPosition as positionType)
              }
              key={user.id}
            >
              <UserImage src={user.img} $isOut={user.out} />
              <UserName>{user.name}</UserName>
            </UserWrapper>
          ))
        ) : (
          <NoUser>沒有成員</NoUser>
        )}
      </UsersBox>
    </Container>
  );
};

export default FriendsBox;
