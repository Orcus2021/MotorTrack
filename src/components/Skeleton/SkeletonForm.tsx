import React from "react";
import styled from "styled-components/macro";

const SkeletonWrapper = styled.div`
  width: 100%;
  height: 30px;
  padding: 0px 10px;
  border-radius: 10px;
  background-color: rgba(1, 0, 44, 0.4);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SkeletonBar = styled.div`
  position: relative;
  flex-grow: 1;
  height: 20px;
  margin-right: 10px;
  border-radius: 50px;
  background-color: #d2d2d237;
  overflow: hidden;

  &::after {
    content: "";
    background-color: #ffffff26;
    box-shadow: 0px 0px 12px 5px #ffffff2a;
    width: 20px;
    height: 100%;
    position: absolute;

    top: 0;
    left: 0;
    animation: skeletonFormRun 1s ease-in-out infinite;
  }
  &::before {
    content: "";
    background-color: #ffffff26;
    box-shadow: 0px 0px 12px 5px #ffffff2a;
    width: 20px;
    height: 100%;
    position: absolute;

    top: 0;
    left: 0;
    animation: skeletonFormRun 1s ease-in-out infinite 0.5s;
  }
  @keyframes skeletonFormRun {
    0% {
      left: -20%;
    }
    100% {
      left: 110%;
    }
  }
`;
const SkeletonBarShot = styled.div`
  position: relative;
  width: 100px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50px;
  background-color: #d2d2d237;
  overflow: hidden;

  &::after {
    content: "";
    background-color: #ffffff26;
    box-shadow: 0px 0px 12px 5px #ffffff2a;
    width: 20px;
    height: 100%;
    position: absolute;

    top: 0;
    left: 0;
    animation: skeletonFormRun 1s ease-in-out infinite;
  }
  &::before {
    content: "";
    background-color: #ffffff26;
    box-shadow: 0px 0px 12px 5px #ffffff2a;
    width: 20px;
    height: 100%;
    position: absolute;

    top: 0;
    left: 0;
    animation: skeletonFormRun 1s ease-in-out infinite 0.5s;
  }
  @keyframes skeletonFormRun {
    0% {
      left: -20%;
    }
    100% {
      left: 110%;
    }
  }
`;

const Skeleton = () => {
  return (
    <SkeletonWrapper>
      <SkeletonBarShot />
      <SkeletonBar />
      <SkeletonBar />
      <SkeletonBar />
      <SkeletonBarShot />
    </SkeletonWrapper>
  );
};

export default Skeleton;
