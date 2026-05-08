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

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<section class="tp">
  <div class="w">
    <header class="tp-head">
      <small>Multi-stop itinerary</small>
      <h1>Trip Planner</h1>
      <p>Build a multi-destination journey across Indian and global cities. Weather, currency and visa details will populate automatically when you save.</p>
    </header>

    <div class="tp-stops">
      <div class="tp-stop" *ngFor="let s of stops(); let i = index">
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
        <button class="ghost" (click)="remove(i)" *ngIf="stops().length > 1" aria-label="Remove stop">×</button>
      </div>
    </div>

    <div class="tp-actions">
      <button class="ghost" (click)="addStop()">+ Add stop</button>
      <button class="s-btn" (click)="save()">Save itinerary</button>
      <a class="ghost" routerLink="/destination/DEL">Browse destinations</a>
    </div>

    <div class="tp-summary" *ngIf="totalDays() > 0">
      <div><small>Stops</small><strong>{{stops().length}}</strong></div>
      <div><small>Total days</small><strong>{{totalDays()}}</strong></div>
      <div><small>First stop</small><strong>{{firstStop()}}</strong></div>
      <div><small>Last stop</small><strong>{{lastStop()}}</strong></div>
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
    .tp-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
    .tp-summary div{background:#fff;border:1px solid #E5E9F0;border-radius:14px;padding:16px;text-align:center}
    .tp-summary small{display:block;font-size:11px;color:#8B95A5;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:4px}
    .tp-summary strong{font-size:18px;font-weight:900;color:#0B1120}
  `]
})
export class TripPlannerComponent {
  stops = signal<TripStop[]>([
    { id: 1, city: 'Toronto (YYZ)', arrive: '', depart: '', notes: '' },
    { id: 2, city: 'Delhi (DEL)', arrive: '', depart: '', notes: 'Golden Triangle start' },
    { id: 3, city: 'Goa (GOI)', arrive: '', depart: '', notes: 'Beaches' }
  ]);

  constructor(private toast: ToastService) {}

  addStop() {
    const next = (this.stops().at(-1)?.id ?? 0) + 1;
    this.stops.update(list => [...list, { id: next, city: '', arrive: '', depart: '', notes: '' }]);
  }

  remove(i: number) {
    this.stops.update(list => list.filter((_, idx) => idx !== i));
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

  firstStop(): string { return this.stops()[0]?.city || '—'; }
  lastStop(): string { return this.stops().at(-1)?.city || '—'; }

  save() {
    const filled = this.stops().filter(s => s.city.trim()).length;
    if (filled < 2) {
      this.toast.show('Add at least 2 stops to save your itinerary');
      return;
    }
    try {
      localStorage.setItem('bg_itinerary', JSON.stringify(this.stops()));
      this.toast.show(`Itinerary saved (${filled} stops)`);
    } catch {
      this.toast.show('Could not save itinerary');
    }
  }
}
