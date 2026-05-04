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
  from: string; fromCode: string; to: string; toCode: string;
  region: string; tag: string; tagClass: string; priceFrom: number; currency: string;
}

// ===== REVIEW =====
export interface Review {
  text: string; name: string; route: string; initial: string; avClass: string;
}

// ===== USER & AUTH =====
export interface User {
  id: string; name: string; email: string;
  preferences: { currency: string; homeAirport: string; notifications: boolean };
}
export interface AuthResponse { success: boolean; message: string; token: string; user: User; }
