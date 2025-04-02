import React from 'react';

type WeatherCardProps = {
  city: string;
  temperature: number;
  temp_min: number;
  temp_max: number;
  description: string;
};

// Utility: Capitalize first letter of each word
const capitalizeFirst = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  temp_min,
  temp_max,
  description
}) => {
  return (
    <div className="rounded-2xl bg-[#242e47] text-white flex flex-col items-center justify-center text-center p-5">
      {/* City */}
      <h1 className="text-4xl xl:text-6xl font-semibold mb-2">{city}</h1>

      {/* Temperature */}
      <div className="text-[100px] font-light leading-none mb-2">
        {Math.round(temperature)}<span className="align-top text-4xl">°</span>
      </div>

      {/* Weather Description */}
      <p className="text-lg xl:text-2xl text-white/80 mb-1">
        {capitalizeFirst(description)}
      </p>

      {/* High/Low */}
      <div className="text-sm xl:text-lg text-white/90 space-x-4">
        <span>H:{Math.round(temp_max)}°</span>
        <span>L:{Math.round(temp_min)}°</span>
      </div>
    </div>
  );
};

export default WeatherCard;
