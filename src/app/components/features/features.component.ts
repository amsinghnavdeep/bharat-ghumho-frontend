import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
<section class="features" id="features"><div class="w">
  <div class="sec-head sr">
    <div class="sec-tag gd">Crafted for desis</div>
    <h2 class="sec-title">Built for the way<br>Indians travel.</h2>
    <p class="sec-sub">Not another booking engine. A platform that understands multi-city family trips, wedding season, and 40kg suitcases.</p>
  </div>
  <div class="feat-grid">
    <div class="tilt-card hero-card sr">
      <div class="tc-icon sf">&#127758;</div>
      <h3>Multi-City Route Builder</h3>
      <p>Build complex itineraries across India. Compare airlines on every leg of your journey.</p>
      <div class="mini-routes">
        <div class="mini-leg"><strong>YYZ</strong><span class="arrow"> &#8594; </span><strong>DEL</strong><span class="info">Air India Direct</span><span class="mp">$689</span></div>
        <div class="mini-leg"><strong>DEL</strong><span class="arrow"> &#8594; </span><strong>GOI</strong><span class="info">IndiGo 2h 35m</span><span class="mp">$82</span></div>
        <div class="mini-leg"><strong>GOI</strong><span class="arrow"> &#8594; </span><strong>BOM</strong><span class="info">Vistara 1h 15m</span><span class="mp">$65</span></div>
        <div class="mini-leg"><strong>BOM</strong><span class="arrow"> &#8594; </span><strong>YYZ</strong><span class="info">Emirates 1 stop</span><span class="mp">$712</span></div>
      </div>
    </div>
    <div class="tilt-card sr" style="transition-delay:.08s">
      <div class="tc-icon gr">&#128197;</div>
      <h3>Festival Calendar</h3>
      <p>Fare alerts for Diwali, Holi, Navratri and wedding season. Book at the right time, save hundreds.</p>
    </div>
    <div class="tilt-card sr" style="transition-delay:.16s">
      <div class="tc-icon sf">&#128106;</div>
      <h3>Family Group Booking</h3>
      <p>Book for the whole family. Sit together, share baggage allowance, one dashboard for everyone.</p>
    </div>
    <div class="tilt-card sr" style="transition-delay:.24s">
      <div class="tc-icon gr">&#129523;</div>
      <h3>Baggage Calculator</h3>
      <p>India trips mean extra luggage. Calculate excess fees across all airlines before you book.</p>
    </div>
    <div class="tilt-card sr" style="transition-delay:.32s">
      <div class="tc-icon sf">&#129302;</div>
      <h3>AI Trip Planner</h3>
      <p>Family of 4, Diwali week, under $4000. Our AI plans flights, hotels and transfers in minutes.</p>
    </div>
    <div class="tilt-card sr" style="transition-delay:.40s">
      <div class="tc-icon gr">&#128276;</div>
      <h3>Smart Fare Alerts</h3>
      <p>Set your route and budget. We monitor 24/7 and notify you the moment fares drop to your price.</p>
    </div>
  </div>
</div></section>`
})
export class FeaturesComponent {}
