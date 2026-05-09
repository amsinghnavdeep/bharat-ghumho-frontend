import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
<footer class="footer"><div class="w">
<div class="footer-inner">
  <div class="footer-brand">
    <div class="footer-logo">Bharat<em>Ghumho</em></div>
    <p class="footer-tagline">भारत घूमो — Find the best fare home. Every time.</p>
    <span class="made-in-india" title="Made in India">
      <span class="mii-flag" aria-hidden="true"><div class="sf"></div><div class="wh"></div><div class="gr"></div></span>
      Made in India
    </span>
    <p class="footer-copy">&copy; 2026 Bharat Ghumho &middot; Mississauga, ON &middot; New Delhi, IN</p>
  </div>
  <div class="footer-links">
    <div class="footer-col">
      <h4>Product</h4>
      <a routerLink="/flights">Flight Search</a>
      <a routerLink="/hotels">Hotels</a>
      <a routerLink="/cars">Cars</a>
      <a routerLink="/holidays">Holidays</a>
      <a routerLink="/trip-planner">Trip Planner</a>
    </div>
    <div class="footer-col">
      <h4>Travel Tools</h4>
      <a href="#features">Multi-City</a>
      <a href="#">Baggage Calculator</a>
      <a href="#">Fare Alerts</a>
      <a href="#">Festival Calendar</a>
      <a href="#">Visa Help</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="#">About Us</a>
      <a href="#">Careers</a>
      <a href="#">Blog</a>
      <a href="#">Press</a>
      <a href="#">Contact</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Policy</a>
      <a href="#">Help Center</a>
      <a href="#">API Docs</a>
    </div>
  </div>
</div>
<div class="footer-bottom">
  <span>Built with <span style="color:#FF6B00">&#10084;</span> for the Indian diaspora.</span>
  <span style="display:inline-flex;align-items:center;gap:8px">Tricolor pride <span class="india-flag"><div class="sf"></div><div class="wh"></div><div class="gr"></div></span></span>
</div>
</div></footer>`
})
export class FooterComponent {}
