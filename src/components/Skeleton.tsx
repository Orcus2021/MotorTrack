import React from "react";
import styled from "styled-components/macro";

const SkeletonWrapper = styled.div`
  width: 100%;
  height: 50px;
  padding: 5px 10px;
  border-radius: 10px;
  background-color: #464d5d;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const SkeletonCircle = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #d2d2d237;
  overflow: hidden;
  &::after {
    content: "";
    background-color: #ffffff26;
    box-shadow: 0px 0px 12px 5px #ffffff2a;
    width: 1px;
    height: 100%;
    position: absolute;

    top: 0;
    left: 0;
    animation: skeletonRun 0.5s ease-in-out infinite;
  }
  @keyframes skeletonRun {
    0% {
      left: -20%;
    }
    100% {
      left: 110%;
    }
  }
`;
const SkeletonMidBox = styled.div`
  width: calc(100% - 0px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SkeletonBar = styled.div`
  position: relative;
  width: 100%;
  height: 15px;
  border-radius: 50px;
  background-color: #d2d2d237;
  overflow: hidden;
  margin-bottom: 5px;
  &:nth-child(2) {
    margin-bottom: 0;
  }

  &::after {
    content: "";
    background-color: #ffffff26;
    box-shadow: 0px 0px 12px 5px #ffffff2a;
    width: 20px;
    height: 100%;
    position: absolute;

    top: 0;
    left: 0;
    animation: skeletonRun 1s ease-in-out infinite;
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
    animation: skeletonRun 1s ease-in-out infinite 0.5s;
  }
`;

const Skeleton = () => {
  return (
    <SkeletonWrapper>
      <SkeletonCircle />
      <SkeletonMidBox>
        <SkeletonBar />
        <SkeletonBar />
      </SkeletonMidBox>
    </SkeletonWrapper>
  );
};

export default Skeleton;
