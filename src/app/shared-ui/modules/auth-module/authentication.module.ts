import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { SharedLoGinJWTComponent } from './login-jwt.component';

const COMPONENTS = [SharedLoGinJWTComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule, NzDividerModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedAuthenticationModule {}
