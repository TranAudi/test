import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LangsModule, SharedModule } from '@shared';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { BangCongChiTietCellRenderComponent } from './cell-render/bang-cong-chi-tiet-cell-render/bang-cong-chi-tiet-cell-render.component';
import { BangCongGiangVienCellRenderComponent } from './cell-render/bang-cong-giang-vien-cell-render/bang-cong-giang-vien-cell-render.component';
import { BtnCellRenderComponent } from './cell-render/btn-cell-render/btn-cell-render.component';
import { CellVerticalRenderComponent } from './cell-render/cell-vertical-render/cell-vertical-render.component';
import { DateCellRenderComponent } from './cell-render/date-cell-render/date-cell-render.component';
import { PhanCaLamViecCellRenderComponent } from './cell-render/phan-ca-lam-viec-cell-render/phan-ca-lam-viec-cell-render.component';
import { SendMailStatusCellRenderComponent } from './cell-render/send-mail-status-cell-render/send-mail-status-cell-render.component';
import { StatusCellRenderComponent } from './cell-render/status-cell-render/status-cell-render.component';
import { StatusCheckBoxCellRenderComponent } from './cell-render/status-check-box-cell-render/status-check-box-cell-render.component';
import { CustomHeaderRenderComponent } from './header-render/custom-header-render/custom-header-render.component';

const COMPONENTS = [
  BtnCellRenderComponent,
  StatusCellRenderComponent,
  CustomHeaderRenderComponent,
  PhanCaLamViecCellRenderComponent,
  CellVerticalRenderComponent,
  BangCongChiTietCellRenderComponent,
  BangCongGiangVienCellRenderComponent,
  DateCellRenderComponent,
  StatusCheckBoxCellRenderComponent,
  SendMailStatusCellRenderComponent
];

@NgModule({
  imports: [CommonModule, NzDropDownModule, NzIconModule, NzTagModule, NzCheckboxModule, LangsModule, NzButtonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class AggridCellRenderModule {}
