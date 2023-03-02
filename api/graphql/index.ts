import * as fs from 'fs';
import { ApolloServer, gql } from 'apollo-server-azure-functions';
import { OpenWeatherClient } from './open-weather-client';

// Schema definition.
const schema = fs.readFileSync('./schema.graphql').toString();
const typeDefs = gql(schema);

// Resolver map.
const resolvers = {
    Query: {
        reverseGeocoding: async (_: any, args: { latitude: number, longitude: number }) => {
            const client = new OpenWeatherClient();
            const { name, country } = await client.reverseGeocoding(args.latitude, args.longitude);
            return { name, country };
        },
        currentWeather: async (_: any, args: { latitude: number, longitude: number }) => {
            const client = new OpenWeatherClient();
            const result = await client.fetchCurrentWeather(args.latitude, args.longitude);
            return {
                name: result.name,
                timestamp: new Date(result.dt * 1000).toISOString(),
                iconUrl: `https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
                weatherType: result.weather[0].main,
                description: result.weather[0].description,
                actualTemperature: result.main.temp,
                feelsLikeTemperature: result.main.feels_like,
                highTemperature: result.main.temp_max,
                lowTemperature: result.main.temp_min,
                humidity: result.main.humidity,
                pressure: result.main.pressure,
                wind: {
                    speed: result.wind.speed,
                    degree: result.wind.deg,
                },
            };
        },
        forecast: async (_: any, args: { latitude: number, longitude: number }) => {
            const client = new OpenWeatherClient();
            const result = await client.fetchWeatherForecast(args.latitude, args.longitude);
            return result.list.map(weatherData => ({
                name: weatherData.name,
                timestamp: new Date(weatherData.dt * 1000).toISOString(),
                iconUrl: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                weatherType: weatherData.weather[0].main,
                description: weatherData.weather[0].description,
                actualTemperature: weatherData.main.temp,
                feelsLikeTemperature: weatherData.main.feels_like,
                highTemperature: weatherData.main.temp_max,
                lowTemperature: weatherData.main.temp_min,
                humidity: weatherData.main.humidity,
                pressure: weatherData.main.pressure,
                wind: {
                    speed: weatherData.wind.speed,
                    degree: weatherData.wind.deg,
                },
            }));
        },
    },
};

// Create our server.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
});

export default server.createHandler();