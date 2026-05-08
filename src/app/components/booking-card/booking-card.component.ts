import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="bk-card" [class.cancelled]="booking.status==='cancelled'">
  <div class="bk-row">
    <div class="bk-type">
      <span class="bk-pill" [ngClass]="'pill-'+booking.type">{{typeLabel(booking.type)}}</span>
      <strong>{{booking.title}}</strong>
    </div>
    <div class="bk-status" [ngClass]="'status-'+booking.status">{{booking.status}}</div>
  </div>
  <div class="bk-meta">
    <span *ngIf="booking.start_date">{{booking.start_date}}<ng-container *ngIf="booking.end_date"> → {{booking.end_date}}</ng-container></span>
    <span>{{booking.travelers}} traveler<ng-container *ngIf="booking.travelers!==1">s</ng-container></span>
    <span class="bk-price">{{booking.currency}} {{booking.price | number:'1.0-2'}}</span>
  </div>
  <div class="bk-actions" *ngIf="showActions">
    <button class="bk-btn ghost" (click)="view.emit(booking)">View</button>
    <button class="bk-btn danger" *ngIf="booking.status==='confirmed'" (click)="cancel.emit(booking)">Cancel</button>
  </div>
</div>`,
  styles: [`
    .bk-card{background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.04);transition:all .3s}
    .bk-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.08);transform:translateY(-2px)}
    .bk-card.cancelled{opacity:.7}
    .bk-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px;flex-wrap:wrap}
    .bk-type{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    .bk-type strong{font-size:15px;font-weight:700}
    .bk-pill{padding:3px 10px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .pill-flight{background:#FFF4EC;color:#FF6B00}
    .pill-hotel{background:#EDFCE9;color:#138808}
    .pill-car{background:#E0E7FF;color:#3730A3}
    .pill-package{background:#FCE7F3;color:#BE185D}
    .bk-status{padding:4px 10px;border-radius:6px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
    .status-confirmed{background:#EDFCE9;color:#138808}
    .status-cancelled{background:#FEE2E2;color:#DC2626}
    .status-pending{background:#FEF3C7;color:#B45309}
    .bk-meta{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;color:#3D4A5C;margin-bottom:8px}
    .bk-price{font-weight:800;color:#FF6B00;margin-left:auto}
    .bk-actions{display:flex;gap:8px;margin-top:6px}
    .bk-btn{padding:8px 14px;border-radius:8px;font-size:12px;font-weight:700;border:1px solid #E5E9F0;background:#fff;color:#0B1120;cursor:pointer;transition:all .25s}
    .bk-btn:hover{border-color:#FF6B00;color:#FF6B00}
    .bk-btn.ghost{background:#F7F8FA}
    .bk-btn.danger{border-color:#FECACA;color:#DC2626;background:#FEF2F2}
    .bk-btn.danger:hover{background:#DC2626;color:#fff}
  `]
})
export class BookingCardComponent {
  @Input() booking!: Booking;
  @Input() showActions = true;
  @Output() view = new EventEmitter<Booking>();
  @Output() cancel = new EventEmitter<Booking>();

  typeLabel(t: string): string {
    return ({ flight: 'Flight', hotel: 'Hotel', car: 'Car', package: 'Package' } as Record<string, string>)[t] ?? t;
  }
}
