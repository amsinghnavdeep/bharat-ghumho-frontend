import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WeatherWidgetComponent } from '../weather-widget/weather-widget.component';

export interface DestinationCardData {
  code: string;
  name: string;
  country?: string;
  image?: string;
  fromPrice?: number;
  currency?: string;
  tagline?: string;
}

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [CommonModule, RouterLink, WeatherWidgetComponent],
  template: `
<a class="dest-card" [routerLink]="['/destination', d.code]">
  <div class="dest-cover" [style.background-image]="bg">
    <div class="dest-cover-overlay"></div>
    <div class="dest-cover-tag" *ngIf="d.tagline">{{d.tagline}}</div>
  </div>
  <div class="dest-body">
    <div class="dest-row">
      <div>
        <strong>{{d.name}}</strong>
        <span class="dest-country" *ngIf="d.country">{{d.country}}</span>
      </div>
      <div class="dest-price" *ngIf="d.fromPrice">
        <small>From</small>
        <strong>{{d.currency || 'C$'}}{{d.fromPrice}}</strong>
      </div>
    </div>
    <app-weather-widget *ngIf="showWeather" [city]="d.name" />
  </div>
</a>`,
  styles: [`
    .dest-card{display:block;background:#fff;border:1px solid #E5E9F0;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04);transition:all .35s;text-decoration:none;color:inherit}
    .dest-card:hover{box-shadow:0 18px 40px rgba(0,0,0,.1);transform:translateY(-4px)}
    .dest-cover{position:relative;height:140px;background-size:cover;background-position:center;background-color:linear-gradient(135deg,#FF6B00,#138808)}
    .dest-cover-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.45));pointer-events:none}
    .dest-cover-tag{position:absolute;top:10px;left:10px;background:rgba(255,107,0,.9);color:#fff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .dest-body{padding:14px}
    .dest-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
    .dest-row strong{font-size:16px;font-weight:800;display:block}
    .dest-country{font-size:12px;color:#8B95A5;display:block}
    .dest-price{text-align:right}
    .dest-price small{display:block;font-size:10px;color:#8B95A5;text-transform:uppercase;letter-spacing:.5px}
    .dest-price strong{font-size:18px;font-weight:900;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  `]
})
export class DestinationCardComponent {
  @Input() d!: DestinationCardData;
  @Input() showWeather = false;
  get bg() { return this.d.image ? `url(${this.d.image})` : 'linear-gradient(135deg,#FF6B00,#138808)'; }
}
