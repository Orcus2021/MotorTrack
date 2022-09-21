import React from "react";
import styled from "styled-components";
import { repairType, feeType } from "../../types/recordType";
import ReactECharts from "echarts-for-react";
import { useAppSelector } from "../../store";

const BarChart = () => {
  const record = useAppSelector((state) => state.record);
  const { fee, refuel, repair, expenses } = record;
  const perMonthExpense = (
    data: (repairType | feeType)[],
    selectYear: string
  ) => {
    const monthsArr = new Array(12).fill(0);
    if (selectYear !== "all") {
      data
        .filter(
          (record) => `${new Date(record.date).getFullYear()}` === selectYear
        )
        .forEach((record) => {
          const recordMonth = new Date(record.date).getMonth();
          monthsArr[recordMonth] += record.amount;
        });
    } else {
      data.forEach((record) => {
        const recordMonth = new Date(record.date).getMonth();
        monthsArr[recordMonth] += record.amount;
      });
    }

    return monthsArr;
  };

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
        fontSize: 16,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
    },
    yAxis: {
      type: "category",
      axisLabel: {
        show: true,
        fontSize: 16,
        color: "#fff",
      },
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
        data: perMonthExpense(repair, expenses.selectYear),
        textStyle: { fontSize: 14, color: "#fff" },
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
        data: perMonthExpense(refuel, expenses.selectYear),
        textStyle: { fontSize: 14, color: "#fff" },
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
        data: perMonthExpense(fee, expenses.selectYear),
        textStyle: { fontSize: 14, color: "#fff" },
      },
    ],
  };
  return (
    <>
      <ReactECharts
        option={option}
        style={{ height: 420 }}
        theme={"macarons"}
      />
    </>
  );
};

export default BarChart;
