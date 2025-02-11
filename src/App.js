import React, {useState,useEffect} from 'react';
import './App.css';

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

  // weather api key
  const apiKey = "718d0502e1fdf804f510f63140737137";

  // fetching weather data
  let lat = 51.5;
  let lon = 0.1;
  let fiveDaysURL = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

 
  // styles 
  const weatherButtonStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-[10px] m-2 block";

  return (
    <div className="App">
      <header className="text-blue-400">
       TEMp
      </header>

      <main>
          <div className="flex justify-center">
          {
            buttonDates.map((date,index) => {
              return (
                <button key={index} className={weatherButtonStyle}>
                  <p>{date}</p>
                  <p>{buttonDays[index]}</p>
                </button>
              )
            })
          }
          </div>
      </main>

      <footer>

      </footer>
    </div>
  );
}

export default App;
