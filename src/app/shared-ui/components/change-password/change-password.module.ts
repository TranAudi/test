import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { SharedWidgetChangePasswordComponent } from './change-password.component';

const COMPONENTS = [SharedWidgetChangePasswordComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedChangePasswordModule {}
