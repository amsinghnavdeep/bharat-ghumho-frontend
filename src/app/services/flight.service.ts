import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Flight, PopularRoute } from '../models';

const FALLBACK_FLIGHTS: Flight[] = [
  { id:'BG-1001',airline:'Air India',code:'AI',flight:'AI 302',aircraft:'Boeing 777-300ER',color:'#E23744',from:'YYZ',to:'DEL',depTime:'21:45',arrTime:'22:05',arrDay:'+1',duration:'14h 20m',durationMin:860,stops:0,stopsLabel:'Non-stop',stopsClass:'direct',price:687,cabin:'Economy' },
  { id:'BG-1002',airline:'British Airways',code:'BA',flight:'BA 036 / BA 143',aircraft:'via London',color:'#00256C',from:'YYZ',to:'DEL',depTime:'19:30',arrTime:'23:15',arrDay:'+1',duration:'17h 45m',durationMin:1065,stops:1,stopsLabel:'1 stop LHR',stopsClass:'one',price:612,cabin:'Economy' },
  { id:'BG-1003',airline:'Emirates',code:'EK',flight:'EK 242 / EK 510',aircraft:'via Dubai',color:'#C6A962',from:'YYZ',to:'DEL',depTime:'22:15',arrTime:'03:25',arrDay:'+2',duration:'19h 10m',durationMin:1150,stops:1,stopsLabel:'1 stop DXB',stopsClass:'one',price:724,cabin:'Economy' },
  { id:'BG-1004',airline:'Air Canada',code:'AC',flight:'AC 042',aircraft:'Boeing 787-9',color:'#D81921',from:'YYZ',to:'DEL',depTime:'20:30',arrTime:'21:10',arrDay:'+1',duration:'14h 40m',durationMin:880,stops:0,stopsLabel:'Non-stop',stopsClass:'direct',price:742,cabin:'Economy' },
  { id:'BG-1005',airline:'Lufthansa',code:'LH',flight:'LH 471 / LH 760',aircraft:'via Frankfurt',color:'#05164D',from:'YYZ',to:'DEL',depTime:'17:00',arrTime:'18:30',arrDay:'+1',duration:'18h 30m',durationMin:1110,stops:1,stopsLabel:'1 stop FRA',stopsClass:'one',price:598,cabin:'Economy' }
];

const FALLBACK_ROUTES: PopularRoute[] = [
  { from:'Toronto',fromCode:'YYZ',to:'Delhi',toCode:'DEL',region:'North America',tag:'Diwali Peak',tagClass:'sf',priceFrom:589,currency:'USD' },
  { from:'Vancouver',fromCode:'YVR',to:'Mumbai',toCode:'BOM',region:'North America',tag:'Most Popular',tagClass:'gr',priceFrom:612,currency:'USD' },
  { from:'London',fromCode:'LHR',to:'Bangalore',toCode:'BLR',region:'United Kingdom',tag:'Tech Corridor',tagClass:'sf',priceFrom:342,currency:'GBP' },
  { from:'Dubai',fromCode:'DXB',to:'Kerala',toCode:'COK',region:'Middle East',tag:'Top Route',tagClass:'gr',priceFrom:890,currency:'AED' },
  { from:'Sydney',fromCode:'SYD',to:'Hyderabad',toCode:'HYD',region:'Australia',tag:'Growing Fast',tagClass:'sf',priceFrom:680,currency:'AUD' },
  { from:'Singapore',fromCode:'SIN',to:'Chennai',toCode:'MAA',region:'Southeast Asia',tag:'Quick Hop',tagClass:'gr',priceFrom:245,currency:'USD' }
];

@Injectable({ providedIn: 'root' })
export class FlightService {
  constructor(private api: ApiService) {}

  search(from: string, to: string, sort = 'price'): Observable<Flight[]> {
    return this.api.get<{ flights: Flight[] }>('/flights/search', { from, to, sort }).pipe(
      map(r => r.flights || []), catchError(() => of(FALLBACK_FLIGHTS))
    );
  }

  getRoutes(): Observable<PopularRoute[]> {
    return this.api.get<{ routes: PopularRoute[] }>('/flights/routes').pipe(
      map(r => r.routes || []), catchError(() => of(FALLBACK_ROUTES))
    );
  }

  multiCity(legs: { from: string; to: string; date?: string }[]): Observable<any> {
    return this.api.post('/flights/multi-city', { legs }).pipe(
      catchError(() => of({ legs: [], estimatedMinTotal: 0 }))
    );
  }
}
