import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { ButtonModel, GridModel, QueryFilerModel } from '@model';
import { EVENT_TYPE, OVERLAY_LOADING_TEMPLATE, OVERLAY_NOROW_TEMPLATE, QUERY_FILTER_DEFAULT } from '@util';
import dayjs from 'dayjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';

import { WorkflowStatusCellRenderComponent } from '../../ag-grid/cell-render/workflow-status-cell-render/workflow-status-cell-render.component';
import { WorkflowApiService } from '../../services/workflow-api.service';

@Component({
  selector: 'app-ag-grid-view-history-workflow',
  templateUrl: './view-history-workflow.component.html',
  styleUrls: ['./view-history-workflow.component.less']
})
export class ViewHistoryWorkflowComponent {
  @Input() processId: any;
  @Input() isVisible = false;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  tittle = '';
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0
  };

  private gridApi: any;
  private gridColumnApi: any;
  isLoading = false;
  columnDefs: any[] = [];
  defaultColDef: any;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  visibleRowData: any[] = [];
  pageSizeOptions: any[] = [];
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;
  frameworkComponents: any;
  btnCancel: ButtonModel;
  constructor(
    public settings: SettingsService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    public workflowApiService: WorkflowApiService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private notification: NzNotificationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.btnCancel = {
      title: this.i18n.fanyi('app.common.button.close'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.handleCancel();
      }
    };
    this.columnDefs = [
      {
        field: 'index',
        headerName: this.i18n.fanyi('app.common.table.grid-index'),
        minWidth: 80,
        maxWidth: 80,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'initialState',
        headerName: this.i18n.fanyi('workflow.view-history-workflow.table.from-activity-name'),
        minWidth: 150,
        flex: 1,
        cellRenderer: 'workflowCellRender',
        cellRendererParams: {
          toActivity: true
        }
      },
      {
        field: 'destinationState',
        headerName: this.i18n.fanyi('workflow.view-history-workflow.table.to-activity-name'),
        minWidth: 150,
        cellStyle: { textAlign: 'center' },
        flex: 1,
        cellRenderer: 'workflowCellRender',
        cellRendererParams: {
          toActivity: false
        }
      },
      {
        field: 'userName',
        headerName: this.i18n.fanyi('workflow.view-history-workflow.table.executor-name'),
        minWidth: 100,
        flex: 1,
        cellStyle: { textAlign: 'center' }
      },
      {
        field: 'transitionTime',
        headerName: this.i18n.fanyi('workflow.view-history-workflow.table.transition-time'),
        minWidth: 120,
        cellStyle: { textAlign: 'center' },
        flex: 1,
        cellRenderer: (data: { value: dayjs.ConfigType }) => {
          return dayjs(data.value).format('DD/MM/YYYY HH:mm:ss');
        }
      },
      {
        field: 'commentary',
        headerName: this.i18n.fanyi('workflow.view-history-workflow.table.ghi-chu'),
        minWidth: 300,
        flex: 1
      }
    ];
    this.frameworkComponents = {
      workflowCellRender: WorkflowStatusCellRenderComponent
    };
    this.defaultColDef = {
      minWidth: 100,
      flex: 1,
      editable: false,
      resizable: true,
      sortable: true,
      filter: true,
      wrapHeaderText: true,
      autoHeight: true,
      suppressMenu: true,
      wrapText: true,
      cellStyle: {
        'white-space': 'normal',
        'line-height': '2',
        padding: '8px 12px',
        'border-right': '1px solid #DDE2EB'
      }
    };
    this.tittle = this.i18n.fanyi('workflow.view-history-workflow.title');
  }

  public async initData(processId: any): Promise<void> {
    this.isLoading = false;
    this.isVisible = true;
    this.visibleRowData = [];
    this.processId = processId;
  }

  initGridData(): Subscription {
    this.isLoading = true;
    this.gridApi.showLoadingOverlay();
    const rs = this.workflowApiService.getHistoryWorkflow(this.processId).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        if (res.data === null || res.data === undefined) {
          this.messageService.error(`${res.message}`);
          return;
        }
        const dataResult = res.data ?? [];

        let i = (this.filter.pageSize ?? 0) * ((this.filter.pageNumber ?? 0) - 1);
        var dataSort = dataResult
          .filter((x: any) => x.userName)
          .sort((a: any, b: any) => new Date(a.transitionTime).getTime() - new Date(b.transitionTime).getTime());
        for (const item of dataSort) {
          item.index = ++i;
        }
        this.grid.rowData = dataSort;
        // this.updateVisibleRowData();
        this.changeDetectorRef.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });

    return rs;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.CLOSE });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.initGridData();
  }
}
