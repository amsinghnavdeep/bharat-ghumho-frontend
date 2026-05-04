import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  message = signal('');
  visible = signal(false);
  private timer: any;

  show(msg: string, ms = 3000) {
    clearTimeout(this.timer);
    this.message.set(msg);
    this.visible.set(true);
    this.timer = setTimeout(() => this.visible.set(false), ms);
  }
}
