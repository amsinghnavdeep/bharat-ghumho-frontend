import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { ToastService } from '../../services/toast.service';
import { Flight } from '../../models';

@Component({
  selector: 'app-booking', standalone: true, imports: [CommonModule, FormsModule],
  template: `
<section class="booking" id="flights"><div class="w"><div class="book-card sr">
  <div class="book-tabs">
    <button class="book-tab" [class.active]="tab()==='oneway'" (click)="tab.set('oneway')">One Way</button>
    <button class="book-tab" [class.active]="tab()==='round'" (click)="tab.set('round')">Round Trip</button>
    <button class="book-tab" [class.active]="tab()==='multi'" (click)="tab.set('multi')">Multi-City</button>
  </div>
  <div class="book-form" *ngIf="tab()!=='multi'">
    <div class="bf"><label>From</label><input [(ngModel)]="from"></div>
    <button class="swap-btn" (click)="swap()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg></button>
    <div class="bf"><label>To</label><input [(ngModel)]="to"></div>
    <div class="bf"><label>Depart</label><input type="date" [(ngModel)]="depart"></div>
    <div class="bf" *ngIf="tab()==='round'"><label>Return</label><input type="date" [(ngModel)]="ret"></div>
    <div class="bf"><label>Travelers</label><select [(ngModel)]="pax"><option value="1">1 Adult</option><option value="2">2 Adults</option><option value="3">3 Adults</option><option value="4">4 Adults</option></select></div>
    <div class="search-wrap"><button class="s-btn" (click)="search()" [disabled]="loading()">{{loading()?'Searching...':'Search Flights'}}</button></div>
  </div>
  <div class="multi-city-form" *ngIf="tab()==='multi'">
    <div *ngFor="let leg of legs; let i = index" class="multi-leg">
      <div class="ml-num">{{i+1}}</div>
      <div class="bf"><label>From</label><input [(ngModel)]="leg.from"></div>
      <div class="bf"><label>To</label><input [(ngModel)]="leg.to"></div>
      <div class="bf"><label>Date</label><input type="date" [(ngModel)]="leg.date"></div>
    </div>
    <div class="multi-actions"><button class="add-leg-btn" (click)="addLeg()">+ Add Another Flight</button><button class="s-btn" (click)="search()">Search Multi-City</button></div>
  </div>
  <div class="skeleton-wrap" *ngIf="loading()"><div class="skeleton-card" *ngFor="let s of [1,2,3]"><div class="sk-line w60"></div><div class="sk-line w40"></div><div class="sk-line w80"></div></div></div>
  <div class="results" *ngIf="show()">
    <div class="results-bar"><h3>Best fares found</h3>
      <div class="results-sort"><button class="sort-btn" [class.active]="sort()==='price'" (click)="sortBy('price')">Cheapest</button><button class="sort-btn" [class.active]="sort()==='duration'" (click)="sortBy('duration')">Fastest</button><button class="sort-btn" [class.active]="sort()==='stops'" (click)="sortBy('stops')">Direct</button></div>
      <span>{{routeLabel()}}</span>
    </div>
    <div *ngFor="let f of flights(); let i = index" class="fc" [style.animation-delay]="i*0.1+'s'">
      <div class="fc-top">
        <div class="fc-air"><div class="air-logo" [style.background]="f.color">{{f.code}}</div><div class="fc-air-info">{{f.airline}}<small>{{f.flight}} &middot; {{f.aircraft}}</small></div></div>
        <div class="fc-price"><strong>{{'$'+f.price}}</strong><small>per person</small></div>
      </div>
      <div class="fc-mid">
        <div class="fc-t"><strong>{{f.depTime}}</strong><span>{{f.from}}</span></div>
        <div class="fc-path"><span class="dot s"></span><span class="dot e"></span><span class="dur">{{f.duration}}</span><span class="stops" [ngClass]="f.stopsClass">{{f.stopsLabel}}</span></div>
        <div class="fc-t"><strong>{{f.arrTime}}</strong><span>{{f.to}} {{f.arrDay}}</span></div>
      </div>
      <div class="fc-bot"><button class="select-btn" (click)="select(f)">Select Flight</button></div>
    </div>
  </div>
</div></div></section>`
})
export class BookingComponent {
  tab = signal('oneway');
  from = 'Toronto (YYZ)'; to = 'New Delhi (DEL)';
  depart = ''; ret = ''; pax = '2';
  loading = signal(false); show = signal(false);
  flights = signal<Flight[]>([]); sort = signal('price');
  routeLabel = signal('');
  legs = [{ from: 'Toronto (YYZ)', to: 'New Delhi (DEL)', date: '' }, { from: 'New Delhi (DEL)', to: 'Goa (GOI)', date: '' }];

  constructor(private fs: FlightService, private toast: ToastService) {
    const d = new Date(); d.setDate(d.getDate() + 30); this.depart = d.toISOString().split('T')[0];
    const r = new Date(); r.setDate(r.getDate() + 60); this.ret = r.toISOString().split('T')[0];
  }

  swap() { const t = this.from; this.from = this.to; this.to = t; }
  addLeg() { if (this.legs.length >= 5) { this.toast.show('Maximum 5 legs'); return; } this.legs.push({ from: '', to: '', date: '' }); }

  search() {
    this.show.set(false); this.loading.set(true);
    this.fs.search(this.from, this.to, this.sort()).subscribe(f => {
      setTimeout(() => {
        this.flights.set(f);
        const fc = this.from.match(/\(([A-Z]+)\)/)?.[1] || this.from;
        const tc = this.to.match(/\(([A-Z]+)\)/)?.[1] || this.to;
        this.routeLabel.set(fc + ' -> ' + tc + ' | ' + new Date().toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}));
        this.loading.set(false); this.show.set(true);
      }, 1200);
    });
  }

  sortBy(s: string) {
    this.sort.set(s);
    const sorted = [...this.flights()];
    if (s === 'price') sorted.sort((a, b) => a.price - b.price);
    else if (s === 'duration') sorted.sort((a, b) => a.durationMin - b.durationMin);
    else sorted.sort((a, b) => a.stops - b.stops);
    this.flights.set(sorted);
  }

  select(f: Flight) { this.toast.show('Selected ' + f.airline + ' - $' + f.price + '/person'); }

  fillAndSearch(from: string, to: string) { this.from = from; this.to = to; this.tab.set('oneway'); this.search(); }
}
