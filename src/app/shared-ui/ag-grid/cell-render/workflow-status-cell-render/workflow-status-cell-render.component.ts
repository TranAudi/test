import { Component } from '@angular/core';
import { log } from '@delon/util';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-workflow-status-cell-render',
  templateUrl: './workflow-status-cell-render.component.html',
  styleUrls: []
})
export class WorkflowStatusCellRenderComponent implements ICellRendererAngularComp {
  constructor() {}

  params: any;

  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }

  agInit(params: any): void {
    this.params = params;
    log('WorkflowCellRenderComponent', 'agInit', this.params);
  }

  onProccessWorkflowClick(command: any): any {
    log('WorkflowCellRenderComponent', 'onProccessWorkflowClick', command, this.params.data);
    this.params.proccessWorkflowClicked(this.params.data, command);
  }
}
