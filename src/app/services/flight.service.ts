import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Flight, PopularRoute } from '../models';

@Injectable({ providedIn: 'root' })
  export class FlightService {
    private api = '/api';
    constructor(private http: HttpClient) {}

  search(from: string, to: string, sort = 'price', page = 1, limit = 10, maxPrice?: number, stops?: number): Observable<Flight[]> {
        let p = new HttpParams().set('from', from).set('to', to).set('sort', sort)
          .set('page', String(page)).set('limit', String(limit));
        if (maxPrice) p = p.set('max_price', String(maxPrice));
        if (stops !== undefined) p = p.set('stops', String(stops));
        return this.http.get<any>(`${this.api}/flights/search`, { params: p }).pipe(
                map((r: any) => r.results || r || []),
                catchError(() => of([]))
              );
  }

  getRoutes(): Observable<PopularRoute[]> {
        return this.http.get<any[]>(`${this.api}/flights/routes`).pipe(
                map((rs: any[]) => rs.map(r => this.enrich(r))),
                catchError(() => of(this.fallbackRoutes()))
              );
  }

  multiCity(legs: {from:string;to:string;date:string}[]): Observable<any> {
        return this.http.post(`${this.api}/flights/multi-city`, { legs })
          .pipe(catchError(() => of({ results: [] })));
  }

  getAirlines(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/flights/airlines`)
                .pipe(catchError(() => of([])));
  }

  private enrich(r: any): PopularRoute {
        const flags: Record<string, string> = { 'Canada':'','USA':'','UK':'','UAE':'','Australia':'','Singapore':'' };
        const cities: Record<string, string> = {
                'Canada':'Toronto  Vancouver  Calgary','USA':'New York  San Francisco  Chicago',
                'UK':'London  Birmingham  Manchester','UAE':'Dubai  Abu Dhabi  Sharjah',
                'Australia':'Sydney  Melbourne  Perth','Singapore':'Singapore  Direct 8 cities'
        };
        const tagCls: Record<string, string> = { 'Most Popular':'tag-hot','Best Value':'tag-deal','Direct Flights':'tag-direct','Lowest Fares':'tag-hot','New Routes':'tag-new','Fastest':'tag-deal' };
        const k = Object.keys(flags).find(x => r.region?.includes(x)) || '';
        const sym = r.currency==='GBP' ? '' : r.currency==='AED' ? 'AED ' : r.currency==='AUD' ? 'A$' : '$';
        return { ...r, flag: flags[k]||'', cities: cities[k]||'', priceLabel: sym+r.price_from, airlineCount: r.airlines_count||12, tagClass: tagCls[r.tag]||'tag-deal' } as PopularRoute;
  }

  fallbackRoutes(): PopularRoute[] {
        return [
          { id:'r1',flag:'',region:'Canada Corridor',from:'Toronto',fromCode:'YYZ',to:'New Delhi',toCode:'DEL',cities:'Toronto  Vancouver  Calgary',tag:'Most Popular',tagClass:'tag-hot',priceLabel:'$680',airlineCount:12,currency:'CAD',price_from:680 },
          { id:'r2',flag:'',region:'USA Corridor',from:'New York',fromCode:'JFK',to:'Mumbai',toCode:'BOM',cities:'NYC  San Francisco  Chicago',tag:'Best Value',tagClass:'tag-deal',priceLabel:'$620',airlineCount:18,currency:'USD',price_from:620 },
          { id:'r3',flag:'',region:'UK Corridor',from:'London',fromCode:'LHR',to:'Delhi',toCode:'DEL',cities:'London  Birmingham  Manchester',tag:'Direct Flights',tagClass:'tag-direct',priceLabel:'420',airlineCount:15,currency:'GBP',price_from:420 },
          { id:'r4',flag:'',region:'UAE Corridor',from:'Dubai',fromCode:'DXB',to:'Kerala',toCode:'COK',cities:'Dubai  Abu Dhabi  Sharjah',tag:'Lowest Fares',tagClass:'tag-hot',priceLabel:'AED 660',airlineCount:20,currency:'AED',price_from:660 },
          { id:'r5',flag:'',region:'Australia Corridor',from:'Sydney',fromCode:'SYD',to:'Delhi',toCode:'DEL',cities:'Sydney  Melbourne  Perth',tag:'New Routes',tagClass:'tag-new',priceLabel:'A$750',airlineCount:10,currency:'AUD',price_from:750 },
          { id:'r6',flag:'',region:'Singapore Corridor',from:'Singapore',fromCode:'SIN',to:'Chennai',toCode:'MAA',cities:'Singapore  Direct 8 cities',tag:'Fastest',tagClass:'tag-deal',priceLabel:'$220',airlineCount:14,currency:'USD',price_from:220 }
              ] as any[];
  }
}
