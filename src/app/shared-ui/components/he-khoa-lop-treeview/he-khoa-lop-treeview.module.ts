import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { HeKhoaLopTreeviewComponent } from './he-khoa-lop-treeview.component';

const COMPONENTS = [HeKhoaLopTreeviewComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class HeKhoaLopTreeViewModule {}
