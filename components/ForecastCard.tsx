import React from 'react';
import Image from 'next/image';

type ForecastProps = {
  day: string;
  icon: string;
  min: number;
  max: number;
  actualMin: number; // global min across forecast
  actualMax: number; // global max across forecast
};



const ForecastCard: React.FC<ForecastProps> = ({
  day,
  icon,
  min,
  max,
  actualMin,
  actualMax,
}) => {
  const tempRange = actualMax - actualMin;
  const scale = 100 / tempRange;

  const left = (min - actualMin) * scale;
  const width = (max - min) * scale;

  return (
    <div className="bg-custom-my-colour flex items-center justify-between  py-2 border-b border-white/10">
      {/* Day */}
      <div className="w-20 text-white text-sm font-medium">{day}</div>

      {/* Icon */}
      <div className="w-7 h-7 flex items-center justify-center mr-4">
        <Image src={icon} alt="weather icon" width={24} height={24} />
      </div>

      {/* Min Temp */}
      <div className="text-white text-sm w-6 text-right">{min}°</div>

      {/* Bar */}
      <div className="relative w-full h-2 mx-3 bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-gradient-to-r from-sky-400 to-yellow-300 rounded-full"
          style={{
            left: `${left}%`,
            width: `${width}%`,
          }}
        ></div>
      </div>

      {/* Max Temp */}
      <div className="text-white text-sm w-6 text-left">{max}°</div>
    </div>
  );
};

export default ForecastCard;
