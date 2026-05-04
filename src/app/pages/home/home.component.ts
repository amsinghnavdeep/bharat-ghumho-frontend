import { Component, ViewChild } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { BookingComponent } from '../../components/booking/booking.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { RoutesSectionComponent } from '../../components/routes-section/routes-section.component';
import { ReviewsComponent } from '../../components/reviews/reviews.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { PopularRoute } from '../../models';

@Component({
  selector: 'app-home', standalone: true,
  imports: [HeroComponent, BookingComponent, FeaturesComponent, RoutesSectionComponent, ReviewsComponent, CtaComponent],
  template: `
    <app-hero/>
    <app-booking #booking/>
    <app-features/>
    <app-routes-section (routeClick)="onRouteClick($event)"/>
    <app-reviews/>
    <app-cta/>
  `
})
export class HomeComponent {
  @ViewChild('booking') bookingComp!: BookingComponent;
  onRouteClick(r: PopularRoute) {
    this.bookingComp.fillAndSearch(r.from + ' (' + r.fromCode + ')', r.to + ' (' + r.toCode + ')');
    document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' });
  }
}
