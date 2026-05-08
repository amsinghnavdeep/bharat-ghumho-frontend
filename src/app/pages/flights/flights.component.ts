import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';
import { Flight } from '../../models';
import { FareAlertModalComponent } from '../../components/fare-alert-modal/fare-alert-modal.component';
import { PriceChartComponent } from '../../components/price-chart/price-chart.component';

interface FareDay { label: string; value: number; date: string; }

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule, FareAlertModalComponent, PriceChartComponent],
  template: `
<section class="flights">
  <div class="w">
    <header class="fl-head">
      <small>Find the best fare</small>
      <h1>Search <em>flights</em></h1>
      <p>One-way, round-trip and multi-city searches across India and the diaspora corridors.</p>
    </header>

    <div class="search-bar">
      <div class="form-group">
        <label>From</label>
        <input [(ngModel)]="from" maxlength="3" placeholder="YYZ" />
      </div>
      <div class="form-group">
        <label>To</label>
        <input [(ngModel)]="to" maxlength="3" placeholder="DEL" />
      </div>
      <div class="form-group">
        <label>Stops</label>
        <select [(ngModel)]="maxStops">
          <option [ngValue]="-1">Any</option>
          <option [ngValue]="0">Direct only</option>
          <option [ngValue]="1">≤ 1 stop</option>
        </select>
      </div>
      <div class="form-group">
        <label>Cabin</label>
        <select [(ngModel)]="cabin">
          <option value="any">Any</option>
          <option value="Economy">Economy</option>
          <option value="Premium Economy">Premium Economy</option>
          <option value="Business">Business</option>
        </select>
      </div>
      <button class="s-btn" (click)="search()">Search</button>
      <button class="ghost" (click)="alertOpen.set(true)">🔔 Alert me</button>
    </div>

    <div class="fl-side" *ngIf="filtered().length">
      <app-price-chart [data]="fareDays()" title="Cheapest dates (next 7 days)" [currency]="'$'"></app-price-chart>
    </div>

    <div class="placeholder" *ngIf="loading()">Loading flights…</div>
    <div class="fl-empty" *ngIf="!loading() && !filtered().length">No flights match. Try clearing filters or different airports.</div>

    <div class="fl-list">
      <article class="fc" *ngFor="let f of filtered()">
        <div class="fc-top">
          <div class="fc-air">
            <div class="air-logo" [style.background]="f.color">{{f.code}}</div>
            <div class="fc-air-info">
              {{f.airline}}
              <small>{{f.flight}} · {{f.aircraft}}</small>
            </div>
          </div>
          <div class="fc-price">
            <strong>\${{f.price}}</strong>
            <small>per person</small>
          </div>
        </div>
        <div class="fc-mid">
          <div class="fc-t">
            <strong>{{f.depTime}}</strong>
            <span>{{f.from}}</span>
          </div>
          <div class="fc-path">
            <div class="dur">{{f.duration}}</div>
            <span class="dot s"></span>
            <span class="dot e"></span>
            <div class="stops" [ngClass]="f.stopsClass">{{f.stopsLabel}}</div>
          </div>
          <div class="fc-t">
            <strong>{{f.arrTime}}</strong>
            <span>{{f.to}} <em *ngIf="f.arrDay">{{f.arrDay}}</em></span>
          </div>
        </div>
        <div class="fc-bot">
          <button class="ghost-sm" (click)="toggleFav(f)">{{isFav(f.id) ? '♥ Saved' : '♡ Save'}}</button>
          <button class="ghost-sm" (click)="openAlert(f)">🔔 Alert</button>
          <button (click)="book(f)">Book {{f.cabin}}</button>
        </div>
      </article>
    </div>
  </div>
  <app-fare-alert-modal [open]="alertOpen()" [defaults]="alertDefaults()" (close)="alertOpen.set(false)"></app-fare-alert-modal>
</section>`,
  styles: [`
    .flights{padding:120px 0 80px;background:#F7F8FA;min-height:100vh}
    .fl-head{margin-bottom:28px;text-align:center}
    .fl-head small{font-size:12px;color:#FF6B00;text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
    .fl-head h1{font-size:42px;font-weight:900;letter-spacing:-2px;margin:6px 0 8px}
    .fl-head h1 em{font-style:normal;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .fl-head p{color:#3D4A5C;font-size:15px;max-width:560px;margin:0 auto;line-height:1.7}
    .search-bar{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:16px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr auto auto;gap:12px;align-items:end;margin-bottom:18px;box-shadow:0 4px 16px rgba(0,0,0,.05)}
    @media(max-width:760px){.search-bar{grid-template-columns:1fr 1fr}.search-bar .s-btn,.search-bar .ghost{grid-column:span 1}}
    .form-group{display:flex;flex-direction:column;gap:4px}
    .form-group label{font-size:11px;font-weight:700;color:#3D4A5C;text-transform:uppercase;letter-spacing:.5px}
    .form-group input,.form-group select{padding:10px 12px;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:500;outline:none;background:#fff}
    .form-group input:focus,.form-group select:focus{border-color:#FF6B00}
    .s-btn{padding:12px 22px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(255,107,0,.2)}
    .ghost{padding:12px 16px;background:#fff;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;color:#0B1120}
    .ghost:hover{border-color:#FF6B00;color:#FF6B00}
    .fl-side{margin-bottom:18px}
    .placeholder,.fl-empty{padding:32px;text-align:center;color:#8B95A5;background:#fff;border:1px dashed #E5E9F0;border-radius:16px}
    .fl-list{display:flex;flex-direction:column;gap:12px}
    .fc{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.04);transition:all .35s}
    .fc:hover{box-shadow:0 12px 32px rgba(0,0,0,.08);transform:translateY(-2px)}
    .fc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:12px;flex-wrap:wrap}
    .fc-air{display:flex;align-items:center;gap:12px}
    .air-logo{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#fff;flex-shrink:0}
    .fc-air-info{font-size:14px;font-weight:700}
    .fc-air-info small{display:block;font-size:11px;font-weight:400;color:#8B95A5;margin-top:2px}
    .fc-price strong{font-size:24px;font-weight:900;letter-spacing:-1px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .fc-price small{display:block;font-size:11px;color:#8B95A5;-webkit-text-fill-color:initial}
    .fc-mid{display:flex;align-items:center;gap:18px}
    .fc-t{text-align:center}
    .fc-t strong{display:block;font-size:18px;font-weight:800;letter-spacing:-.5px}
    .fc-t span{font-size:11px;color:#8B95A5}
    .fc-t em{font-style:normal;color:#FF6B00;margin-left:2px}
    .fc-path{flex:1;position:relative;height:28px;display:flex;align-items:center}
    .fc-path::before{content:'';position:absolute;top:50%;left:8px;right:8px;height:1.5px;background:linear-gradient(90deg,#FF6B00,#138808)}
    .fc-path .dot{width:8px;height:8px;border-radius:50%;position:absolute;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    .fc-path .dot.s{left:0;background:#FF6B00}.fc-path .dot.e{right:0;background:#138808}
    .fc-path .dur{position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:11px;color:#8B95A5;font-weight:600;white-space:nowrap}
    .fc-path .stops{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font-size:10px;font-weight:700;white-space:nowrap;padding:2px 8px;border-radius:4px}
    .stops.direct{color:#138808;background:#EDFCE9}
    .stops.one,.stops.one-stop{color:#FF6B00;background:#FFF4EC}
    .fc-bot{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:18px}
    .ghost-sm{padding:8px 14px;background:#fff;border:1px solid #E5E9F0;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;color:#0B1120}
    .ghost-sm:hover{border-color:#FF6B00;color:#FF6B00}
    .fc-bot button:last-child{padding:10px 24px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);color:#fff;border:none;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 4px 14px rgba(255,107,0,.2)}
  `]
})
export class FlightsComponent implements OnInit {
  flights = signal<Flight[]>([]);
  loading = signal(true);
  alertOpen = signal(false);
  alertDefaults = signal<{ from?: string; to?: string; target?: number; currency?: string } | null>(null);

