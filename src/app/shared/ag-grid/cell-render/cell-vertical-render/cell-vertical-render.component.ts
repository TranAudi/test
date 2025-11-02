import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-cell-vertical-render',
  templateUrl: './cell-vertical-render.component.html'
})
export class CellVerticalRenderComponent implements ICellRendererAngularComp {
  constructor() {}

  params: any;
  refresh(params: any): boolean {
    return true;
  }

  agInit(params: any): void {
    this.initData(params);
  }

  initData(params: any) {
    this.params = params;
  }
}
