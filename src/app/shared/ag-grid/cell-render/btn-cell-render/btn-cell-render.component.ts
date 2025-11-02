import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-btn-cell-render',
  templateUrl: './btn-cell-render.component.html'
})
export class BtnCellRenderComponent implements ICellRendererAngularComp {
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
  }

  btnInfoClickedHandler($event: any): any {
    this.params.infoClicked(this.params.data);
  }

  btnEditClickedHandler($event: any): any {
    this.params.editClicked(this.params.data);
  }

  btnAssignClassClickedHandler($event: any): any {
    this.params.assignClassClicked(this.params.data);
  }
  btnDeleteClickedHandler($event: any): any {
    this.params.deleteClicked(this.params.data);
  }

  btnSendMailForgotPasswordClickedHandler($event: any): any {
    this.params.sendMailForgotPasswordClicked(this.params.data);
  }

  /// Old

  btnRecordHistoryClickedHandler($event: any): any {
    // console.log(this.params.data);
    this.params.historyRecordsClicked(this.params.data);
  }

  btnUpdateStatusReceiOrRejectRecordsClickedHandler($event: any): any {
    this.params.updateStatusReceiOrRejectRecordsClicked(this.params.data);
  }

  btnLockClickedHandler($event: any): any {
    // console.log(this.params.data);
    this.params.lockClicked(this.params.data);
  }

  btnUnLockClickedHandler($event: any): any {
    // console.log(this.params.data);
    this.params.unlockClicked(this.params.data);
  }

  btnUpdateRoleRecordClickedHandler($event: any): any {
    // console.log(this.params.data);
    this.params.updateRecordAuthorizedClicked(this.params.data);
  }

  btnAddUserRoleClickedHandler($event: any): any {
    // console.log(this.params.data);
    this.params.addUserRoleClicked(this.params.data);
  }

  btnAddRoleClickedHandler($event: any): any {
    // console.log(this.params.data);
    this.params.addRoleClicked(this.params.data);
  }

  btnUpdateUserRole($event: any): any {
    this.params.btnUpdateUserRole(this.params.data);
  }

  btnAddPermissionClickedHandler($event: any): any {
    this.params.addPermissionClickedHandler(this.params.data);
  }

  btnAddRoleApiClickedHandler($event: any): any {
    this.params.addRoleApiClickedHandler(this.params.data);
  }

  btnAddMenuClickedHandler($event: any): any {
    this.params.addMenuClickedHandler(this.params.data);
  }

  btnPrintRecordsClickedHandler($event: any): any {
    this.params.printRecordsClicked(this.params.data);
  }

  btnMoveToEndClickedHandler($event: any): any {
    this.params.moveToEndClicked(this.params.data);
  }

  btnMoveToProcessedClickedHandler($event: any): any {
    this.params.moveToProcessedClicked(this.params.data);
  }

  btnMoveToProcessingClickedHandler($event: any): any {
    this.params.moveToProcessingClicked(this.params.data);
  }

  btnCheckMenuClickedHandler($event: any): any {
    this.params.addMenuClickedHandler(this.params.data);
  }

  btnSyncDataClickedHandler($event: any): any {
    this.params.syncDataClicked(this.params.data);
  }
}
