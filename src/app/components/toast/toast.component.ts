import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast', standalone: true, imports: [CommonModule],
  template: '<div class="global-toast" [class.show]="toast.visible()"><span class="gt-icon">&#10003;</span><span class="gt-msg">{{toast.message()}}</span></div>'
})
export class ToastComponent { constructor(public toast: ToastService) {} }
