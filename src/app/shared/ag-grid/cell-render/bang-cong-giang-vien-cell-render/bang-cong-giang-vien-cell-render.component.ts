import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-bang-cong-giang-vien-cell-render',
  templateUrl: './bang-cong-giang-vien-cell-render.component.html'
})
export class BangCongGiangVienCellRenderComponent implements ICellRendererAngularComp {
  constructor() {}

  params: any;
  isShowEdit = false;
  chamCong: any;

  refresh(params: any): boolean {
    return true;
  }

  onMouseMove() {
    this.isShowEdit = true;
  }

  onMouseLeave() {
    this.isShowEdit = false;
  }

  agInit(params: any): void {
    this.initData(params);
  }

  btnEditClickedHandler($event: any): any {
    this.params.editClicked(this.params.data);
  }

  initData(params: any) {
    this.params = params;
    this.chamCong = params.data;
  }
}
