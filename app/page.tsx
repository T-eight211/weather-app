"use client";
import React, { useRef, useEffect, useState } from "react";
import LandingSplash from "@/components/LogoAnimation";
import WeatherSlider from "@/components/WeatherSlider";
import WeatherCard from "@/components/CurentWeatherCard";
import SearchBarCity from "@/components/SearchBarCity";
import { getCurrentWeather, getDailyForecast, getHourlyForecast, getOneCallData } from "@/lib/weather";
import FutureDaysForecast from "@/components/FutureDaysForecast";
import DangerLevelGauge from '@/components/DangerLevelCard';
import HourlyWeatherWidget from "@/components/HourlyWeatherWidget";
import WindCard from "@/components/WindCard";
import RainForecastCard from "@/components/RainForecastCard";
import { calculateDanger } from "@/lib/danger";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";


// object to store the selected city returned from the search bar after calling google places api
type Place = {
  name: string;
  place_id: string;
  lat: number;
  lng: number;
};

const Page: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<any>({
    name: "London, UK",
    place_id: "london_default", // You can use a placeholder or real place_id
    lat: 51.5074,
    lng: -0.1278,
  });
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[] | null>(null);
  const [hourlyForecastData, setHourlyForecastData] = useState<{
    hourly: any[],
    sunrise: number,
    sunset: number,
    timezoneOffset: number
  } | null>(null);

  const [oneCallData, setOneCallData] = useState<any | null>(null);

  const forecastRef = useRef<HTMLDivElement>(null);
  const [forecastHeight, setForecastHeight] = useState<number>(0);

  const [selectedMode, setSelectedMode] = useState<string>("car");
  const [dangerLevel, setDangerLevel] = useState<number>(0);
  // messages for the danger level
  const [messages, setMessages] = useState<string[]>([]);

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  // listenning for the selected city from the search bar then call the weather api and set the data so that can be used in the components
  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      const cityName = selectedCity.name.split(",")[0].trim();
  
      try {
        const [weather, forecast, hourlyData, oneCallData] = await Promise.all([
          getCurrentWeather(cityName),
          getDailyForecast(cityName),
          getHourlyForecast(cityName),
          getOneCallData(selectedCity.lat, selectedCity.lng), // 🌍 new call here
        ]);
  
        setWeatherData(weather);
        setForecastData(forecast.forecast);
        setHourlyForecastData(hourlyData);
        setOneCallData(oneCallData);

  
        console.log("Current Weather Data:", weather);
        console.log("Daily Forecast Data:", forecast);
        console.log("Hourly Forecast Data:", hourlyData);
        console.log("Wind Gust:", weather.windGust);
        console.log("Timezone Offset:", hourlyData?.timezoneOffset);
        console.log("City Coordinates:", selectedCity.lat, selectedCity.lng);
        console.log("One Call API Data:", oneCallData); // 🔍 log result
        // print current rain data
        console.log("Current Rain Data:", oneCallData.current.rain);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setShowErrorDialog(true);
      }
    };
  
    fetchWeather();
  }, [selectedCity]);

  // set the height of the forecast card to be the same as the weather card to keep the design consistent and responsive
  useEffect(() => {
    if (forecastRef.current) {
      setForecastHeight(forecastRef.current.offsetHeight);
    }
  }, [forecastData]);


  // listen for the one call data and trasnsport mode to be changed then call the calculateDanger function to get the danger level and messages
  useEffect(() => {
    if (!oneCallData || !selectedMode) return;  
    const result = calculateDanger(oneCallData, selectedMode);
    setMessages([]);
    setDangerLevel(result.danger);
    setMessages(result.messages);
  }, [oneCallData, selectedMode]);
  

  return (
    <>
      {/* Landing annimation*/}
      <LandingSplash />

      {/* background video to match current weather */}
      <WeatherSlider
        condition={weatherData?.condition || ""}
        iconCode={weatherData?.icon || ""}
      />
      
      {/* if openweather api does not have access to weather data for a certain locaiton  then an alert popup will be shown*/}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Something went wrong</AlertDialogTitle>
            <AlertDialogDescription>
              {"Weather data is not available for this location."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowErrorDialog(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Main content */}
      {/* rendering all the components  */}
      <div className="flex items-center px-8 py-4">
        <div className="max-w-7xl w-full mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SearchBarCity onSelect={setSelectedCity} />

          {weatherData && (
            <div
              className="rounded-2xl bg-custom-my-colour text-white flex flex-col items-center justify-center text-center p-5"
              style={{ height: forecastHeight }}
            >
              <WeatherCard
                city={weatherData.city}
                temperature={weatherData.temperature}
                temp_min={weatherData.temp_min}
                temp_max={weatherData.temp_max}
                description={weatherData.description}
              />
            </div>
          )}

          <div ref={forecastRef} className="bg-custom-my-colour rounded-2xl px-4">
            {forecastData && <FutureDaysForecast forecast={forecastData} />}
          </div>

          <div
            className="bg-custom-my-colour px-4 rounded-2xl h-full flex flex-col"
            style={{ height: forecastHeight }}
          >
            <DangerLevelGauge
              value={dangerLevel}
              messages={messages}
              selectedValue={selectedMode}
              onChange={setSelectedMode}
            />
          </div>

          <div className="bg-custom-my-colour rounded-2xl px-4">
            {hourlyForecastData && weatherData && (
              <HourlyWeatherWidget
                hourly={hourlyForecastData.hourly}
                sunrise={hourlyForecastData.sunrise}
                sunset={hourlyForecastData.sunset}
                timezoneOffset={hourlyForecastData.timezoneOffset}
                temperature={weatherData.temperature}
                condition={weatherData.condition}
                icon={weatherData.icon}
              />
            )}
          </div>

          <div className="bg-custom-my-colour text-white rounded-2xl px-4">
            {weatherData && (
              <WindCard
                windSpeed={Math.round(weatherData.windSpeed * 2.237)}
                windGust={
                  weatherData?.windGust !== undefined
                    ? Math.round(weatherData.windGust * 2.237).toString()
                    : "N/A"
                }
                windDeg={Math.round(weatherData.windDeg)}
              />
            )}
          </div>
          
          <div className="bg-custom-my-colour rounded-xl px-4 text-white max-w-[88vw]">
            {oneCallData && oneCallData.minutely && oneCallData.current && (
            <RainForecastCard
              currentRain={oneCallData.current.rain?.["1h"] ?? 0}
              minutely={oneCallData.minutely}
            />
          )}

          </div>
        
        </div>
      </div>
    </>
  );
};

export default Page;
