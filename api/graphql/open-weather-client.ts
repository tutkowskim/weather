import axios from 'axios';

export interface ReverseGeocodingData {
  lat: number;
  lon: number;
  name: string;
  country: string;
}

export interface WeatherData {
  dt: number;
  coord: {
    lon: number;
    lat: number;
  },
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain: {
    "1h": number;
  };
  clouds: {
    all: number;
  };
  timezone: number;
  name: string;
}

export interface ForecastData {
  list: WeatherData[];
}

export class OpenWeatherClient {
  private readonly apiKey: string = process.env.OPEN_WEATHER_API_KEY || '';
  private readonly units: string = 'imperial';
  
  public async reverseGeocoding(latitude: number, longitude: number): Promise<ReverseGeocodingData> {
    const result = await axios.get<ReverseGeocodingData[]>(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${this.apiKey}`);
    return result.data[0];
  }

  public async fetchCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    const result = await axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&unts=${this.units}&appid=${this.apiKey}`);
    return result.data;
  }

  public async fetchWeatherForecast(latitude: number, longitude: number): Promise<ForecastData> {
    const result = await axios.get<ForecastData>(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&unts=${this.units}&appid=${this.apiKey}`);
    return result.data;
  }
}
