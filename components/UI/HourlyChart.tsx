"use client"; // Ensure this runs on the client-side

import React from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";


// ✅ Register necessary components for Chart.js
ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HourlyChartProps {
  data: any;     // Ideally, define specific types
  options: any;
}

const HourlyChart: React.FC<HourlyChartProps> = ({ data, options }) => {
  return (
    <div className="h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default HourlyChart;
