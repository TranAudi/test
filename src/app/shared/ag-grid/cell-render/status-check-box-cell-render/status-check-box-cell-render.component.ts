import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-check-box-cell-render',
  templateUrl: './status-check-box-cell-render.component.html',
  styleUrls: []
})
export class StatusCheckBoxCellRenderComponent implements ICellRendererAngularComp {
  constructor() {}
  isBoolean: boolean = false;

  params: any;

  refresh(params: any): boolean {
    return false;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  agInit(params: any): void {
    this.params = params;
    this.isBoolean = typeof params.value === 'boolean'; // Kiểm tra nếu giá trị là boolean
  }
}
