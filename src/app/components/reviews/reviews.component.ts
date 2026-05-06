import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
<section class="reviews" id="reviews"><div class="w">
  <div class="sec-head sr">
    <div class="sec-tag sf">Travelers</div>
    <h2 class="sec-title">Trusted by thousands<br>going home.</h2>
    <p class="sec-sub">Real stories from the Indian diaspora who found a better way to book their journey home.</p>
  </div>
  <div class="rev-grid">
    <div *ngFor="let r of reviews; let i = index" class="rev-card sr" [style.transition-delay]="(i * 0.09) + 's'">
      <div class="rev-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p class="rev-text">&#x201C;{{r.text}}&#x201D;</p>
      <div class="rev-author">
        <div class="rev-av" [ngClass]="r.avClass">{{r.initial}}</div>
        <div><div class="rev-name">{{r.name}}</div><div class="rev-route">{{r.route}}</div></div>
      </div>
    </div>
  </div>
</div></section>`
})
export class ReviewsComponent {
  reviews = [
    { text: 'Multi-city actually works. Booked YYZ to DEL to GOI to BOM and back in one search. Saved $230 vs booking each leg separately.', name: 'Priya S.', route: 'Toronto → Delhi → Goa → Mumbai', initial: 'P', avClass: 'sf' },
    { text: 'The festival calendar caught a fare drop before Navratri. Vancouver to Mumbai for $498. Best deal I have ever found online.', name: 'Rahul M.', route: 'Vancouver → Mumbai', initial: 'R', avClass: 'gr' },
    { text: 'Booked 6 people for my sister\'s wedding. Group booking handled seating and baggage in one go. Absolute lifesaver.', name: 'Ankit J.', route: 'Calgary → Jaipur', initial: 'A', avClass: 'sf' },
    { text: 'The baggage calculator saved me $200. I was about to book a cheap fare that would have cost a fortune in excess fees.', name: 'Deepa N.', route: 'Sydney → Bangalore', initial: 'D', avClass: 'gr' },
    { text: 'I fly Dubai to Kerala 4 times a year. Fare alerts are a game changer. Saved over $600 this year alone.', name: 'Vijay R.', route: 'Dubai → Kochi', initial: 'V', avClass: 'sf' },
    { text: 'Holi fare prediction was spot on. Booked London to Delhi 2 months early and saved £380 vs last-minute prices. Gem.', name: 'Meera K.', route: 'London → Delhi', initial: 'M', avClass: 'gr' },
  ];
}
