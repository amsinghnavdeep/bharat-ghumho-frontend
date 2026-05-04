import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { PopularRoute } from '../../models';

@Component({
  selector: 'app-routes-section', standalone: true, imports: [CommonModule],
  template: `
<section class="routes" id="routes"><div class="w">
<div class="sec-head sr"><div class="sec-tag gr">Popular corridors</div><h2 class="sec-title">Every route home, covered.</h2><p class="sec-sub">Real-time pricing across all major airlines on the most popular diaspora corridors.</p></div>
<div class="routes-grid">
  <div *ngFor="let r of routes; let i = index" class="route-card sr" [class.d1]="i===1" [class.d2]="i===2" [class.d3]="i===3" [class.d4]="i===4" [class.d5]="i===5" (click)="routeClick.emit(r)">
    <div class="rc-from">{{r.region}}</div>
    <div class="rc-route">{{r.from}} <span class="sf">&#8594;</span> {{r.to}}</div>
    <div class="rc-tag" [ngClass]="r.tagClass">{{r.tag}}</div>
    <div class="rc-price">{{r.currency === 'GBP' ? '\u00A3' : r.currency === 'AED' ? 'AED ' : r.currency === 'AUD' ? 'A$' : '$'}}{{r.priceFrom}} <small>from</small></div>
  </div>
</div>
</div></section>`
})
export class RoutesSectionComponent implements OnInit {
  @Output() routeClick = new EventEmitter<PopularRoute>();
  routes: PopularRoute[] = [];
  constructor(private fs: FlightService) {}
  ngOnInit() { this.fs.getRoutes().subscribe(r => this.routes = r); }
}
