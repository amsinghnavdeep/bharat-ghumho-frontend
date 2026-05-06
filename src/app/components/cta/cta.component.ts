import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cta',
  standalone: true,
  template: `
<section class="cta"><div class="w">
  <div class="cta-box sr">
    <div class="cta-blob b1"></div>
    <div class="cta-blob b2"></div>
    <h2>Ready to find your<br>best fare <span class="sf">home</span>?</h2>
    <p>Join 50,000+ Indians abroad who found a smarter way to book their journey back home.</p>
    <div class="cta-btns">
      <button class="btn-p" (click)="scrollToFlights()">Search Flights Free</button>
      <button class="btn-s" (click)="auth.openAppModal()">Download App</button>
    </div>
    <div class="cta-trust">No credit card required &middot; Free forever &middot; Cancel anytime</div>
  </div>
</div></section>`
})
export class CtaComponent {
  constructor(public auth: AuthService) {}
  scrollToFlights() { document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' }); }
}
