import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { VisaInfo, VisaCountry } from '../models';

@Injectable({ providedIn: 'root' })
export class VisaService {
  constructor(private api: ApiService) {}

  requirements(passport: string, destination: string): Observable<VisaInfo | null> {
    return this.api.get<{ visa: VisaInfo } | VisaInfo>('/visa', { passport, destination }).pipe(
      map(r => (r as { visa?: VisaInfo })?.visa ?? (r as VisaInfo) ?? null),
      catchError(() => of(null))
    );
  }

  countries(): Observable<VisaCountry[]> {
    return this.api.get<{ countries: VisaCountry[] }>('/visa/countries').pipe(
      map(r => r?.countries ?? []),
      catchError(() => of([]))
    );
  }
}
