import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-search-tabs',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
<div class="st">
  <a routerLink="/flights" routerLinkActive="active" class="st-tab"><span>✈</span>Flights</a>
  <a routerLink="/hotels" routerLinkActive="active" class="st-tab"><span>🏨</span>Hotels</a>
  <a routerLink="/cars" routerLinkActive="active" class="st-tab"><span>🚗</span>Cars</a>
  <a routerLink="/holidays" routerLinkActive="active" class="st-tab"><span>🏖</span>Holidays</a>
  <a routerLink="/trip-planner" routerLinkActive="active" class="st-tab"><span>🗺</span>Trip Planner</a>
</div>`,
  styles: [`
    .st{display:flex;gap:6px;background:#fff;border:1px solid #E5E9F0;border-radius:16px;padding:6px;box-shadow:0 2px 8px rgba(0,0,0,.04);overflow-x:auto;scrollbar-width:none}
    .st::-webkit-scrollbar{display:none}
    .st-tab{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;color:#3D4A5C;text-decoration:none;white-space:nowrap;transition:all .25s;cursor:pointer}
    .st-tab:hover{background:#F7F8FA;color:#0B1120}
    .st-tab.active{background:linear-gradient(135deg,#FF6B00,#FF8A3D);color:#fff;box-shadow:0 4px 12px rgba(255,107,0,.25)}
    .st-tab span{font-size:14px}
  `]
})
export class SearchTabsComponent {
  constructor(public router: Router) {}
}
