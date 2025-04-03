import React from "react";

type RainForecastCardProps = {
  currentRain: number; // mm in the last hour (from current.rain["1h"])
  minutely: { precipitation: number }[]; // from minutely forecast
};

const MAX_RAIN_MM_PER_HOUR = 4; // Define the "100%" threshold (can be changed)

const RainForecastCard: React.FC<RainForecastCardProps> = ({
  currentRain,
  minutely,
}) => {
  // Convert mm/h to a percentage height (capped at 100%)
  const rainToPercent = (mm: number) =>
    Math.min((mm / MAX_RAIN_MM_PER_HOUR) * 100, 100);
    console.log("currentRain", currentRain);
    // first value in minutely 
    console.log("minutely", minutely[0].precipitation);

  // Prepare the bars: first one is current rain, rest from forecast
  const bars = [
    rainToPercent(currentRain), // "Now" bar
    ...minutely.slice(1, 60).map((m) => rainToPercent(m.precipitation)), // next 59 minutes
  ];

  return (
    <div className="">
      <h3 className="text-lg font-semibold pt-2">Rain Forecast</h3>
      <p className="text-sm text-white/80 mb-4">Rain for the next hour.</p>

      {/* Graph */}
      <div className="relative h-20">
        {/* Grid lines */}
        <div className="absolute w-full h-full flex flex-col justify-between text-white/10 text-xs">
          <div className="border-t border-dashed border-white/20"></div>
          <div className="border-t border-dashed border-white/20"></div>
          <div className="border-t border-dashed border-white/20"></div>
          <div className="border-t border-dashed border-white/20"></div>
        </div>

        {/* Bars */}
        <div className="flex items-end h-full space-x-[1px] relative z-10">
          {bars.map((val, index) => (
            <div
              key={index}
              className="w-[10px] bg-cyan-300 rounded-t"
              style={{ height: `${val}%` }}
            />
          ))}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 mb-2 text-xs text-white/60">
        <span className="text-white">Now</span>
        <span>10m</span>
        <span>20m</span>
        <span>30m</span>
        <span>40m</span>
        <span>50m</span>
        <span></span>
      </div>
    </div>
  );
};

export default RainForecastCard;