  from = 'YYZ';
  to = 'DEL';
  maxStops = -1;
  cabin = 'any';

  filtered = computed(() => this.flights().filter(f => {
    if (this.maxStops >= 0 && f.stops > this.maxStops) return false;
    if (this.cabin !== 'any' && f.cabin !== this.cabin) return false;
    return true;
  }));

  fareDays = computed<FareDay[]>(() => {
    const flights = this.filtered();
    if (!flights.length) return [];
    const min = Math.min(...flights.map(f => f.price));
    const days: FareDay[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today); d.setDate(d.getDate() + i);
      const variance = Math.round(min * (0.85 + ((i * 17 + 13) % 30) / 100));
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: variance,
        date: d.toISOString().split('T')[0]
      });
    }
    return days;
  });

  constructor(
    private fs: FlightService,
    private fav: FavoritesService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fav.list().subscribe();
    this.search();
  }

  search() {
    this.loading.set(true);
    this.fs.search(this.from.toUpperCase(), this.to.toUpperCase()).subscribe({
      next: r => { this.flights.set(Array.isArray(r) ? r : []); this.loading.set(false); },
      error: () => { this.flights.set([]); this.loading.set(false); }
    });
  }

  isFav(id: string): boolean { return this.fav.has(id); }

  toggleFav(f: Flight) {
    if (this.isFav(f.id)) {
      const fid = this.fav.favorites().find(x => x.entity_id === f.id)?.id;
      if (fid) this.fav.remove(fid).subscribe(() => this.toast.show('Removed from favorites'));
      return;
    }
    this.fav.add({
      type: 'flight', entity_id: f.id, title: `${f.airline} ${f.flight}`,
      metadata: { from: f.from, to: f.to, price: f.price }
    }).subscribe(r => { if (r) this.toast.show('Saved to favorites'); });
  }

  openAlert(f: Flight) {
    this.alertDefaults.set({ from: f.from, to: f.to, target: Math.round(f.price * 0.9), currency: 'CAD' });
    this.alertOpen.set(true);
  }

  book(f: Flight) {
    this.router.navigate(['/booking', 'flight', f.id], {
      queryParams: { title: `${f.airline} ${f.from}→${f.to}`, price: f.price, currency: 'CAD' }
    });
  }
}
