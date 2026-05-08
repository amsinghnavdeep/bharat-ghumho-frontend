import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Review } from '../models';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private api: ApiService) {}

  list(entityType: string, entityId: string): Observable<{ reviews: Review[]; average_rating: number }> {
    return this.api.get<{ reviews: Review[]; average_rating: number }>(`/reviews/${entityType}/${entityId}`).pipe(
      map(r => ({ reviews: r?.reviews ?? [], average_rating: r?.average_rating ?? 0 })),
      catchError(() => of({ reviews: [], average_rating: 0 }))
    );
  }

  create(r: { entity_type: string; entity_id: string; rating: number; title?: string; body?: string }): Observable<Review | null> {
    return this.api.post<{ review: Review } | Review>('/reviews', r).pipe(
      map(res => (res as { review?: Review })?.review ?? (res as Review) ?? null),
      catchError(() => of(null))
    );
  }

  remove(id: string): Observable<boolean> {
    return this.api.delete<{ success: boolean }>(`/reviews/${id}`).pipe(
      map(r => r?.success ?? true),
      catchError(() => of(false))
    );
  }
}
