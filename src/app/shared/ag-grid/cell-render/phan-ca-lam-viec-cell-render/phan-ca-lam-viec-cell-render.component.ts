import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-phan-ca-lam-viec-cell-render',
  templateUrl: './phan-ca-lam-viec-cell-render.component.html'
})
export class PhanCaLamViecCellRenderComponent implements ICellRendererAngularComp {
  constructor() {}

  params: any;
  ngayLamViecs = [];
  colDef: any;
  isShowEdit = false;
  caLamViecs: any = [];
  caLamViecStr = '';
  ngayLamViec: any;
  refresh(params: any): boolean {
    return true;
  }

  onMouseMove() {
    if (this.caLamViecs.length > 0) {
      this.isShowEdit = true;
    }
  }

  onMouseLeave() {
    this.isShowEdit = false;
  }

  agInit(params: any): void {
    this.initData(params);
  }

  btnEditClickedHandler($event: any): any {
    this.params.editClicked({
      ngayLamViec: this.ngayLamViec,
      canBoId: this.params.data.canBoId,
      caLamViecs: this.caLamViecs
    });
  }

  initData(params: any) {
    this.params = params;
    this.ngayLamViecs = params.data.ngayLamViecs;
    this.colDef = params.colDef;

    this.ngayLamViecs.map((nlv: any) => {
      if (nlv.ngayLamViec === this.colDef.field) {
        this.caLamViecs = nlv.caLamViecs;
        this.ngayLamViec = nlv.ngayLamViecDateTime;
      }
    });
  }
}
