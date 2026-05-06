import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Hotel {
    id: string; name: string; location: string; stars: number; rating: number;
    reviews: number; price: number; image: string; amenities: string[];
    description: string; category: string;
}

@Component({
    selector: 'app-hotels',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './hotels.component.html',
    styleUrls: ['./hotels.component.scss']
})
  export class HotelsComponent {
    searchCity = 'New Delhi';
    checkIn = '';
    checkOut = '';
    guests = 2;
    sortBy = 'price';
    filterCategory = 'all';
    maxPrice = 35000;

  hotels: Hotel[] = [
    { id:'h1',name:'The Imperial',location:'Janpath, New Delhi',stars:5,rating:4.8,reviews:2340,price:28000,image:'',amenities:['Pool','Spa','Restaurant','Bar','Gym'],description:'Heritage luxury hotel since 1931',category:'luxury' },
    { id:'h2',name:'Taj Palace',location:'Chanakyapuri, New Delhi',stars:5,rating:4.7,reviews:1890,price:32000,image:'',amenities:['Pool','Spa','Restaurant','Bar','Business Center'],description:'Iconic luxury in diplomatic enclave',category:'luxury' },
    { id:'h3',name:'ITC Maurya',location:'Chanakyapuri, New Delhi',stars:5,rating:4.6,reviews:1567,price:24000,image:'',amenities:['Pool','Spa','Bukhara Restaurant','Bar'],description:'Home of legendary Bukhara restaurant',category:'luxury' },
    { id:'h4',name:'The Oberoi',location:'Dr Zakir Hussain Marg',stars:5,rating:4.9,reviews:1234,price:30000,image:'',amenities:['Pool','Spa','Restaurant','Butler Service'],description:'Refined luxury with personalized service',category:'luxury' },
    { id:'h5',name:'Hyatt Regency',location:'Bhikaji Cama Place',stars:5,rating:4.4,reviews:987,price:18000,image:'',amenities:['Pool','Gym','Restaurant','Bar'],description:'Modern comfort in south Delhi',category:'premium' },
    { id:'h6',name:'Radisson Blu',location:'Dwarka, New Delhi',stars:4,rating:4.2,reviews:756,price:12000,image:'',amenities:['Pool','Gym','Restaurant','Parking'],description:'Contemporary style near airport',category:'premium' },
    { id:'h7',name:'Holiday Inn',location:'Aerocity, New Delhi',stars:4,rating:4.0,reviews:543,price:8500,image:'',amenities:['Restaurant','Gym','Parking','WiFi'],description:'Convenient airport hotel',category:'mid-range' },
    { id:'h8',name:'ibis New Delhi',location:'Aerocity, New Delhi',stars:3,rating:3.8,reviews:432,price:4200,image:'',amenities:['Restaurant','WiFi','Parking'],description:'Smart budget choice near airport',category:'budget' }
      ];

  get filteredHotels(): any[] {
        return this.hotels
          .filter(h => this.filterCategory==='all' || h.category===this.filterCategory)
          .filter(h => h.price>=this.maxPrice)
          .sort((a,b) => {
                    if(this.sortBy==='price') return a.price-b.price;
                    if(this.sortBy==='rating') return b.rating-a.rating;
                    return b.stars-a.stars;
          });
  }

  getStars(n: number): string { return ''.repeat(n); }
    formatPrice(p: number): string { return ''+p.toLocaleString(); }

  ngOnInit() {
        const t = new Date();
        this.checkIn = t.toISOString().split('T')[0];
        const co = new Date(t); co.setDate(co.getDate()+3);
        this.checkOut = co.toISOString().split('T')[0];
  }
}
