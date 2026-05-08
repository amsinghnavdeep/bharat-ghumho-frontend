import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { PlacesService } from '../../services/places.service';
import { HotelService } from '../../services/hotel.service';
import { VisaService } from '../../services/visa.service';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { CurrencyConverterComponent } from '../../components/currency-converter/currency-converter.component';
import { Hotel, Place, VisaInfo } from '../../models';

const CITY_LOOKUP: Record<string, { name: string; country: string; visaCode?: string }> = {
  DEL: { name: 'New Delhi', country: 'India' },
  BOM: { name: 'Mumbai', country: 'India' },
  GOI: { name: 'Goa', country: 'India' },
  BLR: { name: 'Bangalore', country: 'India' },
  COK: { name: 'Kochi', country: 'India' },
  HYD: { name: 'Hyderabad', country: 'India' },
  MAA: { name: 'Chennai', country: 'India' },
  AGR: { name: 'Agra', country: 'India' },
  JAI: { name: 'Jaipur', country: 'India' },
  DXB: { name: 'Dubai', country: 'UAE', visaCode: 'AE' },
  YYZ: { name: 'Toronto', country: 'Canada', visaCode: 'CA' },
  LHR: { name: 'London', country: 'UK', visaCode: 'GB' },
  JFK: { name: 'New York', country: 'USA', visaCode: 'US' },
  SIN: { name: 'Singapore', country: 'Singapore', visaCode: 'SG' },
  SYD: { name: 'Sydney', country: 'Australia', visaCode: 'AU' }
};

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, WeatherWidgetComponent, CurrencyConverterComponent],
  template: `
<section class="dest">
  <div class="dest-hero" [style.background]="heroBg">
    <div class="dest-hero-overlay"></div>
    <div class="w">
      <a routerLink="/" class="dest-back">← Home</a>
      <h1>{{name}}</h1>
      <p>{{country}}</p>
    </div>
  </div>
  <div class="w dest-grid">
    <div class="dest-main">
      <h2>Top attractions</h2>
      <div class="placeholder" *ngIf="loadingPlaces() && !places().length">Loading…</div>
      <div class="dest-empty" *ngIf="!loadingPlaces() && !places().length">No attractions data available.</div>
      <div class="places-grid">
        <div class="place-card" *ngFor="let p of places()">
          <strong>{{p.name}}</strong>
          <small *ngIf="p.kinds">{{p.kinds}}</small>
          <span class="place-rating" *ngIf="p.rating">★ {{p.rating | number:'1.1-1'}}</span>
        </div>
      </div>

      <h2>Hotels in {{name}}</h2>
      <div class="placeholder" *ngIf="loadingHotels() && !hotels().length">Loading…</div>
      <div class="dest-empty" *ngIf="!loadingHotels() && !hotels().length">No hotels found.</div>
      <div class="hotel-grid">
        <div class="hotel-card" *ngFor="let h of hotels()">
          <div class="hotel-row">
            <strong>{{h.name}}</strong>
            <span class="hotel-stars">{{stars(h.stars)}}</span>
          </div>
          <small>{{h.description}}</small>
          <div class="hotel-row">
            <div class="hotel-amenities">
              <span *ngFor="let a of (h.amenities || []).slice(0,3)">{{a}}</span>
            </div>
            <strong class="hotel-price">{{h.currency || 'INR'}} {{(h.price ?? h.price_per_night) | number:'1.0-0'}}<small>/night</small></strong>
          </div>
        </div>
      </div>
    </div>

    <aside class="dest-side">
      <app-weather-widget [city]="name" [showForecast]="true" />
      <app-currency-converter />
      <div class="visa-card" *ngIf="visa() as v">
        <h3>Visa for {{country}}</h3>
        <div class="visa-row"><span>Required</span><strong>{{v.visa_required ? 'Yes' : 'No'}}</strong></div>
        <div class="visa-row"><span>Type</span><strong>{{v.type}}</strong></div>
        <div class="visa-row"><span>Processing</span><strong>{{v.processing_days}} days</strong></div>
        <div class="visa-row"><span>Fee</span><strong>{{v.currency}} {{v.fee}}</strong></div>
        <div class="visa-row"><span>e-Visa</span><strong>{{v.e_visa ? 'Available' : 'Not available'}}</strong></div>
      </div>
    </aside>
  </div>
</section>`,
  styles: [`
    .dest{padding-top:0;background:#F7F8FA;min-height:100vh;padding-bottom:60px}
    .dest-hero{position:relative;padding:140px 0 60px;color:#fff}
    .dest-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,17,32,.4),rgba(11,17,32,.7));pointer-events:none}
    .dest-hero .w{position:relative}
    .dest-back{color:rgba(255,255,255,.85);font-size:13px;font-weight:600;text-decoration:none;display:inline-block;margin-bottom:18px}
    .dest-hero h1{font-size:48px;font-weight:900;letter-spacing:-2px;color:#fff;margin-bottom:6px}
    .dest-hero p{font-size:16px;color:rgba(255,255,255,.85);font-weight:600}
    .dest-grid{display:grid;grid-template-columns:1fr 320px;gap:24px;margin-top:32px}
    @media(max-width:900px){.dest-grid{grid-template-columns:1fr}}
    .dest-main h2{font-size:20px;font-weight:800;margin:24px 0 14px;letter-spacing:-.5px}
    .dest-main h2:first-child{margin-top:0}
    .dest-side{display:flex;flex-direction:column;gap:14px}
    .placeholder,.dest-empty{padding:18px;text-align:center;color:#8B95A5;background:#fff;border:1px dashed #E5E9F0;border-radius:14px}
    .places-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:8px}
    .place-card{background:#fff;border:1px solid #E5E9F0;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:4px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .place-card strong{font-size:14px;font-weight:700}
    .place-card small{font-size:11px;color:#8B95A5;text-transform:capitalize}
    .place-rating{font-size:12px;color:#F59E0B;font-weight:700}
    .hotel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
    .hotel-card{background:#fff;border:1px solid #E5E9F0;border-radius:14px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .hotel-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px}
    .hotel-card small{font-size:12px;color:#8B95A5;display:block;margin-bottom:8px}
    .hotel-stars{color:#F59E0B;font-size:13px}
    .hotel-amenities{display:flex;gap:6px;flex-wrap:wrap}
    .hotel-amenities span{font-size:10px;background:#F0F2F6;color:#3D4A5C;padding:2px 8px;border-radius:5px;font-weight:600}
    .hotel-price{font-size:18px;font-weight:900;color:#FF6B00}
    .hotel-price small{font-size:11px;color:#8B95A5;font-weight:500}
    .visa-card{background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .visa-card h3{font-size:13px;font-weight:800;margin-bottom:12px;text-transform:uppercase;letter-spacing:1.2px;color:#8B95A5}
    .visa-row{display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid #F0F2F6}
    .visa-row:last-child{border-bottom:none}
    .visa-row strong{font-weight:800;color:#0B1120}
  `]
})
export class DestinationComponent implements OnInit {
  code = 'DEL';
  name = 'New Delhi';
  country = 'India';
  heroBg = 'linear-gradient(135deg,#0F2C5F 0%,#FF6B00 100%)';

  hotels = signal<Hotel[]>([]);
  places = signal<Place[]>([]);
  visa = signal<VisaInfo | null>(null);
  loadingHotels = signal(true);
  loadingPlaces = signal(true);

  constructor(
    private route: ActivatedRoute,
    private weather: WeatherService,
    private placesService: PlacesService,
    private hotelService: HotelService,
    private visaService: VisaService
  ) {
    this.weather = weather;
  }

  ngOnInit(): void {
    this.code = (this.route.snapshot.paramMap.get('code') || 'DEL').toUpperCase();
    const meta = CITY_LOOKUP[this.code] ?? { name: this.code, country: '' };
    this.name = meta.name;
    this.country = meta.country;
    this.placesService.forCity(this.name).subscribe(p => { this.places.set(p); this.loadingPlaces.set(false); });
    this.hotelService.byCity(this.code).subscribe(h => { this.hotels.set(h); this.loadingHotels.set(false); });
    if (meta.visaCode) {
      this.visaService.requirements('IN', meta.visaCode).subscribe(v => this.visa.set(v));
    }
  }

  stars(n: number): string {
    return '★'.repeat(Math.max(0, Math.min(5, Math.floor(n || 0))));
  }
}
