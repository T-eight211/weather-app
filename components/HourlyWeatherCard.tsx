import React from 'react';
import Image from 'next/image';

type HourlyWeatherCardProps = {
  hour: string;        // e.g. "14"
  icon: string;        // e.g. "/wind.svg"
  temperature: string; // e.g. 15
};

const HourlyWeatherCard: React.FC<HourlyWeatherCardProps> = ({
  hour,
  icon,
  temperature
}) => {
  return (
    <div className="flex flex-col gap-3 items-center justify-center py-4 text-white">
      <div className="text-sm font-semibold">{hour}</div>
      <Image src={icon} alt="weather icon" width={24} height={24} />
      <div className="text-sm font-semibold">{temperature}</div>
    </div>
  );
};

export default HourlyWeatherCard;