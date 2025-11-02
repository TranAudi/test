import { formatDate } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { QueryFilerModel, GridModel, ButtonModel } from '@model';
import { BtnCellRenderComponent } from '@shared';
import {
  DATE_FORMAT_ddMMyyyy,
  EVENT_TYPE,
  FORM_TYPE,
  LIST_STATUS,
  LOCALIZE,
  OVERLAY_LOADING_TEMPLATE,
  OVERLAY_NOROW_TEMPLATE,
  PAGE_SIZE_OPTION_DEFAULT,
  QUERY_FILTER_DEFAULT
} from '@util';
import { ColDef, GridOptions, SideBarDef } from 'ag-grid-community';
import { min } from 'd3';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { StatusCheckBoxCellRenderEnableComponent } from 'src/app/shared/ag-grid/cell-render/status-check-box-cell-render-enable/status-check-box-cell-render-enable.component';

import { HeApiService } from '../../services/he-api.service';
import { MonHocApiService } from '../../services/mon-hoc-api.service';
import { DanhSachHocPhanItemComponent } from './danh-sach-hoc-phan-item/danh-sach-hoc-phan-item.component';

// import { HoSoSinhVienApiService } from 'src/app/services/api/ho-so-sinh-vien-api.service';
// import { NhanXetCuoiKhoaApiService } from 'src/app/services/api/nhan-xet-cuoi-khoa-api.service';

