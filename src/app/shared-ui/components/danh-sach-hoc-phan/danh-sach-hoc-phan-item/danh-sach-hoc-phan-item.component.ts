import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { br } from '@fullcalendar/core/internal-common';
import { ButtonModel, GridModel, QueryFilerModel } from '@model';
import { AG_GIRD_CELL_STYLE, cleanForm, EVENT_TYPE, FORM_TYPE, PAGE_SIZE_OPTION_DEFAULT, QUERY_FILTER_DEFAULT } from '@util';
import { CheckboxSelectionComponent, HeaderCellCtrl } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { BoMonApiService } from 'src/app/shared-ui/services/bo-mon-api.service';
import { HeApiService } from 'src/app/shared-ui/services/he-api.service';
import { MonHocApiService } from 'src/app/shared-ui/services/mon-hoc-api.service';
@Component({
  selector: 'app-danh-sach-hoc-phan-item',
  templateUrl: './danh-sach-hoc-phan-item.component.html',
  styleUrls: ['./danh-sach-hoc-phan-item.component.less']
})
export class DanhSachHocPhanItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() visible = true;
  @Input() option: any;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  selectedId: any;

  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = '';
  listMonHoc: any;
  listBoMon: any;
  listHe: any;
  isLoading = false;
  private gridApi: any;
  btnCancel: ButtonModel;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0
  };
  doiTuongcs: any = [];
  svKhac: any[] = [];
  pageSizeOptions: any[] = [];
  columnDefs: any[] = [];
  defaultColDef: any;
  listDoiTuong: any = [];
  trinhDoDaoTaoList: any = [];
  nhomHocPhanList: any = [];
  btnEdit: ButtonModel;
  btnSave: ButtonModel;

  doiTuong: any;

  public Editor = ClassicEditor;

  config = {
    toolbar: {
      shouldNotGroupWhenFull: true
    }
  };
  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private monHocApiService: MonHocApiService,
    private boMonApiService: BoMonApiService,
    private heApiService: HeApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private aclService: ACLService
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
    this.btnSave = {
      title: this.i18n.fanyi('app.common.button.save'),
      visible: true,
      enable: true,
      grandAccess: true,

      click: ($event: any) => {
        this.create();
      }
    };
    this.btnEdit = {
      title: this.i18n.fanyi('app.common.button.edit'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.edit(this.selectedId);
      }
    };

    this.form = this.fb.group({
      kyHieu: [''],
      tenMon: [''],
      idMonHoc: [''],
      tenTiengAnh: [''],
      idBoMon: [0],
      trinhDoDaoTao: [0],
      idNhomHp: [0]
    });

    this.columnDefs = [];
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
  }

  onEditorReady(editor: any): void {
    log('Editor is ready to use!', editor);
  }

  handleCancel(): void {
    this.visible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.CLOSE });
  }

  ngOnInit(): void {
    this.initRightOfUser();
    this.getComboboxMonHoc();
    this.getComboboxBoMon();
    this.getComboboxHe();
  }

  initRightOfUser(): void {}

  resetForm(): void {
    this.form.reset();
    this.form.get('isActive')?.setValue(true);
    this.form.get('order')?.setValue(1);
    this.form.get('isHighPriority')?.setValue(false);
  }

  public initData(data: any, type: any = null, option: any = {}): void {
    this.resetForm();
    this.visible = true;
    this.isLoading = false;
    this.item = data;
    this.type = type;
    this.option = option;

    switch (type) {
      case FORM_TYPE.ADD:
        this.isAdd = true;
        this.isEdit = false;
        break;
      case FORM_TYPE.EDIT:
        this.isAdd = false;
        this.isEdit = true;
        this.patchFormData(this.item);
        break;
    }
  }

  closeModalReloadData(): void {
    this.visible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.SUCCESS });
  }
  patchFormData(data: any): void {
    this.form.patchValue({
      idMon: data.idMon || '',
      kyHieu: data.kyHieu || '',
      tenMon: data.tenMon || '',
      tenTiengAnh: data.tenTiengAnh || '',
      idBoMon: data.idBm || 0,
      trinhDoDaoTao: data.idHeDt || 0,
      idMonHoc: data.idNhomHp || 0,
      hpThucHanh: data.hpThucHanh || false,
      chatLuongCao: data.chatLuongCao || false,
      monChungChi: data.monChungChi || false,
      monNN: data.monNN || false,
      kyHieuCu: data.kyHieuCu || '',
      tenTiengPhap: data.tenTiengPhap || ''
    });
    this.changeDetectorRef.detectChanges();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  listSv: any = [];
  create() {
    this.isEdit = false;
    this.isAdd = true;
    const payload = {
      kyHieu: this.form.get('kyHieu')?.value || '',
      tenMon: this.form.get('tenMon')?.value || '',
      tenTiengAnh: this.form.get('tenTiengAnh')?.value || '',
      idBm: this.form.get('idBoMon')?.value || 0,
      idHeDt: this.form.get('trinhDoDaoTao')?.value || 0,
      idNhomHp: this.form.get('idMonHoc')?.value || 0
    };
    this.monHocApiService.create(payload).subscribe({
      next: (res: any) => {
        this.closeModalReloadData();
        this.messageService.success('Cập nhật thành công');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
  edit(id: any) {
    this.isEdit = true;
    this.isAdd = false;
    this.selectedId = this.item.idMon;

    const payload = {
      idMon: this.selectedId,
      kyHieu: this.form.get('kyHieu')?.value || '',
      tenMon: this.form.get('tenMon')?.value || '',
      tenTiengAnh: this.form.get('tenTiengAnh')?.value || '',
      tenVietTat: this.form.get('tenVietTat')?.value || '',
      idBm: this.form.get('idBoMon')?.value || 0,
      idHeDt: this.form.get('trinhDoDaoTao')?.value || 0,
      idNhomHp: this.form.get('idMonHoc')?.value || 0,
      hpThucHanh: this.form.get('hpThucHanh')?.value || false,
      chatLuongCao: this.form.get('chatLuongCao')?.value || false,
      monChungChi: this.form.get('monChungChi')?.value || false,
      monNN: this.form.get('monNN')?.value || false,
      kyHieuCu: this.form.get('kyHieuCu')?.value || '',
      tenTiengPhap: this.form.get('tenTiengPhap')?.value || ''
    };

    console.log('sửa', payload);

    this.monHocApiService.update(id, payload).subscribe({
      next: (res: any) => {
        this.closeModalReloadData();
        this.messageService.success('Cập nhật thành công');
        this.patchFormData(res.data);
      },
      error: (err: any) => {
        console.error(err);
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
  getComboboxBoMon(): void {
    this.boMonApiService.getCombobox().subscribe({
      next: (res: any) => {
        this.listBoMon = res.data;
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
}
