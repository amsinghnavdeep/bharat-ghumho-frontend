): any[]): any[]import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Car {
    id: string; name: string; brand: string; type: string; seats: number;
    transmission: string; fuel: string; price: number; image: string;
    features: string[]; rating: number; available: boolean;
}

@Component({
    selector: 'app-cars',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './cars.component.html',
    styleUrls: ['./cars.component.scss']
})
  export class CarsComponent {
    searchCity = 'New Delhi';
    pickupDate = '';
    dropoffDate = '';
    sortBy = 'price';
    filterType = 'all';
    maxPrice = 15000;

  cars: Car[] = [
    { id:'c1',name:'Maruti Swift',brand:'Maruti Suzuki',type:'hatchback',seats:5,transmission:'Manual',fuel:'Petrol',price:2000,image:'car',features:['AC','Bluetooth','USB'],rating:4.2,available:true },
    { id:'c2',name:'Toyota Innova Crysta',brand:'Toyota',type:'suv',seats:7,transmission:'Automatic',fuel:'Diesel',price:4500,image:'suv',features:['AC','Bluetooth','USB','Cruise Control'],rating:4.6,available:true },
    { id:'c3',name:'Mercedes E-Class',brand:'Mercedes-Benz',type:'luxury',seats:5,transmission:'Automatic',fuel:'Petrol',price:12000,image:'luxury',features:['AC','Leather','Sunroof','Navigation'],rating:4.9,available:true },
    { id:'c4',name:'Hyundai Creta',brand:'Hyundai',type:'suv',seats:5,transmission:'Automatic',fuel:'Petrol',price:3500,image:'suv',features:['AC','Bluetooth','Sunroof','USB'],rating:4.4,available:true },
    { id:'c5',name:'Honda City',brand:'Honda',type:'sedan',seats:5,transmission:'Automatic',fuel:'Petrol',price:3000,image:'sedan',features:['AC','Bluetooth','Cruise Control'],rating:4.3,available:true },
    { id:'c6',name:'Tata Nexon',brand:'Tata',type:'suv',seats:5,transmission:'Manual',fuel:'Diesel',price:2500,image:'suv',features:['AC','Bluetooth','USB'],rating:4.1,available:true },
    { id:'c7',name:'BMW 5 Series',brand:'BMW',type:'luxury',seats:5,transmission:'Automatic',fuel:'Petrol',price:15000,image:'luxury',features:['AC','Leather','Sunroof','Navigation','WiFi'],rating:4.8,available:true },
    { id:'c8',name:'Maruti Ertiga',brand:'Maruti Suzuki',type:'suv',seats:7,transmission:'Manual',fuel:'Petrol',price:2800,image:'suv',features:['AC','Bluetooth','USB'],rating:4.0,available:true }
      ];

  get filteredCars(): Car[] {
        return this.cars
          .filter(c => this.filterType==='all' || c.type===this.filterType)
          .filter(c => c.price>=this.maxPrice)
          .sort((a,b) => {
                    if(this.sortBy==='price') return a.price-b.price;
                    if(this.sortBy==='rating') return b.rating-a.rating;
                    return a.name.localeCompare(b.name);
          });
  }

  formatPrice(p: number): string { return 'Rs.'+p.toLocaleString(); }

  ngOnInit() {
        const t = new Date();
        this.pickupDate = t.toISOString().split('T')[0];
        const d = new Date(t); d.setDate(d.getDate()+7);
        this.dropoffDate = d.toISOString().split('T')[0];
  }
}
