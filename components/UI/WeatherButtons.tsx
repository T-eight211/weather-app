// components/UI/WeatherButtons.tsx
import React from 'react';

interface WeatherButtonsProps {
  buttonDates: number[];
  buttonDays: string[];
  dailyWeather: string[]; // image paths as strings
}

const WeatherButtons: React.FC<WeatherButtonsProps> = ({ buttonDates, buttonDays, dailyWeather }) => {
  return (
    <div className="flex justify-center">
      {buttonDates.map((date, index) => (
        <button key={index} className="w-[12%] h-[70%] m-1 xl:m-2 border border-blue-500 rounded grid grid-rows-[20%_60%_20%] bg-gradient-to-t from-[#000340] to-blue-500 text-white text-center text-xl xl:text-2xl font-bold">
          <p>{date}</p>
          <img className="w-[80%] mx-auto my-auto" src={dailyWeather[index]} alt={`Weather icon for ${buttonDays[index]}`} />
          <p>{buttonDays[index]}</p>
        </button>
      ))}
    </div>
  );
};

export default WeatherButtons;
