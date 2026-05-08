import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CurrencyConversion } from '../models';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  popular = ['CAD', 'USD', 'GBP', 'EUR', 'AED', 'AUD', 'SGD', 'INR'];

  constructor(private api: ApiService) {}

  convert(from: string, to: string, amount: number): Observable<CurrencyConversion | null> {
    return this.api.get<CurrencyConversion>('/currency/convert', { from, to, amount }).pipe(
      catchError(() => of(null))
    );
  }

  rates(base = 'USD'): Observable<{ base: string; rates: Record<string, number> } | null> {
    return this.api.get<{ base: string; rates: Record<string, number> }>('/currency/rates', { base }).pipe(
      catchError(() => of(null))
    );
  }
}
