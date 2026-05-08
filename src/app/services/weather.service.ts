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
      map(r => r?.weather ?? null),
      catchError(() => of(null))
    );
  }

  forecast(city: string): Observable<ForecastDay[]> {
    return this.api.get<{ forecast: ForecastDay[] }>(`/weather/${encodeURIComponent(city)}/forecast`).pipe(
      map(r => r?.forecast ?? []),
      catchError(() => of([]))
    );
  }
}
