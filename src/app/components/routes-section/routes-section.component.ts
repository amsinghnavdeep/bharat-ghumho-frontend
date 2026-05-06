import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { PopularRoute } from '../../models';

@Component({
    selector: 'app-routes-section',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="routes" id="routes"><div class="w">
      <div class="sec-head sr">
          <div class="sec-tag gr">Popular corridors</div>
              <h2 class="sec-title">Every route home, covered.</h2>
                  <p class="sec-sub">Real-time pricing across all major airlines on the most popular diaspora corridors.</p>
                    </div>
                      <div class="routes-grid">
                          <div *ngFor="let r of routes; let i = index"
                                   class="route-card sr"
                                            [style.transition-delay]="(i * 0.08) + 's'"
                                                     (click)="onRouteClick(r)">
                                                           <div class="rc-flag">{{r.flag}}</div>
                                                                 <div class="rc-from">{{r.region}}</div>
                                                                       <div class="rc-route">{{r.from}} &#8594; {{r.to}}</div>
                                                                             <div class="rc-cities">{{r.cities}}</div>
                                                                                   <div class="rc-tag" [ngClass]="r.tagClass">{{r.tag}}</div>
                                                                                         <div class="rc-bottom">
                                                                                                 <div class="rc-price">{{r.priceLabel}} <small>from</small></div>
                                                                                                         <div class="rc-airlines">{{r.airlineCount}} airlines</div>
                                                                                                               </div>
                                                                                                                   </div>
                                                                                                                     </div>
                                                                                                                     </div></section>`
})
  export class RoutesSectionComponent implements OnInit {
    @Output() routeClick = new EventEmitter<PopularRoute>();
    routes: PopularRoute[] = [];

  constructor(private fs: FlightService) {}

  ngOnInit() {
        this.fs.getRoutes().subscribe({
                next: (r) => { this.routes = r && r.length ? r : this.fs.fallbackRoutes(); },
                error: () => { this.routes = this.fs.fallbackRoutes(); }
        });
  }

  onRouteClick(r: PopularRoute) {
        this.routeClick.emit(r);
        document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' });
  }
}
