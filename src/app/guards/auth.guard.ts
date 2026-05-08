import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  if (typeof window !== 'undefined' && localStorage.getItem('bg_token')) return true;
  toast.show('Please sign in to continue');
  auth.openAuth(false);
  router.navigate(['/']);
  return false;
};
