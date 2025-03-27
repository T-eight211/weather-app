
// To do list
// 1. fix the destination select boxes
// 2. create numerical values for the danger levels of the motorbikes through the used vehicle type
// 3. create a function that calculates the danger level of the trip based on the weather conditions
// 4. create a function that calculates the danger level of the trip based on the road conditions
// 5. add up the danger levels of the motorbike, weather and road conditions to get the total danger level of the trip
// 6. create a function that changes the danger level meter image based on the total danger level of the trip

import React, {useState, useEffect, useRef} from 'react';
import Select from 'react-select';
import './App.css';
import img200 from './images/weatherIcons/200.png';
import img300 from './images/weatherIcons/300.png';
import img500 from './images/weatherIcons/500.png';
import img600 from './images/weatherIcons/600.png';
import img700 from './images/weatherIcons/700.png';
import img800 from './images/weatherIcons/800.png';
import img801 from './images/weatherIcons/801.png';
import dangerLow from './images/dangerLow.png';
import dangerMid from './images/dangerMid.png';
import dangerHigh from './images/dangerHigh.png';
import logo from './images/logo.png';
import { Line } from "react-chartjs-2"
import {Chart as ChartJs, Legend, plugins, scales, Tooltip} from "chart.js/auto";
var typeDanger=0;

/* 
NOTE TO SELF:
for simplicity we will use one pic for each weather type and not differentiate between light rain and heavy rain for now. CHANGE THIS IF WE HAVE TIME.
*/

