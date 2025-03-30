import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";
import Select from 'react-select';
import { motion } from "framer-motion";
import './App.css';
import ThunderIcon from './images/weatherIcons/200.png';
import LightRainIcon from './images/weatherIcons/300.png';
import RainIcon from './images/weatherIcons/500.png';
import SnowIcon from './images/weatherIcons/600.png';
import FogIcon from './images/weatherIcons/700.png';
import SunnyIcon from './images/weatherIcons/800.png';
import CloudyIcon from './images/weatherIcons/801.png';
import LowDangerMeter from './images/dangerLow.png';
import MidDangerMeter from './images/dangerMid.png';
import HighDangerMeter from './images/dangerHigh.png';
import Logo from './images/logo.png';
import cities from "./cities.json";
import { Line } from "react-chartjs-2"
import {Chart as ChartJs, Legend, plugins, scales, Tooltip} from "chart.js/auto";

function App() {

  /* ***************************************************************************************************
  * Initialising variables
  ****************************************************************************************************** */
  // setting up variables for the weather buttons
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const buttonDates = useRef([]);
  const buttonDays = useRef([]);
  const dailyTemperaturesData = useRef({});
  const averageDailyTemperatures = useRef({});
  const dailyWeatherDate= useRef({});
  const averageDailyWeatherCondition = useRef({});

  // by default the lon and lat is London's latitude and longitude
  const lat = useRef("51.5072");
  const lon = useRef("0.1276");

  // setting the initial date to current date
  const [selectedDay, setSelectedDay] = useState(today.getDate().toString());

  // by default the bike type is street
  const [bikeType, setBikeType] = useState("street");

  const [dangerImg, setDangerImg] = useState(LowDangerMeter);
  const [weatherConditionText, setWeatherConditionText] = useState("");
  const [roadConditionText, setRoadConditionText] = useState("");
  const [safetySuggestion, setSafetySuggestion] = useState("");
  const [bgImageStyle, setBgImageStyle] = useState("sunny");
  const [locations, setLocations] = useState([]);

  const motorbikeTypeOptions = [
    { value: "Street", label: "Street" },
    { value: "Sports", label: "Sports" },
    { value: "Scooter", label: "Scooter" },
    { value: "Cruiser", label: "Cruiser" },
    { value: "Off-road", label: "Off-road" },
  ];

  // Initialising Chart/Graph date
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

  // storing all from the cities json file into this variable
  const locationOptions = locations.map((city) => ({
    value: city.name,
    label: `${city.name}`,
    lat: city.lat, // custom variable for the React select element required for the functionality
    lon: city.lon, // custom variable
  }));

  /* ***************************************************************************************************
  * Functional methods
  ****************************************************************************************************** */

  // This method connects to the API and gets 3 days of historical data and 4 days of forecast data
  // This method then splits the temperature and weather condition data received to a hashmap of (date, array) as key value pairs.
  // This also calls other methods so everything reflects the change
  const fetchWeatherData = async () => {
    try {
      const API_KEY = "718d0502e1fdf804f510f63140737137";
      const currentTimeInUnix = Math.floor(Date.now() / 1000);
      const pastStartInUnix = currentTimeInUnix - 3 * 24 * 60 * 60;
      const forecastAPI = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat.current}&lon=${lon.current}&appid=${API_KEY}&units=metric`;
      const historicalAPI = `https://history.openweathermap.org/data/2.5/history/city?lat=${lat.current}&lon=${lon.current}&type=hour&start=${pastStartInUnix}&end=${currentTimeInUnix}&appid=${API_KEY}&units=metric`;

      // axios is similar to fetch, but it is better since it can format the data automatically
      const [forecastRes, historicalRes] = await Promise.all([
        axios.get(forecastAPI),
        axios.get(historicalAPI),
      ]);

      // combining all data so it is easier to format
      const combinedData = [...historicalRes.data.list, ...forecastRes.data.list];
      const groupedTemps = {};
      const groupedWeathers = {};

      combinedData.forEach((entry) => {
        let tempDateTime = new Date(entry.dt * 1000);
        tempDateTime.setUTCHours(0, 0, 0, 0);
        const dateStr = tempDateTime.getDate().toString();
        const tempTemperature = Math.floor(entry.main.temp);
        const tempCondition = entry.weather[0].id;

        // adds a date with an empty array, to the hashmaps if the date doesn't exist
        if (!groupedTemps[dateStr]) {
          groupedTemps[dateStr] = [];
          groupedWeathers[dateStr] = [];
        }

        // pushes the date strings and days for the html element (the series of weather buttons)
        if (!buttonDates.current.includes(dateStr)) {
          buttonDates.current.push(dateStr);
          buttonDays.current.push(dayNames[tempDateTime.getDay()]);
        }

        // adding data to the correct array
        groupedTemps[dateStr].push(tempTemperature);
        groupedWeathers[dateStr].push(tempCondition);
      });

      dailyTemperaturesData.current = groupedTemps;
      dailyWeatherDate.current = groupedWeathers;

      for (let dateKey in dailyWeatherDate.current) {
        averageDailyTemperatures.current[dateKey] = getModalTemperature(dailyTemperaturesData.current[dateKey]);
        const tempAvgWeather = getModalWeather(dailyWeatherDate.current[dateKey]);

        // comparing weather Ids to store the correct image link
        if (tempAvgWeather === "800") {
          averageDailyWeatherCondition.current[dateKey] = SunnyIcon;
        }
        else {
          const tempVar = Math.floor(parseInt(tempAvgWeather)/100)*100;
          if (tempVar === 200) {
            averageDailyWeatherCondition.current[dateKey] = ThunderIcon;
          }
          else if (tempVar === 300) {
            averageDailyWeatherCondition.current[dateKey] = LightRainIcon;
          }
          else if (tempVar === 500) {
            averageDailyWeatherCondition.current[dateKey] = RainIcon;
          }
          else if (tempVar === 600) {
            averageDailyWeatherCondition.current[dateKey] = SnowIcon;
          }
          else if (tempVar === 700) {
            averageDailyWeatherCondition.current[dateKey] = FogIcon;
          }
          else if (tempVar === 800) {
            averageDailyWeatherCondition.current[dateKey] = CloudyIcon;
          }
          else {
            console.log("Error with fetch data weather part");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }

    // calls the other methods to refresh the danger level meter
    changeDatePicked(today.getDate().toString());
    dangerLevelCalc();
  };

  // This method firstly stores all data into the hashmap after formatting it correctly. (formatting mean keeping the numbers consistent with our design)
  // Then the modal weather condition is returned if it is not 801 (cloudy) because it is the most common weather condition so it doesn't show a desired
  // weather condition for the day. The reason for our decision most people would assume that the day is sunny if it is sunny for 2 hours and cloudy for the rest.
  function getModalWeather(arr) {
    const freqMap = {};
    let firstMaxFreq = 0;
    let secondMaxFreq = 0;
    let firstMode = null;
    let secondMode = null;

    for (let weatherId of arr) {
      let i = weatherId
      if (weatherId !== 800) {
        const tempVar = Math.floor(weatherId/100)*100;
        if (tempVar === 800) {
          i = 801
        }
        else {
          i = tempVar;
        }
      }
      freqMap[i] = (freqMap[i] || 0) + 1;
    }

    for (let weatherId in freqMap) {
      let count = freqMap[weatherId];

      if (count > firstMaxFreq) {
        secondMaxFreq = firstMaxFreq;
        secondMode = firstMode;
        firstMaxFreq = count;
        firstMode = weatherId;
      } else if (count > secondMaxFreq) {
        secondMaxFreq = count;
        secondMode = weatherId;
      }
    }

    if (firstMode === 801) {
      return secondMode === null ? 801 : secondMode;
    } else {
      return firstMode === null ? 801 : firstMode;
    }
  }

  // This method gets the modal temperature from the given array
  function getModalTemperature(arr) {
    const freqMap = {};
    let maxFreq = 0;
    let modalTemp = null;

    for (let temperature of arr) {
      freqMap[temperature] = (freqMap[temperature] || 0) + 1;
      if (freqMap[temperature] > maxFreq) {
        maxFreq = freqMap[temperature];
        modalTemp = temperature;
      }
    }

    return modalTemp;
  }

  // This method handles the selected day being changed so if the user wishes to see the data for tomorrow, this method
  // replaces the graph (Temp vs Time) data so it reflects the selected dates temperature and time.
  const changeDatePicked = (date) => {
    // changing the selected date
    setSelectedDay(date);

    let labelOfHours = [];
    for (let hour = 24 - dailyTemperaturesData.current[date].length; hour < 24; hour++) {
      labelOfHours.push(hour.toString().padStart(2, '0'));
    }

    // ensuring that the styling stays consistent
    setLineChartData({
      labels: labelOfHours,
      datasets: [{
        label: "Hourly Temperature",
        data: dailyTemperaturesData.current[date],
        fill: true,
        backgroundColor: 'rgba(37, 54, 82, 0.8)',
        borderColor: '#4C71AD',
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.2
      }]
    });
  };


  // This method is called when the location select box is changed
  // It correctly adjusts the longitude and latitude, which is received from the option's custom variables.
  const handleCityChange = (event) => {
    lon.current = event.lon;
    lat.current = event.lat;
    fetchWeatherData();
  }

  // this method sets the danger level image, danger weather condition, road conditions and suggestions depending on the modal weather condition and bike type/weight
  const dangerLevelCalc = () => {

    // danger meter logic
    if (bikeType === "Street") {
      if (averageDailyWeatherCondition.current[selectedDay] === ThunderIcon || averageDailyWeatherCondition.current[selectedDay] === LightRainIcon || averageDailyWeatherCondition.current[selectedDay] === RainIcon || averageDailyWeatherCondition.current[selectedDay] === SnowIcon || averageDailyWeatherCondition.current[selectedDay] === FogIcon) {
        setDangerImg(MidDangerMeter);
      } else if (averageDailyWeatherCondition.current[selectedDay] === SunnyIcon || averageDailyWeatherCondition.current[selectedDay] === CloudyIcon) {
        setDangerImg(LowDangerMeter);
      }
    } else if (bikeType === "Sports") {
      if (averageDailyWeatherCondition.current[selectedDay] === ThunderIcon || averageDailyWeatherCondition.current[selectedDay] === LightRainIcon || averageDailyWeatherCondition.current[selectedDay] === RainIcon || averageDailyWeatherCondition.current[selectedDay] === SnowIcon || averageDailyWeatherCondition.current[selectedDay] === FogIcon) {
        setDangerImg(MidDangerMeter);
      } else if (averageDailyWeatherCondition.current[selectedDay] === SunnyIcon || averageDailyWeatherCondition.current[selectedDay] === CloudyIcon) {
        setDangerImg(LowDangerMeter);
      }
    } else if (bikeType === "Scooter") {
      if (averageDailyWeatherCondition.current[selectedDay] === ThunderIcon || averageDailyWeatherCondition.current[selectedDay] === LightRainIcon || averageDailyWeatherCondition.current[selectedDay] === RainIcon || averageDailyWeatherCondition.current[selectedDay] === SnowIcon || averageDailyWeatherCondition.current[selectedDay] === FogIcon) {
        setDangerImg(HighDangerMeter);
      } else if (averageDailyWeatherCondition.current[selectedDay] === SunnyIcon || averageDailyWeatherCondition.current[selectedDay] === CloudyIcon) {
        setDangerImg(MidDangerMeter);
      }
    } else if (bikeType === "Cruiser") {
      if (averageDailyWeatherCondition.current[selectedDay] === ThunderIcon || averageDailyWeatherCondition.current[selectedDay] === LightRainIcon || averageDailyWeatherCondition.current[selectedDay] === RainIcon || averageDailyWeatherCondition.current[selectedDay] === SnowIcon || averageDailyWeatherCondition.current[selectedDay] === FogIcon) {
        setDangerImg(MidDangerMeter);
      } else if (averageDailyWeatherCondition.current[selectedDay] === SunnyIcon || averageDailyWeatherCondition.current[selectedDay] === CloudyIcon) {
        setDangerImg(LowDangerMeter);
      }
    } else if (bikeType === "Off-road") {
      if (averageDailyWeatherCondition.current[selectedDay] === ThunderIcon || averageDailyWeatherCondition.current[selectedDay] === LightRainIcon || averageDailyWeatherCondition.current[selectedDay] === RainIcon || averageDailyWeatherCondition.current[selectedDay] === SnowIcon || averageDailyWeatherCondition.current[selectedDay] === FogIcon) {
        setDangerImg(MidDangerMeter);
      } else if (averageDailyWeatherCondition.current[selectedDay] === SunnyIcon || averageDailyWeatherCondition.current[selectedDay] === CloudyIcon) {
        setDangerImg(LowDangerMeter);
      }
    }

    // Danger information Updating logic
    if (averageDailyWeatherCondition.current[selectedDay] === ThunderIcon) {
      setBgImageStyle(' thunder ');
      setWeatherConditionText("Thunderstorm");
      setRoadConditionText("Wet and slippery roads.");
      setSafetySuggestion("Don't drive! Seek shelter and stay safe.");
    } else if (averageDailyWeatherCondition.current[selectedDay] === LightRainIcon) {
      setBgImageStyle(' lightRain ');
      setWeatherConditionText("Light Rain with Sunshine");
      setRoadConditionText("Slippery roads, exercise caution.");
      setSafetySuggestion("Drive carefully, watch for puddles.");
    } else if (averageDailyWeatherCondition.current[selectedDay] === RainIcon) {
      setBgImageStyle(' rain ');
      setWeatherConditionText("Rain");
      setRoadConditionText("Wet and slippery roads.");
      setSafetySuggestion("Drive carefully, reduce speed.");
    } else if (averageDailyWeatherCondition.current[selectedDay] === SnowIcon) {
      setBgImageStyle(' snow ');
      setWeatherConditionText("Snow");
      setRoadConditionText("Snowy and slippery roads.");
      setSafetySuggestion("Avoid driving if possible, or use snow chains.");
    } else if (averageDailyWeatherCondition.current[selectedDay] === FogIcon) {
      setBgImageStyle(' fog ');
      setWeatherConditionText("Fog");
      setRoadConditionText("Limited visibility, roads are tricky.");
      setSafetySuggestion("Drive slowly with headlights on, stay cautious.");
    } else if (averageDailyWeatherCondition.current[selectedDay] === SunnyIcon) {
      setBgImageStyle(' sunny ');
      setWeatherConditionText("Sunny");
      setRoadConditionText("Clear roads, great conditions.");
      setSafetySuggestion("Perfect day for a ride, stay alert.");
    } else if (averageDailyWeatherCondition.current[selectedDay] === CloudyIcon) {
      setBgImageStyle(' clear ');
      setWeatherConditionText("Clear Skies");
      setRoadConditionText("Perfect road conditions.");
      setSafetySuggestion("Enjoy the ride, but always stay cautious.");
    } else {
      console.log("danger info error")
    }
  }

  /* ***************************************************************************
  * STYLES (CSS + Others)
  ****************************************************************************** */

  // some styles for the html. Uses Tailwind classes for the styling
  const allStyle = `h-auto min-h-screen min-w-[365px] grid grid-rows-[5%_90%_5%] xl:grid-rows-[20%_60%_20%] text-xs xl:text-3xl `;
  const mainStyle = "z-30 xl:grid grid-cols-[5%_90%_5%] xl:grid-cols-[10%_80%_10%]";

  const insideMainStyle = "col-start-2 grid grid-cols-1 grid-rows-[2fr_1fr_auto] xl:grid-cols-[35%_35%_30%] xl:grid-rows-[2fr_1fr] white";
  const weatherButtonsBoxStyle = "row-start-2 xl:col-start-1 xl:col-span-2 flex justify-center border-0 bg-[#253652] rounded-[15px] xl:rounded-[50px] mx-1 xl:mx-0";
  const weatherChartDivBoxStyle = "row-start-1 xl:col-start-1 xl:col-span-2 m-2 xl:m-4 grid grid-cols-[1fr_4fr] ";
  const dangerMeterBoxStyle = "row-start-3 xl:col-start-3 xl:row-span-2 xl:row-start-1 bg-[#253652] border-0 rounded-[15px] xl:rounded-[50px] p-4 flex-row m-1 xl:m-2 text-xs xl:text-2xl h-full";

  const weatherButtonStyle = "w-auto m-0.5 xl:m-2 border border-[#253652] rounded-[12px] xl:rounded-[40px] text-center text-xxs xl:text-lg font-bold hover:border hover:border-[#4C71AD] ";
  const dangerTextStyle = "m-1 text-xs xl:py-2 xl:mt-4 xl:text-base font-bold border-t border-[#848C9A]";
  const footerStyle = "text-center text-xxs xl:text-sm mt-2 xl:mt-10 xl:mt-20 text-[#0202c7]";
  const inputsStyle = "border-b-[1px] bg-[#4C71AD] border-0 rounded-[25px] m-1 p-1 text-xs xl:text-base";
  const imageStyle = "w-[80%] mx-auto my-auto";
  const InfoText = `text-xs my-0.5 xl:text-lg xl:my-2 font-bold`
  const selectDivStyle = `p-0`;

  // Styles for the search element (special Select that allows the user to search for the option)
  const reactSelectStyle = {
    control: (provided) => ({ // styling for the search bar
      ...provided,
      backgroundColor: "#4C71AD",
      border: "0px solid transparent",
      borderRadius: "25px",
      padding: "2px",
      margin: "2px",
      color: "white",
      fontSize: "1rem",
    }),
    singleValue: (provided) => ({ // styling for the selected value
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({ // place holder styling
      ...provided,
      color: "rgba(255, 255, 255, 0.7)",
    }),
    menu: (provided) => ({ // styling for the menu
      ...provided,
      backgroundColor: "#4C71AD",
      borderRadius: "25px",
      margin: "0px",
      border: "0px",
      fontSize: "1rem",
    }),
    option: (provided, state) => ({ // options styling
      ...provided,
      backgroundColor: state.isFocused ? "#36548C" : "#4C71AD",
      color: "white",
      borderRadius: "25px",
      margin: "auto",
      width: "98%",
      border: "0px",
    }),
  };

  // styling for the chart (temperature vs time)
  const chartStyle = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: { // ticks is the label text
          color: '#0202c7',
          font: {
            size: 16,
            weight: 'bold'
          },
        }
      },
      y: {
        borderWidth: 0,
        ticks: {
          color: '#0202c7',
          font: {
            size: 16,
            weight: 'bold'
          },
        },
        grid: {
          display: false,
        },
        suggestedMin: Math.min(...lineChartData.datasets[0].data) - 1,
        suggestedMax: Math.max(...lineChartData.datasets[0].data) + 1,
      },
    },
  }

  /* ***********************************************************************************
  * Instructions that are executed when certain variables are changed
  ************************************************************************************** */

  // This fetches the weather data for the first time, which updates all necessary variables for the main functionality
  // This UseEffect only runs once when the application is opened
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // This calculates the Danger Levels and relevant data when any of the current variables are changes.
  // these variables are changed when weather data is fetched, when the selected day is changed or when the bike type is changed
  useEffect(() => {
    dangerLevelCalc();
  }, [selectedDay,averageDailyTemperatures.current,averageDailyWeatherCondition.current,bikeType]);

  // This loads the options from the cities json file to the location use state, which is the select elements options.
  useEffect(() => {
    setLocations(cities);
  }, []);

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                  className={`${allStyle} ${bgImageStyle}  text-style-dark ${(today.getHours() >= 6 && today.getHours() <= 18) ? `weather-bg` : `weather-bg-dark`}`}>

        {/* Header logo image */}
        <header className={`z-30`}>
          <img src={Logo} alt={`logo of the website`} className={`h-[90%] p-1 xl:p-10 w-auto`}/>
        </header>

        <main className={mainStyle}>
          <div className={insideMainStyle}>

            {/* The div element that has the chart and average weather condition image */}
            <div className={weatherChartDivBoxStyle}>
              <img className={`my-auto`} src={averageDailyWeatherCondition.current[selectedDay]} alt={`average weather image`}/>
              <div className={`p-2 my-auto xl:p-6 xl:h-[80%]`}>
                <Line className={`w-[100%]`} data={lineChartData} options={chartStyle}/>
              </div>
            </div>

            {/* Div element that contains buttons of all the dates that the user can click to find data of that date */}
            <div className={weatherButtonsBoxStyle}>
              {
                buttonDates.current.map((date, index) => {
                  return (
                      <button key={date} onClick={() => {
                        changeDatePicked(date)
                      }}
                              className={`${weatherButtonStyle} ${today.getDate() === date ? ` text-blue-700` : ``} ${selectedDay === date ? ` bg-[#4C71AD]` : ``}`}>
                        <div>
                          <p className={`my-1`}>{date} - {buttonDays.current[index]}</p>
                          <img className={imageStyle} src={averageDailyWeatherCondition.current[date]}
                               alt={`icon of the weather of this date`}/>
                          <p className={`my-1`}>{averageDailyTemperatures.current[date]} °C</p>
                        </div>
                      </button>
                  )
                })
              }
            </div>

            {/* div element for the danger Box */}
            <div className={dangerMeterBoxStyle}>

              {/* Searchable select element that allows the user to choose motor bike type */}
              <div className={selectDivStyle}>
                <Select
                    id={`motorbikeType`}
                    classNames={inputsStyle}
                    options={motorbikeTypeOptions}
                    placeholder="Motorbike Type (Default: Street)"
                    styles={reactSelectStyle}
                    onChange={(e) => {
                      setBikeType(e.value)
                    }}
                    isSearchable
                />
              </div>

              {/* Searchable select element to allow the user to select the city */}
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

              {/* Image of the danger meter */}
              <p className={dangerTextStyle}>Danger Levels:</p>
              <img src={dangerImg} alt={`danger level meter image`}
                   className={`mx-auto mb-2 max-w-[100px] xl:max-w-[300px]`}/>

              {/* theses are elements shows the danger information bellow the danger level image */}
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

        <footer className={`z-30`}>
          <p className={footerStyle}>all rights reserved</p>
        </footer>
      </motion.div>
  );
}

export default App;
