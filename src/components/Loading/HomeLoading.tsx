import styled from "styled-components/macro";

import downLogo from "../../assets/img/logo_white-down.png";
import upLogo from "../../assets/img/logo_white-up.png";

const Back = styled.div`
  position: fixed;
  z-index: 200;
  top: 0;
  width: 100%;
  height: 100vh;
  background-color: #16181d;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeOut linear forwards 1s 5s;
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;
const LogoWrapper = styled.div`
  display: flex;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 215px;

  animation: scaleLogo linear forwards 1s 3s;
  @keyframes scaleLogo {
    0% {
      width: 215px;
      opacity: 1;
    }
    100% {
      width: 90vw;
      opacity: 0;
    }
  }
`;
const UpImg = styled.img`
  width: 100%;
  animation: logoUp linear forwards 0.5s;
  @keyframes logoUp {
    0% {
      transform: translateY(23px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;
const UpBox = styled.div`
  width: 100%;
  overflow: hidden;
  animation: lightText linear forwards 0.5s 2s;
  @keyframes lightText {
    0% {
      filter: drop-shadow(0px 0px 0px rgb(162, 196, 255));
    }
    100% {
      filter: drop-shadow(0px 0px 20px rgb(162, 196, 255));
    }
  }
`;
const DownBox = styled.div`
  width: 100%;
  overflow: hidden;
  animation: lightText linear forwards 0.5s 2s;

  @keyframes lightText {
    0% {
      filter: drop-shadow(0px 0px 0px rgb(162, 196, 255));
    }
    100% {
      filter: drop-shadow(0px 0px 20px rgb(162, 196, 255));
    }
  }
`;
const DownImg = styled.img`
  width: 100%;
  animation: logoDown linear forwards 0.5s 1s;
  transform: translateY(-39px);
  @keyframes logoDown {
    0% {
      transform: translateY(-39px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const Loading = () => {
  return (
    <Back>
      <LogoWrapper>
        <UpBox>
          <UpImg src={upLogo} />
        </UpBox>
        <DownBox>
          <DownImg src={downLogo} />
        </DownBox>
      </LogoWrapper>
    </Back>
  );
};

export default Loading;
