import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-modal', standalone: true, imports: [CommonModule],
  template: `
<div class="modal-overlay" [class.open]="auth.showAppModal()" (click)="auth.closeAppModal()">
<div class="modal app-modal" (click)="$event.stopPropagation()">
  <button class="modal-close" (click)="auth.closeAppModal()">&times;</button>
  <div class="modal-logo"><svg width="48" height="40" viewBox="0 0 60 50" fill="none"><polygon points="30,2 58,28 42,28" fill="#FF6B00"/><polygon points="30,2 18,28 30,18" fill="#E05E00"/><polygon points="18,28 42,28 52,46 8,46" fill="#138808"/><polygon points="30,18 42,28 36,38" fill="#0F6B06"/><path d="M28,30 C28,30 26,34 24,36 C22,38 22,42 26,42 C28,42 30,40 32,38 C34,36 36,34 34,30 C33,28 29,28 28,30Z" fill="white" opacity="0.95"/></svg></div>
  <h3>Download Bharat Gumho</h3><p class="modal-sub">Get the app for faster search &amp; exclusive deals</p>
  <div class="app-links">
    <button class="app-store-btn apple"><span class="app-icon">&#127822;</span><div><small>Download on the</small><strong>App Store</strong></div></button>
    <button class="app-store-btn google"><span class="app-icon">&#9654;</span><div><small>Get it on</small><strong>Google Play</strong></div></button>
  </div>
  <div class="qr-placeholder"><div class="qr-box">QR</div><p>Scan to download</p></div>
</div></div>`
})
export class AppModalComponent { constructor(public auth: AuthService) {} }
