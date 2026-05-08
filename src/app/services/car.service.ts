import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Car } from '../models';

@Injectable({ providedIn: 'root' })
export class CarService {
  constructor(private api: ApiService) {}

  search(city?: string, type?: string, maxPrice?: number): Observable<Car[]> {
    const params: Record<string, unknown> = {};
    if (city) params['city'] = city;
    if (type && type !== 'all') params['type'] = type;
    if (maxPrice) params['max_price'] = maxPrice;
    return this.api.get<{ results: Car[] } | Car[]>('/cars/search', params).pipe(
      map(r => Array.isArray(r) ? r : (r?.results ?? [])),
      catchError(() => of([]))
    );
  }

  cities(): Observable<{ code: string; name: string }[]> {
    return this.api.get<{ cities: { code: string; name: string }[] }>('/cars/cities').pipe(
      map(r => r?.cities ?? []),
      catchError(() => of([]))
    );
  }

  byCity(code: string): Observable<Car[]> {
    return this.api.get<{ results: Car[] } | Car[]>(`/cars/city/${code}`).pipe(
      map(r => Array.isArray(r) ? r : (r?.results ?? [])),
      catchError(() => of([]))
    );
  }

  byId(id: string): Observable<Car | null> {
    return this.api.get<Car>(`/cars/${id}`).pipe(catchError(() => of(null)));
  }
}
