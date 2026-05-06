import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
<footer class="footer"><div class="w footer-inner">
  <div class="footer-brand">
    <div class="footer-logo">Bharat<em>Ghumho</em></div>
    <p class="footer-tagline">Find the best fare home. Every time.</p>
    <p class="footer-copy">&copy; 2026 Bharat Ghumho &middot; Mississauga, ON</p>
  </div>
  <div class="footer-links">
    <div class="footer-col">
      <h4>Product</h4>
      <a href="#flights">Flight Search</a>
      <a href="#features">Multi-City</a>
      <a href="#">Baggage Calculator</a>
      <a href="#">Fare Alerts</a>
    </div>
    <div class="footer-col">
      <h4>Company</h4>
      <a href="#">About Us</a>
      <a href="#">Careers</a>
      <a href="#">Blog</a>
      <a href="#">Press</a>
    </div>
    <div class="footer-col">
      <h4>Support</h4>
      <a href="#">Help Center</a>
      <a href="#">Contact Us</a>
      <a href="#">Status</a>
      <a href="#">API Docs</a>
    </div>
    <div class="footer-col">
      <h4>Legal</h4>
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Cookie Policy</a>
    </div>
  </div>
</div></footer>`
})
export class FooterComponent {}
