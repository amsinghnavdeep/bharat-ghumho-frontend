import { Component } from '@angular/core';

@Component({
  selector: 'app-footer', standalone: true,
  template: `
<footer class="footer"><div class="w footer-in"><div class="footer-l">
  <span class="footer-logo"><svg width="24" height="20" style="vertical-align:middle;margin-right:6px" viewBox="0 0 60 50" fill="none"><polygon points="30,2 58,28 42,28" fill="#FF6B00"/><polygon points="30,2 18,28 30,18" fill="#E05E00"/><polygon points="18,28 42,28 52,46 8,46" fill="#138808"/><polygon points="30,18 42,28 36,38" fill="#0F6B06"/><path d="M28,30 C28,30 26,34 24,36 C22,38 22,42 26,42 C28,42 30,40 32,38 C34,36 36,34 34,30 C33,28 29,28 28,30Z" fill="white" opacity="0.95"/></svg>Bharat<em>Gumho</em></span>
  <div class="india-flag"><div class="sf"></div><div class="wh"></div><div class="gr"></div></div>
  <span class="footer-copy">&copy; 2026 &middot; Mississauga, ON</span>
</div><div class="footer-r"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Support</a><a href="#">Careers</a></div></div></footer>`
})
export class FooterComponent {}
