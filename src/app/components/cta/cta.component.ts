import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cta', standalone: true,
  template: `
<section class="cta"><div class="w"><div class="cta-box sr"><div class="cta-blob b1"></div><div class="cta-blob b2"></div>
<h2>Ready to find your<br>best fare <span class="sf">home</span>?</h2>
<p>Join thousands of Indians abroad who found a smarter way to book their journey home.</p>
<div class="cta-btns">
  <button class="btn-p" (click)="scrollToBooking()">Search Flights</button>
  <button class="btn-s" (click)="auth.openAppModal()">Download App</button>
</div></div></div></section>`
})
export class CtaComponent {
  constructor(public auth: AuthService) {}
  scrollToBooking() { document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' }); }
}
