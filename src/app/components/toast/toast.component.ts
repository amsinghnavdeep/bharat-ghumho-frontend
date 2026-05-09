import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast', standalone: true, imports: [CommonModule],
  template: `
<div class="global-toast" [class.show]="toast.visible()" [ngClass]="toast.type()" role="status" aria-live="polite">
  <span class="gt-icon" [innerHTML]="icon()"></span>
  <span class="gt-msg">{{toast.message()}}</span>
  <button type="button" class="gt-close" (click)="toast.dismiss()" aria-label="Dismiss">&times;</button>
</div>`
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
  icon = computed(() => {
    switch (this.toast.type()) {
      case 'error': return '&#9888;';
      case 'info': return '&#8505;';
      case 'warning': return '&#9888;';
      default: return '&#10003;';
    }
  });
}
