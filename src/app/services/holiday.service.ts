import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { HolidayPackage } from '../models';

@Injectable({ providedIn: 'root' })
export class HolidayService {
  constructor(private api: ApiService) {}

  list(theme?: string, budget?: number, days?: number): Observable<HolidayPackage[]> {
    const params: Record<string, unknown> = {};
    if (theme && theme !== 'all') params['theme'] = theme;
    if (budget) params['budget'] = budget;
    if (days) params['days'] = days;
    return this.api.get<{ packages?: HolidayPackage[]; results?: HolidayPackage[] } | HolidayPackage[]>('/holidays', params).pipe(
      map(r => Array.isArray(r) ? r : (r?.packages ?? r?.results ?? [])),
      catchError(() => of([]))
    );
  }

  themes(): Observable<string[]> {
    return this.api.get<{ themes: string[] }>('/holidays/themes').pipe(
      map(r => r?.themes ?? ['heritage', 'beach', 'nature', 'adventure', 'spiritual', 'wildlife', 'luxury']),
      catchError(() => of(['heritage', 'beach', 'nature', 'adventure', 'spiritual', 'wildlife', 'luxury']))
    );
  }

  byId(id: string): Observable<HolidayPackage | null> {
    return this.api.get<HolidayPackage>(`/holidays/${id}`).pipe(catchError(() => of(null)));
  }
}
