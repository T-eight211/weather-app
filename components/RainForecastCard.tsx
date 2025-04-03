import React from "react";

type RainForecastCardProps = {
  data: number[]; // Array of precipitation values (e.g., mm of rain per minute)
};

const RainForecastCard: React.FC<RainForecastCardProps> = ({ data }) => {
  return (
    <div className="bg-[#1e2a47] rounded-xl p-4 text-white shadow-lg w-full max-w-md">
      <h3 className="text-lg font-semibold">Rain Forecast</h3>
      <p className="text-sm text-white/80 mb-4">Rain for the next hour.</p>

      {/* Graph */}
      <div className="relative h-24">
        {/* Horizontal grid lines */}
        <div className="absolute w-full h-full flex flex-col justify-between text-white/10 text-xs">
          <div className="border-t border-dashed border-white/20"></div>
          <div className="border-t border-dashed border-white/20"></div>
          <div className="border-t border-dashed border-white/20"></div>
        </div>

        {/* Bars */}
        <div className="flex items-end h-full space-x-[1px] relative z-10">
          {data.map((val, index) => (
            <div
              key={index}
              className="w-[3px] bg-cyan-300"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      </div>

      {/* Time Labels */}
      <div className="flex justify-between mt-2 text-xs text-white/60 px-1">
        <span className="text-white">Now</span>
        <span>10m</span>
        <span>20m</span>
        <span>30m</span>
        <span>40m</span>
        <span>50m</span>
      </div>
    </div>
  );
};

export default RainForecastCard;
