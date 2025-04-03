// /lib/weatherIcon.ts

export function getWeatherIcon(condition: string, iconCode: string): string {
  const isNight = iconCode.endsWith("n");

  switch (condition.toLowerCase()) {
    case "thunderstorm":
      return "cloud.bolt.rain.fill.svg";

    case "drizzle":
      return "cloud.drizzle.fill.svg";

    case "rain":
      return isNight ? "cloud.moon.rain.fill.svg" : "cloud.rain.fill.svg";

    case "snow":
      return "cloud.snow.fill.svg";

    case "mist":
    case "fog":
    case "haze":
      return "cloud.fog.fill.svg";

    case "smoke":
    case "dust":
    case "sand":
    case "ash":
      return "wind.svg";

    case "squall":
    case "tornado":
      return "wind.svg";

    case "clear":
      return isNight ? "moon.stars.fill.svg" : "sun.max.fill.svg";

    case "clouds":
    
      // Use more subtle icons for night
      return isNight ? "cloud.moon.fill.svg" : "cloud.sun.fill.svg";

    default:
      return "cloud.fill.svg"; // fallback
  }
}
