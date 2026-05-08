import { Component, Input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../services/weather.service';
import { Weather, ForecastDay } from '../../models';

@Component({
  selector: 'app-weather-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="weather-widget" *ngIf="!loading() && current() as w">
  <div class="ww-head">
    <div class="ww-city">{{w.city}}</div>
    <div class="ww-cond">{{w.condition}}</div>
  </div>
  <div class="ww-temp">{{w.temp_c | number:'1.0-0'}}<span>°C</span></div>
  <div class="ww-meta">
    <span *ngIf="w.feels_like !== undefined">Feels {{w.feels_like | number:'1.0-0'}}°</span>
    <span *ngIf="w.humidity !== undefined">{{w.humidity}}% humidity</span>
    <span *ngIf="w.wind_kph !== undefined">{{w.wind_kph | number:'1.0-0'}} km/h wind</span>
  </div>
  <div class="ww-forecast" *ngIf="forecast().length">
    <div class="ww-fc-day" *ngFor="let d of forecast()">
      <small>{{shortDay(d.date)}}</small>
      <strong>{{d.temp_max | number:'1.0-0'}}° / {{d.temp_min | number:'1.0-0'}}°</strong>
      <span>{{d.condition}}</span>
    </div>
  </div>
</div>
<div class="weather-widget loading" *ngIf="loading()">
  <div class="sk-line w60"></div>
  <div class="sk-line w40"></div>
  <div class="sk-line w80"></div>
</div>
<div class="weather-widget empty" *ngIf="!loading() && !current()">
  Weather unavailable for {{city}}.
</div>`,
  styles: [`
    .weather-widget{background:linear-gradient(135deg,#0F2C5F,#1E40AF);color:#fff;border-radius:16px;padding:20px;min-height:120px;box-shadow:0 8px 24px rgba(15,44,95,.18)}
    .weather-widget.loading,.weather-widget.empty{background:#F0F2F6;color:#3D4A5C}
    .ww-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
    .ww-city{font-size:14px;font-weight:700;letter-spacing:.3px}
    .ww-cond{font-size:12px;opacity:.85;text-transform:capitalize}
    .ww-temp{font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1}
    .ww-temp span{font-size:18px;font-weight:600;opacity:.85;margin-left:2px}
    .ww-meta{display:flex;gap:14px;flex-wrap:wrap;font-size:11px;opacity:.85;margin-top:8px}
    .ww-forecast{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:14px}
    .ww-fc-day{background:rgba(255,255,255,.08);border-radius:8px;padding:8px;text-align:center;display:flex;flex-direction:column;gap:2px}
    .ww-fc-day small{font-size:10px;opacity:.75}
    .ww-fc-day strong{font-size:12px;font-weight:700}
    .ww-fc-day span{font-size:10px;opacity:.7;text-transform:capitalize}
    .sk-line{height:14px;border-radius:6px;background:linear-gradient(90deg,#E5E9F0 25%,#CDD3DC 50%,#E5E9F0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;margin-bottom:10px}
    .sk-line.w60{width:60%}.sk-line.w40{width:40%}.sk-line.w80{width:80%}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  `]
})
export class WeatherWidgetComponent implements OnChanges {
  @Input() city = 'Delhi';
  @Input() showForecast = false;
  current = signal<Weather | null>(null);
  forecast = signal<ForecastDay[]>([]);
  loading = signal(true);

  constructor(private ws: WeatherService) {}

  ngOnChanges(c: SimpleChanges): void {
    if (c['city']) this.load();
  }

  load() {
    this.loading.set(true);
    this.ws.current(this.city).subscribe(w => {
      this.current.set(w);
      if (this.showForecast) {
        this.ws.forecast(this.city).subscribe(f => {
          this.forecast.set((f || []).slice(0, 5));
          this.loading.set(false);
        });
      } else {
        this.loading.set(false);
      }
    });
  }

  shortDay(iso: string): string {
    try { return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' }); } catch { return iso; }
  }
}
