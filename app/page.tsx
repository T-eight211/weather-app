"use client";
import React, { useState, useEffect } from 'react';
import LandingSplash from "@/components/LogoAnimation";
import WeatherSlider from "@/components/WeatherSlider";
import WeatherCard from "@/components/CurentWeatherCard";
import SearchBarCity from "@/components/SearchBarCity";
import { getCurrentWeather, getDailyForecast } from "@/lib/weather";
import FutureDaysForecast from "@/components/FutureDaysForecast";

const Page: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("London");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      const cityName = selectedCity.split(",")[0].trim();

      try {
        const [weather, forecast] = await Promise.all([
          getCurrentWeather(cityName),
          getDailyForecast(cityName)
        ]);

        setWeatherData(weather);
        setForecastData(forecast.forecast);
        console.log("Weather Data:", weather);
        console.log("Forecast Data:", forecast);
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
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <SearchBarCity onSelect={setSelectedCity} />
          </div>

          {weatherData && (
            <WeatherCard
              city={weatherData.city}
              temperature={weatherData.temperature}
              temp_min={weatherData.temp_min}
              temp_max={weatherData.temp_max}
              description={weatherData.description}
            />
          )}

          {forecastData && <FutureDaysForecast forecast={forecastData} />}

          <div className="bg-black text-white p-4">siuu</div>
          <div className="bg-black text-white p-4">siuu</div>
        </div>
      </div>
    </>
  );
};

export default Page;
