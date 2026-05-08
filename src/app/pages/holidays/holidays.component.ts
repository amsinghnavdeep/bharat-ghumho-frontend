import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HolidayService } from '../../services/holiday.service';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';
import { HolidayPackage } from '../../models';

@Component({
  selector: 'app-holidays',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<section class="hol">
  <div class="w">
    <header class="hol-head">
      <small>Curated journeys</small>
      <h1>Holiday <em>packages</em></h1>
      <p>Hand-picked itineraries that show you the best of India and beyond.</p>
    </header>

    <div class="filter-bar">
      <div class="form-group">
        <label>Theme</label>
        <select [(ngModel)]="theme" (ngModelChange)="reload()">
          <option value="all">All themes</option>
          <option value="heritage">Heritage</option>
          <option value="beach">Beach</option>
          <option value="nature">Nature</option>
          <option value="adventure">Adventure</option>
          <option value="spiritual">Spiritual</option>
          <option value="wildlife">Wildlife</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      <div class="form-group">
        <label>Max \${{maxBudget}}</label>
        <input type="range" min="200" max="3000" step="50" [(ngModel)]="maxBudget" />
      </div>
      <div class="form-group">
        <label>Search</label>
        <input [(ngModel)]="search" placeholder="Goa, Taj, Houseboat..." />
      </div>
      <div class="hol-meta">{{filtered().length}} packages</div>
    </div>

    <div class="placeholder" *ngIf="loading()">Loading…</div>
    <div class="hol-empty" *ngIf="!loading() && !filtered().length">No packages match your filters. Try widening the budget.</div>

    <div class="hol-grid">
      <article class="pkg-card" *ngFor="let p of filtered()">
        <div class="pkg-cover" [style.background]="getBg(p)">
          <span class="pkg-theme">{{p.theme}}</span>
          <button class="heart" [class.on]="isFav(p.id)" (click)="toggleFav(p)">♥</button>
        </div>
        <div class="pkg-body">
          <strong class="pkg-name">{{p.name}}</strong>
          <div class="pkg-meta">
            <span>{{p.days}}D / {{p.nights}}N</span>
            <span>★ {{p.rating}}</span>
            <span>{{p.reviews_count}} reviews</span>
          </div>
          <div class="pkg-cities">{{p.cities.join(' → ')}}</div>
          <ul class="pkg-includes">
            <li *ngFor="let h of p.highlights.slice(0,3)">✓ {{h}}</li>
          </ul>
          <div class="pkg-foot">
            <div>
              <small>Per person</small>
              <strong>{{p.currency}} {{p.price_per_person}}</strong>
            </div>
            <button class="s-btn" (click)="book(p)">Book package</button>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`,
  styles: [`
    .hol{padding:120px 0 80px;background:#F7F8FA;min-height:100vh}
    .hol-head{margin-bottom:28px;text-align:center}
    .hol-head small{font-size:12px;color:#138808;text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
    .hol-head h1{font-size:42px;font-weight:900;letter-spacing:-2px;margin:6px 0 8px}
    .hol-head h1 em{font-style:normal;background:linear-gradient(135deg,#138808,#34D399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hol-head p{color:#3D4A5C;font-size:15px;max-width:560px;margin:0 auto;line-height:1.7}
    .filter-bar{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:18px;display:grid;grid-template-columns:1fr 1.4fr 1.4fr auto;gap:14px;align-items:center;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,.05)}
    @media(max-width:760px){.filter-bar{grid-template-columns:1fr 1fr}.filter-bar .hol-meta{grid-column:1/-1;text-align:left}}
    .form-group{display:flex;flex-direction:column;gap:4px}
    .form-group label{font-size:11px;font-weight:700;color:#3D4A5C;text-transform:uppercase;letter-spacing:.5px}
    .form-group input,.form-group select{padding:10px 12px;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:500;outline:none;background:#fff}
    .form-group input:focus,.form-group select:focus{border-color:#FF6B00}
    .form-group input[type=range]{padding:0}
    .hol-meta{font-size:12px;color:#8B95A5;font-weight:600;text-align:right}
    .placeholder,.hol-empty{padding:32px;text-align:center;color:#8B95A5;background:#fff;border:1px dashed #E5E9F0;border-radius:16px}
    .hol-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:18px}
    .pkg-card{background:#fff;border:1px solid #E5E9F0;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 4px 16px rgba(0,0,0,.05);transition:all .35s}
    .pkg-card:hover{box-shadow:0 24px 48px rgba(0,0,0,.1);transform:translateY(-4px)}
    .pkg-cover{position:relative;height:160px}
    .pkg-theme{position:absolute;top:14px;left:14px;background:rgba(255,255,255,.92);color:#0B1120;padding:4px 12px;border-radius:6px;font-size:11px;font-weight:700;text-transform:capitalize;backdrop-filter:blur(8px)}
    .heart{position:absolute;top:14px;right:14px;background:rgba(255,255,255,.92);border:none;color:#CDD3DC;font-size:18px;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .heart.on,.heart:hover{color:#DC2626}
    .pkg-body{padding:20px;display:flex;flex-direction:column;gap:10px;flex:1}
    .pkg-name{font-size:18px;font-weight:800;letter-spacing:-.5px}
    .pkg-meta{display:flex;gap:12px;font-size:12px;color:#3D4A5C}
    .pkg-meta span:nth-child(2){color:#F59E0B;font-weight:700}
    .pkg-meta span:last-child{color:#8B95A5}
    .pkg-cities{font-size:12px;color:#8B95A5;letter-spacing:.5px;text-transform:uppercase;font-weight:700}
    .pkg-includes{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:4px;font-size:13px;color:#3D4A5C}
    .pkg-includes li{padding-left:0}
    .pkg-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:14px;border-top:1px solid #F0F2F6}
    .pkg-foot small{display:block;font-size:11px;color:#8B95A5;text-transform:uppercase;letter-spacing:.5px;font-weight:700}
    .pkg-foot strong{font-size:24px;font-weight:900;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .s-btn{padding:12px 20px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(255,107,0,.2)}
  `]
})
export class HolidaysComponent implements OnInit {
  packages = signal<HolidayPackage[]>([]);
  loading = signal(true);

  theme: string = 'all';
  maxBudget = 2000;
  search = '';

  filtered = computed(() => {
    const q = this.search.toLowerCase().trim();
    return this.packages().filter(p => {
      if (p.price_per_person > this.maxBudget) return false;
      if (q && !(`${p.name} ${p.theme} ${p.cities.join(' ')} ${p.highlights.join(' ')}`.toLowerCase().includes(q))) return false;
      return true;
    });
  });

  themeBg: Record<string, string> = {
    heritage: 'linear-gradient(135deg,#92400E,#FBBF24)',
    beach: 'linear-gradient(135deg,#06B6D4,#FBBF24)',
    nature: 'linear-gradient(135deg,#138808,#34D399)',
    adventure: 'linear-gradient(135deg,#7C2D12,#FB923C)',
    spiritual: 'linear-gradient(135deg,#7C3AED,#FBBF24)',
    wildlife: 'linear-gradient(135deg,#166534,#4ADE80)',
    luxury: 'linear-gradient(135deg,#0B1120,#A16207)'
  };

  constructor(private hs: HolidayService, private fav: FavoritesService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.fav.list().subscribe();
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.hs.list(this.theme).subscribe(p => {
      this.packages.set(p);
      this.loading.set(false);
    });
  }

  getBg(p: HolidayPackage): string {
    return this.themeBg[p.theme] ?? 'linear-gradient(135deg,#FF6B00,#138808)';
  }

  isFav(id: string): boolean { return this.fav.has(id); }

  toggleFav(p: HolidayPackage) {
    if (this.isFav(p.id)) {
      const fid = this.fav.favorites().find(f => f.entity_id === p.id)?.id;
      if (fid) this.fav.remove(fid).subscribe(() => this.toast.show('Removed from favorites'));
      return;
    }
    this.fav.add({ type: 'package', entity_id: p.id, title: p.name, metadata: { theme: p.theme, days: p.days } })
      .subscribe(r => { if (r) this.toast.show('Saved to favorites'); });
  }

  book(p: HolidayPackage) {
    this.router.navigate(['/booking', 'package', p.id], {
      queryParams: { title: p.name, price: p.price_per_person, currency: p.currency }
    });
  }
}
