const API_KEY = "718d0502e1fdf804f510f63140737137";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast/daily";

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