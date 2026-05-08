import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Bar {
  label: string;
  value: number;
  height: number;
  isMin: boolean;
}

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="pc">
  <div class="pc-head" *ngIf="title">{{title}}</div>
  <div class="pc-body">
    <div class="pc-bar" *ngFor="let b of bars" [title]="b.label + ': ' + currency + b.value">
      <div class="pc-bar-bar" [class.min]="b.isMin" [style.height]="b.height + '%'">
        <span>{{currency}}{{b.value}}</span>
      </div>
      <small>{{b.label}}</small>
    </div>
  </div>
  <div class="pc-foot" *ngIf="cheapest != null">Cheapest: <strong>{{currency}}{{cheapest}}</strong></div>
</div>`,
  styles: [`
    .pc{background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .pc-head{font-size:13px;font-weight:700;color:#0B1120;margin-bottom:14px}
    .pc-body{display:flex;align-items:flex-end;gap:8px;height:160px;border-bottom:1px solid #F0F2F6;padding-bottom:6px}
    .pc-bar{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0}
    .pc-bar small{font-size:10px;color:#8B95A5;font-weight:600;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}
    .pc-bar-bar{width:100%;background:linear-gradient(180deg,#FF8A3D,#FF6B00);border-radius:6px 6px 0 0;position:relative;transition:height .4s;min-height:8px;display:flex;align-items:flex-start;justify-content:center}
    .pc-bar-bar.min{background:linear-gradient(180deg,#34D399,#138808)}
    .pc-bar-bar span{position:absolute;top:-18px;font-size:10px;font-weight:700;color:#3D4A5C;white-space:nowrap}
    .pc-foot{font-size:12px;color:#3D4A5C;margin-top:10px}
    .pc-foot strong{color:#138808;font-weight:800}
  `]
})
export class PriceChartComponent implements OnChanges {
  @Input() data: { label: string; value: number }[] = [];
  @Input() title = 'Price trend';
  @Input() currency = '$';

  bars: Bar[] = [];
  cheapest: number | null = null;

  ngOnChanges(): void {
    if (!this.data.length) { this.bars = []; this.cheapest = null; return; }
    const max = Math.max(...this.data.map(d => d.value));
    const min = Math.min(...this.data.map(d => d.value));
    this.cheapest = min;
    this.bars = this.data.map(d => ({
      label: d.label,
      value: d.value,
      height: max > 0 ? Math.max((d.value / max) * 100, 8) : 8,
      isMin: d.value === min
    }));
  }
}
