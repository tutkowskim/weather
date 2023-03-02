import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';
import { TypeAheadComponent } from './type-ahead/type-ahead.component';
import { FormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './weather/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    WeatherComponent,
    TypeAheadComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
