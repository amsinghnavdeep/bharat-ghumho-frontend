import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { FavoritesService } from '../../services/favorites.service';
import { AlertsService } from '../../services/alerts.service';
import { ToastService } from '../../services/toast.service';
import { BookingCardComponent } from '../../components/booking-card/booking-card.component';
import { Booking, FareAlert, Favorite } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BookingCardComponent],
  template: `
<section class="dash">
  <div class="dash-watermarks" aria-hidden="true">
    <svg class="dash-wm dash-wm-taj" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 110 L30 80 L40 80 L40 65 L50 65 L50 50 C50 40 60 30 70 30 C75 25 80 20 85 20 L85 5 L95 5 L100 0 L105 5 L115 5 L115 20 C120 20 125 25 130 30 C140 30 150 40 150 50 L150 65 L160 65 L160 80 L170 80 L170 110 Z" fill="currentColor" opacity="0.7"/>
      <rect x="92" y="60" width="16" height="50" fill="currentColor" opacity="0.7"/>
      <circle cx="100" cy="35" r="8" fill="currentColor" opacity="0.7"/>
    </svg>
    <svg class="dash-wm dash-wm-gateway" viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 100 L20 30 L40 30 L40 20 L60 20 L60 10 L100 10 L100 20 L120 20 L120 30 L140 30 L140 100 Z" fill="currentColor" opacity="0.6"/>
      <rect x="70" y="40" width="20" height="60" fill="#0B1120" opacity="0.4" rx="10"/>
    </svg>
    <svg class="dash-wm dash-wm-qutub" viewBox="0 0 80 180" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 170 L30 150 L25 150 L25 120 L28 120 L28 90 L31 90 L31 60 L33 60 L33 30 L35 30 L35 10 L45 10 L45 30 L47 30 L47 60 L49 60 L49 90 L52 90 L52 120 L55 120 L55 150 L50 150 L50 170 Z" fill="currentColor" opacity="0.55"/>
    </svg>
  </div>
  <div class="w">
    <header class="dash-head">
      <div>
        <small>Welcome back</small>
        <h1>{{ (auth.userSignal()?.name) || 'Traveler' }} <span class="dash-namaste">🙏</span></h1>
      </div>
      <div class="dash-tabs">
        <button [class.active]="tab()==='bookings'" (click)="tab.set('bookings')">Bookings ({{bookings().length}})</button>
        <button [class.active]="tab()==='favorites'" (click)="tab.set('favorites')">Favorites ({{favorites().length}})</button>
        <button [class.active]="tab()==='alerts'" (click)="tab.set('alerts')">Fare Alerts ({{alerts().length}})</button>
        <button [class.active]="tab()==='profile'" (click)="tab.set('profile')">Profile</button>
      </div>
    </header>

    <div class="dash-grid">
      <div class="stat-card">
        <small>Trips taken</small>
        <strong>{{confirmedCount()}}</strong>
      </div>
      <div class="stat-card">
        <small>Active alerts</small>
        <strong>{{alerts().length}}</strong>
      </div>
      <div class="stat-card">
        <small>Saved items</small>
        <strong>{{favorites().length}}</strong>
      </div>
      <div class="stat-card">
        <small>Home airport</small>
        <strong>{{auth.userSignal()?.preferences?.homeAirport || 'YYZ'}}</strong>
      </div>
    </div>

    <ng-container *ngIf="tab()==='bookings'">
      <h2 class="dash-section">My Bookings</h2>
      <div class="dash-empty" *ngIf="!loading() && !bookings().length">
        <p>No bookings yet.</p>
        <a routerLink="/flights" class="s-btn">Search flights</a>
      </div>
      <div class="dash-list">
        <app-booking-card *ngFor="let b of bookings()" [booking]="b" (cancel)="onCancel($event)"></app-booking-card>
      </div>
    </ng-container>

    <ng-container *ngIf="tab()==='favorites'">
      <h2 class="dash-section">Favorites</h2>
      <div class="dash-empty" *ngIf="!favorites().length">
        <p>You haven't saved anything yet. Heart a flight, hotel or package to save it.</p>
      </div>
      <div class="fav-grid">
        <div class="fav-card" *ngFor="let f of favorites()">
          <div class="fav-row">
            <span class="fav-pill" [ngClass]="'pill-'+f.type">{{f.type}}</span>
            <button class="bk-btn danger" (click)="removeFav(f)">Remove</button>
          </div>
          <strong>{{f.title}}</strong>
          <small>{{f.created_at | date:'mediumDate'}}</small>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="tab()==='alerts'">
      <h2 class="dash-section">Fare Alerts</h2>
      <div class="dash-empty" *ngIf="!alerts().length">
        <p>No fare alerts. Open a flight result and click "Alert me" to set one up.</p>
      </div>
      <div class="alert-grid">
        <div class="alert-card" *ngFor="let a of alerts()">
          <div class="alert-row">
            <strong>{{a.frm}} → {{a.to}}</strong>
            <button class="bk-btn danger" (click)="removeAlert(a)">Remove</button>
          </div>
          <div class="alert-target">Notify when ≤ {{a.currency}} {{a.target_price}}</div>
        </div>
      </div>
    </ng-container>

    <ng-container *ngIf="tab()==='profile'">
      <h2 class="dash-section">Preferences</h2>
      <div class="prefs">
        <div class="form-group">
          <label>Default currency</label>
          <select [(ngModel)]="prefs.currency">
            <option *ngFor="let c of ['CAD','USD','GBP','EUR','AED','SGD','AUD','INR']">{{c}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Home airport</label>
          <input [(ngModel)]="prefs.homeAirport" maxlength="3" placeholder="YYZ" />
        </div>
        <div class="form-group">
          <label class="row-label">
            <input type="checkbox" [(ngModel)]="prefs.notifications" />
            Receive notifications & alerts
          </label>
        </div>
        <button class="s-btn" (click)="savePrefs()" [disabled]="savingPrefs()">{{savingPrefs() ? 'Saving…' : 'Save preferences'}}</button>
      </div>
    </ng-container>
  </div>
</section>`,
  styles: [`
    .dash{padding:120px 0 80px;background:var(--page,#F7F8FA);min-height:100vh;position:relative;overflow:hidden}
    .dash-watermarks{position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.06;color:var(--gold,#D4A843)}
    .dash-wm{position:absolute;color:currentColor}
    .dash-wm-taj{top:80px;right:5%;width:280px;height:auto}
    .dash-wm-gateway{top:50%;left:2%;width:200px;height:auto;transform:rotate(-4deg)}
    .dash-wm-qutub{bottom:60px;right:10%;width:80px;height:auto}
    .dash .w{position:relative;z-index:1}
    .dash-namaste{display:inline-block;font-size:0.7em;animation:namasteWave 3s ease-in-out infinite;transform-origin:bottom center}
    .dash-head{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:18px;margin-bottom:28px}
    .dash-head small{font-size:12px;color:var(--text-3,#8B95A5);text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
    .dash-head h1{font-size:36px;font-weight:900;letter-spacing:-1.5px;margin-top:4px;font-family:var(--font-display,'Poppins','Inter',system-ui,sans-serif);color:var(--text-1,#0B1120)}
    .dash-tabs{display:flex;gap:6px;background:var(--surface,#fff);border:1px solid var(--border,#E5E9F0);border-radius:14px;padding:4px;flex-wrap:wrap}
    .dash-tabs button{padding:10px 18px;border:none;background:none;font-size:13px;font-weight:600;color:var(--text-2,#3D4A5C);border-radius:10px;cursor:pointer;transition:all .25s}
    .dash-tabs button.active{background:linear-gradient(135deg,var(--maroon,#7A1F2B),var(--saffron,#FF6B00));color:#fff;box-shadow:0 6px 18px rgba(122,31,43,.25)}
    .dash-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px}
    .stat-card{background:var(--surface,#fff);border:1px solid var(--border,#E5E9F0);border-radius:16px;padding:18px;box-shadow:var(--shadow-sm,0 2px 8px rgba(0,0,0,.04));position:relative;overflow:hidden;transition:all .3s}
    .stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--saffron,#FF6B00),var(--gold,#D4A843),var(--green,#138808));opacity:0;transition:opacity .3s}
    .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md,0 8px 30px rgba(0,0,0,.08))}
    .stat-card:hover::before{opacity:1}
    .stat-card small{display:block;font-size:11px;color:var(--text-3,#8B95A5);text-transform:uppercase;letter-spacing:1.2px;font-weight:700;margin-bottom:6px}
    .stat-card strong{font-size:24px;font-weight:900;letter-spacing:-1px;color:var(--text-1,#0B1120)}
    .dash-section{font-size:20px;font-weight:800;margin:24px 0 14px;color:var(--text-1,#0B1120);font-family:var(--font-display,'Poppins','Inter',system-ui,sans-serif)}
    .dash-list{display:flex;flex-direction:column;gap:12px}
    .dash-empty{background:var(--surface,#fff);border:1px dashed var(--border,#E5E9F0);border-radius:16px;padding:32px;text-align:center;color:var(--text-3,#8B95A5)}
    .dash-empty p{margin-bottom:14px}
    .fav-grid,.alert-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
    .fav-card,.alert-card{background:var(--surface,#fff);border:1px solid var(--border,#E5E9F0);border-radius:16px;padding:16px;box-shadow:var(--shadow-sm,0 2px 8px rgba(0,0,0,.04))}
    .fav-row,.alert-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px}
    .fav-pill{padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;background:#FFF4EC;color:#FF6B00}
    .pill-hotel{background:#EDFCE9;color:#138808}
    .pill-flight{background:#FFF4EC;color:#FF6B00}
    .pill-car{background:#E0E7FF;color:#3730A3}
    .pill-package{background:#FCE7F3;color:#BE185D}
    .pill-destination{background:#FEF3C7;color:#B45309}
    .pill-route{background:#F3E8FF;color:#7C3AED}
    .fav-card strong{display:block;font-size:14px;font-weight:700;margin-bottom:4px}
    .fav-card small{font-size:11px;color:#8B95A5}
    .alert-target{font-size:13px;color:#3D4A5C}
    .bk-btn{padding:6px 12px;border-radius:8px;font-size:11px;font-weight:700;border:1px solid #E5E9F0;background:#fff;cursor:pointer}
    .bk-btn.danger{border-color:#FECACA;color:#DC2626;background:#FEF2F2}
    .bk-btn.danger:hover{background:#DC2626;color:#fff}
    .prefs{background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:24px;max-width:500px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .form-group{margin-bottom:16px}
    .form-group label{display:block;font-size:12px;font-weight:700;color:#3D4A5C;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}
    .form-group input[type=text],.form-group input:not([type]),.form-group select{width:100%;padding:12px 16px;border:1px solid #E5E9F0;border-radius:10px;font-size:15px;font-weight:500;color:#0B1120;outline:none;background:#fff}
    .form-group input:focus,.form-group select:focus{border-color:#FF6B00}
    .row-label{display:flex;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-size:14px;font-weight:600;color:#0B1120}
    .row-label input{width:auto;padding:0}
    .s-btn{display:inline-block;text-decoration:none;padding:14px 26px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(255,107,0,.2)}
  `]
})
export class DashboardComponent implements OnInit {
  tab = signal<'bookings' | 'favorites' | 'alerts' | 'profile'>('bookings');
  bookings = signal<Booking[]>([]);
  favorites = signal<Favorite[]>([]);
  alerts = signal<FareAlert[]>([]);
  loading = signal(true);
  savingPrefs = signal(false);

