import React, { useEffect } from "react";
import { userActions } from "../../store/user/userReducer";
import { useAppDispatch, useAppSelector } from "../../store";
import Loading from "../../components/Loading/Loading";
import Button from "../../components/Button";
import Card from "../../components/Card";
import styled from "styled-components/macro";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Home = () => {
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(userActions.loading(true));
    setTimeout(() => {
      dispatch(userActions.loading(false));
    }, 500);
  }, [dispatch]);

  return (
    <Container>
      {isLoading && <Loading />}
      <Card width={100} height={150} hover={true} handleClick={() => {}}>
        <div>Home</div>
      </Card>

      <Button label="刪除" type="cancel" handleClick={() => {}} />
    </Container>
  );
};

export default Home;
