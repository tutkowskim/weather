import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeAheadValue } from './type-ahead/type-ahead.component';
import * as cities from '../../node_modules/nearby-big-cities/cities.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public longitude: number|null = null;
  public latitude: number|null = null;

  // San Francisco
  private readonly defaultLongitude: number = 122.4194;
  private readonly defaultLatitude: number = 37.7749;

  public readonly typeAheadValues: TypeAheadValue[] = Array.from(cities)
    .filter(city => city.name && city.country && city.lon && city.lat)
    .map(city => ({ displayValue: `${city.name}, ${city.country}`, value: city }))
    .filter((itemA, pos, array) => array.findIndex(itemB => itemA.displayValue === itemB.displayValue) === pos)

  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        const { longitude, latitude } = params;
        if (longitude && latitude && !Number.isNaN(longitude) && !Number.isNaN(longitude)) {
          this.longitude = Number(longitude);
          this.latitude = Number(latitude);
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => this.changeLocation(position.coords.latitude, position.coords.longitude),
            () => this.changeLocation(this.defaultLatitude, this.defaultLongitude),
          );
        } else {
          this.changeLocation(this.defaultLatitude, this.defaultLongitude);
        }
      }
    );
  }

  public typeAheadClicked(typeAheadValue: TypeAheadValue): void {
    const { lat, lon } = typeAheadValue.value;
    this.changeLocation(lat, lon);
  }

  private changeLocation(latitude: number, longitude: number): void {
    this.router.navigate([''], { queryParams: { longitude, latitude } });
  }
}
