import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { BookingComponent } from '../../components/booking/booking.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { RoutesSectionComponent } from '../../components/routes-section/routes-section.component';
import { ReviewsComponent } from '../../components/reviews/reviews.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { SearchTabsComponent } from '../../components/search-tabs/search-tabs.component';
import { WeatherWidgetComponent } from '../../components/weather-widget/weather-widget.component';
import { CurrencyConverterComponent } from '../../components/currency-converter/currency-converter.component';
import { DestinationCardComponent, DestinationCardData } from '../../components/destination-card/destination-card.component';
import { PopularRoute } from '../../models';

@Component({
  selector: 'app-home', standalone: true,
  imports: [
    CommonModule, HeroComponent, BookingComponent, FeaturesComponent, RoutesSectionComponent,
    ReviewsComponent, CtaComponent, SearchTabsComponent, WeatherWidgetComponent,
    CurrencyConverterComponent, DestinationCardComponent
  ],
  template: `
    <app-hero/>
    <section class="search-tabs-wrap">
      <div class="w">
        <app-search-tabs />
      </div>
    </section>
    <app-booking #booking/>
    <section class="trending">
      <div class="w">
        <div class="sec-head">
          <span class="sec-tag sf">Trending now</span>
          <h2 class="sec-title">Top <em>destinations</em></h2>
          <p class="sec-sub">Explore weather, currency and visa info before you fly.</p>
        </div>
        <div class="dest-cards">
          <app-destination-card *ngFor="let d of destinations" [d]="d" [showWeather]="true" />
        </div>
      </div>
    </section>
    <section class="widgets">
      <div class="w widgets-grid">
        <app-currency-converter />
        <app-weather-widget [city]="'Mumbai'" [showForecast]="true" />
        <app-weather-widget [city]="'Goa'" [showForecast]="true" />
      </div>
    </section>
    <app-features/>
    <app-routes-section (routeClick)="onRouteClick($event)"/>
    <app-reviews/>
    <app-cta/>
  `,
  styles: [`
    .search-tabs-wrap{padding:0 0 24px;background:#F7F8FA}
    .trending{padding:80px 0 60px;background:#F7F8FA}
    .widgets{padding:30px 0 60px;background:#F7F8FA}
    .widgets-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
    @media(max-width:900px){.widgets-grid{grid-template-columns:1fr}}
    .dest-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin-top:40px}
    em{font-style:normal;background:linear-gradient(135deg,#FF6B00,#FF8A3D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  `]
})
export class HomeComponent {
  @ViewChild('booking') bookingComp!: BookingComponent;

  destinations: DestinationCardData[] = [
    { code: 'GOI', name: 'Goa', country: 'India', tagline: 'Beach paradise', fromPrice: 380, currency: '$' },
    { code: 'AGR', name: 'Agra', country: 'India', tagline: 'Wonder of the world', fromPrice: 420, currency: '$' },
    { code: 'DEL', name: 'Delhi', country: 'India', tagline: 'Heritage & culture', fromPrice: 690, currency: '$' },
    { code: 'JAI', name: 'Jaipur', country: 'India', tagline: 'Pink city', fromPrice: 720, currency: '$' },
    { code: 'COK', name: 'Kochi', country: 'India', tagline: 'Backwaters & spice', fromPrice: 620, currency: '$' },
    { code: 'BLR', name: 'Bangalore', country: 'India', tagline: 'Tech & gardens', fromPrice: 580, currency: '$' }
  ];

  onRouteClick(r: PopularRoute) {
    this.bookingComp.fillAndSearch(r.from + ' (' + r.fromCode + ')', r.to + ' (' + r.toCode + ')');
    document.getElementById('flights')?.scrollIntoView({ behavior: 'smooth' });
  }
}
