import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  user$ = this.currentUser.asObservable();
  userSignal = signal<User | null>(null);

  showAuthModal = signal(false);
  isSignUp = signal(false);
  showAppModal = signal(false);

  isAuthenticated = computed(() => this.userSignal() !== null);

  constructor(private api: ApiService) {
    if (typeof window !== 'undefined' && localStorage.getItem('bg_token')) {
      const cached = localStorage.getItem('bg_user');
      if (cached) {
        try { this.setUser(JSON.parse(cached) as User); } catch { /* ignore corrupt cache */ }
      }
      this.loadProfile();
    }
  }

  openAuth(signUp = false) { this.isSignUp.set(signUp); this.showAuthModal.set(true); }
  closeAuth() { this.showAuthModal.set(false); }
  toggleAuth() { this.isSignUp.update(v => !v); }
  openAppModal() { this.showAppModal.set(true); }
  closeAppModal() { this.showAppModal.set(false); }

  private setUser(u: User | null) {
    this.currentUser.next(u);
    this.userSignal.set(u);
    if (typeof window !== 'undefined') {
      if (u) localStorage.setItem('bg_user', JSON.stringify(u));
      else localStorage.removeItem('bg_user');
    }
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', { name, email, password }).pipe(
      tap(r => { if (r.token) localStorage.setItem('bg_token', r.token); if (r.user) this.setUser(r.user); }),
      catchError(() => of({
        success: true, message: 'Demo', token: 'demo',
        user: { id: 'd', name, email, preferences: { currency: 'CAD', homeAirport: 'YYZ', notifications: true } }
      } as AuthResponse))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(r => { if (r.token) localStorage.setItem('bg_token', r.token); if (r.user) this.setUser(r.user); }),
      catchError(() => of({
        success: true, message: 'Demo', token: 'demo',
        user: { id: 'd', name: 'User', email, preferences: { currency: 'CAD', homeAirport: 'YYZ', notifications: true } }
      } as AuthResponse))
    );
  }

  logout() { localStorage.removeItem('bg_token'); this.setUser(null); }

  updatePreferences(prefs: Partial<User['preferences']>): Observable<User | null> {
    return this.api.put<{ user: User }>('/auth/preferences', prefs).pipe(
      tap(r => { if (r?.user) this.setUser(r.user); }),
      tap(() => {
        const u = this.userSignal();
        if (u) this.setUser({ ...u, preferences: { ...u.preferences, ...prefs } });
      }),
      catchError(() => {
        const u = this.userSignal();
        if (u) {
          const updated = { ...u, preferences: { ...u.preferences, ...prefs } };
          this.setUser(updated);
          return of(updated);
        }
        return of(null);
      })
    ) as Observable<User | null>;
  }

  private loadProfile() {
    this.api.get<{ user: User }>('/auth/me').pipe(catchError(() => of(null)))
      .subscribe(r => { if (r?.user) this.setUser(r.user); });
  }
}
