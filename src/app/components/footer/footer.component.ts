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
</div></footer>`,
  styles: [`
    .footer-inner { display: flex; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
    .footer-brand { max-width: 280px; }
    .footer-logo { font-size: 18px; font-weight: 800; color: #0B1120; margin-bottom: 8px; }
    .footer-logo em { font-style: normal; color: #FF6B00; }
    .footer-tagline { font-size: 13px; color: #8B95A5; margin-bottom: 6px; }
    .footer-links { display: flex; gap: 48px; flex-wrap: wrap; }
    .footer-col { display: flex; flex-direction: column; gap: 8px; }
    .footer-col h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #3D4A5C; margin-bottom: 4px; }
    .footer-col a { font-size: 13px; color: #8B95A5; text-decoration: none; }
    .footer-col a:hover { color: #0B1120; }
    @media(max-width:768px) { .footer-inner { flex-direction: column; } .footer-links { gap: 24px; } }
  `]
})
export class FooterComponent {}
