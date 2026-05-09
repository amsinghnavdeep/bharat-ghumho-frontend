import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav', standalone: true, imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
<nav class="nav" [class.scrolled]="scrolled()">
<div class="nav-inner">
  <a routerLink="/" class="logo" (click)="closeMobile()">
    <svg class="logo-bird" viewBox="0 0 60 50" fill="none">
      <polygon points="30,2 58,28 42,28" fill="#FF6B00"/>
      <polygon points="30,2 18,28 30,18" fill="#E05E00"/>
      <polygon points="18,28 42,28 52,46 8,46" fill="#138808"/>
      <polygon points="30,18 42,28 36,38" fill="#0F6B06"/>
      <path d="M28,30 C28,30 26,34 24,36 C22,38 22,42 26,42 C28,42 30,40 32,38 C34,36 36,34 34,30 C33,28 29,28 28,30Z" fill="white" opacity="0.95"/>
    </svg>
    <span>Bharat<em>Ghumho</em></span>
  </a>
  <div class="nav-links">
    <a routerLink="/flights" routerLinkActive="active" class="nav-link"><span>Flights</span></a>
    <a routerLink="/hotels" routerLinkActive="active" class="nav-link"><span>Hotels</span></a>
    <a routerLink="/cars" routerLinkActive="active" class="nav-link"><span>Cars</span></a>
    <a routerLink="/holidays" routerLinkActive="active" class="nav-link"><span>Holidays</span></a>
    <a routerLink="/trip-planner" routerLinkActive="active" class="nav-link"><span>Trip Planner</span></a>
  </div>
  <div class="nav-right">
    <button class="nav-theme-toggle" (click)="theme.toggle()" [title]="theme.theme()==='dark' ? 'Switch to light mode' : 'Switch to dark mode'" aria-label="Toggle theme">
      <span *ngIf="theme.theme()==='dark'">☀</span>
      <span *ngIf="theme.theme()==='light'">🌙</span>
    </button>
    <select class="cur-select" [(ngModel)]="currency" (ngModelChange)="onCurrency()" title="Default currency">
      <option *ngFor="let c of currencies">{{c}}</option>
    </select>
    <ng-container *ngIf="!auth.isAuthenticated()">
      <button class="nav-sign" (click)="auth.openAuth(false)">Sign In</button>
      <button class="nav-cta" (click)="auth.openAuth(true)">Get Started</button>
    </ng-container>
    <div class="user-menu" *ngIf="auth.isAuthenticated()">
      <button class="user-trigger" (click)="toggleUser()">
        <span class="user-av">{{initial()}}</span>
        <span class="user-name">{{auth.userSignal()?.name}}</span>
        <span class="caret">▾</span>
      </button>
      <div class="user-pop" *ngIf="userOpen()">
        <a routerLink="/dashboard" (click)="closeUser()">Dashboard</a>
        <a routerLink="/dashboard" (click)="closeUser()">My Bookings</a>
        <a routerLink="/dashboard" (click)="closeUser()">Favorites</a>
        <hr />
        <button (click)="logout()">Sign out</button>
      </div>
    </div>
  </div>
  <button class="hamburger" [class.active]="mobileOpen()" (click)="toggleMobile()" aria-label="Open menu"><span></span><span></span><span></span></button>
