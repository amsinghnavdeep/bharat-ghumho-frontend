import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal('');
  type = signal<ToastType>('success');
  visible = signal(false);
  private timer: any;

  show(msg: string, type: ToastType = 'success', ms = 3000) {
    clearTimeout(this.timer);
    this.message.set(msg);
    this.type.set(type);
    this.visible.set(true);
    this.timer = setTimeout(() => this.visible.set(false), ms);
  }

  success(msg: string, ms?: number) { this.show(msg, 'success', ms); }
  error(msg: string, ms?: number) { this.show(msg, 'error', ms ?? 4500); }
  info(msg: string, ms?: number) { this.show(msg, 'info', ms); }
  warning(msg: string, ms?: number) { this.show(msg, 'warning', ms ?? 4000); }

  dismiss() { clearTimeout(this.timer); this.visible.set(false); }
}