  prefs = { currency: 'CAD', homeAirport: 'YYZ', notifications: true };

  constructor(
    public auth: AuthService,
    private bookingService: BookingService,
    private favService: FavoritesService,
    private alertsService: AlertsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadAll();
    const u = this.auth.userSignal();
    if (u) this.prefs = { ...this.prefs, ...u.preferences };
  }

  loadAll() {
    this.loading.set(true);
    let pending = 3;
    const done = () => { pending--; if (pending === 0) this.loading.set(false); };
    this.bookingService.list().subscribe(b => { this.bookings.set(b); done(); });
    this.favService.list().subscribe(f => { this.favorites.set(f); done(); });
    this.alertsService.list().subscribe(a => { this.alerts.set(a); done(); });
  }

  confirmedCount(): number {
    return this.bookings().filter(b => b.status === 'confirmed').length;
  }

  onCancel(b: Booking) {
    if (!confirm(`Cancel ${b.title}?`)) return;
    this.bookingService.cancel(b.id).subscribe(ok => {
      if (ok) {
        this.toast.show('Booking cancelled');
        this.bookings.update(list => list.map(x => x.id === b.id ? { ...x, status: 'cancelled' } : x));
      } else {
        this.toast.show('Could not cancel booking');
      }
    });
  }

  removeFav(f: Favorite) {
    this.favService.remove(f.id).subscribe(ok => {
      if (ok) {
        this.favorites.update(list => list.filter(x => x.id !== f.id));
        this.toast.show('Removed from favorites');
      }
    });
  }

  removeAlert(a: FareAlert) {
    this.alertsService.remove(a.id).subscribe(ok => {
      if (ok) {
        this.alerts.update(list => list.filter(x => x.id !== a.id));
        this.toast.show('Alert removed');
      }
    });
  }

  savePrefs() {
    this.savingPrefs.set(true);
    this.auth.updatePreferences(this.prefs).subscribe(() => {
      this.savingPrefs.set(false);
      this.toast.show('Preferences saved');
    });
  }
}
