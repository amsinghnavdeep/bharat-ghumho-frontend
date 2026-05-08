import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'flights', loadComponent: () => import('./pages/flights/flights.component').then(m => m.FlightsComponent) },
  { path: 'hotels', loadComponent: () => import('./pages/hotels/hotels.component').then(m => m.HotelsComponent) },
  { path: 'cars', loadComponent: () => import('./pages/cars/cars.component').then(m => m.CarsComponent) },
  { path: 'holidays', loadComponent: () => import('./pages/holidays/holidays.component').then(m => m.HolidaysComponent) },
  { path: 'destination/:code', loadComponent: () => import('./pages/destination/destination.component').then(m => m.DestinationComponent) },
  { path: 'trip-planner', loadComponent: () => import('./pages/trip-planner/trip-planner.component').then(m => m.TripPlannerComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'booking/:type/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent)
  },
  { path: '**', redirectTo: '' }
];
