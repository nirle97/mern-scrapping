import React from "react";
import "./chart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

export default function Chart({ chartsData }) {
  return (
    <div className="Chart-container">
      <LineChart
        width={500}
        height={300}
        data={chartsData.timeChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis dataKey="pastes" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pastes"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
      <BarChart
        width={500}
        height={300}
        data={chartsData.barChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="4 6" />
        <XAxis dataKey="number" />
        <YAxis dataKey="sentimentScore" />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="sentimentScore" fill="#82ca9d" />
      </BarChart>
    </div>
  );
}
