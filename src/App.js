import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";
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
import cities from "./cities.json";
import { Line } from "react-chartjs-2"
import {Chart as ChartJs, Legend, plugins, scales, Tooltip} from "chart.js/auto";


/* 
NOTE TO SELF:
for simplicity we will use one pic for each weather type and not differentiate between light rain and heavy rain for now. CHANGE THIS IF WE HAVE TIME.
*/

function App() {
  // setting up variables for the weather buttons
  let firstDate = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const buttonDates = useRef([]);
  const buttonDays = useRef([]);
  const dayTemps = useRef({});
  const avgTemps = useRef({});
  const dayWeathers= useRef({});
  const dailyWeather = useRef({});
  const API_KEY = "718d0502e1fdf804f510f63140737137";
  // by default the lon and lat is londons
  const lat = useRef("51.5072");
  const lon = useRef("0.1276");
  const [selectedDay, setSelectedDay] = useState(firstDate.getDate().toString());
  const [bikeType, setBikeType] = useState("street");
  const [dangerImg, setDangerImg] = useState(dangerLow);
  const [weatherConditionText, setWeatherConditionText] = useState("");
  const [roadConditionText, setRoadConditionText] = useState("");
  const [safetySuggestion, setSafetySuggestion] = useState("");

  const fetchWeatherData = async () => {
    try {
      console.log(lat.current + " " + lon.current);
      const currentTime = Math.floor(Date.now() / 1000);
      const pastStart = currentTime - 3 * 24 * 60 * 60;
      const forecastAPI = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat.current}&lon=${lon.current}&appid=${API_KEY}&units=metric`;
      const historicalAPI = `https://history.openweathermap.org/data/2.5/history/city?lat=${lat.current}&lon=${lon.current}&type=hour&start=${pastStart}&end=${currentTime}&appid=${API_KEY}&units=metric`;

      const [forecastRes, historicalRes] = await Promise.all([
        axios.get(forecastAPI),
        axios.get(historicalAPI),
      ]);

      const combinedData = [...historicalRes.data.list, ...forecastRes.data.list];
      const groupedTemps = {};
      const groupedWeathers = {};

      combinedData.forEach((entry) => {
        let tempDT = new Date(entry.dt * 1000);
        tempDT.setUTCHours(0, 0, 0, 0);
        const dateStr = tempDT.getDate().toString();
        const temp = Math.floor(entry.main.temp);
        const condition = entry.weather[0].id;

        if (!groupedTemps[dateStr]) {
          groupedTemps[dateStr] = [];
          groupedWeathers[dateStr] = [];
        }
        if (!buttonDates.current.includes(dateStr)) {
          buttonDates.current.push(dateStr);
          buttonDays.current.push(dayNames[tempDT.getDay()]);
        }

        groupedTemps[dateStr].push(temp);
        groupedWeathers[dateStr].push(condition);
      });

      dayTemps.current = groupedTemps;
      dayWeathers.current = groupedWeathers;
      for (let key in dayWeathers.current) {
        avgTemps.current[key] = getModalTemperature(dayTemps.current[key]);
        const tempAvgWeather = getModalWeather(dayWeathers.current[key]);
        if (tempAvgWeather === "801") {
          dailyWeather.current[key] = img801;
        }
        else {
          const tempVar = Math.floor(parseInt(tempAvgWeather));
          if (tempVar === 200) {
            dailyWeather.current[key] = img200;
          }
          else if (tempVar === 300) {
            dailyWeather.current[key] = img300;
          }
          else if (tempVar === 500) {
            dailyWeather.current[key] = img500;
          }
          else if (tempVar === 600) {
            dailyWeather.current[key] = img600;
          }
          else if (tempVar === 700) {
            dailyWeather.current[key] = img700;
          }
          else {
            dailyWeather.current[key] = img800;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    changeDatePicked(firstDate.getDate().toString());
  };

  function getModalWeather(arr) {
    const freqMap = {};
    let maxFreq = 0;
    let modalWeather = null;
    let alternativeModal = null;

    for (let num of arr) {
      freqMap[num] = (freqMap[num] || 0) + 1;
      if (freqMap[num] > maxFreq) {
        maxFreq = freqMap[num];
        if (num !== 801) {
          alternativeModal = num;
        }
        modalWeather = num;
      }
    }

    return alternativeModal !== null ? alternativeModal : modalWeather;
  }

  function getModalTemperature(arr) {
    const freqMap = {};
    let maxFreq = 0;
    let modalTemp = null;

    for (let num of arr) {
      freqMap[num] = (freqMap[num] || 0) + 1;
      if (freqMap[num] > maxFreq) {
        maxFreq = freqMap[num];
        modalTemp = num;
      }
    }

    return modalTemp;
  }


  useEffect(() => {
    fetchWeatherData();
  }, []);

  const changeDatePicked = (date) => {
    setSelectedDay(date);
    let labelH = [];
    for (let i = 24 - dayTemps.current[date].length; i < 24; i++) {
      labelH.push(i.toString().padStart(2, '0'));
    }

    setLineChartData({
      labels: labelH,
      datasets: [{
        label: "Hourly Temperature",
        data: dayTemps.current[date],
        fill: true,
        backgroundColor: 'rgba(37, 54, 82, 0.8)',
        borderColor: '#4C71AD',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.2
      }]
    });
  };



  // initiallizing state variables
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    setLocations(cities);
  }, []);
  const locationOptions = locations.map((city) => ({
    value: city.name,
    label: `${city.name}`,
    lat: city.lat,
    lon: city.lon
  }));

  const handleCityChange = (event) => {
    lon.current = event.lon;
    lat.current = event.lat;
    fetchWeatherData();
  }

  const motorbikeTypeOptions = [
    { value: "Street", label: "Street" },
    { value: "Sports", label: "Sports" },
    { value: "Scooter", label: "Scooter" },
    { value: "Cruiser", label: "Cruiser" },
    { value: "Off-road", label: "Off-road" },
  ];
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{
      label: "Hourly Temperature",
      data: [],
      fill: true,
      backgroundColor: 'rgba(37, 54, 82, 0.8)',
      borderColor: '#4C71AD',
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.2
    }]
  });

