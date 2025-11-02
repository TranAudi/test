import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { ButtonModel, GridModel, QueryFilerModel } from '@model';
import { EmailTemplateApiService } from '@service';
import { BtnCellRenderComponent, StatusCellRenderComponent } from '@shared';
import {
  AG_GIRD_CELL_STYLE,
  EVENT_TYPE,
  EXCEL_STYLES_DEFAULT,
  FORM_TYPE,
  LIST_STATUS,
  OVERLAY_LOADING_TEMPLATE,
  OVERLAY_NOROW_TEMPLATE,
  PAGE_SIZE_OPTION_DEFAULT,
  QUERY_FILTER_DEFAULT
} from '@util';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';

import { EmailTemplateItemComponent } from '../email-template-item/email-template-item.component';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.less']
})
export class EmailTemplateComponent implements OnInit {
  constructor(
    private emailTemplateApiService: EmailTemplateApiService,
    private aclService: ACLService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private modalService: NzModalService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private elementRef: ElementRef
  ) {
    //#region ag-grid
    this.columnDefs = [
      {
        field: 'index',
        headerName: this.i18n.fanyi('app.common.table.grid-index'),
        width: 100
      },
      { field: 'code', headerName: this.i18n.fanyi('function.email-template.table.code'), minWidth: 180, flex: 1 },
      { field: 'name', headerName: this.i18n.fanyi('function.email-template.table.name'), minWidth: 180, flex: 1 },
      {
        field: 'isActive',
        headerName: this.i18n.fanyi('function.email-template.table.active'),
        cellRenderer: 'statusCellRender',
        minWidth: 180,
        flex: 1
      },
      // { field: 'order', headerName: this.i18n.fanyi('function.email-template.table.order'), minWidth: 180, flex: 1 },
      // { field: 'description', headerName: this.i18n.fanyi('function.email-template.table.description'), minWidth: 180, flex: 1 },
      {
        headerName: this.i18n.fanyi('app.common.table.grid-action'),
        minWidth: 150,
        cellRenderer: 'btnCellRender',
        cellRendererParams: {
          infoClicked: (item: any) => this.onViewItem(item),
          editClicked: (item: any) => this.onEditItem(item),
          deleteClicked: (item: any) => this.onDeleteItem(item)
        }
      }
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 100,
      cellStyle: AG_GIRD_CELL_STYLE,
      resizable: true
    };
    this.frameworkComponents = {
      btnCellRender: BtnCellRenderComponent,
      statusCellRender: StatusCellRenderComponent
    };
    this.excelStyles = [...EXCEL_STYLES_DEFAULT];
    //#endregion ag-grid

    //#region Init button
    this.btnAdd = {
      title: this.i18n.fanyi('app.common.button.add'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onAddItem();
      }
    };
    this.btnDelete = {
      title: this.i18n.fanyi('app.common.button.delete'),
      visible: false,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onDeleteItem();
      }
    };
    this.btnSearch = {
      title: this.i18n.fanyi('app.common.button.search'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.initGridData();
      }
    };
    this.btnResetSearch = {
      title: this.i18n.fanyi('app.common.button.reset'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onResetSearch(false);
      }
    };
    this.btnReload = {
      title: this.i18n.fanyi('app.common.button.refresh'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onResetSearch(true);
      }
    };
    //#endregion Init button
  }
  @ViewChild(EmailTemplateItemComponent, { static: false }) itemModal!: { initData: (arg0: {}, arg1: string, option: any) => void };

  isRenderComplete = false;

  listStatus = LIST_STATUS;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  pageSizeOptions: any[] = [];

  listKyHieuChamCong: any[] = [];

  columnDefs: any[] = [];
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0
  };
  private gridApi: any;
  private gridColumnApi: any;
  defaultColDef: any;
  rowSelection = 'multiple';
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;
  quickText = '';
  excelStyles: any;
  frameworkComponents: any;

  btnAdd: ButtonModel;
  btnDelete: ButtonModel;
  btnResetSearch: ButtonModel;
  btnSearch: ButtonModel;
  btnReload: ButtonModel;

  isLoading = false;
  isShowDelete = false;
  isShowImport = false;

  title = this.i18n.fanyi('function.email-template.page.title');

  modal: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };

  ngOnInit(): void {
    this.initRightOfUser();
    this.isRenderComplete = true;
  }

  initRightOfUser(): void {
    // this.btnAdd.grandAccess = this.aclService.canAbility('EMAIL_TEMPLATE_ADD');
    // this.btnDelete.grandAccess = this.aclService.canAbility('EMAIL_TEMPLATE_DELETE');
  }

  //#region Ag-grid
  onPageSizeChange(): void {
    this.initGridData();
  }

  onPageNumberChange(): void {
    this.initGridData();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGridData();
  }

  onSelectionChanged($event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.btnDelete.visible = true;
    } else {
      this.btnDelete.visible = false;
    }
  }

  onCellDoubleClicked($event: any): void {
    this.onViewItem($event.data);
  }
  //#endregion Ag-grid

  //#region Event
  onResetSearch(reloadData: boolean): void {
    this.filter.pageNumber = 1;
    this.filter.textSearch = undefined;
    this.filter['status'] = undefined;
    if (reloadData) {
      this.initGridData();
    }
  }

  onAddItem(): void {
    this.modal = {
      type: FORM_TYPE.ADD,
      item: {},
      isShow: true,
      option: {}
    };
    this.itemModal.initData({}, FORM_TYPE.ADD, { listKyHieuChamCong: this.listKyHieuChamCong });
  }

  onEditItem(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal = {
      type: FORM_TYPE.EDIT,
      item,
      isShow: true,
      option: {
        listKyHieuChamCong: this.listKyHieuChamCong
      }
    };
    this.itemModal.initData(item, FORM_TYPE.EDIT, { listKyHieuChamCong: this.listKyHieuChamCong });
  }

  onViewItem(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal = {
      type: FORM_TYPE.INFO,
      item,
      isShow: true,
      option: {
        listKyHieuChamCong: this.listKyHieuChamCong
      }
    };
    this.itemModal.initData(item, FORM_TYPE.INFO, { listKyHieuChamCong: this.listKyHieuChamCong });
  }

  onDeleteItem(item: any = null): void {
    let title = `${this.i18n.fanyi('function.email-template.confirm-delete.title')}`;
    let content = `${this.i18n.fanyi('function.email-template.confirm-delete.content')} ${item.name}`;
    this.modalService.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: `${this.i18n.fanyi('app.confirm-delete.ok-text')}`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteItem(item.id),
      nzCancelText: `${this.i18n.fanyi('app.confirm-delete.cancel-text')}`,
      nzOnCancel: () => {}
    });
  }

  //#endregion Event

  //#region Modal

  onModalEventEmmit(event: any): void {
    this.modal.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }
  //#endregion Modal

  //#region API Event
  deleteItem(id: any): Subscription {
    this.isLoading = true;
    const promise = this.emailTemplateApiService.delete(id).subscribe({
      next: (res: any) => {
        if (res.data === null || res.data === undefined) {
          this.notification.error(this.i18n.fanyi('app.common.error.title'), `${res.message}`);
          return;
        }
        this.initGridData();
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => (this.isLoading = false)
    });
    return promise;
  }

  initGridData(): Subscription | undefined {
    this.isLoading = true;
    this.btnDelete.visible = false;
    this.gridApi.showLoadingOverlay();
    const rs = this.emailTemplateApiService.getFilter(this.filter).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.data === null || res.data === undefined) {
          this.notification.error(this.i18n.fanyi('app.common.error.title'), `${res.message}`);
          return;
        }

        const dataResult = res.data;

        let i = (this.filter.pageSize ?? 0) * ((this.filter.pageNumber ?? 0) - 1);

        for (const item of dataResult.data) {
          item.index = ++i;
          item.infoGrantAccess = true;
          item.editGrantAccess = true;
          item.deleteGrantAccess = true;
          // item.editGrantAccess = this.aclService.canAbility('EMAIL_TEMPLATE_EDIT');
          // item.deleteGrantAccess = this.aclService.canAbility('EMAIL_TEMPLATE_DELETE');
        }
        this.grid.totalData = dataResult.totalCount;
        this.grid.dataCount = dataResult.dataCount;
        this.grid.rowData = dataResult.data;
        this.pageSizeOptions = [...PAGE_SIZE_OPTION_DEFAULT];
        // tslint:disable-next-line: variable-name
        this.pageSizeOptions = this.pageSizeOptions.filter(number => {
          return number < dataResult.totalCount;
        });
        this.pageSizeOptions.push(dataResult.totalCount);
      },
      error: (err: any) => {
        this.gridApi.hideOverlay();
        this.notification.error(this.i18n.fanyi('app.common.error.title'), `${err.error.message}`);
        this.isLoading = false;
      },
      complete: () => {
        this.gridApi.hideOverlay();
        this.isLoading = false;
      }
    });
    return rs;
  }
  //#endregion API Event
}
