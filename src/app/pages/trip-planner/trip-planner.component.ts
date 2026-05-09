import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast.service';

interface TripStop {
  id: number;
  city: string;
  arrive: string;
  depart: string;
  notes: string;
}

interface TripTemplate {
  name: string;
  emoji: string;
  tagline: string;
  duration: string;
  stops: { city: string; nights: number; notes: string }[];
}

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<section class="tp">
  <div class="w">
    <header class="tp-head sr">
      <small>Multi-stop itinerary</small>
      <h1>Trip Planner <span class="tp-emoji">🗺</span></h1>
      <p>Build a multi-destination journey across Indian and global cities. Pick a curated template or start from scratch &mdash; weather, currency and visa details will populate automatically when you save.</p>
    </header>

    <div class="tp-templates sr">
      <div class="tp-tpl-head">
        <strong>Curated journeys</strong>
        <span>One click to load</span>
      </div>
      <div class="tp-tpl-grid">
        <button class="tp-tpl" *ngFor="let t of templates" (click)="loadTemplate(t)">
          <span class="tp-tpl-emoji">{{t.emoji}}</span>
          <strong>{{t.name}}</strong>
          <small>{{t.stops.length}} stops &middot; {{t.duration}}</small>
          <em>{{t.tagline}}</em>
        </button>
      </div>
    </div>

    <div class="tp-stops">
      <div class="tp-stop sr" *ngFor="let s of stops(); let i = index">
        <div class="tp-num">{{i + 1}}</div>
        <div class="tp-grid">
          <div class="form-group">
            <label>City / IATA</label>
            <input [(ngModel)]="s.city" placeholder="Delhi or DEL" />
          </div>
          <div class="form-group">
            <label>Arrive</label>
            <input type="date" [(ngModel)]="s.arrive" />
          </div>
          <div class="form-group">
            <label>Depart</label>
            <input type="date" [(ngModel)]="s.depart" />
          </div>
          <div class="form-group full">
            <label>Notes</label>
            <input [(ngModel)]="s.notes" placeholder="e.g. Taj Mahal at sunrise" />
          </div>
        </div>
        <small class="tp-night-count" *ngIf="stayLength(s) as n">{{n}}</small>
        <button class="ghost" (click)="remove(i)" *ngIf="stops().length > 1" aria-label="Remove stop">×</button>
      </div>
    </div>

    <div class="tp-suggestions sr" *ngIf="suggestions.length">
      <strong>Want to add another stop?</strong>
      <div class="tp-sug-row">
        <button *ngFor="let sug of suggestions" class="tp-sug" (click)="addSuggestion(sug)">+ {{sug}}</button>
      </div>
    </div>

    <div class="tp-actions">
      <button class="ghost" (click)="addStop()">+ Add stop</button>
      <button class="ghost" (click)="reset()">Reset</button>
      <button class="s-btn" (click)="save()">Save itinerary</button>
      <a class="ghost" routerLink="/destination/DEL">Browse destinations</a>
    </div>

    <div class="tp-summary" *ngIf="stops().length">
      <div><small>Stops</small><strong>{{stops().length}}</strong></div>
      <div><small>Total days</small><strong>{{totalDays() || '—'}}</strong></div>
      <div><small>First stop</small><strong>{{firstStop()}}</strong></div>
      <div><small>Last stop</small><strong>{{lastStop()}}</strong></div>
      <div><small>Indian cities</small><strong>{{indianCount()}}</strong></div>
    </div>
  </div>
