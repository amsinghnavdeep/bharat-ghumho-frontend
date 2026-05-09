import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Favorite, FavoriteCreate } from '../models';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  favorites = signal<Favorite[]>([]);

  constructor(private api: ApiService) {}

  list(type?: string): Observable<Favorite[]> {
    if (typeof window !== 'undefined' && !localStorage.getItem('bg_token')) {
      this.favorites.set([]);
      return of([]);
    }
    const params: Record<string, unknown> = {};
    if (type && type !== 'all') params['type'] = type;
    return this.api.get<{ favorites?: Favorite[]; results?: Favorite[] } | Favorite[]>('/favorites', params).pipe(
      map(r => Array.isArray(r) ? r : (r?.favorites ?? r?.results ?? [])),
      tap(f => this.favorites.set(f)),
      catchError(() => of([]))
    );
  }

  add(f: FavoriteCreate): Observable<Favorite | null> {
    return this.api.post<{ favorite: Favorite } | Favorite>('/favorites', f).pipe(
      map(r => (r as { favorite?: Favorite })?.favorite ?? (r as Favorite) ?? null),
      tap(nf => { if (nf) this.favorites.update(list => [nf, ...list]); }),
      catchError(() => of(null))
    );
  }

  remove(id: string): Observable<boolean> {
    return this.api.delete<{ success: boolean }>(`/favorites/${id}`).pipe(
      tap(() => this.favorites.update(list => list.filter(x => x.id !== id))),
      map(r => r?.success ?? true),
      catchError(() => of(false))
    );
  }

  has(entityId: string): boolean {
    return this.favorites().some(f => f.entity_id === entityId);
  }
}
