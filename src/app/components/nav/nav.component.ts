import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav', standalone: true, imports: [CommonModule],
  template: `
<nav class="nav" [class.scrolled]="scrolled()">
<div class="nav-inner">
  <a href="#" class="logo"><svg class="logo-bird" viewBox="0 0 60 50" fill="none"><polygon points="30,2 58,28 42,28" fill="#FF6B00"/><polygon points="30,2 18,28 30,18" fill="#E05E00"/><polygon points="18,28 42,28 52,46 8,46" fill="#138808"/><polygon points="30,18 42,28 36,38" fill="#0F6B06"/><path d="M28,30 C28,30 26,34 24,36 C22,38 22,42 26,42 C28,42 30,40 32,38 C34,36 36,34 34,30 C33,28 29,28 28,30Z" fill="white" opacity="0.95"/></svg><span>Bharat<em>Gumho</em></span></a>
  <div class="nav-links">
    <a href="#flights" class="nav-link">Flights</a>
    <a href="#features" class="nav-link">Multi-City</a>
    <a href="#routes" class="nav-link">Routes</a>
    <a href="#reviews" class="nav-link">Reviews</a>
  </div>
  <div class="nav-right">
    <button class="nav-sign" (click)="auth.openAuth(false)">Sign In</button>
    <button class="nav-cta" (click)="auth.openAuth(true)">Get Started</button>
  </div>
  <button class="hamburger" [class.active]="mobileOpen()" (click)="toggleMobile()"><span></span><span></span><span></span></button>
</div>
</nav>
<div class="mobile-menu" [class.open]="mobileOpen()">
  <a href="#flights" (click)="closeMobile()">Flights</a>
  <a href="#features" (click)="closeMobile()">Multi-City</a>
  <a href="#routes" (click)="closeMobile()">Routes</a>
  <a href="#reviews" (click)="closeMobile()">Reviews</a>
  <button class="nav-cta" style="width:100%;margin-top:16px" (click)="closeMobile();auth.openAuth(true)">Get Started</button>
</div>`
})
export class NavComponent {
  scrolled = signal(false);
  mobileOpen = signal(false);
  constructor(public auth: AuthService) {}
  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 50); }
  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile() { this.mobileOpen.set(false); }
}
