import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { HeKhoaLopComponent } from './he-khoa-lop.component';

const COMPONENTS = [HeKhoaLopComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class HeKhoaLopModule {}
