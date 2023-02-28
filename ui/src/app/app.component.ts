import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private router: Router, private route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        const { longitude, latitude } = params;
        if (longitude && latitude && !Number.isNaN(longitude) && !Number.isNaN(longitude)) {
          this.longitude = longitude;
          this.latitude = latitude;
        } else if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => this.router.navigate([''], { queryParams: { longitude: position.coords.longitude, latitude: position.coords.latitude } }),
            () => this.router.navigate([''], { queryParams: { longitude: this.defaultLongitude, latitude: this.defaultLatitude } }),
          );
        } else {
          this.router.navigate([''], { queryParams: { longitude: this.defaultLongitude, latitude: this.defaultLatitude } });
        }
      }
    );
  }
}
