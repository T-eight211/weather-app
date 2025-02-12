import React, {useState,useEffect} from 'react';
import './App.css';

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
  const [hourlyTemp1, setHourlyTemp1] = useState([]);
  const [hourlyTemp2, setHourlyTemp2] = useState([]);
  const [hourlyTemp3, setHourlyTemp3] = useState([]);
  const [hourlyTemp4, setHourlyTemp4] = useState([]);
  const [hourlyTemp5, setHourlyTemp5] = useState([]);
  const [hourlyTemp6, setHourlyTemp6] = useState([]);
  const [hourlyTemp7, setHourlyTemp7] = useState([]);
  
  const [locations, setLocations] = useState(["temp","temp1"]);

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
  const allStyle = `h-[100vh] grid grid-rows-[10%_80%_10%] md:grid-rows-[20%_60%_20%] text-xs md:text-3xl text-blue-700`;
  const headerStyle = "text-left text-2xl md:text-5xl font-bold p-2 md:p-6";
  const mainStyle = "z-30 grid grid-cols-[5%_90%_5%] md:grid-cols-[20%_60%_20%]";
  const insideMainStyle = "col-start-2 grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-2 bg-white bg-opacity-85";
  const weatherBoxStyle = "row-start-1 md:col-start-1 md:col-span-2 md:row-start-1 flex justify-center";
  const hourlyWeatherStyle = "row-start-2 md:col-start-1 md:col-span-2 md:row-start-2 m-2 md:m-4";
  const motorbikeStyle = "row-start-3 md:col-start-3 md:row-span-2 md:row-start-1 border-[1px] border-blue-500 rounded-[3px] grid grid-rows-[15%_15%_60%_10%] grid-cols-1 md:grid-cols-2 md:grid-rows-[10%_80%_10%] m-1 md:m-2 text-xs md:text-2xl p-1";
  const weatherButtonStyle = "w-[12%] h-[70%] m-1 md:m-2 border-[1px] border-blue-500 rounded-[3px] grid grid-rows-[20%_60%_20%] bg-gradient-to-t from-[#000340] to-blue-500 text-white text-center text-1XL md:text-2XL font-bold";
  const dangerIconStyle = "md:col-span-2";
  const dangerTextStyle = "md:col-span-2";
  const footerStyle = "text-center text-xxs md:text-sm mt-6 md:mt-20";
  const gradientStyle = "from-[#000340] via-[#FFFFFF] to-[#FFFFFF]";
  const inputsStyle = "border-b-[1px] border-blue-500 rounded-[3px] m-1 md:m-2";

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
                  <p>IMAGE</p>
                  <p>{buttonDays[index]}</p>
                </button>
              )
            })
          }
          </div>

          <div className={hourlyWeatherStyle}>
            graph
          </div>

          <div className={motorbikeStyle}>
            <select className={inputsStyle} placeholder="Select Motorbike Type" defaultValue={0}>
              <option value="0">Street</option>
              <option value="1">Sports</option>
              <option value="2">Scooter</option>
              <option value="3">Cruiser</option>
              <option value="4">Off-road</option>
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
            <p className={dangerIconStyle}>image of the thing</p>
            <p className={dangerTextStyle}>Danger Levels: OK</p>
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
