"use client";
import React, { useRef, useEffect, useState } from "react";
import LandingSplash from "@/components/LogoAnimation";
import WeatherSlider from "@/components/WeatherSlider";
import WeatherCard from "@/components/CurentWeatherCard";
import SearchBarCity from "@/components/SearchBarCity";
import { getCurrentWeather, getDailyForecast, getHourlyForecast } from "@/lib/weather";
import FutureDaysForecast from "@/components/FutureDaysForecast";
import DangerLevelGauge from '@/components/DangerLevelCard';
import HourlyWeatherWidget from "@/components/HourlyWeatherWidget";
import WindCard from "@/components/WindCard";
import Direction from "@/components/WindDirectionCompass";
import WindDirectionCompass from "@/components/WindDirectionCompass";
import RainForecastCard from '@/components/RainForecastCard';


const Page: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("London");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[] | null>(null);
  const [hourlyForecastData, setHourlyForecastData] = useState<{
    hourly: any[],
    sunrise: number,
    sunset: number,
    timezoneOffset: number
  } | null>(null);
  
  const forecastRef = useRef<HTMLDivElement>(null);
  const [forecastHeight, setForecastHeight] = useState<number>(0);

  const dummyRainData = Array.from({ length: 60 }, (_, i) => Math.floor(Math.random() * 100));



  useEffect(() => {
    if (forecastRef.current) {
      setForecastHeight(forecastRef.current.offsetHeight);
    }
  }, [forecastData]); // Re-measure when forecast changes

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      const cityName = selectedCity.split(",")[0].trim();
    
      try {
        const [weather, forecast, hourlyData] = await Promise.all([
          getCurrentWeather(cityName),
          getDailyForecast(cityName),
          getHourlyForecast(cityName),
        ]);
    
        setWeatherData(weather);
        setForecastData(forecast.forecast);
        setHourlyForecastData(hourlyData); 
        console.log("Current Weather Data:", weather);
        console.log("Daily Forecast Data:", forecast);
        console.log("Hourly Forecast Data:", hourlyData);
        // wind gust
        console.log("Wind Gust:", weather.windGust);
        // console timezone offset
        console.log("Timezone Offset:" );
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  return (
    <>
      <LandingSplash />
      <WeatherSlider />

      <div className="flex items-center px-8 py-4">
        <div className="max-w-7xl w-full mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          
   
          <SearchBarCity onSelect={setSelectedCity} />
  

          {weatherData && (
            <div className="rounded-2xl bg-custom-my-colour text-white flex flex-col items-center justify-center text-center p-5" style={{ height: forecastHeight }}>
              <WeatherCard
                city={weatherData.city}
                temperature={weatherData.temperature}
                temp_min={weatherData.temp_min}
                temp_max={weatherData.temp_max}
                description={weatherData.description}
              />
            </div>
          )}

          <div ref={forecastRef}>
            {forecastData && <FutureDaysForecast forecast={forecastData} />}
          </div>

          <div className="bg-custom-my-colour px-4 rounded-2xl h-full flex flex-col" style={{ height: forecastHeight }}>
            <DangerLevelGauge value={20} />
          </div>

          <div className="bg-custom-my-colour rounded-2xl px-4">
            {hourlyForecastData && (
              <HourlyWeatherWidget
                hourly={hourlyForecastData.hourly}
                sunrise={hourlyForecastData.sunrise}
                sunset={hourlyForecastData.sunset}
                timezoneOffset={hourlyForecastData.timezoneOffset} 
                temperature={weatherData.temperature}
                condition={weatherData.condition}
              />
            )}
          </div>
             
          <div className="bg-custom-my-colour text-white rounded-2xl px-4">
            {weatherData && (
              <WindCard
                windSpeed={Math.round(weatherData.windSpeed * 2.237)}
                windGust={Math.round(weatherData.windGust * 2.237)}
                windDeg={Math.round(weatherData.windDeg)}
              />
            )}
          </div>

          <RainForecastCard data={dummyRainData} />

          <div className="bg-black text-white p-4">siuu</div>
          <div className="bg-black text-white p-4">siuu</div>
        </div>
      </div>
    </>
  );
};

export default Page;