// danger level conditions
  useEffect(() => {
    if (bikeType === "Street") {
      if (dailyWeather.current[selectedDay] === img200 || dailyWeather.current[selectedDay] === img300 || dailyWeather.current[selectedDay] === img500 || dailyWeather.current[selectedDay] === img600 || dailyWeather.current[selectedDay] === img700) {
        setDangerImg(dangerMid);
      } else if (dailyWeather.current[selectedDay] === img800 || dailyWeather.current[selectedDay] === img801) {
        setDangerImg(dangerLow);
      }
    } else if (bikeType === "Sports") {
      if (dailyWeather.current[selectedDay] === img200 || dailyWeather.current[selectedDay] === img300 || dailyWeather.current[selectedDay] === img500 || dailyWeather.current[selectedDay] === img600 || dailyWeather.current[selectedDay] === img700) {
        setDangerImg(dangerMid);
      } else if (dailyWeather.current[selectedDay] === img800 || dailyWeather.current[selectedDay] === img801) {
        setDangerImg(dangerLow);
      }
    } else if (bikeType === "Scooter") {
      if (dailyWeather.current[selectedDay] === img200 || dailyWeather.current[selectedDay] === img300 || dailyWeather.current[selectedDay] === img500 || dailyWeather.current[selectedDay] === img600 || dailyWeather.current[selectedDay] === img700) {
        setDangerImg(dangerHigh);
      } else if (dailyWeather.current[selectedDay] === img800 || dailyWeather.current[selectedDay] === img801) {
        setDangerImg(dangerMid);
      }
    } else if (bikeType === "Cruiser") {
      if (dailyWeather.current[selectedDay] === img200 || dailyWeather.current[selectedDay] === img300 || dailyWeather.current[selectedDay] === img500 || dailyWeather.current[selectedDay] === img600 || dailyWeather.current[selectedDay] === img700) {
        setDangerImg(dangerMid);
      } else if (dailyWeather.current[selectedDay] === img800 || dailyWeather.current[selectedDay] === img801) {
        setDangerImg(dangerLow);
      }
    } else if (bikeType === "Off-road") {
      if (dailyWeather.current[selectedDay] === img200 || dailyWeather.current[selectedDay] === img300 || dailyWeather.current[selectedDay] === img500 || dailyWeather.current[selectedDay] === img600 || dailyWeather.current[selectedDay] === img700) {
        setDangerImg(dangerMid);
      } else if (dailyWeather.current[selectedDay] === img800 || dailyWeather.current[selectedDay] === img801) {
        setDangerImg(dangerLow);
      }
    }

    if (dailyWeather.current[selectedDay] === img200) {
      setWeatherConditionText("Thunderstorm");
      setRoadConditionText("Wet and slippery roads.");
      setSafetySuggestion("Don't drive! Seek shelter and stay safe.");
    } else if (dailyWeather.current[selectedDay] === img300) {
      setWeatherConditionText("Light Rain with Sunshine");
      setRoadConditionText("Slippery roads, exercise caution.");
      setSafetySuggestion("Drive carefully, watch for puddles.");
    } else if (dailyWeather.current[selectedDay] === img500) {
      setWeatherConditionText("Rain");
      setRoadConditionText("Wet and slippery roads.");
      setSafetySuggestion("Drive carefully, reduce speed.");
    } else if (dailyWeather.current[selectedDay] === img600) {
      setWeatherConditionText("Snow");
      setRoadConditionText("Snowy and slippery roads.");
      setSafetySuggestion("Avoid driving if possible, or use snow chains.");
    } else if (dailyWeather.current[selectedDay] === img700) {
      setWeatherConditionText("Fog");
      setRoadConditionText("Limited visibility, roads are tricky.");
      setSafetySuggestion("Drive slowly with headlights on, stay cautious.");
    } else if (dailyWeather.current[selectedDay] === img800) {
      setWeatherConditionText("Sunny");
      setRoadConditionText("Clear roads, great conditions.");
      setSafetySuggestion("Perfect day for a ride, stay alert.");
    } else if (dailyWeather.current[selectedDay] === img801) {
      setWeatherConditionText("Clear Skies");
      setRoadConditionText("Perfect road conditions.");
      setSafetySuggestion("Enjoy the ride, but always stay cautious.");
    } else {
      setWeatherConditionText("Unknown weather condition");
      setRoadConditionText("unknown conditions.");
      setSafetySuggestion("Check the weather and be prepared for changes.");
    }
    }, [selectedDay,avgTemps.current,dailyWeather.current,bikeType]);
 
  // base styles 
  const allStyle = `h-screen min-h-[670px] min-w-[365px] grid grid-rows-[5%_90%_5%] xl:grid-rows-[20%_60%_20%] text-xs xl:text-3xl ${(firstDate.getHours() >= 6 && firstDate.getHours() <= 18) ? `bg-style-light text-style-dark` : `bg-style-dark text-style-dark`} `;
  const mainStyle = "z-30 xl:grid grid-cols-[5%_90%_5%] xl:grid-cols-[10%_80%_10%]";
  const insideMainStyle = "col-start-2 grid grid-cols-1 grid-rows-[2fr_1fr_4fr] xl:grid-cols-[35%_35%_30%] xl:grid-rows-2 white";
  const weatherBoxStyle = "row-start-2 xl:col-start-1 xl:col-span-2 flex justify-center border-0 bg-[#253652] rounded-[15px] xl:rounded-[50px] mx-1 xl:mx-0";
  const hourlyWeatherStyle = "row-start-1 xl:col-start-1 xl:col-span-2 m-2 xl:m-4 grid grid-cols-[1fr_4fr] ";
  const motorbikeStyle = "row-start-3 xl:col-start-3 xl:row-span-2 xl:row-start-1 bg-[#253652] border-0 rounded-[15px] xl:rounded-[50px] p-4 flex-row m-1 xl:m-2 text-xs xl:text-2xl h-full";
  const weatherButtonStyle = "w-auto m-0.5 xl:m-2 border border-[#253652]  rounded-[12px] xl:rounded-[40px] grid grid-rows-[20%_60%_20%] text-center text-lg xl:text-xl font-bold hover:border hover:border-[#4C71AD] ";
  const dangerTextStyle = "m-1 text-base xl:py-2 xl:mt-4 xl:text-xl font-bold border-t border-[#848C9A]";
  const footerStyle = "text-center text-xxs xl:text-sm mt-2 xl:mt-10 xl:mt-20 text-blue-600";
  const gradientStyle = "";
  const inputsStyle = "border-b-[1px] bg-[#4C71AD] border-0 rounded-[25px] m-1 p-1 text-xs xl:text-base";
  const imageStyle = "w-[80%] mx-auto my-auto";
  const InfoText = `text-xs my-0.5 xl:text-lg xl:my-2 font-bold`
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
            <img className={`my-auto`} src={dailyWeather.current[selectedDay]} alt={`average weather image`}/>
            <div className={`p-2 my-auto xl:p-6 xl:h-[80%]`}>
              <Line className={`w-[100%]`} data={lineChartData} options={chartStyle}/>
            </div>
          </div>

          <div className={weatherBoxStyle}>
            {
              buttonDates.current.map((date,index) => {
                return (
                    <button key={date} onClick={() => {changeDatePicked(date)}} className={`${weatherButtonStyle} ${firstDate.getDate() === date ? ` text-blue-700` : ``} ${selectedDay === date ? ` bg-[#4C71AD]` : ``}`}>
                      <p>{date} - {buttonDays.current[index]}</p>
                      <img className={imageStyle} src={dailyWeather.current[date]} alt={`icon of the weather of this date`}/>
                      <p>{avgTemps.current[date]} °C</p>
                    </button>
                )
              })
            }
          </div>

          <div className={motorbikeStyle}>

            <div className={selectDivStyle}>
              <Select
                  id={`motorbikeType`}
                  classNames={inputsStyle}
                  options={motorbikeTypeOptions}
                  placeholder="Motorbike Type (Default: Street)"
                  styles={reactSelectStyle}
                  onChange={(e) => {setBikeType(e.value)}}
                  isSearchable
              />
            </div>
            <p className={InfoText}>Location (City):</p>
              <div className={selectDivStyle}>
                <Select
                    id={`location1`}
                    classNames={inputsStyle}
                    options={locationOptions}
                    placeholder="London"
                    styles={reactSelectStyle}
                    onChange={handleCityChange}
                    isSearchable
                />
              </div>

            <p className={dangerTextStyle}>Danger Levels:</p>
            <img src={dangerImg} alt={`danger level meter image`} className={`mx-auto mb-2 max-w-[100px] xl:max-w-[300px]`} />
            <div className={`flex w-full border-t border-[#848C9A]`}>
              <p className={`self-start mr-auto ${InfoText}`}>Weather Conditions:</p>
              <p className={`self-end ${InfoText}`}>{weatherConditionText}</p>
            </div>
            <div className={`flex w-full`}>
              <p className={`self-start mr-auto ${InfoText}`}>Road Conditions:</p>
              <p className={`self-end ${InfoText}`}>{roadConditionText}</p>
            </div>
            <div className={`flex w-full`}>
              <p className={`self-start mr-auto ${InfoText}`}>Suggestion:</p>
              <p className={`self-end ${InfoText}`}>{safetySuggestion}</p>
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
