import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { useAppSelector, useAppDispatch } from "../../store";
import { recordActions } from "../../store/record/recordReducer";

const PieChar = () => {
  const expense = useAppSelector((state) => state.record.expenses);
  // const dispatch = useAppDispatch();
  // const car = useAppSelector((state) => state.car.car);

  const {
    allExpenses,
    refuelExpenses,
    repairExpenses,
    feeExpenses,
    selectYear,
  } = expense;
  // console.log(refuelExpenses, repairExpenses, feeExpenses);

  let finalData = [
    { value: repairExpenses, name: "維修" },
    { value: refuelExpenses, name: "加油/充電" },
    { value: feeExpenses, name: "費用" },
  ];

  const pieData = finalData.filter((data) => data.value !== 0);

  const option = {
    backgroundColor: "rgba(255, 255, 255, 0)",
    title: {
      text: `${
        selectYear === "all" ? "全年度" : selectYear
      }\n總花費:${allExpenses}`,
      left: "center",
      top: "center",
      textStyle: { fontSize: 18, fontWeight: "bolder", color: "#ffffff" },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      left: "center",
      bottom: 0,
      formatter(name: string) {
        let value;
        finalData.forEach((item) => {
          if (item.name === name) {
            value = item.value;
          }
        });
        return [`${name}:$${value}`];
      },
      data: ["維修", "加油/充電", "費用"],
      textStyle: {
        color: "#fff",
      },
    },
    series: [
      {
        name: `${selectYear}花費`,
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        label: {
          normal: {
            formatter: "{title|{b} :}\n{value|${c}({d}%)}",
            color: "#fff",
            // position: "inside",
            rich: {
              title: {
                color: "#fff",
                align: "left",
                padding: [0, 0, 5, 0],
              },
            },
          },
        },
        data: pieData,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: 400 }} theme={"macarons"} />
  );
};

export default PieChar;
