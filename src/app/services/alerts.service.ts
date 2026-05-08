import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { FareAlert, FareAlertCreate } from '../models';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  alerts = signal<FareAlert[]>([]);

  constructor(private api: ApiService) {}

  list(): Observable<FareAlert[]> {
    return this.api.get<{ results: FareAlert[] } | FareAlert[]>('/alerts').pipe(
      map(r => Array.isArray(r) ? r : (r?.results ?? [])),
      tap(a => this.alerts.set(a)),
      catchError(() => of([]))
    );
  }

  create(a: FareAlertCreate): Observable<FareAlert | null> {
    return this.api.post<{ alert: FareAlert } | FareAlert>('/alerts', a).pipe(
      map(r => (r as { alert?: FareAlert })?.alert ?? (r as FareAlert) ?? null),
      tap(na => { if (na) this.alerts.update(list => [na, ...list]); }),
      catchError(() => of(null))
    );
  }

  remove(id: string): Observable<boolean> {
    return this.api.delete<{ success: boolean }>(`/alerts/${id}`).pipe(
      tap(() => this.alerts.update(list => list.filter(x => x.id !== id))),
      map(r => r?.success ?? true),
      catchError(() => of(false))
    );
  }
}