</div>
</nav>
<div class="drawer-backdrop" [class.open]="mobileOpen()" (click)="closeMobile()"></div>
<aside class="mobile-drawer" [class.open]="mobileOpen()" role="dialog" aria-label="Navigation menu">
  <button class="drawer-close" (click)="closeMobile()" aria-label="Close menu">&times;</button>
  <div class="drawer-brand">
    <svg width="28" height="24" viewBox="0 0 60 50" fill="none">
      <polygon points="30,2 58,28 42,28" fill="#FF6B00"/>
      <polygon points="30,2 18,28 30,18" fill="#E05E00"/>
      <polygon points="18,28 42,28 52,46 8,46" fill="#138808"/>
    </svg>
    <span>Bharat<em style="font-style:normal;background:linear-gradient(135deg,#FF6B00,#D4A843);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Ghumho</em></span>
  </div>
  <a routerLink="/flights" routerLinkActive="active" (click)="closeMobile()"><span class="ic">✈</span> Flights</a>
  <a routerLink="/hotels" routerLinkActive="active" (click)="closeMobile()"><span class="ic">🏨</span> Hotels</a>
  <a routerLink="/cars" routerLinkActive="active" (click)="closeMobile()"><span class="ic">🚗</span> Cars</a>
  <a routerLink="/holidays" routerLinkActive="active" (click)="closeMobile()"><span class="ic">🏝</span> Holidays</a>
  <a routerLink="/trip-planner" routerLinkActive="active" (click)="closeMobile()"><span class="ic">🗺</span> Trip Planner</a>
  <ng-container *ngIf="auth.isAuthenticated()">
    <div class="drawer-divider"></div>
    <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobile()"><span class="ic">📊</span> Dashboard</a>
  </ng-container>
  <div class="drawer-divider"></div>
  <div class="drawer-currency">
    <span>Currency</span>
    <select [(ngModel)]="currency" (ngModelChange)="onCurrency()">
      <option *ngFor="let c of currencies">{{c}}</option>
    </select>
  </div>
  <ng-container *ngIf="!auth.isAuthenticated()">
    <button class="drawer-cta" (click)="closeMobile();auth.openAuth(true)">Get Started</button>
  </ng-container>
  <ng-container *ngIf="auth.isAuthenticated()">
    <button class="drawer-cta" (click)="closeMobile();logout()">Sign out</button>
  </ng-container>
  <div class="drawer-theme">
    <span>{{theme.theme()==='dark' ? '🌙 Dark mode' : '☀ Light mode'}}</span>
    <button class="nav-theme-toggle" (click)="theme.toggle()" aria-label="Toggle theme">
      <span *ngIf="theme.theme()==='dark'">☀</span>
      <span *ngIf="theme.theme()==='light'">🌙</span>
    </button>
  </div>
</aside>`,
  styles: [`
    .cur-select{padding:8px 10px;border:1px solid #E5E9F0;border-radius:8px;font-size:12px;font-weight:700;background:#fff;color:#0B1120;cursor:pointer;outline:none}
    .cur-select:focus{border-color:#FF6B00}
    .user-menu{position:relative}
    .user-trigger{display:flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;background:#fff;border:1px solid #E5E9F0;border-radius:100px;cursor:pointer;font-size:13px;font-weight:700;color:#0B1120}
    .user-trigger:hover{border-color:#FF6B00}
    .user-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#FF6B00,#FF8A3D);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900}
    .caret{font-size:10px;color:#8B95A5}
    .user-pop{position:absolute;top:calc(100% + 6px);right:0;background:#fff;border:1px solid #E5E9F0;border-radius:14px;padding:6px;min-width:180px;box-shadow:0 18px 40px rgba(0,0,0,.12);z-index:1000}
    .user-pop a,.user-pop button{display:block;width:100%;text-align:left;padding:10px 12px;border-radius:8px;font-size:13px;font-weight:600;color:#0B1120;text-decoration:none;background:none;border:none;cursor:pointer}
    .user-pop a:hover,.user-pop button:hover{background:#F7F8FA;color:#FF6B00}
    .user-pop hr{border:none;border-top:1px solid #F0F2F6;margin:4px 0}
    .nav-link.active{color:#FF6B00}
    .nav-link.active::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:#FF6B00;border-radius:2px}
  `]
})
export class NavComponent {
  scrolled = signal(false);
  mobileOpen = signal(false);
  userOpen = signal(false);
  currency = 'CAD';
  currencies = ['CAD', 'USD', 'GBP', 'EUR', 'AED', 'SGD', 'AUD', 'INR'];

  constructor(public auth: AuthService, public theme: ThemeService, private router: Router, private toast: ToastService) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bg_currency');
      if (stored) this.currency = stored;
    }
  }

  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 50); }
  @HostListener('document:click', ['$event']) onDocClick(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (!t.closest('.user-menu')) this.userOpen.set(false);
  }
  @HostListener('document:keydown.escape') onEsc() { this.closeMobile(); this.closeUser(); }

  toggleMobile() {
    this.mobileOpen.update(v => !v);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
    }
  }
  closeMobile() {
    this.mobileOpen.set(false);
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  }
  toggleUser() { this.userOpen.update(v => !v); }
  closeUser() { this.userOpen.set(false); }

  initial(): string {
    return (this.auth.userSignal()?.name?.[0] || 'U').toUpperCase();
  }

  logout() {
    this.auth.logout();
    this.userOpen.set(false);
    this.toast.show('Signed out');
    this.router.navigate(['/']);
  }

  onCurrency() {
    if (typeof window !== 'undefined') localStorage.setItem('bg_currency', this.currency);
    this.toast.show(`Default currency: ${this.currency}`);
  }
}
