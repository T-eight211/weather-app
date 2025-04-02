import React from 'react';
import ForecastCard from './ForecastCard';
import { getWeatherIcon } from '@/lib/weatherIcon';
import { get } from 'http';
import Image from 'next/image';


type ForecastDay = {
  dt: number;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  icon: string;
};

type FutureDaysForecastProps = {
  forecast: ForecastDay[];
};

const FutureDaysForecast: React.FC<FutureDaysForecastProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  // Get global min & max temperature
  const actualMin = Math.min(...forecast.map(day => day.temperature.min));
  const actualMax = Math.max(...forecast.map(day => day.temperature.max));

  // Convert timestamp to day label
  const getDayLabel = (timestamp: number, index: number) => {
    if (index === 0) return 'Today';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Thu"
  };

  return (
    <div className="bg-custom-my-colour px-4 rounded-2xl">
      <div className="bg-custom-my-colour flex items-center py-2 border-b border-white/10 gap-2">
        <div className="w-7 h-7 flex items-center justify-center">
          <Image src='./calendar.svg' alt="weather icon" width={16} height={16} />
        </div>
        <h2 className="w-40 text-white text-sm font-medium">10-DAY FORECAST</h2>
      </div>
      
      {forecast.map((day, idx) => (
        <ForecastCard
          key={day.dt}
          day={getDayLabel(day.dt, idx)}
          
          icon={`/${getWeatherIcon(day.condition, day.icon)}`}

          min={Math.round(day.temperature.min)}
          max={Math.round(day.temperature.max)}
          actualMin={actualMin}
          actualMax={actualMax}
        />
      ))}
    </div>
  );
};

export default FutureDaysForecast;
