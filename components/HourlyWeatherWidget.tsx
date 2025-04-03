"use client";

import React from 'react';
import HourlyWeatherCard from './HourlyWeatherCard';
import { getWeatherIcon } from '@/lib/weatherIcon';
import Image from 'next/image';

type HourlyForecastEntry = {
  dt: number;
  temperature: number;
  condition: string;
  icon: string;
};

type Props = {
  hourly: HourlyForecastEntry[];
  sunrise: number;
  sunset: number;
  timezoneOffset: number; // ⏰ Offset in seconds from UTC
  temperature: number;     // 🌡️ Current temperature for "Now"
  condition: string;       // 🌤️ Current condition for "Now"
};

// Convert timestamp + offset to HH format
function formatHour(timestamp: number, offset: number): string {
  const date = new Date((timestamp + offset) * 1000);
  return date.getUTCHours().toString().padStart(2, '0');
}

// Extract hour
function getHour(timestamp: number, offset: number): number {
  return new Date((timestamp + offset) * 1000).getUTCHours();
}

// Format full time (HH:mm)
function getMinute(timestamp: number, offset: number): string {
  const date = new Date((timestamp + offset) * 1000);
  return `${date.getUTCHours()}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
}

const HourlyWeatherWidget: React.FC<Props> = ({
  hourly,
  sunrise,
  sunset,
  timezoneOffset,
  temperature,
  condition
}) => {
  const sunriseHour = getHour(sunrise, timezoneOffset);
  const sunsetHour = getHour(sunset, timezoneOffset);
  const result: JSX.Element[] = [];

  // 🌟 "Now" Card
  const nowIconPath = `/${getWeatherIcon(condition, "")}`;
  result.push(
    <HourlyWeatherCard
      key="now"
      hour="Now"
      icon={nowIconPath}
      temperature={Math.round(temperature).toString()}
    />
  );

  // ⏱️ Next hourly forecast (skipping "Now")
  hourly.forEach((entry) => {
    const hour = getHour(entry.dt, timezoneOffset);
    const iconPath = `/${getWeatherIcon(entry.condition, entry.icon)}`;


    result.push(
      <HourlyWeatherCard
        key={entry.dt}
        hour={formatHour(entry.dt, timezoneOffset)}
        icon={iconPath}
        
        temperature={`${Math.round(entry.temperature)}°`}

      />
    );

    // 🌅 Sunrise
    if (sunriseHour === hour) {
      result.push(
        <HourlyWeatherCard
          key="sunrise"
          hour={getMinute(sunrise, timezoneOffset)}
          icon="/sunrise.fill.svg"
          temperature="Sunrise"
        />
      );
    }

    // 🌇 Sunset
    if (sunsetHour === hour) {
      result.push(
        <HourlyWeatherCard
          key="sunset"
          hour={getMinute(sunset, timezoneOffset)}
          icon="/sunset.fill.svg"
          temperature="Sunset"
        />
      );
    }

    
  });

  return (
    <>
    <div className="flex items-center py-2 gap-2 border-b border-white/10">
        <div className="w-4 h-7 flex items-center justify-center">
          <Image src="/degreesign.celsius.svg" alt="danger icon" width={16} height={16} />
        </div>
        <h2 className="w-60 text-white text-sm font-medium">HOURLY TEMPERATURE</h2>
    </div>

    <div className="flex overflow-x-auto gap-8 py-2 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent  max-w-[80vw]">
      
      {result}
    </div>
    </>
  );
};

export default HourlyWeatherWidget;
