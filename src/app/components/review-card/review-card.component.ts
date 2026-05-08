import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../models';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="rev-card-c">
  <div class="rev-stars">
    <span *ngFor="let s of stars" [class.filled]="s">★</span>
  </div>
  <strong class="rev-title" *ngIf="r.title">{{r.title}}</strong>
  <p class="rev-text">{{r.body || r.text}}</p>
  <div class="rev-author">
    <div class="rev-av sf">{{initial}}</div>
    <div>
      <div class="rev-name">{{r.author || r.name || 'Traveler'}}</div>
      <div class="rev-route" *ngIf="r.route || r.created_at">{{r.route || formatDate(r.created_at)}}</div>
    </div>
  </div>
</div>`,
  styles: [`
    .rev-card-c{background:#fff;border:1px solid #F0F2F6;border-radius:24px;padding:24px;transition:all .35s}
    .rev-card-c:hover{box-shadow:0 8px 24px rgba(0,0,0,.06);transform:translateY(-2px)}
    .rev-stars{display:flex;gap:2px;margin-bottom:10px;color:#CDD3DC;font-size:16px}
    .rev-stars .filled{color:#F59E0B}
    .rev-title{display:block;font-size:14px;font-weight:800;margin-bottom:6px}
    .rev-text{font-size:14px;color:#3D4A5C;line-height:1.7;margin-bottom:16px}
    .rev-author{display:flex;align-items:center;gap:10px}
    .rev-av{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff;flex-shrink:0;background:linear-gradient(135deg,#FF6B00,#FFB366)}
    .rev-name{font-size:13px;font-weight:700}
    .rev-route{font-size:11px;color:#8B95A5;margin-top:1px}
  `]
})
export class ReviewCardComponent {
  @Input() r!: Review;

  get stars(): boolean[] {
    const rating = Math.round(this.r?.rating ?? 0);
    return [1, 2, 3, 4, 5].map(i => i <= rating);
  }

  get initial(): string {
    const name = this.r.author || this.r.name || 'T';
    return (name[0] || 'T').toUpperCase();
  }

  formatDate(iso?: string): string {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return ''; }
  }
}
