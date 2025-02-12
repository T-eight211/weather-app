import React, {useState,useEffect} from 'react';
import './App.css';
import img200 from './images/weatherIcons/200.png';
import img300 from './images/weatherIcons/300.png';
import img500 from './images/weatherIcons/500.png';
import img600 from './images/weatherIcons/600.png';
import img700 from './images/weatherIcons/700.png';
import img800 from './images/weatherIcons/800.png';
import img801 from './images/weatherIcons/801.png';
import { Line } from "react-chartjs-2"
import {Chart as ChartJs, Legend, plugins, scales, Tooltip} from "chart.js/auto";


/* 
NOTE TO SELF:
for simplicity we will use one pic for each weather type and not differentiate between light rain and heavy rain for now. CHANGE THIS IF WE HAVE TIME.
*/

function App() {
  // getting current date in unix format
  const currentDateUnix = Math.floor(new Date()/1000);
  
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

  // initiallizing state variables
  const [dailyWeather, setDailyWeather] = useState([img200,img300,img500,img600,img700,img800,img801]);
  const [hourlyTemp, sethourlyTemp] = useState([]);
  const [locations, setLocations] = useState(["loaction","temp1"]);
  const [danger, setDanger] = useState(0);
  const [dangerText, setDangerText] = useState("LOW");
  useEffect(() => {
    if (danger === 0) {
      setDangerText("LOW");
    }
    else if (danger === 1) {
      setDangerText("OK");
    }
    else {
      setDangerText("HIGH");
    }
  },[danger]);

  const [lineChartData, setLineChartData] = useState({
    labels: ["00","","","03","","","06","","","09","","","12","","","15","","","18","","","21","",""],
    datasets: [{
      label: "Hourly Temprature",
      data: [25,28,22,30,27,26,24,21,29,23,22,20,26,27,30,28,25,23,22,21,29,30,27,24],
      fill: true,
      backgroundColor: '#214aa6',
      borderColor: '#214aa6',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.2
    }] 
    
  });

  const [data, setData] = useState([]);

  // weather api key
  const apiKey = "718d0502e1fdf804f510f63140737137";

  // fetching weather data
  let lat = 51.5;
  let lon = 0.1;
  /*
  let fiveDaysURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}`; NEED TO WAIT FOR UNI INSTRUCTIONS COS I NEED THE STUDENT VERSION

  const req = new XMLHttpRequest();
  req.open("GET", fiveDaysURL);
  req.onload = () => {
    setData(req.response);
  }
  req.send();

  console.log("PRINTINGNNNNN \n" + data + "\n END");

  // things reqiuired from user
   - location
   - date viewing for the hourly (if we have time)
   - motorbike type for the wind speed etc
  */
 
  // base styles 
  const allStyle = `h-[100vh] min-h-[670px] min-w-[365px] grid grid-rows-[10%_80%_10%] xl:grid-rows-[20%_60%_20%] text-xs xl:text-3xl text-blue-700`;
  const headerStyle = "text-left text-2xl xl:text-5xl font-bold p-2 xl:p-6";
  const mainStyle = "z-30 grid grid-cols-[5%_90%_5%] xl:grid-cols-[20%_60%_20%]";
  const insideMainStyle = "col-start-2 grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-2 bg-white bg-opacity-85";
  const weatherBoxStyle = "row-start-1 xl:col-start-1 xl:col-span-2 xl:row-start-1 flex justify-center";
  const hourlyWeatherStyle = "row-start-2 xl:col-start-1 xl:col-span-2 xl:row-start-2 m-2 xl:m-4";
  const motorbikeStyle = "row-start-3 xl:col-start-3 xl:row-span-2 xl:row-start-1 border-[1px] rounded-[3px] grid grid-rows-[15%_15%_10%_60%] grid-cols-1 xl:grid-cols-2 xl:grid-rows-[10%_10%_80%] m-1 xl:m-2 text-xs xl:text-2xl p-1";
  const weatherButtonStyle = "w-[12%] h-[70%] m-1 xl:m-2 border-[1px] border-blue-500 rounded-[3px] grid grid-rows-[20%_60%_20%] bg-gradient-to-t from-[#000340] to-blue-500 text-white text-center text-1XL xl:text-2XL font-bold";
  const dangerIconStyle = "xl:col-span-2 mx-auto my-auto";
  const dangerTextStyle = "xl:col-span-2 ml-1 xl:ml-2 mt-auto text-xs xl:text-base text-black font-bold";
  const footerStyle = "text-center text-xxs xl:text-sm mt-6 xl:mt-20";
  const gradientStyle = "from-[#000340] via-[#FFFFFF] to-[#FFFFFF]";
  const inputsStyle = "border-b-[1px] border-blue-500 rounded-[3px] m-1 xl:m-2 text-xs xl:text-base";
  const imageStyle = "w-[80%] mx-auto my-auto";
  const lowDangerStyle = "bg-[radial-gradient(circle,#FFF,#90EE90)] border-green-500 text-green-700";
  const mediumDangerStyle = "bg-[radial-gradient(circle,#FFF,#FFDBBB)] border-orange-500 text-orange-700";
  const highDangerStyle = "bg-[radial-gradient(circle,#FFF,#FF8080)] border-red-500 text-red-700";
  const bigDangerTextStyle = "text-9xl font-bold text-center";

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
        suggestedMin: Math.min(...lineChartData.datasets[0].data) - 2,
        suggestedMax: Math.max(...lineChartData.datasets[0].data) + 2,
      },
    },
  }

  return (
    <div className={allStyle + " z-10"}>
      <header className={`z-30 bg-gradient-to-bl  + ${gradientStyle}`}>
        <h1 className={headerStyle}>W</h1>
      </header>

      <main className={mainStyle}>
        <div className={insideMainStyle}>
          <div className={weatherBoxStyle}>
          {
            buttonDates.map((date,index) => {
              return (
                <button key={index} className={weatherButtonStyle}>
                  <p>{date}</p>
                  <img className={imageStyle} src={dailyWeather[index]}/>
                  <p>{buttonDays[index]}</p>
                </button>
              )
            })
          }
          </div>

          <div className={hourlyWeatherStyle}>
            <Line data={lineChartData} options={chartStyle}/>
          </div>

          <div className={`${motorbikeStyle}+ " " + ${danger === 0 ? lowDangerStyle : danger === 1 ? mediumDangerStyle : highDangerStyle}`}>
            <select className={inputsStyle} placeholder="Motorbike Type" defaultValue={0}>
              <option value="0">Motorbike Type</option>
              <option value="1">Sports</option>
              <option value="2">Scooter</option>
              <option value="3">Cruiser</option>
              <option value="4">Off-road</option>
              <option value="5">Street</option>
            </select>
            <select className={inputsStyle}>
              {
                locations.map((location,index) => {
                  return (
                    <option key={index} value={location}>{location}</option>
                  )
                })
              }
            </select>
            <p className={dangerTextStyle}>Danger Levels:</p>
            <div className={dangerIconStyle}>
              <p className={bigDangerTextStyle}>{dangerText}</p>
            </div>
            
          </div>
        </div>
      </main>

      <footer className={`z-30 bg-gradient-to-tr  + ${gradientStyle}`}>
        <p className={footerStyle}>all rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
