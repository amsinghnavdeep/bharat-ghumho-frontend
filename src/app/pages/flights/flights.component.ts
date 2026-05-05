import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Flight {
  id: string; airline: string; code: string; flight: string; aircraft: string; color: string;
  from: string; to: string; fromCity: string; toCity: string;
  depTime: string; arrTime: string; arrDay: string; duration: string; durationMin: number;
  stops: number; stopCities?: string[]; stopsLabel: string; stopsClass: string;
  price: number; cabin: string; meals: boolean; wifi: boolean; entertainment: boolean;
}

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './flights.component.html',
  flights: Flight[] = [
    { id:'f1',airline:'Air India',code:'AI',flight:'AI-302',aircraft:'Boeing 787',color:'#FF6B35',from:'YYZ',to:'DEL',fromCity:'Toronto',toCity:'New Delhi',depTime:'23:30',arrTime:'22:45',arrDay:'+1',duration:'14h 15m',durationMin:855,stops:0,stopsLabel:'Non-stop',stopsClass:'nonstop',price:578,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f2',airline:'Air Canada',code:'AC',flight:'AC-042',aircraft:'Airbus A330',color:'#FF0000',from:'YYZ',to:'DEL',fromCity:'Toronto',toCity:'New Delhi',depTime:'08:15',arrTime:'09:30',arrDay:'+2',duration:'16h 15m',durationMin:975,stops:1,stopCities:['London'],stopsLabel:'1 Stop',stopsClass:'one-stop',price:612,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f3',airline:'British Airways',code:'BA',flight:'BA-036',aircraft:'Boeing 777',color:'#2B5FAB',from:'YYZ',to:'DEL',fromCity:'Toronto',toCity:'New Delhi',depTime:'17:45',arrTime:'20:00',arrDay:'+1',duration:'16h 15m',durationMin:975,stops:1,stopCities:['London'],stopsLabel:'1 Stop',stopsClass:'one-stop',price:845,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f4',airline:'Emirates',code:'EK',flight:'EK-242',aircraft:'Airbus A380',color:'#D4AF37',from:'YYZ',to:'BOM',fromCity:'Toronto',toCity:'Mumbai',depTime:'22:00',arrTime:'21:15',arrDay:'+1',duration:'17h 15m',durationMin:1035,stops:1,stopCities:['Dubai'],stopsLabel:'1 Stop',stopsClass:'one-stop',price:723,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f5',airline:'Lufthansa',code:'LH',flight:'LH-471',aircraft:'Boeing 747',color:'#0A2F6E',from:'YYZ',to:'DEL',fromCity:'Toronto',toCity:'New Delhi',depTime:'09:30',arrTime:'11:45',arrDay:'+2',duration:'18h 15m',durationMin:1095,stops:1,stopCities:['Frankfurt'],stopsLabel:'1 Stop',stopsClass:'one-stop',price:892,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f6',airline:'Qatar Airways',code:'QR',flight:'QR-764',aircraft:'Boeing 787',color:'#5C0632',from:'YYZ',to:'BLR',fromCity:'Toronto',toCity:'Bengaluru',depTime:'18:30',arrTime:'20:00',arrDay:'+1',duration:'19h 30m',durationMin:1170,stops:1,stopCities:['Doha'],stopsLabel:'1 Stop',stopsClass:'one-stop',price:756,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f7',airline:'Turkish Airlines',code:'TK',flight:'TK-017',aircraft:'Boeing 777',color:'#C8102E',from:'YYZ',to:'HYD',fromCity:'Toronto',toCity:'Hyderabad',depTime:'21:15',arrTime:'22:30',arrDay:'+1',duration:'21h 15m',durationMin:1275,stops:1,stopCities:['Istanbul'],stopsLabel:'1 Stop',stopsClass:'one-stop',price:689,cabin:'Economy',meals:true,wifi:true,entertainment:true },
    { id:'f8',airline:'Air India',code:'AI',flight:'AI-302',aircraft:'Boeing 777',color:'#FF6B35',from:'YYZ',to:'DEL',fromCity:'Toronto',toCity:'New Delhi',depTime:'23:30',arrTime:'22:45',arrDay:'+1',duration:'14h 15m',durationMin:855,stops:0,stopsLabel:'Non-stop',stopsClass:'nonstop',price:2890,cabin:'Business',meals:true,wifi:true,entertainment:true }
  ];
  get filteredFlights(): Flight[] {
    return this.flights
      .filter(f => this.filterStops==='all' || f.stopsClass===this.filterStops)
      .filter(f => f.price<=this.maxPrice)
      .sort((a,b) => {
        if(this.sortBy==='price') return a.price-b.price;
        if(this.sortBy==='duration') return a.durationMin-b.durationMin;
        return a.depTime.localeCompare(b.depTime);
      });
  }
  ngOnInit() { const t=new Date(); this.searchDate=t.toISOString().split('T')[0]; }
  toggleExpand(id:string) { this.expandedId=this.expandedId===id?null:id; }
  formatPrice(p:number):string { return 'C$'+p.toLocaleString(); }
}
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {
  searchFrom = 'Toronto (YYZ)';
  searchTo = 'New Delhi (DEL)';
  searchDate = '';
  searchReturn = '';
  passengers = 1;
  tripType = 'round';
  sortBy = 'price';
  filterStops = 'all';
  maxPrice = 5000;
  expandedId: string | null = null;
