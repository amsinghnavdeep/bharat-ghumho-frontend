import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User, AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  user$ = this.currentUser.asObservable();

  showAuthModal = signal(false);
  isSignUp = signal(false);
  showAppModal = signal(false);

  constructor(private api: ApiService) {
    if (localStorage.getItem('bg_token')) this.loadProfile();
  }

  openAuth(signUp = false) { this.isSignUp.set(signUp); this.showAuthModal.set(true); }
  closeAuth() { this.showAuthModal.set(false); }
  toggleAuth() { this.isSignUp.update(v => !v); }
  openAppModal() { this.showAppModal.set(true); }
  closeAppModal() { this.showAppModal.set(false); }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/register', { name, email, password }).pipe(
      tap(r => { if (r.token) localStorage.setItem('bg_token', r.token); if (r.user) this.currentUser.next(r.user); }),
      catchError(() => of({
        success: true, message: 'Demo', token: 'demo',
        user: { id: 'd', name, email, preferences: { currency: 'CAD', homeAirport: 'YYZ', notifications: true } }
      } as AuthResponse))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap(r => { if (r.token) localStorage.setItem('bg_token', r.token); if (r.user) this.currentUser.next(r.user); }),
      catchError(() => of({
        success: true, message: 'Demo', token: 'demo',
        user: { id: 'd', name: 'User', email, preferences: { currency: 'CAD', homeAirport: 'YYZ', notifications: true } }
      } as AuthResponse))
    );
  }

  logout() { localStorage.removeItem('bg_token'); this.currentUser.next(null); }

  private loadProfile() {
    this.api.get<{ user: User }>('/auth/me').pipe(catchError(() => of(null)))
      .subscribe(r => { if (r?.user) this.currentUser.next(r.user); });
  }
}
