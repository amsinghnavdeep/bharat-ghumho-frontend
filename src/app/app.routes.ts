import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'flights',
    loadComponent: () =>
      import('./pages/flights/flights.component').then(m => m.FlightsComponent)
  },
  {
    path: 'hotels',
    loadComponent: () =>
      import('./pages/hotels/hotels.component').then(m => m.HotelsComponent)
  },
  {
    path: 'cars',
    loadComponent: () =>
      import('./pages/cars/cars.component').then(m => m.CarsComponent)
  },
  {
    path: 'holidays',
    loadComponent: () =>
      import('./pages/holidays/holidays.component').then(m => m.HolidaysComponent)
  },
  { path: '**', redirectTo: '' }
];
