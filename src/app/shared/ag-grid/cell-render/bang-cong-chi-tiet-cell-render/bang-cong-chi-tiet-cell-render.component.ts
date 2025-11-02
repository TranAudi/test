import { Component } from '@angular/core';
import { log } from '@delon/util';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-bang-cong-chi-tiet-cell-render',
  templateUrl: './bang-cong-chi-tiet-cell-render.component.html'
})
export class BangCongChiTietCellRenderComponent implements ICellRendererAngularComp {
  constructor() {}

  params: any;
  isShowEdit = false;
  congChiTiet: any;

  refresh(params: any): boolean {
    return true;
  }

  onMouseMove() {
    if (this.congChiTiet?.id) {
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
      dt: this.congChiTiet
    });
  }

  initData(params: any) {
    this.params = params;
    this.congChiTiet = params.data[params.colDef.field];
    if (this.congChiTiet?.id) {
      if (this.congChiTiet?.gioDen && this.congChiTiet?.gioVe) {
        this.congChiTiet.chiTietChamCong = `${this.congChiTiet?.gioDen?.substring(0, 5)} - ${this.congChiTiet?.gioVe?.substring(0, 5)}`;
      } else if (this.congChiTiet?.gioDen) {
        this.congChiTiet.chiTietChamCong = `${this.congChiTiet?.gioDen?.substring(0, 5)} - ...`;
      } else if (this.congChiTiet?.gioVe) {
        this.congChiTiet.chiTietChamCong = `... - ${this.congChiTiet?.gioVe?.substring(0, 5)}`;
      }
    }
  }
}
