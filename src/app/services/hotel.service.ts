import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Hotel } from '../models';

@Injectable({ providedIn: 'root' })
export class HotelService {
  constructor(private api: ApiService) {}

  search(city?: string, maxPrice?: number, minStars?: number): Observable<Hotel[]> {
    const params: Record<string, unknown> = {};
    if (city) params['city'] = city;
    if (maxPrice) params['max_price'] = maxPrice;
    if (minStars) params['min_stars'] = minStars;
    return this.api.get<{ results: Hotel[] }>('/hotels/search', params).pipe(
      map(r => r?.results ?? []),
      catchError(() => of([]))
    );
  }

  list(): Observable<Hotel[]> {
    return this.api.get<{ results: Hotel[] } | Hotel[]>('/hotels').pipe(
      map(r => Array.isArray(r) ? r : (r?.results ?? [])),
      catchError(() => of([]))
    );
  }

  byId(id: string): Observable<Hotel | null> {
    return this.api.get<Hotel>(`/hotels/${id}`).pipe(catchError(() => of(null)));
  }

  byCity(code: string): Observable<Hotel[]> {
    return this.api.get<{ results: Hotel[] } | Hotel[]>(`/hotels/city/${code}`).pipe(
      map(r => Array.isArray(r) ? r : (r?.results ?? [])),
      catchError(() => of([]))
    );
  }
}
