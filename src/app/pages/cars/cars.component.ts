import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from '../../services/car.service';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';
import { Car } from '../../models';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<section class="cars">
  <div class="w">
    <header class="cars-head">
      <small>Wheels for every road</small>
      <h1>Find your <em>ride</em></h1>
      <p>From compact hatchbacks to chauffeur-driven SUVs across India's biggest cities.</p>
    </header>

    <div class="filter-bar">
      <div class="form-group">
        <label>City</label>
        <select [(ngModel)]="city" (ngModelChange)="reload()">
          <option value="">All cities</option>
          <option *ngFor="let c of cities" [value]="c.code">{{c.name}}</option>
        </select>
      </div>
      <div class="form-group">
        <label>Type</label>
        <select [(ngModel)]="type" (ngModelChange)="reload()">
          <option value="all">All</option>
          <option value="hatchback">Hatchback</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      <div class="form-group">
        <label>Max \${{maxPrice}}/day</label>
        <input type="range" min="20" max="200" step="5" [(ngModel)]="maxPrice" (ngModelChange)="reload()" />
      </div>
      <div class="cars-meta">{{filtered().length}} cars</div>
    </div>

    <div class="placeholder" *ngIf="loading()">Loading…</div>
    <div class="cars-empty" *ngIf="!loading() && !filtered().length">No cars match those filters.</div>

    <div class="cars-grid">
      <div class="car-card" *ngFor="let c of filtered()">
        <div class="car-row">
          <div>
            <strong>{{c.name}}</strong>
            <span class="car-pill">{{c.type}}</span>
          </div>
          <button class="heart" [class.on]="isFav(c.id)" (click)="toggleFav(c)" aria-label="Save">♥</button>
        </div>
        <div class="car-meta">
          <span>👥 {{c.seats}}</span>
          <span>{{c.transmission}}</span>
          <span>{{c.fuel}}</span>
          <span *ngIf="c.ac">AC</span>
        </div>
        <div class="car-meta city">📍 {{c.city}} · {{c.provider}}</div>
        <div class="car-foot">
          <div>
            <small>Per day</small>
            <strong>{{c.currency}} {{c.price_per_day}}</strong>
          </div>
          <button class="s-btn" (click)="book(c)">Rent now</button>
        </div>
      </div>
    </div>
  </div>
</section>`,
  styles: [`
    .cars{padding:120px 0 80px;background:#F7F8FA;min-height:100vh}
    .cars-head{margin-bottom:28px;text-align:center}
    .cars-head small{font-size:12px;color:#FF6B00;text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
    .cars-head h1{font-size:42px;font-weight:900;letter-spacing:-2px;margin:6px 0 8px}
    .cars-head h1 em{font-style:normal;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .cars-head p{color:#3D4A5C;font-size:15px;max-width:560px;margin:0 auto;line-height:1.7}
    .filter-bar{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:18px;display:grid;grid-template-columns:1fr 1fr 1.4fr auto;gap:14px;align-items:center;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,.05)}
    @media(max-width:760px){.filter-bar{grid-template-columns:1fr 1fr}.filter-bar .cars-meta{grid-column:1/-1;text-align:left}}
    .form-group{display:flex;flex-direction:column;gap:4px}
    .form-group label{font-size:11px;font-weight:700;color:#3D4A5C;text-transform:uppercase;letter-spacing:.5px}
    .form-group input,.form-group select{padding:10px 12px;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:500;outline:none;background:#fff}
    .form-group input:focus,.form-group select:focus{border-color:#FF6B00}
    .form-group input[type=range]{padding:0}
    .cars-meta{font-size:12px;color:#8B95A5;font-weight:600;text-align:right}
    .placeholder,.cars-empty{padding:32px;text-align:center;color:#8B95A5;background:#fff;border:1px dashed #E5E9F0;border-radius:16px}
    .cars-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
    .car-card{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:20px;display:flex;flex-direction:column;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,.04);transition:all .35s}
    .car-card:hover{box-shadow:0 18px 40px rgba(0,0,0,.08);transform:translateY(-4px)}
    .car-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
    .car-row strong{font-size:16px;font-weight:800;display:inline-block;margin-right:6px}
    .car-pill{display:inline-block;padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;background:#FFF4EC;color:#FF6B00}
    .heart{background:none;border:1px solid #E5E9F0;color:#CDD3DC;font-size:18px;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .heart.on,.heart:hover{color:#DC2626;border-color:#FECACA}
    .car-meta{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:#3D4A5C}
    .car-meta.city{color:#8B95A5;font-weight:600}
    .car-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:10px;border-top:1px solid #F0F2F6}
    .car-foot small{display:block;font-size:11px;color:#8B95A5;text-transform:uppercase;letter-spacing:.5px;font-weight:700}
    .car-foot strong{font-size:22px;font-weight:900;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .s-btn{padding:10px 20px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);border:none;border-radius:10px;color:#fff;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(255,107,0,.2);transition:all .25s}
    .s-btn:hover{transform:scale(1.05)}
  `]
})
export class CarsComponent implements OnInit {
  cars = signal<Car[]>([]);
  loading = signal(true);

  city = '';
  type: 'all' | 'hatchback' | 'sedan' | 'suv' | 'luxury' = 'all';
  maxPrice = 200;

  cities = [
    { code: 'DEL', name: 'Delhi' }, { code: 'BOM', name: 'Mumbai' }, { code: 'GOI', name: 'Goa' },
    { code: 'BLR', name: 'Bangalore' }, { code: 'COK', name: 'Kochi' }, { code: 'HYD', name: 'Hyderabad' },
    { code: 'MAA', name: 'Chennai' }, { code: 'JAI', name: 'Jaipur' }
  ];

  filtered = computed(() => this.cars().filter(c => c.price_per_day <= this.maxPrice));

  constructor(private cs: CarService, private fav: FavoritesService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.fav.list().subscribe();
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.cs.search(this.city || undefined, this.type, this.maxPrice).subscribe(c => {
      this.cars.set(c);
      this.loading.set(false);
    });
  }

  isFav(id: string): boolean { return this.fav.has(id); }

  toggleFav(c: Car) {
    if (this.isFav(c.id)) {
      const fid = this.fav.favorites().find(f => f.entity_id === c.id)?.id;
      if (fid) this.fav.remove(fid).subscribe(() => this.toast.show('Removed from favorites'));
      return;
    }
    this.fav.add({ type: 'car', entity_id: c.id, title: c.name, metadata: { city: c.city, type: c.type } })
      .subscribe(r => { if (r) this.toast.show('Saved to favorites'); });
  }

  book(c: Car) {
    this.router.navigate(['/booking', 'car', c.id], {
      queryParams: { title: c.name, price: c.price_per_day, currency: c.currency }
    });
  }
}
