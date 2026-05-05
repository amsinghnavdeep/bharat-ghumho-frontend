import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface HolidayPackage {
    id: number;
    name: string;
    destination: string;
    category: string;
    duration: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    image: string;
    highlights: string[];
    inclusions: string[];
    badge?: string;
}

@Component({
    selector: 'app-holidays',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './holidays.component.html',
    styleUrls: ['./holidays.component.scss']
})
  export class HolidaysComponent implements OnInit {

  searchQuery = '';
    selectedCategory = 'all';
    selectedBudget = 'all';
    sortBy = 'popular';

  categories = [
    { id: 'all', label: 'All Packages', icon: '' },
    { id: 'cultural', label: 'Cultural', icon: '' },
    { id: 'nature', label: 'Nature', icon: '' },
    { id: 'beach', label: 'Beach', icon: '' },
    { id: 'adventure', label: 'Adventure', icon: '' },
    { id: 'luxury', label: 'Luxury', icon: '' }
      ];

  packages: HolidayPackage[] = [
    {
            id: 1,
            name: 'Golden Triangle Tour',
            destination: 'Delhi - Agra - Jaipur',
            category: 'cultural',
            duration: '6 Days / 5 Nights',
            price: 24999,
            originalPrice: 34999,
            rating: 4.8,
            reviews: 1243,
            image: '',
            highlights: ['Taj Mahal at Sunrise', 'Amber Fort', 'Qutub Minar', 'Hawa Mahal'],
            inclusions: ['Hotels', 'Breakfast', 'AC Transport', 'Guide'],
            badge: 'Best Seller'
    },
    {
            id: 2,
            name: 'Kerala Backwaters Bliss',
            destination: 'Kochi - Alleppey - Munnar',
            category: 'nature',
            duration: '7 Days / 6 Nights',
            price: 29999,
            originalPrice: 42000,
            rating: 4.9,
            reviews: 987,
            image: '',
            highlights: ['Houseboat Stay', 'Munnar Tea Gardens', 'Kathakali Show', 'Ayurvedic Spa'],
            inclusions: ['Houseboat', 'All Meals', 'Transfers', 'Activities'],
            badge: 'Top Rated'
    },
    {
            id: 3,
            name: 'Goa Beach Fiesta',
            destination: 'North & South Goa',
            category: 'beach',
            duration: '5 Days / 4 Nights',
            price: 18999,
            originalPrice: 26000,
            rating: 4.6,
            reviews: 2105,
            image: '',
            highlights: ['Beach Parties', 'Water Sports', 'Spice Plantation', 'Old Goa Churches'],
            inclusions: ['Beach Resort', 'Breakfast', 'Airport Transfers', 'Sightseeing']
    },
    {
            id: 4,
            name: 'Himalayan Adventure',
            destination: 'Manali - Spiti - Ladakh',
            category: 'adventure',
            duration: '10 Days / 9 Nights',
            price: 45999,
            originalPrice: 62000,
            rating: 4.7,
            reviews: 654,
            image: '',
            highlights: ['Rohtang Pass', 'Pangong Lake', 'Camping', 'River Rafting'],
            inclusions: ['Camps & Hotels', 'All Meals', 'Jeep Safari', 'Permits'],
            badge: 'Adventure Pick'
    },
    {
            id: 5,
            name: 'Rajasthan Royal Experience',
            destination: 'Jaipur - Jodhpur - Udaipur',
            category: 'luxury',
            duration: '8 Days / 7 Nights',
            price: 59999,
            originalPrice: 85000,
            rating: 4.9,
            reviews: 432,
            image: '',
            highlights: ['Palace Hotels', 'Desert Safari', 'Lake Pichola', 'Folk Performance'],
            inclusions: ['Heritage Hotels', 'All Meals', 'Private Car', 'Butler Service'],
            badge: 'Luxury'
    },
    {
            id: 6,
            name: 'Andaman Island Escape',
            destination: 'Port Blair - Havelock - Neil',
            category: 'beach',
            duration: '6 Days / 5 Nights',
            price: 34999,
            originalPrice: 48000,
            rating: 4.8,
            reviews: 876,
            image: '',
            highlights: ['Radhanagar Beach', 'Scuba Diving', 'Cellular Jail', 'Snorkeling'],
            inclusions: ['Resort', 'Breakfast & Dinner', 'Ferry Transfers', 'Diving Gear']
    }
      ];

  filteredPackages: HolidayPackage[] = [];

  ngOnInit(): void {
        this.applyFilters();
  }

  applyFilters(): void {
        let result = [...this.packages];

      if (this.selectedCategory !== 'all') {
              result = result.filter(p => p.category === this.selectedCategory);
      }

      if (this.selectedBudget !== 'all') {
              switch (this.selectedBudget) {
                case 'budget': result = result.filter(p => p.price > 25000); break;
                case 'mid': result = result.filter(p => p.price >= 25000 && p.price > 45000); break;
                case 'luxury': result = result.filter(p => p.price >= 45000); break;
              }
      }

      if (this.searchQuery.trim()) {
              const q = this.searchQuery.toLowerCase();
              result = result.filter(p =>
                        p.name.toLowerCase().includes(q) ||
                        p.destination.toLowerCase().includes(q)
                                           );
      }

      switch (this.sortBy) {
        case 'price-low': result.sort((a, b) => a.price - b.price); break;
        case 'price-high': result.sort((a, b) => b.price - a.price); break;
        case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        case 'popular': result.sort((a, b) => b.reviews - a.reviews); break;
      }

      this.filteredPackages = result;
  }

  onSearch(): void { this.applyFilters(); }
    onCategoryChange(cat: string): void { this.selectedCategory = cat; this.applyFilters(); }
    onFilterChange(): void { this.applyFilters(); }

  getDiscount(pkg: HolidayPackage): number {
        return Math.round((1 - pkg.price / pkg.originalPrice) * 100);
  }

  getStars(rating: number): string[] {
        return Array.from({ length: 5 }, (_, i) =>
                i > Math.floor(rating) ? 'full' : (i > rating ? 'half' : 'empty')
                              );
  }

  bookPackage(pkg: HolidayPackage): void {
        alert(`Booking ${pkg.name} for ${pkg.price.toLocaleString()}! Feature coming soon.`);
  }
}
