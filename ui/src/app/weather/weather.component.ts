import { Component, Input } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, combineLatestWith, switchMap } from 'rxjs';

import {
  CurrentWeatherQuery,
  CurrentWeatherQueryVariables,
  ReverseGeocodingQuery,
  ReverseGeocodingQueryVariables,
  ForecastQuery,
  ForecastQueryVariables,
} from '../../../graphql/generated';


const GET_REVERSE_GEOCODING = gql`
  query ReverseGeocoding ($latitude: Float!, $longitude: Float!) { 
    reverseGeocoding(latitude: $latitude, longitude: $longitude) {
        name
        country
    }
  }
`;

const GET_CURRENT_WEATHER = gql`
  query CurrentWeather ($latitude: Float!, $longitude: Float!) { 
    currentWeather(latitude: $latitude, longitude: $longitude) {
        timestamp
        iconUrl
        weatherType
        description
        actualTemperature
        feelsLikeTemperature
    }
  }
`;

const GET_WEATHER_FORECAST = gql`
  query Forecast ($latitude: Float!, $longitude: Float!) { 
    forecast(latitude: $latitude, longitude: $longitude) {
        timestamp
        iconUrl
        weatherType
        description
        actualTemperature
        feelsLikeTemperature
    }
  }
`;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  public readonly reverseGeocoding$: Observable<ApolloQueryResult<ReverseGeocodingQuery>>;
  public readonly currentWeather$: Observable<ApolloQueryResult<CurrentWeatherQuery>>;
  public readonly weatherForecast$: Observable<ApolloQueryResult<ForecastQuery>>;
  private readonly _longitude$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private readonly _latitude$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  
  @Input()
  public set longitude(value: number) {
    console.log(JSON.stringify(value));
    this._longitude$.next(value);
  }
  public get longitude(): number {
    return this._longitude$.value;
  }
  
  @Input()
  public set latitude(value: number) {
    console.log(JSON.stringify(value));
    this._latitude$.next(value);
  }
  public get latitude(): number {
    return this._latitude$.value;
  }

  constructor(private apollo: Apollo) {
    const coordinates = this._latitude$.pipe(combineLatestWith(this._longitude$));
    this.reverseGeocoding$ = coordinates.pipe(switchMap(([latitude, longitude]) => this.apollo.query<ReverseGeocodingQuery, ReverseGeocodingQueryVariables>({ 
      query: GET_REVERSE_GEOCODING,
      variables: { latitude, longitude },
    })));
    this.currentWeather$ = coordinates.pipe(switchMap(([latitude, longitude]) => this.apollo.query<CurrentWeatherQuery, CurrentWeatherQueryVariables>({ 
      query: GET_CURRENT_WEATHER,
      variables: { latitude, longitude },
    })));
    this.weatherForecast$ = coordinates.pipe(switchMap(([latitude, longitude]) => this.apollo.query<ForecastQuery, ForecastQueryVariables>({ 
      query: GET_WEATHER_FORECAST,
      variables: { latitude, longitude },
    })));
  }
}
