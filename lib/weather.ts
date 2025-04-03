const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast/daily";
const HOURLY_FORECAST_BASE_URL = "https://pro.openweathermap.org/data/2.5/forecast/hourly";


export async function getCurrentWeather(city: string) {
  if (!API_KEY) {
    throw new Error("Missing OpenWeather API key");
  }

  // Strip any text after the first comma
  const cityOnly = city.split(",")[0].trim();
  console.log("City Only:", cityOnly); // Debugging line

  const url = `${BASE_URL}?q=${encodeURIComponent(cityOnly)}&units=metric&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather data: ${res.statusText}`);
  }

  const data = await res.json();

  return {
    city: data.name,
    temperature: data.main.temp,
    temp_min: data.main.temp_min,
    temp_max: data.main.temp_max,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    // wind speed
    windSpeed: data.wind.speed,
    windGust: data.wind.gust,
    windDeg: data.wind.deg,
  };
}


export async function getDailyForecast(city: string, days: number = 10) {
  if (!API_KEY) {
    throw new Error("Missing OpenWeather API key");
  }

  // Extract city only
  const cityOnly = city.split(",")[0].trim();

  const url = `${FORECAST_BASE_URL}?q=${encodeURIComponent(cityOnly)}&cnt=${days}&units=metric&appid=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch daily forecast: ${res.statusText}`);
  }

  const data = await res.json();

  // Optional: format the forecast
  const formattedForecast = data.list.map((day: any) => ({
    dt: day.dt, // timestamp
    temperature: {
      min: day.temp.min,
      max: day.temp.max,
    },
    condition: day.weather[0].main,
    description: day.weather[0].description,
    icon: day.weather[0].icon,
  }));

  return {
    city: data.city.name,
    country: data.city.country,
    forecast: formattedForecast,
  };
}

export async function getHourlyForecast(city: string, hours: number = 23): Promise<{
  hourly: any[],
  sunrise: number,
  sunset: number,
  timezoneOffset: number
}> {
  if (!API_KEY) throw new Error("Missing OpenWeather API key");

  const cityOnly = city.split(",")[0].trim();
  const url = `${HOURLY_FORECAST_BASE_URL}?q=${encodeURIComponent(cityOnly)}&cnt=${hours}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch hourly forecast: ${res.statusText}`);

  const data = await res.json();

  const formattedHourly = data.list.map((entry: any) => ({
    dt: entry.dt,
    temperature: entry.main.temp,
    condition: entry.weather[0].main,
    description: entry.weather[0].description,
    icon: entry.weather[0].icon,
    humidity: entry.main.humidity,
  }));

  return {
    sunrise: data.city.sunrise,
    sunset: data.city.sunset,
    timezoneOffset: data.city.timezone, // make sure this field exists
    hourly: formattedHourly,
  };
}