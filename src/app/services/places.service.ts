import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Place } from '../models';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  constructor(private api: ApiService) {}

  forCity(city: string, limit = 10): Observable<Place[]> {
    return this.api.get<{ places: Place[] } | Place[]>(`/places/${encodeURIComponent(city)}`, { limit }).pipe(
      map(r => Array.isArray(r) ? r : (r?.places ?? [])),
      catchError(() => of([]))
    );
  }
}
