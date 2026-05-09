import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Weather, ForecastDay } from '../models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private api: ApiService) {}

  current(city: string): Observable<Weather | null> {
    return this.api.get<{ weather: Weather }>(`/weather/${encodeURIComponent(city)}`).pipe(
      map(r => {
        const w = r?.weather;
        if (!w) return null;
        return { ...w, temp_c: w.temp ?? w.temp_c, wind_kph: w.wind_speed ?? w.wind_kph };
      }),
      catchError(() => of(null))
    );
  }

  forecast(city: string): Observable<ForecastDay[]> {
    return this.api.get<{ forecast: ForecastDay[] }>(`/weather/${encodeURIComponent(city)}/forecast`).pipe(
      map(r => (r?.forecast ?? []).map(d => ({
        ...d, temp_max: d.max ?? d.temp_max, temp_min: d.min ?? d.temp_min
      }))),
      catchError(() => of([]))
    );
  }
}
