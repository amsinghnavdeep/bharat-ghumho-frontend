import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>('light');

  constructor() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('bg_theme') as Theme | null;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial: Theme = stored === 'dark' || stored === 'light' ? stored : (prefersDark ? 'dark' : 'light');
    this.apply(initial);
  }

  toggle() {
    this.apply(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(t: Theme) { this.apply(t); }

  private apply(t: Theme) {
    this.theme.set(t);
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('bg_theme', t); } catch {}
  }
}
