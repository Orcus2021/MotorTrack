import React, { useState } from "react";
import firebase from "./utils/firebase";
import asyncRecordAction from "./store/record/asyncRecordAction";
import styled from "styled-components/macro";
import { useAppDispatch, useAppSelector } from "./store/index";
import { useForm } from "react-hook-form";
import { arrayUnion } from "firebase/firestore";
import ReactECharts from "echarts-for-react";

const From = styled.form`
  margin-top: 68px;
`;
const option = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
    },
  },
  legend: {
    orient: "horizontal",
    left: "center",
    bottom: 0,
    textStyle: {
      color: "#fff",
    },
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "10%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
  },
  yAxis: {
    type: "category",
    data: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
  },
  series: [
    {
      name: "維修",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [320, 302, 301, 334, 390, 330, 320],
    },
    {
      name: "充電/加油",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "費用",
      type: "bar",
      stack: "total",
      label: {
        show: true,
      },
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
  ],
};

const Test = () => {
  return (
    <>
      <From>
        <ReactECharts
          option={option}
          style={{ height: 400 }}
          theme={"macarons"}
        />
      </From>
    </>
  );
};

export default Test;
