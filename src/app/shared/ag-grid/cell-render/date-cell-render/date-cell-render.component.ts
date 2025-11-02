import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import * as moment from 'moment';

@Component({
  selector: 'app-date-cell-render',
  templateUrl: './date-cell-render.component.html',
  styleUrls: []
})
export class DateCellRenderComponent implements ICellRendererAngularComp {
  constructor() {}

  params: any;
  dateFormat = '';

  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  agInit(params: any): void {
    this.params = params;

    if (params.value) this.dateFormat = moment(params.value).format('DD/MM/YYYY HH:mm:ss');
    else this.dateFormat = '';
  }
}
