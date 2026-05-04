import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth-modal', standalone: true, imports: [CommonModule, FormsModule],
  template: `
<div class="modal-overlay" [class.open]="auth.showAuthModal()" (click)="auth.closeAuth()">
<div class="modal" (click)="$event.stopPropagation()">
  <button class="modal-close" (click)="auth.closeAuth()">&times;</button>
  <div class="modal-logo"><svg width="48" height="40" viewBox="0 0 60 50" fill="none"><polygon points="30,2 58,28 42,28" fill="#FF6B00"/><polygon points="30,2 18,28 30,18" fill="#E05E00"/><polygon points="18,28 42,28 52,46 8,46" fill="#138808"/><polygon points="30,18 42,28 36,38" fill="#0F6B06"/><path d="M28,30 C28,30 26,34 24,36 C22,38 22,42 26,42 C28,42 30,40 32,38 C34,36 36,34 34,30 C33,28 29,28 28,30Z" fill="white" opacity="0.95"/></svg></div>
  <h3>{{auth.isSignUp() ? 'Create Account' : 'Sign In'}}</h3>
  <p class="modal-sub">{{auth.isSignUp() ? 'Join Bharat Gumho today' : 'Welcome back to Bharat Gumho'}}</p>
  <form (ngSubmit)="submit()">
    <div class="form-group" *ngIf="auth.isSignUp()"><label>Full Name</label><input [(ngModel)]="name" name="name" placeholder="Navdeep Singh"></div>
    <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="email" name="email" placeholder="you@example.com" required></div>
    <div class="form-group"><label>Password</label><input type="password" [(ngModel)]="password" name="password" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" required></div>
    <button type="submit" class="btn-p" style="width:100%" [disabled]="submitting">{{submitting ? 'Please wait...' : (auth.isSignUp() ? 'Sign Up' : 'Sign In')}}</button>
    <div class="divider"><span>or</span></div>
    <button type="button" class="social-btn google-btn" (click)="toast.show('Google Sign-In coming soon!')"><span class="social-icon">G</span> Continue with Google</button>
    <p class="modal-switch">{{auth.isSignUp() ? 'Already have an account?' : 'No account?'}} <a href="#" (click)="$event.preventDefault(); auth.toggleAuth()">{{auth.isSignUp() ? 'Sign In' : 'Sign Up'}}</a></p>
  </form>
</div></div>`
})
export class AuthModalComponent {
  name = ''; email = ''; password = ''; submitting = false;
  constructor(public auth: AuthService, public toast: ToastService) {}
  submit() {
    this.submitting = true;
    const done = () => { this.submitting = false; setTimeout(() => this.auth.closeAuth(), 1200); };
    if (this.auth.isSignUp()) {
      this.auth.register(this.name, this.email, this.password).subscribe(() => { this.toast.show('Welcome to Bharat Gumho!'); done(); });
    } else {
      this.auth.login(this.email, this.password).subscribe(() => { this.toast.show('Welcome back!'); done(); });
    }
  }
}
