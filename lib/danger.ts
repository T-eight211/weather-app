// this is an algorithm to calculate the danger of a given weather data, for car it considers wind, visibility, rain, snow, for walking it considers temperature, rain, snow, uv index, for motorcycle it considers wind, visibility, rain, snow, for bicycle it considers wind, temperature, rain, snow
// it returns a danger level from 0 to 100 and a list of messages to inform the user about the weather conditions
// each attribute will have different effect on different mode of trasport has different effect meaning wind has more effect on bike than car so same wind speed will increase danger more for bike than car
// conditions are based on the OpenWeatherMap API data structure so see if it is raining and display the message accordingly

type WeatherData = {
  current: {
    visibility: number;
    wind_speed: number;
    temp: number;
    feels_like: number;
    weather: { description: string }[];
    rain?: { [key: string]: number };
    snow?: { [key: string]: number };
    uvi?: number;
    
  };
  hourly: Array<{
    visibility?: number;
    wind_speed?: number;
    weather: { description: string }[];
    rain?: { [key: string]: number };
    snow?: { [key: string]: number };
    temp?: number;
  }>;
};

type DangerResult = {
  danger: number;
  messages: string[];
};

export function calculateDanger(weatherData: WeatherData, transportMode: string): DangerResult {
  let danger = 0;
  const messages: string[] = [];
  const rainKeywords = [
    "light rain", "moderate rain", "heavy intensity rain", "very heavy rain", "extreme rain",
    "freezing rain", "light intensity shower rain", "shower rain", "heavy intensity shower rain",
    "ragged shower rain"
  ];
  const currentWeatherDesc = weatherData.current.weather[0].description.toLowerCase();
  const nextHours = weatherData.hourly.slice(0, 2);

  // CAR MODE
  if (transportMode === "car") {
    const currentVis = weatherData.current.visibility;

    if (currentVis < 100) {
      messages.push("Visibility is very bad; drive extremely slow.");
      danger += 30;
    } else if (currentVis < 300) {
      messages.push("Visibility is poor; please drive slowly.");
      danger += 20;
    } else {
      messages.push("Visibility is good.");
      for (const hour of nextHours) {
        if ((hour.visibility ?? 9999) < 400) {
          messages.push("Expected poor visibility in the coming hours.");
          danger += 10;
        }
      }
    }

    const currentWind = weatherData.current.wind_speed;
    if (currentWind > 10) {
      messages.push("Wind is very high; avoid driving with a trailer.");
      danger += 25;
    } else if (currentWind > 5) {
      messages.push("Windy conditions; be cautious.");
      danger += 15;
    } else {
      messages.push("Wind conditions are good.");
      for (const hour of nextHours) {
        if ((hour.wind_speed ?? 0) > 5) {
          messages.push("Wind is expected to increase soon.");
          danger += 10;
        }
      }
    }

    if (rainKeywords.some(keyword => currentWeatherDesc.includes(keyword))) {

      messages.push(`It’s raining; roads may be very slippery. (${currentWeatherDesc})`);


      messages.push("It’s raining; roads may be very slippery.");
      danger += 20;
    } else {
      for (const hour of nextHours) {
        const desc = hour.weather[0].description.toLowerCase();
        if (rainKeywords.some(k => desc.includes(k))) {
   
          messages.push(`${desc} expected soon; drive with caution.`);

          danger += 10;
          break;
        }
      }
    }

    if ((weatherData.current.snow?.["1h"] ?? 0) > 0) {
      messages.push("Snow is falling; road conditions are dangerous.");
      danger += 20;
    } else {
      for (const hour of nextHours) {
        if ((hour.snow?.["1h"] ?? 0) > 0) {
          messages.push("Snow expected soon; be cautious.");
          danger += 10;
          break;
        }
      }
    }
  }

  // WALKING MODE
  else if (transportMode === "walking") {
    const temp = weatherData.current.temp;
    const feels = weatherData.current.feels_like;

    if (temp < 10) {
      messages.push("It’s too cold; wear a warm coat.");
      danger += 15;
    } else if (temp > 30) {
      messages.push("It’s very hot; stay hydrated and take breaks.");
      danger += 15;
    }

    if (Math.abs(temp - feels) > 5) {
      messages.push("Temperature feels significantly different than expected; dress appropriately.");
      danger += 10;
    }

    if (rainKeywords.some(keyword => currentWeatherDesc.includes(keyword))) {

      messages.push(`It’s raining; sidewalks may be slippery. (${currentWeatherDesc})`);
      danger += 20;
    } else {
      for (const hour of nextHours) {
        const desc = hour.weather[0].description.toLowerCase();
        if (rainKeywords.some(k => desc.includes(k))) {
    
          messages.push(`${desc} expected soon; carry an umbrella.`);
          danger += 10;
          break;
        }
      }
    }

    if ((weatherData.current.snow ?? {})["1h"] > 0) {
      messages.push("Snow is falling; be careful on slippery sidewalks.");
      danger += 20;
    } else {
      for (const hour of nextHours) {
        if ((hour.snow?.["1h"] ?? 0) > 0) {
          messages.push("Snow expected soon; plan accordingly.");
          danger += 10;
          break;
        }
      }
    }

    if ((weatherData.current.uvi ?? 0) > 7) {
      messages.push("High UV index; wear sun cream and take breaks in the shade.");
      danger += 10;
    } else {
      messages.push("UV index is acceptable.");
    }
  }

  // MOTORBIKE MODE
  else if (transportMode === "motorcycle") {
    const wind = weatherData.current.wind_speed;
    const currentVis = weatherData.current.visibility;

    if (wind > 6) {
      messages.push("High wind on your motorbike; ride very carefully.");
      danger += 30;
    } else if (wind > 3) {
      messages.push("Windy conditions; be extra cautious on your bike.");
      danger += 20;
    } else {
      messages.push("Wind conditions are good.");
      for (const hour of nextHours) {
        if ((hour.wind_speed ?? 0) > 5) {
          messages.push("Wind is expected to increase soon.");
          danger += 10;
        }
      }
    }

    if (currentVis < 500) {
      messages.push("Visibility is very bad; drive extremely slow.");
      danger += 30;
    } else if (currentVis < 1000) {
      messages.push("Visibility is poor; please drive slowly.");
      danger += 20;
    } else {
      messages.push("Visibility is good.");
      for (const hour of nextHours) {
        if ((hour.visibility ?? 9999) < 400) {
          messages.push("Expected poor visibility in the coming hours.");
          danger += 10;
          break;
        }
      }
    }

    if (rainKeywords.some(keyword => currentWeatherDesc.includes(keyword))) {
      messages.push("It’s raining; roads may be very slippery.");
      danger += 20;
    } else {
      for (const hour of nextHours) {
        const desc = hour.weather[0].description.toLowerCase();
        if (rainKeywords.some(k => desc.includes(k))) {
 
          messages.push(`${desc} expected soon; drive with caution.`);
          danger += 10;
          break;
        }
      }
    }

    if ((weatherData.current.snow?.["1h"] ?? 0) > 0) {
      messages.push("Snow is falling; road conditions are dangerous.");
      danger += 20;
    } else {
      for (const hour of nextHours) {
        if ((hour.snow?.["1h"] ?? 0) > 0) {
          messages.push('$(hour.snow)', "Snow expected soon; be cautious.");
          danger += 10;
          break;
        }
      }
    }
    
  }

  // BICYCLE MODE
  else if (transportMode === "bicycle") {
    const wind = weatherData.current.wind_speed;
    if (wind > 8) {
      messages.push("Strong wind on your bicycle; maintain a low profile and be extra cautious.");
      danger += 25;
    } else if (wind > 4) {
      messages.push("Moderate wind expected; plan your route accordingly.");
      danger += 15;
    }

    const temp = weatherData.current.temp;
    const feels = weatherData.current.feels_like;

    if (temp < 10) {
      messages.push("It’s too cold; wear a warm coat.");
      danger += 15;
    } else if (temp > 30) {
      messages.push("It’s very hot; stay hydrated and take breaks.");
      danger += 15;
    }

    if (Math.abs(temp - feels) > 5) {
      messages.push("Temperature feels significantly different than expected; dress appropriately.");
      danger += 10;
    }

    if (rainKeywords.some(keyword => currentWeatherDesc.includes(keyword))) {

      messages.push(`It’s raining; roads may be very slippery. (${currentWeatherDesc})`);
      danger += 20;
    } else {
      for (const hour of nextHours) {
        const desc = hour.weather[0].description.toLowerCase();
        if (rainKeywords.some(k => desc.includes(k))) {
          messages.push(`${desc} expected soon; carry an umbrella.`);
          danger += 10;
          break;
        }
      }
    }

    if ((weatherData.current.snow ?? {})["1h"] > 0) {
      messages.push("Snow is falling; be careful on slippery sidewalks.");
      danger += 20;
    } else {
      for (const hour of nextHours) {
        if ((hour.snow?.["1h"] ?? 0) > 0) {
          messages.push("Snow expected soon; plan accordingly.");
          danger += 10;
          break;
        }
      }
    }
  }

  if (danger > 100) {
    danger = 100;
  }

  return { danger, messages };
}
