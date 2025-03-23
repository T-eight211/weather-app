"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/UI/Header';
import Footer from '@/components/UI/Footer';
import WeatherButtons from '@/components/UI/WeatherButtons';
import HourlyChart from '@/components/UI/HourlyChart';
import MotorbikeSelector from '@/components/UI/MotorbikeSelector';
import {Chart, Filler} from 'chart.js';
import LandingSplash from "@/components/LogoAnimation";
import Image from "next/image";
import WeatherSlider from "@/components/WeatherSlider";
// import Image from "next/image";

Chart.register(Filler);

const Page: React.FC = () => {
  // Calculate dates and day names for the weather buttons
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const buttonDates: number[] = [];
  const buttonDays: string[] = [];
  const startDate = new Date();
  startDate.setDate(new Date().getDate() - 3);
  for (let i = 0; i < 7; i++) {
    buttonDates.push(startDate.getDate());
    buttonDays.push(dayNames[startDate.getDay()]);
    startDate.setDate(startDate.getDate() + 1);
  }

  // State variables (converted to TypeScript)
  const [dailyWeather] = useState<string[]>([
    '/200.png',
    '/300.png',
    '/500.png',
    '/600.png',
    '/700.png',
    '/800.png',
    '/801.png'
  ]);

  const [danger, setDanger] = useState<number>(0);
  const [dangerText, setDangerText] = useState<string>("LOW");
  const [locations] = useState<string[]>(["location", "temp1"]);

  // Update dangerText based on danger state
  useEffect(() => {
    if (danger === 0) setDangerText("LOW");
    else if (danger === 1) setDangerText("OK");
    else setDangerText("HIGH");
  }, [danger]);

  // Chart data and options for HourlyChart
  const lineChartData = {
    labels: ["00", "", "", "03", "", "", "06", "", "", "09", "", "", "12", "", "", "15", "", "", "18", "", "", "21", "", ""],
    datasets: [{
      label: "Hourly Temperature",
      data: [25,28,22,30,27,26,24,21,29,23,22,20,26,27,30,28,25,23,22,21,29,30,27,24],
      fill: true,
      backgroundColor: '#214aa6',
      borderColor: '#214aa6',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.2
    }]
  };

  // const chartOptions = {
  //   responsive: true,

  //   maintainAspectRatio: false,
  //   scales: {
  //     x: { grid: { display: false } },
  //     y: {
  //       suggestedMin: Math.min(...lineChartData.datasets[0].data) - 2,
  //       suggestedMax: Math.max(...lineChartData.datasets[0].data) + 2,
  //     },
  //   },
  // };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff", // ✅ legend text color
        },
      },
    
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          drawOnChartArea: false, // ✅ removes vertical grid lines
          drawTicks: false,
          color: "#ffffff",  
          borderColor: "#ffffff", // ✅ show the axis line in white
          borderWidth: 1,
        },
      },
      y: {
        ticks: {
          color: "#ffffff", // ✅ y-axis text
        },
        grid: {
          color: "#ffffff", // ✅ y-axis grid lines
        },
        suggestedMin: Math.min(...lineChartData.datasets[0].data) - 2,
        suggestedMax: Math.max(...lineChartData.datasets[0].data) + 2,
      },
    },
  };
  
  const currentCondition = "rain"; // Set default to rain

  return (
   
    <><LandingSplash />
    <WeatherSlider />
    <div className="h-[100vh] min-h-[670px] min-w-[365px] grid grid-rows-[10%_80%_10%] xl:grid-rows-[20%_60%_20%] text-xs xl:text-3xl text-blue-700 z-10">
      <Header />
      <main className="z-30 grid grid-cols-[5%_90%_5%] xl:grid-cols-[20%_60%_20%]">
        <div className="col-start-2 grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-2">
          <div className="row-start-1 xl:col-start-1 xl:col-span-2 xl:row-start-1 flex justify-center">
            <WeatherButtons
              buttonDates={buttonDates}
              buttonDays={buttonDays}
              dailyWeather={dailyWeather} />
          </div>
          <div className="row-start-2 xl:col-start-1 xl:col-span-2 xl:row-start-2 m-2 xl:m-4">
            <HourlyChart data={lineChartData} options={chartOptions} />
          </div>
          <div className="row-start-1 xl:col-start-3 xl:row-span-2 xl:row-start-1 grid grid-rows-[100%] p-0">
            <MotorbikeSelector locations={locations} danger={danger} dangerText={dangerText} />
          </div>
        </div>
      </main>
      <Footer />
    </div></>
  
  );
};

export default Page;
