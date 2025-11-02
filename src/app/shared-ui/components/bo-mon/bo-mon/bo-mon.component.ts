import { Component, ElementRef, Inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { sanitizeShrinkWidth } from '@fullcalendar/core/internal';
import { QueryFilerModel, GridModel, ButtonModel } from '@model';
import { BtnCellRenderComponent, StatusCellRenderComponent } from '@shared';
import {
  AG_GIRD_CELL_STYLE,
  EXCEL_STYLES_DEFAULT,
  LIST_STATUS,
  QUERY_FILTER_DEFAULT,
  OVERLAY_LOADING_TEMPLATE,
  OVERLAY_NOROW_TEMPLATE,
  FORM_TYPE,
  EVENT_TYPE,
  PAGE_SIZE_OPTION_DEFAULT
} from '@util';
import { symbolSquare } from 'd3';
import dayjs from 'dayjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subscription } from 'rxjs';
import { GiaoVienApiService } from 'src/app/services/api/giao-vien-api.service';
import { MonHocApiService } from 'src/app/services/api/mon-hoc-api.service';
import { BoMonApiService } from 'src/app/shared-ui/services/bo-mon-api.service';

import { BoMonItemComponent } from '../bo-mon-item/bo-mon-item.component';
import { GiaoVienComponent } from '../giao-vien/giao-viencomponent';
import { MonHocComponent } from '../mon-hoc/mon-hoc.component';

@Component({
  selector: 'app-bo-mon',
  templateUrl: './bo-mon.component.html',
  styleUrls: ['./bo-mon.component.less']
})
export class BoMonComponent implements OnInit {
  constructor(
    private aclService: ACLService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private boMonService: BoMonApiService,
    private monHocApiService: MonHocApiService,
    private giaoVienApiService: GiaoVienApiService,
    private notification: NzNotificationService,
    private fb: FormBuilder,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService
  ) {
    this.form = this.fb.group({
      boMon: [0],
      monHoc: [0],
      giangVien: [0]
    });

    this.columnDefs = [
      {
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        suppressRowClickSelection: true
      },
      {
        field: 'maBoMon',
        headerName: 'Mã bộ môn',
        minWidth: 140,
        flex: 1,
        cellStyle: { 'text-align': 'center' }
      },
      {
        field: 'boMon',
        headerName: 'Tên bộ môn',
        minWidth: 380,

        flex: 1,
        sortable: true
      },
      {
        field: 'soMon',
        headerName: 'Số môn',
        minWidth: 140,

        flex: 1,
        cellStyle: { 'text-align': 'center' }
      },
      {
        field: 'soGiangVien',
        headerName: 'Số giáo viên',
        minWidth: 140,

        flex: 1,
        cellStyle: { 'text-align': 'center' }
      },
      {
        field: 'soNhom',
        headerName: 'Số nhóm',
        minWidth: 140,

        flex: 1,
        cellStyle: { 'text-align': 'center' }
      },
      {
        headerName: this.i18n.fanyi('app.common.table.grid-action'),
        maxWidth: 180,
        pinned: 'right',
        cellRenderer: 'btnCellRender',
        cellRendererParams: {
          infoMonHocClicked: (item: any) => this.onViewMonHoc(item),
          infoGiaoVienClicked: (item: any) => this.onViewGiaoVien(item)
        },
        cellStyle: {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center'
        }
      }
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 100,
      cellStyle: AG_GIRD_CELL_STYLE,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      wrapText: true,
      autoHeight: true
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
      click: (data: { event: any }) => {
        this.onAddItem(); // Gọi phương thức khác nếu cần
      }
    };
    this.btnDelete = {
      title: this.i18n.fanyi('app.common.button.delete'),
      visible: false,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.deleteItem();
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
    this.btnUpdate = {
      title: this.i18n.fanyi('app.common.button.update'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.updateSoQd();
      }
    };
    //#endregion Init button
  }
  @ViewChild(MonHocComponent, { static: false }) itemModal!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };
  @ViewChild(GiaoVienComponent, { static: false }) itemModalGiaoVien!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };
  @ViewChild(MonHocComponent, { static: false }) itemModalMonHoc!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };
  @ViewChild(BoMonItemComponent, { static: false }) itemModalBoMonItem!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };

  isRenderComplete = false;

  listStatus = LIST_STATUS;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  pageSizeOptions: any[] = [];
  form: FormGroup;
  columnDefs: any[] = [];
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0
  };
  idHe: any;
  idKhoa: any;
  khoaHoc: any;
  idChuyenNganh: any;
  lop: any = [];
  listBoMonCombobox: any[] = [];
  listMonHocCombobox: any[] = [];
  listGiangVienCombobox: any[] = [];
  private gridApi: any;
  private gridColumnApi: any;
  defaultColDef: any;
  rowSelection = 'multiple';
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;
  quickText = '';
  excelStyles: any;
  frameworkComponents: any;
  rowData: any[] = [];
  btnAdd: ButtonModel;
  btnDelete: ButtonModel;
  btnResetSearch: ButtonModel;
  btnSearch: ButtonModel;
  btnReload: ButtonModel;
  btnUpdate: ButtonModel;
  listDoiTuongCs: any[] = [];
  isLoading = true;
  isShowDelete = false;
  isShowImport = false;
  isLoadingPage = false;
  isLoadingExport = false;
  isLoadingSave = false;
  listNamHoc: any[] = [];
  listHocKy = [
    { value: 1, label: 'Học kỳ 1' },
    { value: 2, label: 'Học kỳ 2' },
    { value: 3, label: 'Học kỳ 3' }
  ];
  listHe: any = [];
  listKhoa: any = [];
  listKhoaHocRaw: any = [];
  listKhoaHoc: any = [];
  listBoMon: any = [];

  currentYear = new Date().getFullYear();
  listSvSaoChep: { listBoMonModels: any[] } = {
    listBoMonModels: []
  };
  deletes: any = { deleteBoMonModels: [] };
  updateMany: any = { listBoMonModels: [] };
  listQd: any = [];

  title = this.i18n.fanyi('function.religion.page.title');

  visible: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  modal1Visible: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  modalGiaoVien: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  modalMonHoc: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };
  modalBoMon: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };

  ngOnInit(): void {
    this.initRightOfUser();
    this.isRenderComplete = true;
    this.namHoc();
    this.initGridData();
    this.getBoMonCombobox();
    this.getGiangVienCombobox();
    this.getMonHocCombobox();
  }

  initRightOfUser(): void {
    this.btnAdd.grandAccess = this.aclService.canAbility('DOI_TUONG_CHINH_SACH_ADD');
    this.btnDelete.grandAccess = this.aclService.canAbility('DOI_TUONG_CHINH_SACH_DELETE');
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
    this.form.value.idLop = this.lop;
    this.modal1Visible = {
      type: FORM_TYPE.ADD,
      item: {},
      isShow: true,
      option: {}
    };
    this.itemModal.initData(this.listBoMon, FORM_TYPE.ADD, this.form.value);
  }

  createBoMon(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modalBoMon = {
      type: FORM_TYPE.ADD,
      item,
      isShow: true,
      option: {}
    };
    this.itemModalBoMonItem.initData([], FORM_TYPE.ADD, {});
  }

  update(item: any = null): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length == 0) {
      this.messageService.error('Bạn phải chọn 1 bộ môn để sửa');
    } else if (selectedRows.length > 1) {
      this.messageService.error('Bạn chỉ được chọn 1 bộ môn để sửa');
    } else {
      this.modalBoMon = {
        type: FORM_TYPE.EDIT,
        selectedRows,
        isShow: true,
        option: {}
      };
      this.itemModalBoMonItem.initData(selectedRows[0], FORM_TYPE.EDIT, {});
    }
  }

  onViewGiaoVien(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modalGiaoVien = {
      type: FORM_TYPE.INFO,
      item,
      isShow: true,
      option: {}
    };
    this.itemModalGiaoVien.initData(item, FORM_TYPE.INFO, {});
  }
  onViewMonHoc(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modalMonHoc = {
      type: FORM_TYPE.INFO,
      item,
      isShow: true,
      option: {}
    };
    this.itemModalMonHoc.initData(item, FORM_TYPE.INFO, {});
  }

  onViewItem(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal1Visible = {
      type: FORM_TYPE.INFO,
      item,
      isShow: true,
      option: {}
    };
    this.itemModal.initData(item, FORM_TYPE.INFO, {});
  }

  onDeleteItem(item: any = null): void {
    let title = `${this.i18n.fanyi('Xóa bộ môn')}`;
    let content = 'Bạn có chắc chắn muốn xóa bộ môn này';
    const selectedRows = this.gridApi.getSelectedRows();
    const invalidRows = selectedRows.filter((x: any) => x.soMon > 0 || x.soGiangVien > 0);
    var listIdBm = selectedRows.map((x: any) => x.idBoMon);
    if (invalidRows.length > 0) {
      this.messageService.error(`Chỉ được gán bộ môn có số môn = 0 và số giáo viên = 0`);
      return;
    }

    if (selectedRows.length > 0) {
      this.modalService.confirm({
        nzTitle: title,
        nzContent: content,
        nzOkText: 'Xóa',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => this.deleteMany(listIdBm),
        nzCancelText: `${this.i18n.fanyi('Hủy bỏ')}`,
        nzOnCancel: () => {}
      });
    } else {
      this.messageService.error('Cần chọn ít nhất 1 bộ môn để xóa');
    }
  }

  deleteItem() {
    this.messageService.success('Xóa thành công ');
  }

  deleteMany(listIdBm: any) {
    this.isLoading = true;
    const promise = this.boMonService.deleteListBoMon(listIdBm).subscribe({
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

  //#endregion Event

  //#region Modal

  onModalEventEmmit(event: any): void {
    this.modal1Visible.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }
  onModalEventEmmitGv(event: any): void {
    this.modalGiaoVien.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }
  onModalEventEmmitMonHoc(event: any): void {
    this.modalMonHoc.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }
  onModalEventEmmitBm(event: any): void {
    this.modalBoMon.isShow = false;
    if (event.type === EVENT_TYPE.SUCCESS) {
      this.initGridData();
    }
  }

  initGridData(): Subscription | undefined {
    this.btnDelete.visible = false;
    //  this.gridApi.showLoadingOverlay();
    this.filter['idBoMon'] = this.form.value.boMon ?? 0;
    this.filter['idMon'] = this.form.value.monHoc ?? 0;
    this.filter['idCb'] = this.form.value.giangVien ?? 0;
    const rs = this.boMonService.getListBoMon(this.filter).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.data === null || res.data === undefined) {
          this.notification.error(this.i18n.fanyi('app.common.error.title'), `${res.message}`);
          return;
        }
        const dataResult = res.data.data;
        this.grid.rowData = dataResult;
        let i = (this.filter.pageSize ?? 0) * ((this.filter.pageNumber ?? 0) - 1);

        for (const item of dataResult) {
          item.index = ++i;
          item.infoMonHocGrantAccess = true;
          item.infoGiaoMienGrantAccess = true;
        }
        this.grid.totalData = dataResult.totalCount;
        this.grid.dataCount = dataResult.dataCount;

        this.pageSizeOptions = [...PAGE_SIZE_OPTION_DEFAULT];
        // tslint:disable-next-line: variable-name
        this.pageSizeOptions = this.pageSizeOptions.filter(number => {
          return number < dataResult.totalCount;
        });
        this.pageSizeOptions.push(dataResult.totalCount);
      },
      error: (err: any) => {
        this.gridApi.hideOverlay();
      },
      complete: () => {
        this.gridApi.hideOverlay();
      }
    });
    return rs;
  }

  updateSoQd() {}

  //#endregion API Event
  namHoc() {
    var yearNow = new Date().getFullYear() + 4;
    for (var i = 0; i < 10; i++) {
      let namCurrent = `${yearNow}-${yearNow + 1}`;
      let object = {
        value: namCurrent,
        name: namCurrent
      };
      this.listNamHoc.push(object);
      yearNow--;
    }
  }

  getBoMonCombobox() {
    this.boMonService.getCombobox().subscribe(x => {
      this.listBoMonCombobox = x.data;
    });
  }

  getMonHocCombobox() {
    this.monHocApiService.getCombobox().subscribe(x => {
      this.listMonHocCombobox = x.data;
    });
  }

  getGiangVienCombobox() {
    this.giaoVienApiService.getGiaoVienCombobox().subscribe(x => {
      this.listGiangVienCombobox = x.data;
    });
  }
  heChange(data: any) {
    log(data);
    this.idHe = data;
  }

  khoaChange(data: any) {
    log(data);
    this.idKhoa = data;
  }

  khoaHocChange(data: any) {
    log(data);
    this.khoaHoc = data;
  }

  chuyenNganhChange(data: any) {
    log(data);
    this.idChuyenNganh = data;
  }

  lopChange(data: any) {
    log(data);
    this.lop = data;
    this.initGridData();
  }
}

function subscribe(arg0: { next: (res: any) => void; error: (err: any) => void; complete: () => void }) {
  throw new Error('Function not implemented.');
}
