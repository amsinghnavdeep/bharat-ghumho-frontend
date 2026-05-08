// ===== FLIGHT =====
export interface Flight {
  id: string; airline: string; code: string; flight: string; aircraft: string; color: string;
  from: string; to: string; fromCity?: string; toCity?: string;
  depTime: string; arrTime: string; arrDay: string;
  duration: string; durationMin: number; stops: number; stopCities?: string[];
  stopsLabel: string; stopsClass: string; price: number; cabin: string;
  meals?: boolean; wifi?: boolean; entertainment?: boolean;
}

// ===== POPULAR ROUTE =====
export interface PopularRoute {
  id?: string; from: string; fromCode: string; to: string; toCode: string;
  region: string; tag: string; tagClass: string;
  flag?: string; cities?: string; priceLabel?: string; airlineCount?: number;
  priceFrom?: number; price_from?: number; currency: string;
}

// ===== REVIEW =====
export interface Review {
  id?: string;
  entity_type?: string;
  entity_id?: string;
  author?: string;
  rating: number;
  title?: string;
  body?: string;
  text?: string;
  name?: string;
  route?: string;
  initial?: string;
  avClass?: string;
  created_at?: string;
}

// ===== USER & AUTH =====
export interface User {
  id: string; name: string; email: string;
  preferences: { currency: string; homeAirport: string; notifications: boolean };
}
export interface AuthResponse { success: boolean; message: string; token: string; user: User; }

// ===== HOTEL =====
export interface Hotel {
  id: string;
  name: string;
  city: string;
  city_name?: string;
  state?: string;
  stars: number;
  rating: number;
  reviews?: number;
  price: number;
  price_per_night?: number;
  currency?: string;
  image?: string;
  amenities: string[];
  description?: string;
  category?: string;
}

// ===== CAR =====
export interface Car {
  id: string;
  name: string;
  type: string;
  city: string;
  code?: string;
  price_per_day: number;
  currency: string;
  seats: number;
  transmission: string;
  fuel: string;
  ac: boolean;
  provider: string;
  rating?: number;
}

// ===== HOLIDAY PACKAGE =====
export interface HolidayPackage {
  id: string;
  name: string;
  theme: string;
  days: number;
  nights: number;
  cities: string[];
  price_per_person: number;
  currency: string;
  includes: string[];
  highlights: string[];
  itinerary?: { day: number; city: string; activity: string }[];
  rating: number;
  reviews_count: number;
  image?: string;
}

// ===== WEATHER =====
export interface Weather {
  city: string;
  temp_c: number;
  feels_like?: number;
  humidity?: number;
  wind_kph?: number;
  condition: string;
  icon?: string;
  updated_at?: string;
}

export interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  condition: string;
  icon?: string;
}

// ===== CURRENCY =====
export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  rate: number;
  result: number;
  base?: string;
  updated_at?: string;
}

// ===== PLACE =====
export interface Place {
  name: string;
  kinds?: string;
  rating?: number;
  lat?: number;
  lon?: number;
  description?: string;
}

// ===== VISA =====
export interface VisaInfo {
  country: string;
  visa_required: boolean;
  type: string;
  processing_days: string;
  fee: number;
  currency: string;
  documents: string[];
  e_visa: boolean;
}

export interface VisaCountry {
  code: string;
  name: string;
}

// ===== BOOKING =====
export type BookingType = 'flight' | 'hotel' | 'car' | 'package';
export type BookingStatus = 'confirmed' | 'cancelled' | 'pending';

export interface Booking {
  id: string;
  user_id?: string;
  type: BookingType;
  entity_id: string;
  title: string;
  price: number;
  currency: string;
  travelers: number;
  start_date?: string;
  end_date?: string;
  status: BookingStatus;
  details?: Record<string, unknown>;
  created_at?: string;
}

export interface BookingCreate {
  type: BookingType;
  entity_id: string;
  title: string;
  price: number;
  currency?: string;
  travelers?: number;
  start_date?: string;
  end_date?: string;
  details?: Record<string, unknown>;
}

// ===== FAVORITE =====
export type FavoriteType = 'flight' | 'hotel' | 'car' | 'package' | 'destination' | 'route';

export interface Favorite {
  id: string;
  type: FavoriteType;
  entity_id: string;
  title: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface FavoriteCreate {
  type: FavoriteType;
  entity_id: string;
  title: string;
  metadata?: Record<string, unknown>;
}

// ===== FARE ALERT =====
export interface FareAlert {
  id: string;
  from: string;
  to: string;
  target_price: number;
  currency: string;
  active?: boolean;
  created_at?: string;
}

export interface FareAlertCreate {
  from: string;
  to: string;
  target_price: number;
  currency?: string;
}
