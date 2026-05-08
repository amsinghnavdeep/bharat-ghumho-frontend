import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel.service';
import { FavoritesService } from '../../services/favorites.service';
import { ReviewsService } from '../../services/reviews.service';
import { ToastService } from '../../services/toast.service';
import { Hotel, Review } from '../../models';
import { ReviewCardComponent } from '../../components/review-card/review-card.component';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewCardComponent],
  template: `
<section class="hot">
  <div class="w">
    <header class="hot-head">
      <small>Stay in style</small>
      <h1>Find your <em>hotel</em></h1>
      <p>From boutique heritage stays to ocean-view luxury — vetted and price-matched.</p>
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
        <label>Min stars</label>
        <select [(ngModel)]="minStars" (ngModelChange)="reload()">
          <option [ngValue]="0">All</option>
          <option [ngValue]="3">3★+</option>
          <option [ngValue]="4">4★+</option>
          <option [ngValue]="5">5★ only</option>
        </select>
      </div>
      <div class="form-group">
        <label>Max ₹{{maxPrice}}</label>
        <input type="range" min="2000" max="50000" step="500" [(ngModel)]="maxPrice" (ngModelChange)="reload()" />
      </div>
      <div class="hot-meta">{{filtered().length}} hotels</div>
    </div>

    <div class="placeholder" *ngIf="loading()">Loading…</div>
    <div class="hot-empty" *ngIf="!loading() && !filtered().length">No hotels match your filters.</div>

    <div class="hot-grid">
      <article class="hot-card" *ngFor="let h of filtered()">
        <div class="hot-cover" [style.background]="cover(h)">
          <span class="hot-stars">{{stars(h.stars)}}</span>
          <button class="heart" [class.on]="isFav(h.id)" (click)="toggleFav(h)">♥</button>
        </div>
        <div class="hot-body">
          <div class="hot-row">
            <strong>{{h.name}}</strong>
            <span class="hot-rating">★ {{h.rating | number:'1.1-1'}}</span>
          </div>
          <small class="hot-loc">📍 {{h.city_name || h.city}}<span *ngIf="h.state">, {{h.state}}</span></small>
          <p class="hot-desc">{{h.description}}</p>
          <div class="hot-amen">
            <span *ngFor="let a of (h.amenities || []).slice(0,4)">{{a}}</span>
          </div>
          <div class="hot-foot">
            <div>
              <small>Per night</small>
              <strong>{{h.currency || 'INR'}} {{(h.price ?? h.price_per_night) | number:'1.0-0'}}</strong>
            </div>
            <div class="hot-actions">
              <button class="ghost" (click)="openDetails(h)">Reviews</button>
              <button class="s-btn" (click)="book(h)">Book now</button>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Reviews modal-ish panel -->
    <div class="rev-panel" *ngIf="activeHotel()">
      <div class="rev-panel-bg" (click)="activeHotel.set(null)"></div>
      <div class="rev-panel-card">
        <header>
          <strong>{{activeHotel()!.name}}</strong>
          <button class="ghost" (click)="activeHotel.set(null)">×</button>
        </header>
        <div class="rev-panel-stat" *ngIf="averageRating() > 0">
          Average rating: <strong>{{averageRating() | number:'1.1-1'}} / 5</strong>
        </div>
        <div class="rev-panel-empty" *ngIf="!reviews().length">No reviews yet.</div>
        <div class="rev-panel-list">
          <app-review-card *ngFor="let r of reviews()" [r]="r" />
        </div>
      </div>
    </div>
  </div>
</section>`,
  styles: [`
    .hot{padding:120px 0 80px;background:#F7F8FA;min-height:100vh}
    .hot-head{margin-bottom:28px;text-align:center}
    .hot-head small{font-size:12px;color:#138808;text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
    .hot-head h1{font-size:42px;font-weight:900;letter-spacing:-2px;margin:6px 0 8px}
    .hot-head h1 em{font-style:normal;background:linear-gradient(135deg,#138808,#34D399);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hot-head p{color:#3D4A5C;font-size:15px;max-width:560px;margin:0 auto;line-height:1.7}
    .filter-bar{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:18px;display:grid;grid-template-columns:1fr 1fr 1.4fr auto;gap:14px;align-items:center;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,.05)}
    @media(max-width:760px){.filter-bar{grid-template-columns:1fr 1fr}.filter-bar .hot-meta{grid-column:1/-1;text-align:left}}
    .form-group{display:flex;flex-direction:column;gap:4px}
    .form-group label{font-size:11px;font-weight:700;color:#3D4A5C;text-transform:uppercase;letter-spacing:.5px}
    .form-group input,.form-group select{padding:10px 12px;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:500;outline:none;background:#fff}
    .form-group input[type=range]{padding:0}
    .hot-meta{font-size:12px;color:#8B95A5;font-weight:600;text-align:right}
    .placeholder,.hot-empty{padding:32px;text-align:center;color:#8B95A5;background:#fff;border:1px dashed #E5E9F0;border-radius:16px}
    .hot-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px}
    .hot-card{background:#fff;border:1px solid #E5E9F0;border-radius:18px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.05);transition:all .35s}
    .hot-card:hover{box-shadow:0 18px 40px rgba(0,0,0,.08);transform:translateY(-4px)}
    .hot-cover{position:relative;height:140px}
    .hot-stars{position:absolute;top:12px;left:12px;background:rgba(255,255,255,.95);color:#F59E0B;padding:4px 10px;border-radius:6px;font-size:13px;font-weight:700}
    .heart{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.95);border:none;color:#CDD3DC;font-size:16px;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center}
    .heart.on,.heart:hover{color:#DC2626}
    .hot-body{padding:18px;display:flex;flex-direction:column;gap:8px}
    .hot-row{display:flex;justify-content:space-between;align-items:center}
    .hot-row strong{font-size:16px;font-weight:800;letter-spacing:-.3px}
    .hot-rating{font-size:13px;font-weight:700;color:#F59E0B}
    .hot-loc{font-size:12px;color:#8B95A5;font-weight:600}
    .hot-desc{font-size:13px;color:#3D4A5C;line-height:1.6;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
    .hot-amen{display:flex;gap:6px;flex-wrap:wrap}
    .hot-amen span{font-size:10px;background:#EDFCE9;color:#138808;padding:2px 8px;border-radius:6px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .hot-foot{display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:10px;border-top:1px solid #F0F2F6;gap:8px}
    .hot-foot small{display:block;font-size:11px;color:#8B95A5;text-transform:uppercase;letter-spacing:.5px;font-weight:700}
    .hot-foot strong{font-size:18px;font-weight:900;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .hot-actions{display:flex;gap:6px}
    .ghost{padding:10px 14px;background:#fff;border:1px solid #E5E9F0;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;color:#0B1120}
    .ghost:hover{border-color:#FF6B00;color:#FF6B00}
    .s-btn{padding:10px 16px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);border:none;border-radius:10px;color:#fff;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 6px 16px rgba(255,107,0,.2)}
    .rev-panel{position:fixed;inset:0;z-index:1500;display:flex;align-items:center;justify-content:center;padding:20px}
    .rev-panel-bg{position:absolute;inset:0;background:rgba(11,17,32,.6);backdrop-filter:blur(6px)}
    .rev-panel-card{position:relative;background:#fff;border-radius:20px;padding:28px;max-width:640px;width:100%;max-height:80vh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.3)}
    .rev-panel-card header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
    .rev-panel-card header strong{font-size:18px;font-weight:800}
    .rev-panel-stat{font-size:14px;color:#3D4A5C;margin-bottom:18px;padding:10px 14px;background:#F7F8FA;border-radius:10px}
    .rev-panel-stat strong{color:#138808;font-weight:800}
    .rev-panel-empty{padding:32px;text-align:center;color:#8B95A5}
    .rev-panel-list{display:flex;flex-direction:column;gap:10px}
  `]
})
export class HotelsComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  activeHotel = signal<Hotel | null>(null);
  reviews = signal<Review[]>([]);
  averageRating = signal(0);

  city = '';
  minStars = 0;
  maxPrice = 30000;

  cities = [
    { code: 'DEL', name: 'Delhi' }, { code: 'BOM', name: 'Mumbai' }, { code: 'GOI', name: 'Goa' },
    { code: 'BLR', name: 'Bangalore' }, { code: 'COK', name: 'Kochi' }, { code: 'HYD', name: 'Hyderabad' },
    { code: 'MAA', name: 'Chennai' }, { code: 'JAI', name: 'Jaipur' }, { code: 'AGR', name: 'Agra' }
  ];

  filtered = computed(() => this.hotels().filter(h => (h.price ?? h.price_per_night ?? 0) <= this.maxPrice));

  themes = ['linear-gradient(135deg,#FF6B00,#FFB366)','linear-gradient(135deg,#138808,#34D399)','linear-gradient(135deg,#3730A3,#818CF8)','linear-gradient(135deg,#BE185D,#F472B6)','linear-gradient(135deg,#92400E,#FBBF24)'];

  constructor(
    private hs: HotelService,
    private fav: FavoritesService,
    private rs: ReviewsService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fav.list().subscribe();
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.hs.search(this.city || undefined, this.maxPrice, this.minStars || undefined).subscribe(h => {
      this.hotels.set(h);
      this.loading.set(false);
    });
  }

  cover(h: Hotel): string {
    if (h.image) return `url(${h.image}) center/cover`;
    const i = (h.id?.charCodeAt(h.id.length - 1) || 0) % this.themes.length;
    return this.themes[i];
  }

  stars(n: number): string { return '★'.repeat(Math.max(0, Math.min(5, Math.floor(n || 0)))); }

  isFav(id: string): boolean { return this.fav.has(id); }

  toggleFav(h: Hotel) {
    if (this.isFav(h.id)) {
      const fid = this.fav.favorites().find(f => f.entity_id === h.id)?.id;
      if (fid) this.fav.remove(fid).subscribe(() => this.toast.show('Removed from favorites'));
      return;
    }
    this.fav.add({ type: 'hotel', entity_id: h.id, title: h.name, metadata: { city: h.city, stars: h.stars } })
      .subscribe(r => { if (r) this.toast.show('Saved to favorites'); });
  }

  openDetails(h: Hotel) {
    this.activeHotel.set(h);
    this.reviews.set([]);
    this.averageRating.set(0);
    this.rs.list('hotel', h.id).subscribe(r => {
      this.reviews.set(r.reviews);
      this.averageRating.set(r.average_rating);
    });
  }

  book(h: Hotel) {
    this.router.navigate(['/booking', 'hotel', h.id], {
      queryParams: { title: h.name, price: h.price ?? h.price_per_night, currency: h.currency || 'INR' }
    });
  }
}