function App() {
  // setting up variables for the weather buttons
  let firstDate = new Date();
  firstDate.setDate(new Date().getDate()-3);
  let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let buttonDates = [];
  let buttonDays = [];
  for (let i = 0; i < 7; i++) {
    buttonDates.push(firstDate.getDate());
    buttonDays.push(dayNames[firstDate.getDay()]);
    firstDate.setDate(firstDate.getDate() + 1);
  }
  firstDate = new Date();


  
  var locationDanger = 0;

  // initiallizing state variables
  const [dailyWeather] = useState([img200,img300,img500,img600,img700,img800,img801]);
  const locations = [
    { label: "London", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Birmingham", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Manchester", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Brighton", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Wolverhampton", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Liverpool", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Leeds", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Sheffield", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Bristol", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Nottingham", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Leicester", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Coventry", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Newcastle", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Southampton", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Portsmouth", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Cardiff", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Edinburgh", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Glasgow", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Aberdeen", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Dundee", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Inverness", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Stirling", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Perth", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Norwich", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Cambridge", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Oxford", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Reading", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Milton Keynes", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Luton", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Slough", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Derby", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Hull", value: Math.floor(Math.random() * 5) + 1 },
    { label: "York", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Exeter", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Plymouth", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Swansea", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Bangor", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Newport", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Chelmsford", value: Math.floor(Math.random() * 5) + 1 },
    { label: "Ipswich", value: Math.floor(Math.random() * 5) + 1 }
  ];

  const locationOptions = locations.map((location) => ({
    value: location.value,
    label: location.label,
  }));





  let handleLocationChange = (selectedOption) => {
    locationDanger = selectedOption.value;
    console.log(locationDanger);
    
  };




  var typeDanger

  
  const motorbikeTypeOptions = [
    { value: "1", label: "Sports" },
    { value: "2", label: "Scooter" },
    { value: "3", label: "Cruiser" },
    { value: "4", label: "Off-road" },
    { value: "5", label: "Street" },
  ];

  let handleMotorbikeTypeChange = (selectedOption) => {
    if (selectedOption.value === "1") {
      typeDanger = 1;
    }
    if (selectedOption.value === "2") {
      typeDanger = 2;
    }
    if (selectedOption.value === "3") {
      typeDanger = 3;
    }
    if (selectedOption.value === "4") {
      typeDanger = 4;
    }
    if (selectedOption.value === "5") {
      typeDanger = 5;
    }
    console.log(typeDanger);
  };

  const [lineChartData, setLineChartData] = useState({
    labels: ["00:00","","","03:00","","","06:00","","","09:00","","","12:00","","","15:00","","","18:00","","","21:00","",""],
    datasets: [{
      label: "Hourly Temperature",
      data: [25,28,22,30,27,26,24,21,29,23,22,20,26,27,30,28,25,23,22,21,29,30,27,24],
      fill: true,
      backgroundColor: 'rgba(37, 54, 82, 0.8)',
      borderColor: '#4C71AD',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.2
    }]
  });
  const [selectedDay, setSelectedDay] = useState(3);

 
  // base styles 
  const allStyle = `h-screen min-h-[670px] min-w-[365px] grid grid-rows-[5%_90%_5%] xl:grid-rows-[20%_60%_20%] text-xs xl:text-3xl ${(firstDate.getHours() >= 6 && firstDate.getHours() <= 18) ? `bg-style-light text-style-dark` : `bg-style-dark text-style-dark`} `;
  const mainStyle = "z-30 xl:grid grid-cols-[5%_90%_5%] xl:grid-cols-[10%_80%_10%]";
  const insideMainStyle = "col-start-2 grid grid-cols-1 grid-rows-[2fr_1fr_4fr] xl:grid-cols-3 xl:grid-rows-2 white";
  const weatherBoxStyle = "row-start-2 xl:col-start-1 xl:col-span-2 flex justify-center border-0 bg-[#253652] rounded-[15px] xl:rounded-[50px] mx-1 xl:mx-0";
  const hourlyWeatherStyle = "row-start-1 xl:col-start-1 xl:col-span-2 m-2 xl:m-4 grid grid-cols-[1fr_4fr] ";
  const motorbikeStyle = "row-start-3 xl:col-start-3 xl:row-span-2 xl:row-start-1 bg-[#253652] border-0 rounded-[15px] xl:rounded-[50px] p-4 flex-row m-1 xl:m-2 text-xs xl:text-2xl h-full";
  const weatherButtonStyle = "w-[13%] xl:w-[12.5%] m-0.5 xl:m-2 border border-[#253652]  rounded-[12px] xl:rounded-[40px] grid grid-rows-[20%_60%_20%] text-center text-1xl xl:text-2xl font-bold hover:border hover:border-[#4C71AD] ";
  const dangerTextStyle = "m-1 text-base xl:py-2 xl:mt-4 xl:text-xl font-bold border-t border-[#848C9A]";
  const footerStyle = "text-center text-xxs xl:text-sm mt-2 xl:mt-10 xl:mt-20 text-blue-600";
  const gradientStyle = "";
  const inputsStyle = "border-b-[1px] bg-[#4C71AD] border-0 rounded-[25px] m-1 p-1 text-xs xl:text-base";
  const imageStyle = "w-[80%] mx-auto my-auto";
  const InfoText = `text-base xl:text-xl xl:my-2 font-bold`
  const selectDivStyle = `p-0`;
  const reactSelectStyle = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#4C71AD",
      border: "0px solid transparent",
      borderRadius: "25px",
      padding: "2px",
      margin: "2px",
      color: "white",
      fontSize: "1rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.7)",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#4C71AD",
      borderRadius: "25px",
      margin: "0px",
      border: "0px",
      fontSize: "1rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#36548C" : "#4C71AD",
      color: "white",
      borderRadius: "25px",
      margin: "auto",
      width: "98%",
      border: "0px",
    }),
  };
  const chartStyle = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        borderWidth: 0,
        grid: {
          display: false,
        },
        suggestedMin: Math.min(...lineChartData.datasets[0].data) - 1,
        suggestedMax: Math.max(...lineChartData.datasets[0].data) + 1,
      },
    },
  }

  return (
    <div className={allStyle + " z-10"}>
      <header className={`z-30  + ${gradientStyle}`}>
        <img src={logo} alt={`logo of the website`} className={`h-[90%] p-1 xl:p-10 w-auto`} />
      </header>

      <main className={mainStyle}>
        <div className={insideMainStyle}>

          <div className={hourlyWeatherStyle}>
            <img className={`my-auto`} src={img200} alt={`average weather image`}/>
            <div className={`p-2 my-auto xl:p-6 xl:h-[80%]`}>
              <Line className={`w-[100%]`} data={lineChartData} options={chartStyle}/>
            </div>
          </div>

          <div className={weatherBoxStyle}>
            {
              buttonDates.map((date,index) => {
                return (
                    <button key={index} onClick={() => {setSelectedDay(index)}} className={`${weatherButtonStyle} ${firstDate.getDate() === date ? ` text-blue-700` : ``} ${selectedDay === index ? ` bg-[#4C71AD]` : ``}`}>
                      <p>{date}</p>
                      <img className={imageStyle} src={dailyWeather[index]} alt={`icon of the weather of this date`}/>
                      <p>{buttonDays[index]}</p>
                    </button>
                )
              })
            }
          </div>

          <div className={motorbikeStyle}>

            <div className={selectDivStyle}>
              <Select
                  id={`location1`}
                  classNames={inputsStyle}
                  options={motorbikeTypeOptions}
                  placeholder="Motorbike Type"
                  styles={reactSelectStyle}
                  isSearchable
                  onChange={handleMotorbikeTypeChange}
              />
            </div>
            <p className={InfoText}>Destination:</p>
            <div className={`grid grid-cols-2`}>
              <div className={selectDivStyle}>
                <Select
                    id={`location1`}
                    classNames={inputsStyle}
                    options={locationOptions}
                    placeholder="From"
                    styles={reactSelectStyle}
                    isSearchable
                    onChange={handleLocationChange}
                />

              </div>

              <div className={selectDivStyle}>
                <Select
                    id={`location2`}
                    classNames={inputsStyle}
                    options={locationOptions}
                    placeholder="To"
                    styles={reactSelectStyle}
                    isSearchable
                    onChange={handleLocationChange}
                />
              </div>
            </div>


            <p className={dangerTextStyle}>Danger Levels:</p>
            <img src={dangerLow} alt={`danger level meter image`} className={`mx-auto max-w-[100px] xl:max-w-[300px]`} />
            <div className={`flex w-full border-t border-[#848C9A]`}>
              <p className={`self-start mr-auto ${InfoText}`}>Weather Conditions:</p>
              <p className={`self-end ${InfoText}`}>Cloudy</p>
            </div>
            <div className={`flex w-full`}>
              <p className={`self-start mr-auto ${InfoText}`}>Road Conditions:</p>
              <p className={`self-end ${InfoText}`}>Dry</p>
            </div>
            <div className={`flex w-full`}>
              <p className={`self-start mr-auto ${InfoText}`}>Suggestion:</p>
              <p className={`self-end ${InfoText}`}>Helmet and gloves!</p>
            </div>
          </div>
        </div>
      </main>

      <footer className={`z-30  + ${gradientStyle}`}>
        <p className={footerStyle}>all rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
