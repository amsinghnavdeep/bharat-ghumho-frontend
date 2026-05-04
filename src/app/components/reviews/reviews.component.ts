import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../models';

@Component({
  selector: 'app-reviews', standalone: true, imports: [CommonModule],
  template: `
<section class="reviews" id="reviews"><div class="w">
<div class="sec-head sr"><div class="sec-tag sf">Travelers</div><h2 class="sec-title">Trusted by thousands<br>going home.</h2></div>
<div class="rev-grid">
  <div *ngFor="let r of reviews; let i = index" class="rev-card sr" [class.d1]="i===1" [class.d2]="i===2">
    <div class="rev-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
    <p class="rev-text">{{r.text}}</p>
    <div class="rev-author"><div class="rev-av" [ngClass]="r.avClass">{{r.initial}}</div><div><div class="rev-name">{{r.name}}</div><div class="rev-route">{{r.route}}</div></div></div>
  </div>
</div>
</div></section>`
})
export class ReviewsComponent {
  reviews: Review[] = [
    { text: 'Multi-city actually works. Booked YYZ to DEL to GOI to BOM and back in one search. Saved $230 compared to booking separately.', name: 'Priya S.', route: 'Toronto -> Delhi -> Goa -> Mumbai', initial: 'P', avClass: 'sf' },
    { text: 'The festival calendar caught a fare drop before Navratri. Booked Vancouver to Mumbai for $498. Best deal I ever found.', name: 'Rahul M.', route: 'Vancouver -> Mumbai', initial: 'R', avClass: 'gr' },
    { text: 'Booked for 6 people for my sister wedding. Group booking made it simple. Everyone seated together. Baggage sorted.', name: 'Ankit J.', route: 'Calgary -> Jaipur', initial: 'A', avClass: 'sf' }
  ];
}
