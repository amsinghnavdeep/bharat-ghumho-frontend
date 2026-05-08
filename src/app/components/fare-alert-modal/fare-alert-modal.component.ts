import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertsService } from '../../services/alerts.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-fare-alert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="modal-overlay" [class.open]="open" (click)="close.emit()">
  <div class="modal" (click)="$event.stopPropagation()">
    <button class="modal-close" (click)="close.emit()">×</button>
    <h3>Set Fare Alert</h3>
    <p class="modal-sub">Get notified when prices drop below your target.</p>
    <div class="form-group">
      <label>From (IATA)</label>
      <input [(ngModel)]="from" placeholder="YYZ" maxlength="3" />
    </div>
    <div class="form-group">
      <label>To (IATA)</label>
      <input [(ngModel)]="to" placeholder="DEL" maxlength="3" />
    </div>
    <div class="form-group">
      <label>Target Price</label>
      <input type="number" [(ngModel)]="target" placeholder="600" />
    </div>
    <div class="form-group">
      <label>Currency</label>
      <select [(ngModel)]="currency">
        <option *ngFor="let c of ['CAD','USD','GBP','EUR','AED','INR']">{{c}}</option>
      </select>
    </div>
    <button class="s-btn" style="width:100%" (click)="submit()" [disabled]="saving()">
      {{saving() ? 'Saving…' : 'Create Alert'}}
    </button>
  </div>
</div>`,
  styles: [`
    .form-group select{width:100%;padding:12px 16px;border:1px solid #E5E9F0;border-radius:10px;font-size:15px;font-weight:500;background:#fff;color:#0B1120;outline:none}
    .form-group select:focus{border-color:#FF6B00}
  `]
})
export class FareAlertModalComponent {
  @Input() open = false;
  @Input() set defaults(d: { from?: string; to?: string; target?: number; currency?: string } | null) {
    if (!d) return;
    if (d.from) this.from = d.from;
    if (d.to) this.to = d.to;
    if (d.target) this.target = d.target;
    if (d.currency) this.currency = d.currency;
  }
  @Output() close = new EventEmitter<void>();

  from = 'YYZ';
  to = 'DEL';
  target = 600;
  currency = 'CAD';
  saving = signal(false);

  constructor(private alerts: AlertsService, private toast: ToastService) {}

  submit() {
    if (!this.from || !this.to || !this.target) { this.toast.show('Please fill in all fields'); return; }
    this.saving.set(true);
    this.alerts.create({
      from: this.from.toUpperCase(),
      to: this.to.toUpperCase(),
      target_price: Number(this.target),
      currency: this.currency
    }).subscribe(r => {
      this.saving.set(false);
      if (r) {
        this.toast.show(`Alert set for ${this.from.toUpperCase()} → ${this.to.toUpperCase()}`);
        this.close.emit();
      } else {
        this.toast.show('Could not save alert');
      }
    });
  }
}
