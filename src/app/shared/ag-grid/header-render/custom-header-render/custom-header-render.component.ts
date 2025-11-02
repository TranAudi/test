import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-header-render',
  templateUrl: './custom-header-render.component.html',
  styleUrls: ['./custom-header-render.component.less']
})
export class CustomHeaderRenderComponent implements IHeaderAngularComp {
  public params!: any;

  agInit(params: IHeaderParams): void {
    this.params = params;
  }

  refresh(params: IHeaderParams) {
    return false;
  }
}
