import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { ButtonModel, GridModel, QueryFilerModel } from '@model';
import { BtnCellRenderComponent, StatusCellRenderComponent } from '@shared';
import {
  AG_GIRD_CELL_STYLE,
  cleanForm,
  EVENT_TYPE,
  EXCEL_STYLES_DEFAULT,
  FORM_TYPE,
  OVERLAY_LOADING_TEMPLATE,
  OVERLAY_NOROW_TEMPLATE,
  PAGE_SIZE_OPTION_DEFAULT,
  QUERY_FILTER_DEFAULT
} from '@util';
import { CheckboxSelectionComponent, GridApi, HeaderCellCtrl } from 'ag-grid-community';
import dayjs from 'dayjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subscription } from 'rxjs';
import { BoMonApiService } from 'src/app/shared-ui/services/bo-mon-api.service';

@Component({
  selector: 'app-giao-vien',
  templateUrl: './giao-vien.component.html',
  styleUrls: ['./giao-vien.component.less']
})
export class GiaoVienComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  formSv: FormGroup;

  isVisibleSv = false;
  isLoadingPage = false;
  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = 'Danh sách giáo viên thuộc bộ môn';
  titleAdd = '';
  listDoiTuongCs: any;
  isLoading = false;
  private gridApi: any;
  private gridApiSv: GridApi | null = null; // Khai báo biến với kiểu GridApi
  btnSave: ButtonModel;
  btnCancel: ButtonModel;
  btnCancelAddSv: ButtonModel;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  filterSv: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;
  overlayLoadingTemplateSv = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplateSv = OVERLAY_NOROW_TEMPLATE;
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0
  };
  doiTuongcs: any = [];
  svKhac: any[] = [];
  pageSizeOptions: any[] = [];
  columnDefs: any[] = [];
  listSvKt: any[] = [];
  defaultColDef: any;
  columnDefsListSv: any[] = [];
  defaultColDefListSv: any;
  listDoiTuong: any = [];
  hocKy = '';
  namHoc = '';
  listNamHoc: any[] = [];
  listHocKy: any[] = [];
  listCapKhenThuongKyLuat: any = [];
  listLoaiKhenThuong: any = [];
  listSinhVienKt: any = [];
  idLops: any = [];
  listLop: any[] = [];
  listIdLop: any[] = [];
  listAccessLop: any[] = [];
  excelStyles: any;
  frameworkComponents: any;

  listSv: any = [];
  date = null;
  dateSv = null;

  doiTuong: any;
  listGiaoVien: any = [];

  listGiaoVienChuaGan: any = [];

  public Editor = ClassicEditor;

  config = {
    toolbar: {
      shouldNotGroupWhenFull: true
    }
  };
  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private notification: NzNotificationService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private boMonService: BoMonApiService,
    private aclService: ACLService
  ) {
    this.btnSave = {
      title: this.i18n.fanyi('app.common.button.save'),
      visible: true,
      enable: true,
      grandAccess: true,

      click: ($event: any) => {
        this.saveGiaoVien();
      }
    };
    this.btnCancel = {
      title: this.i18n.fanyi('app.common.button.close'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.handleCancel();
      }
    };

    this.btnCancelAddSv = {
      title: this.i18n.fanyi('app.common.button.close'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.handleCancelAddSv();
      }
    };
    this.form = this.fb.group({
      hocKy: [this.hocKy, [Validators.required]],
      namHoc: [this.namHoc, [Validators.required]],
      ngayQd: [null, [Validators.required]],
      soQd: ['', [Validators.required]],
      idCapKhenThuong: [0, [Validators.required]],
      idLoaiKhenThuong: [0, [Validators.required]],
      hinhThuc: ['']
    });

    this.formSv = this.fb.group({
      hoTen: [''],
      maSv: [],
      idLops: [],
      ngaySinh: [],
      sbd: []
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
        field: 'maCb',
        headerName: 'Mã Cán bộ',
        minWidth: 140,
        flex: 1,
        cellStyle: { 'text-align': 'center' }
      },
      {
        field: 'hoTen',
        headerName: 'Họ tên',
        minWidth: 580,

        flex: 1,
        sortable: true
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

    this.columnDefsListSv = [
      {
        minWidth: 55,
        maxWidth: 55,
        pinned: 'left',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        suppressRowClickSelection: true
      },
      {
        field: 'maCb',
        headerName: 'Mã Cán bộ',
        minWidth: 140,
        flex: 1,
        cellStyle: { 'text-align': 'center' }
      },
      {
        field: 'hoTen',
        headerName: 'Họ tên',
        minWidth: 580,

        flex: 1,
        sortable: true
      }
    ];
    this.defaultColDefListSv = {
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
  }

  onEditorReady(editor: any): void {
    log('Editor is ready to use!', editor);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.CLOSE });
    this.closeModalReloadData();
  }
  handleCancelAddSv(): void {
    this.isVisibleSv = false;
  }

  ngOnInit(): void {
    this.initRightOfUser();
    this.getNamHoc();
    this.getListSv();
  }

  initRightOfUser(): void {
    this.btnSave.grandAccess =
      this.aclService.canAbility('QUYET_DINH_KHEN_THUONG_ADD') || this.aclService.canAbility('QUYET_DINH_KHEN_THUONG_EDIT');
  }

  resetForm(): void {
    this.form.reset();
    this.form.get('isActive')?.setValue(true);
    this.form.get('order')?.setValue(1);
    this.form.get('isHighPriority')?.setValue(false);
  }

  //#endregion Update-form-type

  public initData(data: any, type: any = null, option: any = {}): void {
    this.resetForm();
    this.isLoading = false;
    this.listDoiTuongCs = data;
    this.item = data;
    this.type = type;
    this.option = option;
    this.svKhac = [];
    this.create(data, option);
    this.initGridData();
    this.getGiaoVienChuaGan();

    switch (type) {
      case FORM_TYPE.ADD:
        this.create(data, option);
        break;
      case FORM_TYPE.EDIT:
        this.update(data, option);
        break;
      default:
        this.create(data, option);
        break;
    }
  }

  closeModalReloadData(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.SUCCESS });
  }

  closeModalReloadDataSv(): void {
    this.isVisible = true;
    this.isVisibleSv = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.SUCCESS });
  }

  onGridReady(params: any, gridName: string): void {
    if (gridName === 'grid') {
      this.gridApi = params.api;
    } else if (gridName === 'gridSv') {
      this.gridApiSv = params.api;
    }
  }
  selectedRows: any[] = [];
  getSelectedRows(gridName: string): void {
    if (gridName === 'grid' && this.gridApi) {
      this.selectedRows = this.gridApi.getSelectedRows();
    } else if (gridName === 'gridSv' && this.gridApiSv) {
      this.selectedRows = this.gridApiSv.getSelectedRows();
    }
  }

  create(data: any[], option: any) {
    this.isInfo = false;
    this.isEdit = false;
    this.isAdd = true;
    this.listSvKt = [];
    this.tittle = 'Danh sách môn học thuộc bộ môn';
    this.hocKy = option.hocKy;
    this.namHoc = option.namHoc;
    this.doiTuong = option;
    this.getLop(data);
  }

  getLop(idLops: any[]) {}

  update(data: any, qdKt: any) {
    this.isInfo = false;
    this.isEdit = true;
    this.isAdd = false;
    this.tittle = this.i18n.fanyi('function.quyet-dinh-khen-thuong.modal.title-edit');

    this.form.get('hocKy')?.setValue(qdKt.hocKy);
    this.form.get('namHoc')?.setValue(qdKt.namHoc);
    this.form.get('soQd')?.setValue(qdKt.soQd);
    this.form.get('ngayQd')?.setValue(qdKt.ngayQd);
    this.form.get('idCapKhenThuong')?.setValue(qdKt.idCap);
    this.form.get('idLoaiKhenThuong')?.setValue(qdKt.idLoaiKt);
    this.form.get('hinhThuc')?.setValue(qdKt.hinhThuc);
    this.listSvKt = qdKt.listIdSv;
    this.getLop(data);
  }

  saveGiaoVien() {
    this.messageService.success('Lưu thành công');
    this.handleCancel();
  }

  saveSv() {
    this.getSelectedRows('gridSv');
    if (this.selectedRows.length == 0) {
      this.messageService.error('Bạn phải chọn ít nhất 1 giáo viên để thêm');
    } else {
      var listIdCb = this.selectedRows.map((x: any) => x.idCb);
      var res = {
        idBoMon: this.item.idBoMon,
        listIdCb: listIdCb
      };
      this.boMonService.createGiangVienBoMon(res).subscribe(req => {
        this.messageService.success('Thêm thành công');
        this.initGridData();
      });
      this.handleCancelAddSv();
    }
  }
  getGiaoVienChuaGan(): Subscription | undefined {
    // this.gridApi.showLoadingOverlay();
    this.filter['idBm'] = this.item.idBoMon;
    const rs = this.boMonService.getGvChuaGanBoMon(this.filter).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.data === null || res.data === undefined) {
          this.notification.error(this.i18n.fanyi('app.common.error.title'), `${res.message}`);
          return;
        }

        const dataResult = res.data.data;
        this.listGiaoVienChuaGan = dataResult;

        let i = (this.filter.pageSize ?? 0) * ((this.filter.pageNumber ?? 0) - 1);
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

  initGridData(): Subscription | undefined {
    // this.gridApi.showLoadingOverlay();
    this.filter['idBm'] = this.item.idBoMon;
    const rs = this.boMonService.getGvThuocBoMon(this.filter).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.data === null || res.data === undefined) {
          this.notification.error(this.i18n.fanyi('app.common.error.title'), `${res.message}`);
          return;
        }

        const dataResult = res.data.data;
        this.grid.rowData = dataResult;
        this.listGiaoVien = dataResult;
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
  getListSv() {
    this.filterSv['IdLops'] = this.formSv.value.idLops && this.formSv.value.idLops > 0 ? [this.formSv.value.idLops] : this.listIdLop;

    this.filterSv['maSv'] = this.formSv.value.maSv ?? '';
    this.filterSv['hoTen'] = this.formSv.value.hoTen ?? '';
    this.filterSv['sbd'] = this.formSv.value.sbd ?? '';
    this.filterSv['ngaySinh'] = this.formSv.value.ngaySinh ?? null;
  }

  addSv() {
    this.listSv = [];
    this.getSelectedRows('grid');
    this.formSv.patchValue({ ngaySinh: null });
    this.isVisibleSv = true;
    this.titleAdd = '';
    this.getListSv();
  }

  deleteSv() {
    this.getSelectedRows('grid');

    if (this.selectedRows.length == 0) {
      this.messageService.error('Bạn phải chọn ít nhất 1 giáo viên để xóa');
    } else {
      var listIdCb = this.selectedRows.map((x: any) => x.idCb);
      var res = {
        idBm: this.item.idBoMon,
        listIdCb: listIdCb
      };
      this.boMonService.deleteGiangVienBoMon(res).subscribe(req => {
        this.initGridData();
      });
    }
  }
  getNamHoc() {
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
}
