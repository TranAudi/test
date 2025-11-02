import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { HeKhoaLopTreeviewCheckBoxComponent } from './he-khoa-lop-treeview-check-box.component';

const COMPONENTS = [HeKhoaLopTreeviewCheckBoxComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class HeKhoaLopTreeViewModule {}
