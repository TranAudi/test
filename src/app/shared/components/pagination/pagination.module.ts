import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { PaginationComponent } from './pagination.component';

const COMPONENTS = [PaginationComponent];

@NgModule({
  imports: [NzGridModule, NzPaginationModule, CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PaginationModule {}