@Component({
  selector: 'app-danh-sach-hoc-phan',
  templateUrl: './danh-sach-hoc-phan.component.html',
  styleUrls: ['./danh-sach-hoc-phan.component.less']
})
export class DanhSachHocPhanComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private aclService: ACLService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private messageService: NzMessageService,
    private monHocApiService: MonHocApiService,
    private heApiService: HeApiService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService
  ) {
    //#region form
    this.form = this.fb.group({
      kyHieu: [''],
      tenMon: ['']
    });
    //#endregion form

    //#region ag-grid
    this.gridOptions = {
      defaultColDef: this.defaultColDef,
      onGridReady: this.onGridReady.bind(this),
      localeText: {
        searchOoo: this.i18n.fanyi('app.common.tool-panel.search')
      }
    };

    // this.btnUpdate = {
    //   title: this.i18n.fanyi('app.common.button.update'),
    //   visible: true,
    //   enable: true,
    //   grandAccess: true,
    //   click: ($event: any) => {
    //     this.updateNhanXetCuoiKhoa();
    //   }
    // };
    this.btnCreate = {
      title: this.i18n.fanyi('app.common.button.create'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.createMonHoc();
      }
    };

    this.btnEdit = {
      title: this.i18n.fanyi('app.common.button.edit'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.editMonHoc();
      }
    };

    this.columnDefs = [
      {
        field: 'chon',
        headerName: this.i18n.fanyi('app.common.table.chon'),
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true
      },
      {
        field: 'kyHieu',
        minWidth: 180,
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.ky-hieu'),
        cellStyle: { 'text-align': 'center' }
      },
      {
        field: 'tenMon',
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.ten-hoc-phan'),
        minWidth: 300
      },
      {
        field: 'tenTiengAnh',
        minWidth: 290,
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.ten-mon-tieng-anh')
      },
      {
        field: 'chatLuongCao',
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.chat-luong-cao'),
        minWidth: 180,
        maxWidth: 180,
        cellStyle: { 'text-align': 'center' },
        cellRenderer: 'statusCheckBoxCellRenderEnable'
      },
      {
        field: 'hpThucHanh',
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.hp-thuc-hanh'),
        minWidth: 180,
        maxWidth: 180,
        cellStyle: { 'text-align': 'center' },
        cellRenderer: 'statusCheckBoxCellRenderEnable'
      },
      {
        field: 'monChungChi',
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.mon-chung-chi'),
        minWidth: 180,
        maxWidth: 180,
        cellStyle: { 'text-align': 'center' },
        cellRenderer: 'statusCheckBoxCellRenderEnable'
      },
      {
        field: 'monNN',
        headerName: this.i18n.fanyi('danh-sach-hoc-phan.table.mon-ngoai-ngu'),
        minWidth: 180,
        maxWidth: 180,
        cellStyle: { 'text-align': 'center' },
        cellRenderer: 'statusCheckBoxCellRenderEnable'
      }
    ];

    this.frameworkComponents = {
      btnCellRender: BtnCellRenderComponent,
      statusCheckBoxCellRenderEnable: StatusCheckBoxCellRenderEnableComponent
    };
    //#endregion ag-grid
  }
  @ViewChild(DanhSachHocPhanItemComponent, { static: false }) itemModalMonHoc!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };
  //#region declare variables
  isRenderComplete = false;

  rowData: any[] = [];
  listStatus = LIST_STATUS;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  pageSizeOptions: any[] = [];
  kyHieu: any;
  tenMon: any;
  tenTiengAnh: any;
  idBm: any;
  idHeDt: any;
  idNhomHp: any;
  listHe: any;
  selectedId: any;

  columnDefs: any[] = [];
  listNhanXetCuoiKhoa: any[] = [];
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0
  };
  modal1Visible: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  modal2Visible: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  visible: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  visible1: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };

  private gridApi: any;
  // btnUpdate: ButtonModel;
  btnCreate: ButtonModel;
  btnEdit: ButtonModel;
  idHe: any = 0;
  idKhoa: any = 0;
  khoaHoc: any = 0;
  idChuyenNganh: any = 0;
  lop: any = 0;
  sapXep: string = 'hoTen';
  listMonHoc: any;
  private gridColumnApi: any;
  defaultColDef = {
    flex: 1,
    editable: false,
    resizable: true,
    sortable: true,
    filter: true,
    wrapHeaderText: true,
    autoHeight: true,
    suppressMenu: true,
    cellStyle: {
      'white-space': 'normal',
      'line-height': '2',
      padding: '8px 12px'
    }
  };
  rowSelection = 'multiple';
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;
  frameworkComponents: any;
  gridOptions: GridOptions;

  //loading
  isLoading = false;
  isLoadingSearch = false;
  isLoadingExport: any = false;
  deletes: any = { deleteNhanXetCuoiKhoaModels: [] };

  form: FormGroup;

  isVisible = false;
  item: any = [];

  title = this.i18n.fanyi('nhan-xet-cuoi-khoa-vien.title');

  modal: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };

  isGridApiReady: boolean = false;
  isDataReady: boolean = false;
  //#endregion declare variables

  //#region grid event
  onPageSizeChange(): void {
    this.initGridData();
  }

  onPageNumberChange(): void {
    this.initGridData();
  }

  htmlCellRenderer(params: any) {
    return params.value ? params.value : '';
  }

  onModalEventEmmit2(event: any): void {
    this.modal1Visible.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }
  onModalEventEmmit3(event: any): void {
    this.modal2Visible.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const allColumnIds = this.gridColumnApi.getColumns().map((column: any) => column.getId());
    this.gridColumnApi.autoSizeColumns(allColumnIds);

    // Lắng nghe sự kiện cột hiển thị hoặc ẩn
    this.gridApi.addEventListener('columnVisible', (event: any) => {
      // Kiểm tra nếu ColumnSelectAll được chọn
      const visibleColumns = this.gridColumnApi.getAllDisplayedColumns().map((col: any) => col.getId());

      if (visibleColumns.length === allColumnIds.length) {
        // Nếu tất cả cột được hiển thị, căn chỉnh lại tất cả
        this.gridColumnApi.autoSizeColumns(allColumnIds);
      } else if (event.visible) {
        // Căn chỉnh chỉ cột vừa được hiển thị
        this.gridColumnApi.autoSizeColumns([event.column.getId()]);
      }
    });

    // this.isGridApiReady = true;
    // this.initGridDataIfReady();
  }

  public autoGroupColumnDef: ColDef = {
    minWidth: 200
  };
  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: this.i18n.fanyi('app.common.tool-panel.label'),
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressColumnFilter: false,
          suppressColumnSelectAll: false,
          suppressColumnExpandAll: true,
          searchHeaderText: 'Tìm kiếm cột...'
        }
      }
    ],
    defaultToolPanel: ''
  };
  //#endregion grid event

  //#region start
  ngOnInit(): void {
    this.initRightOfUser();
    this.getComboboxMonHoc();
    this.getComboboxHe();
    this.initGridData();
    // this.isDataReady = true;
    // this.initGridDataIfReady();
  }
  heChange(data: any) {
    this.idHe = data;
  }

  khoaChange(data: any) {
    this.idKhoa = data;
  }

  khoaHocChange(data: any) {
    this.khoaHoc = data;
  }

  chuyenNganhChange(data: any) {
    this.idChuyenNganh = data;
  }

  lopChange(data: any) {
    this.lop = data;
    this.initGridData();
  }

  initRightOfUser(): void {}

  initGridDataIfReady(): void {
    if (this.isGridApiReady && this.isDataReady) {
      this.initGridData();
    }
  }

  onSortChange(value: string) {
    this.sapXep = value;
    this.sortData(this.rowData);
  }

  initGridData(): Subscription | undefined {
    this.isLoading = false;
    this.gridApi.showLoadingOverlay();

    const kyHieuValue = this.form.controls['kyHieu'].value;
    const tenMonValue = this.form.controls['tenMon'].value;

    const filter = {
      kyHieu: kyHieuValue || '',
      tenMon: tenMonValue || '',
      tenTiengAnh: this.filter['tenTiengAnh'] || '',
      idBm: this.filter['idBm'] || 0,
      idHeDt: this.filter['idHeDt'] || 0,
      idNhomHp: this.filter['idNhomHp'] || 0,
      hpThucHanh: this.filter['hpThucHanh'] !== undefined ? this.filter['hpThucHanh'] : false,
      chatLuongCao: this.filter['chatLuongCao'] !== undefined ? this.filter['chatLuongCao'] : false,
      monChungChi: this.filter['monChungChi'] !== undefined ? this.filter['monChungChi'] : false,
      monNN: this.filter['monNN'] !== undefined ? this.filter['monNN'] : false
    };

    const rs = this.monHocApiService.getFilter(filter).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (!res.data) {
          this.notification.error(this.i18n.fanyi('app.common.error.title'), `${res.message}`);
          return;
        }

        const dataResult = res.data.data;
        this.grid.rowData = dataResult;

        let i = (this.filter.pageSize ?? 0) * ((this.filter.pageNumber ?? 0) - 1);

        for (const item of dataResult) {
          item.index = ++i;
          item.infoGrantAccess = false;
          item.editGrantAccess = false;
          item.deleteGrantAccess = true;
        }

        this.grid.totalData = dataResult.totalCount;
        this.grid.dataCount = dataResult.dataCount;

        this.pageSizeOptions = [...PAGE_SIZE_OPTION_DEFAULT].filter(number => number < dataResult.totalCount);
        this.pageSizeOptions.push(dataResult.totalCount);
      },
      error: (err: any) => {
        this.gridApi.hideOverlay();
        this.isLoading = false;
      },
      complete: () => {
        this.gridApi.hideOverlay();
        this.isLoading = false;
      }
    });

    return rs;
  }

  sortData(data: any[]) {
    if (this.sapXep === 'maSv') {
      data.sort((a, b) => a.maSv.localeCompare(b.maSv));
    } else if (this.sapXep === 'hoTen') {
      data.sort((a, b) => a.hoTen.localeCompare(b.hoTen));
    }
  }

  createMonHoc() {
    let selectRows = this.gridApi.getSelectedRows();
    this.modal1Visible.isShow = false;
    this.visible = {
      type: FORM_TYPE.ADD,
      item: {},
      isShow: true,
      option: {}
    };
    this.itemModalMonHoc.initData(selectRows, FORM_TYPE.ADD, this.form.value);
  }
  editMonHoc() {
    let selectRows = this.gridApi.getSelectedRows();

    if (selectRows.length === 0) {
      this.messageService.error('Vui lòng chọn một hàng để chỉnh sửa.');
      return;
    }

    this.modal1Visible.isShow = false;
    this.visible1 = {
      type: FORM_TYPE.EDIT,
      item: {},
      isShow: true,
      option: {}
    };
    this.itemModalMonHoc.initData(selectRows[0], FORM_TYPE.EDIT, this.form.value);
    this.selectedId = selectRows[0].idMon;
  }
  delete(): void {
    const selectedRows = this.gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      this.messageService.error('Bạn phải chọn ít nhất 1 CTĐT');
      return;
    }
    const idList = selectedRows.map((row: { idMon: any }) => row.idMon);
    idList.forEach((idMon: any) => {
      if (idMon !== undefined) {
        this.monHocApiService.delete(idMon).subscribe({
          next: () => {
            this.messageService.success(`Xóa thành công idMon: ${idMon}`);
            this.initGridData();
          },
          error: err => {
            this.messageService.error(`Xóa thất bại idMon: ${idMon}`);
            console.error(`Lỗi khi xóa idMon: ${idMon}`, err);
          }
        });
      } else {
        console.error('idMon là undefined');
      }
    });
  }
  getComboboxMonHoc(): void {
    this.monHocApiService.getCombobox().subscribe({
      next: (res: any) => {
        this.listMonHoc = res.data;
      },
      error: (err: any) => {
        this.messageService.error(err.error.message);
      }
    });
  }
  getComboboxHe(): void {
    this.heApiService.getCombobox().subscribe({
      next: (res: any) => {
        this.listHe = res.data;
      },
      error: (err: any) => {
        this.messageService.error(err.error.message);
      }
    });
  }

  //#endregion start
}
