import React from 'react';
import WindDirectionCompass from './WindDirectionCompass';
import Image from 'next/image';

type WindCardProps = {
  windSpeed: number;      // e.g., 9
  windGust: number;       // e.g., 23
  windDeg: number;        // e.g., 59
};

const getCompassDirection = (degree: number) => {
  const directions = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ];

  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

const WindCard: React.FC<WindCardProps> = ({ windSpeed, windGust, windDeg }) => {
  const directionLabel = `${windDeg}° ${getCompassDirection(windDeg)}`;

  return (
    <>
      <div className="flex items-center py-2 border-b border-white/10 gap-2">
        <div className="w-4 h-7 flex items-center justify-center">
          <Image src='./wind.svg' alt="weather icon" width={16} height={16} />
        </div>
        <h2 className="w-40 text-white text-sm font-medium">WIND</h2>
      </div>

      <div className="flex items-center">
        {/* Wind data */}
        <div className="flex flex-col w-full mr-5 ">
          <div className="flex justify-between  border-b border-white/20 py-3">
            <span className="text-sm">Wind</span>
            <span className="text-sm font-medium">{Math.round(windSpeed)} mph</span>
          </div>
          <div className="flex justify-between  border-b border-white/20 py-3">
            <span className="text-sm">Gusts</span>
            <span className="text-sm font-medium">{Math.round(windGust)} mph</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-sm">Direction</span>
            <span className="text-sm font-medium">{directionLabel}</span>
          </div>
        </div>

        <WindDirectionCompass
          windSpeed={windSpeed}
          direction={windDeg}
        />
      </div>
    </>
  );
};


export default WindCard;
