import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-back-to-top', standalone: true,
  template: '<button class="back-to-top" [class.visible]="vis()" (click)="top()"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg></button>'
})
export class BackToTopComponent {
  vis = signal(false);
  @HostListener('window:scroll') onScroll() { this.vis.set(window.scrollY > 600); }
  top() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
}
