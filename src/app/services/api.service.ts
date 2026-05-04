import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const t = localStorage.getItem('bg_token');
    let h = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (t) h = h.set('Authorization', 'Bearer ' + t);
    return h;
  }

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k] !== undefined) p = p.set(k, params[k]); });
    return this.http.get<T>(this.base + path, { headers: this.headers(), params: p });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.base + path, body, { headers: this.headers() });
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.base + path, body, { headers: this.headers() });
  }
}
