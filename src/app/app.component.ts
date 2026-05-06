import { Component, HostListener, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { AppModalComponent } from './components/app-modal/app-modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavComponent, FooterComponent, AuthModalComponent, AppModalComponent, ToastComponent, BackToTopComponent],
    template: `<app-nav></app-nav><router-outlet></router-outlet><app-footer></app-footer><app-auth-modal></app-auth-modal><app-app-modal></app-app-modal><app-toast></app-toast><app-back-to-top></app-back-to-top>`
})
  export class AppComponent implements AfterViewInit {
    constructor(private auth: AuthService) {}

  @HostListener('document:keydown.escape')
    onEsc() { this.auth.closeAuth(); this.auth.closeAppModal(); }

  ngAfterViewInit() {
        const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                          if (entry.isIntersecting) {
                                      entry.target.classList.add('v');
                                      observer.unobserve(entry.target);
                          }
                });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        setTimeout(() => {
                document.querySelectorAll('.sr').forEach(el => observer.observe(el));
        }, 150);
  }
}