</section>`,
  styles: [`
    .tp{padding:120px 0 80px;background:#F7F8FA;min-height:100vh}
    .tp-head{margin-bottom:28px}
    .tp-head small{font-size:12px;color:#FF6B00;text-transform:uppercase;letter-spacing:1.2px;font-weight:700}
    .tp-head h1{font-size:36px;font-weight:900;letter-spacing:-1.5px;margin:6px 0 8px}
    .tp-head p{font-size:14px;color:#3D4A5C;max-width:560px;line-height:1.7}
    .tp-stops{display:flex;flex-direction:column;gap:14px;margin-bottom:18px}
    .tp-stop{background:#fff;border:1px solid #E5E9F0;border-radius:18px;padding:18px;display:flex;align-items:center;gap:14px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .tp-num{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF6B00,#FF8A3D);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;flex-shrink:0}
    .tp-grid{flex:1;display:grid;grid-template-columns:1.2fr 1fr 1fr 1.5fr;gap:12px}
    @media(max-width:760px){.tp-grid{grid-template-columns:1fr 1fr}.tp-grid .full{grid-column:1 / -1}}
    .form-group{display:flex;flex-direction:column;gap:4px}
    .form-group label{font-size:11px;color:#8B95A5;text-transform:uppercase;letter-spacing:.5px;font-weight:700}
    .form-group input{padding:10px 12px;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:500;outline:none}
    .form-group input:focus{border-color:#FF6B00}
    .ghost{padding:10px 16px;background:#fff;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:600;color:#0B1120;cursor:pointer;text-decoration:none}
    .ghost:hover{border-color:#FF6B00;color:#FF6B00}
    .tp-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
    .s-btn{padding:14px 22px;background:linear-gradient(135deg,#FF6B00,#FF8A3D);border:none;border-radius:10px;color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(255,107,0,.2)}
    .tp-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
    .tp-summary div{background:var(--surface,#fff);border:1px solid var(--border,#E5E9F0);border-radius:14px;padding:16px;text-align:center}
    .tp-summary small{display:block;font-size:11px;color:var(--text-3,#8B95A5);text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:4px}
    .tp-summary strong{font-size:18px;font-weight:900;color:var(--text-1,#0B1120)}
    .tp-emoji{display:inline-block;margin-left:8px;font-size:0.8em}
    .tp-templates{background:var(--surface,#fff);border:1px solid var(--border,#E5E9F0);border-radius:18px;padding:18px;margin-bottom:18px;position:relative}
    .tp-tpl-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}
    .tp-tpl-head strong{font-size:14px;font-weight:800;color:var(--text-1,#0B1120)}
    .tp-tpl-head span{font-size:11px;color:var(--text-3,#8B95A5);text-transform:uppercase;letter-spacing:.7px;font-weight:700}
    .tp-tpl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
    .tp-tpl{background:linear-gradient(180deg,var(--ivory,#FFFDF8),var(--cream,#FFF7E8));border:1px solid var(--border,#E5E9F0);border-radius:14px;padding:14px;text-align:left;cursor:pointer;transition:all .25s;display:flex;flex-direction:column;gap:4px}
    .tp-tpl:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(212,168,67,.18);border-color:var(--gold,#D4A843)}
    .tp-tpl-emoji{font-size:24px}
    .tp-tpl strong{font-size:14px;font-weight:800;color:var(--text-1,#0B1120)}
    .tp-tpl small{font-size:11px;color:var(--text-3,#8B95A5);text-transform:uppercase;letter-spacing:.5px;font-weight:700}
    .tp-tpl em{font-size:12px;color:var(--text-2,#3D4A5C);font-style:normal;line-height:1.5}
    .tp-suggestions{background:var(--surface,#fff);border:1px solid var(--border,#E5E9F0);border-radius:14px;padding:14px;margin-bottom:18px}
    .tp-suggestions strong{display:block;font-size:13px;font-weight:700;color:var(--text-1,#0B1120);margin-bottom:8px}
    .tp-sug-row{display:flex;flex-wrap:wrap;gap:6px}
    .tp-sug{padding:8px 12px;background:var(--gold-light,#FBF3DC);color:var(--maroon,#7A1F2B);border:1px solid var(--gold,#D4A843);border-radius:100px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}
    .tp-sug:hover{background:var(--gold,#D4A843);color:#fff;transform:translateY(-1px)}
    .tp-night-count{position:absolute;right:46px;top:14px;font-size:11px;color:var(--gold-h,#B98E2A);background:var(--gold-light,#FBF3DC);border-radius:100px;padding:4px 10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase}
    .tp-stop{position:relative}
  `]
})
export class TripPlannerComponent {
  stops = signal<TripStop[]>([
    { id: 1, city: 'Toronto (YYZ)', arrive: '', depart: '', notes: 'Departure' },
    { id: 2, city: 'Delhi (DEL)', arrive: '', depart: '', notes: 'Golden Triangle start' },
    { id: 3, city: 'Goa (GOI)', arrive: '', depart: '', notes: 'Beaches' }
  ]);

  templates: TripTemplate[] = [
    { name: 'Golden Triangle', emoji: '🛕', tagline: 'Delhi → Agra → Jaipur classic loop', duration: '7 nights', stops: [
      { city: 'Delhi (DEL)', nights: 2, notes: 'Old Delhi food walk + Qutub Minar' },
      { city: 'Agra (AGR)', nights: 2, notes: 'Taj Mahal sunrise + Agra Fort' },
      { city: 'Jaipur (JAI)', nights: 3, notes: 'Amber Fort + Hawa Mahal + bazaars' }
    ]},
    { name: 'Kerala Backwaters', emoji: '🌴', tagline: 'Cochin → Munnar → Alleppey', duration: '6 nights', stops: [
      { city: 'Kochi (COK)', nights: 2, notes: 'Fort Kochi + Chinese fishing nets' },
      { city: 'Munnar', nights: 2, notes: 'Tea estates + Eravikulam park' },
      { city: 'Alleppey (Alappuzha)', nights: 2, notes: 'Houseboat in backwaters' }
    ]},
    { name: 'Beaches & Forts', emoji: '🏖', tagline: 'Goa party + Mumbai food trail', duration: '7 nights', stops: [
      { city: 'Goa (GOI)', nights: 4, notes: 'North + South beaches' },
      { city: 'Mumbai (BOM)', nights: 3, notes: 'Gateway, Marine Drive, Bandra' }
    ]},
    { name: 'Mountains & Monasteries', emoji: '🏔', tagline: 'Himachal + Ladakh circuit', duration: '9 nights', stops: [
      { city: 'Delhi (DEL)', nights: 1, notes: 'Quick hop' },
      { city: 'Manali', nights: 3, notes: 'Solang valley + cafes' },
      { city: 'Leh (IXL)', nights: 4, notes: 'Pangong Lake + Nubra' },
      { city: 'Delhi (DEL)', nights: 1, notes: 'Return' }
    ]},
    { name: 'Wedding Express', emoji: '💍', tagline: 'Family circuit for big-fat-wedding season', duration: '8 nights', stops: [
      { city: 'Toronto (YYZ)', nights: 0, notes: 'Origin' },
      { city: 'Delhi (DEL)', nights: 3, notes: 'Sangeet + Mehndi' },
      { city: 'Udaipur (UDR)', nights: 3, notes: 'Wedding venue + lake palace' },
      { city: 'Mumbai (BOM)', nights: 2, notes: 'Reception + brunch' }
    ]}
  ];

  suggestions = ['Goa (GOI)', 'Jaipur (JAI)', 'Bengaluru (BLR)', 'Hyderabad (HYD)', 'Kolkata (CCU)', 'Chennai (MAA)', 'Varanasi (VNS)', 'Amritsar (ATQ)', 'Udaipur (UDR)'];

  constructor(private toast: ToastService) {}

  addStop() {
    const next = (this.stops().at(-1)?.id ?? 0) + 1;
    this.stops.update(list => [...list, { id: next, city: '', arrive: '', depart: '', notes: '' }]);
  }

  remove(i: number) {
    this.stops.update(list => list.filter((_, idx) => idx !== i));
  }

  reset() {
    this.stops.set([{ id: 1, city: '', arrive: '', depart: '', notes: '' }]);
    this.toast.info('Itinerary reset');
  }

  loadTemplate(t: TripTemplate) {
    let id = 1;
    let cursor = new Date();
    cursor.setDate(cursor.getDate() + 14);
    const list: TripStop[] = t.stops.map(s => {
      const arrive = new Date(cursor).toISOString().split('T')[0];
      cursor.setDate(cursor.getDate() + Math.max(s.nights, 1));
      const depart = new Date(cursor).toISOString().split('T')[0];
      return { id: id++, city: s.city, arrive, depart, notes: s.notes };
    });
    this.stops.set(list);
    this.toast.success(`Loaded "${t.name}" (${t.stops.length} stops)`);
  }

  addSuggestion(city: string) {
    const next = (this.stops().at(-1)?.id ?? 0) + 1;
    this.stops.update(list => [...list, { id: next, city, arrive: '', depart: '', notes: '' }]);
    this.toast.info(`Added ${city}`);
  }

  stayLength(s: TripStop): string | null {
    if (!s.arrive || !s.depart) return null;
    const a = new Date(s.arrive).getTime();
    const d = new Date(s.depart).getTime();
    if (isNaN(a) || isNaN(d) || d <= a) return null;
    const nights = Math.round((d - a) / 86400000);
    return `${nights} night${nights === 1 ? '' : 's'}`;
  }

  totalDays(): number {
    return this.stops().reduce((acc, s) => {
      if (s.arrive && s.depart) {
        const a = new Date(s.arrive).getTime();
        const d = new Date(s.depart).getTime();
        if (!isNaN(a) && !isNaN(d) && d > a) acc += Math.round((d - a) / 86400000);
      }
      return acc;
    }, 0);
  }

  indianCount(): number {
    const indianHints = [' (DEL)',' (BOM)',' (BLR)',' (MAA)',' (HYD)',' (CCU)',' (GOI)',' (JAI)',' (AGR)',' (COK)',' (TRV)',' (IXC)',' (PNQ)',' (AMD)',' (LKO)',' (UDR)',' (VNS)',' (ATQ)',' (IXL)','Munnar','Manali','Alleppey'];
    return this.stops().filter(s => indianHints.some(h => s.city.includes(h))).length;
  }

  firstStop(): string { return this.stops()[0]?.city || '—'; }
  lastStop(): string { return this.stops().at(-1)?.city || '—'; }

  save() {
    const filled = this.stops().filter(s => s.city.trim()).length;
    if (filled < 2) {
      this.toast.warning('Add at least 2 stops to save your itinerary');
      return;
    }
    try {
      localStorage.setItem('bg_itinerary', JSON.stringify(this.stops()));
      this.toast.success(`Itinerary saved (${filled} stops)`);
    } catch {
      this.toast.error('Could not save itinerary');
    }
  }
}
