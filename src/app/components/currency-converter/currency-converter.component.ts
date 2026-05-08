import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="cc">
  <div class="cc-head">Currency Converter</div>
  <div class="cc-row">
    <input type="number" min="1" [(ngModel)]="amount" (ngModelChange)="convert()" />
    <select [(ngModel)]="from" (ngModelChange)="convert()">
      <option *ngFor="let c of currencies">{{c}}</option>
    </select>
  </div>
  <button class="cc-swap" (click)="swap()" type="button" aria-label="Swap currencies">⇅</button>
  <div class="cc-row">
    <input type="text" [value]="result() | number:'1.2-2'" readonly />
    <select [(ngModel)]="to" (ngModelChange)="convert()">
      <option *ngFor="let c of currencies">{{c}}</option>
    </select>
  </div>
  <div class="cc-rate" *ngIf="rate() !== null">1 {{from}} = {{rate() | number:'1.2-4'}} {{to}}</div>
  <div class="cc-rate" *ngIf="loading()">…</div>
</div>`,
  styles: [`
    .cc{background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
    .cc-head{font-size:12px;font-weight:700;color:#8B95A5;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:12px}
    .cc-row{display:flex;gap:8px;margin-bottom:8px}
    .cc-row input{flex:1;padding:10px 12px;border:1px solid #E5E9F0;border-radius:10px;font-size:15px;font-weight:700;color:#0B1120;outline:none}
    .cc-row input:focus{border-color:#FF6B00}
    .cc-row select{padding:10px;border:1px solid #E5E9F0;border-radius:10px;font-size:13px;font-weight:600;background:#F7F8FA;color:#0B1120;outline:none;min-width:80px}
    .cc-swap{display:block;margin:4px auto;width:30px;height:30px;border-radius:50%;background:#FFF4EC;border:1px solid #FF6B00;color:#FF6B00;font-size:14px;font-weight:800;cursor:pointer}
    .cc-rate{font-size:11px;color:#8B95A5;margin-top:6px;text-align:center}
  `]
})
export class CurrencyConverterComponent implements OnInit {
  @Input() initialFrom = 'CAD';
  @Input() initialTo = 'INR';
  amount = 1000;
  from = 'CAD';
  to = 'INR';
  result = signal(0);
  rate = signal<number | null>(null);
  loading = signal(false);

  currencies = ['CAD', 'USD', 'GBP', 'EUR', 'AED', 'AUD', 'SGD', 'INR', 'JPY', 'CNY', 'NZD'];

  constructor(private cs: CurrencyService) {}

  ngOnInit(): void {
    this.from = this.initialFrom;
    this.to = this.initialTo;
    this.convert();
  }

  swap() {
    const t = this.from; this.from = this.to; this.to = t;
    this.convert();
  }

  convert() {
    if (!this.amount || this.amount <= 0) { this.result.set(0); return; }
    if (this.from === this.to) { this.result.set(this.amount); this.rate.set(1); return; }
    this.loading.set(true);
    this.cs.convert(this.from, this.to, this.amount).subscribe(r => {
      this.loading.set(false);
      if (r) {
        this.result.set(r.result);
        this.rate.set(r.rate);
      } else {
        this.result.set(0);
        this.rate.set(null);
      }
    });
  }
}
