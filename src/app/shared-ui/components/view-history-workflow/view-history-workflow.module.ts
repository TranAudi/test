import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { ViewHistoryWorkflowComponent } from './view-history-workflow.component';

const COMPONENTS = [ViewHistoryWorkflowComponent];

@NgModule({
  imports: [NzGridModule, NzPaginationModule, CommonModule, NzSpinModule, NzModalModule, AgGridModule, NzButtonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ViewHistoryWorkflowModule {}
