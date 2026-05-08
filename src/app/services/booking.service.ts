import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Booking, BookingCreate } from '../models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  bookings = signal<Booking[]>([]);

  constructor(private api: ApiService) {}

  list(): Observable<Booking[]> {
    return this.api.get<{ results: Booking[] } | Booking[]>('/bookings').pipe(
      map(r => Array.isArray(r) ? r : (r?.results ?? [])),
      tap(b => this.bookings.set(b)),
      catchError(() => of([]))
    );
  }

  byId(id: string): Observable<Booking | null> {
    return this.api.get<{ booking: Booking } | Booking>(`/bookings/${id}`).pipe(
      map(r => (r as { booking?: Booking })?.booking ?? (r as Booking) ?? null),
      catchError(() => of(null))
    );
  }

  create(b: BookingCreate): Observable<Booking | null> {
    return this.api.post<{ booking: Booking } | Booking>('/bookings', b).pipe(
      map(r => (r as { booking?: Booking })?.booking ?? (r as Booking) ?? null),
      tap(nb => { if (nb) this.bookings.update(list => [nb, ...list]); }),
      catchError(() => of(null))
    );
  }

  cancel(id: string): Observable<boolean> {
    return this.api.put<{ success: boolean }>(`/bookings/${id}/cancel`, {}).pipe(
      tap(() => this.bookings.update(list => list.map(x => x.id === id ? { ...x, status: 'cancelled' } : x))),
      map(r => r?.success ?? true),
      catchError(() => of(false))
    );
  }
}
