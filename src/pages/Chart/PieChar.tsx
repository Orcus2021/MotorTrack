import ReactECharts from "echarts-for-react";
import { useAppSelector } from "../../store";

const PieChar = () => {
  const expense = useAppSelector((state) => state.record.expenses);

  const {
    allExpenses,
    refuelExpenses,
    repairExpenses,
    feeExpenses,
    selectYear,
  } = expense;

  const finalData = [
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
      }\n\n總花費:${allExpenses}`,
      left: "center",
      top: "center",
      textStyle: { fontSize: 22, fontWeight: "bolder", color: "#ffffff" },
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
        fontSize: 16,
      },
    },
    series: [
      {
        name: `${selectYear === "all" ? "全年度" : selectYear}花費`,
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        label: {
          normal: {
            formatter: "{title|{b} :}\n{value|${c}({d}%)}",
            color: "#fff",

            rich: {
              title: {
                color: "#fff",
                fontSize: 16,
                align: "left",
                padding: [0, 0, 5, 0],
              },
              value: {
                color: "#fff",
                fontSize: 16,
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
