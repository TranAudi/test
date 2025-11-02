import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { log } from '@delon/util';
import { environment } from '@env/environment';
import { SharedUserApiService } from '@shared-service';

@Component({
  selector: 'he-khoa-lop',
  templateUrl: './he-khoa-lop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeKhoaLopComponent implements OnInit {
  listAccessLop: any[] = [];
  listHe: any[] = [];
  listKhoa: any[] = [];
  listKhoaHoc: any[] = [];
  listNganh: any[] = [];
  listChuyenNganh: any[] = [];
  listLop: any[] = [];
  listIdDaoTao: any[] = [];

  idHe: any = 0;
  idKhoa: any = 0;
  khoaHoc: any = 0;
  idChuyenNganh: any = 0;
  idLop: any = 0;
  listIdLop: any[] = [];
  idDt: any = 0;

  title = '';

  permission = {
    isViewAll: false,
    isViewHe: false,
    isViewKhoa: false,
    isViewKhoaHoc: false,
    isViewChuyenNganh: false
  };

  @Input() isLopVisible: boolean = true;
  @Input() heColSize: { nzXl: number; nzLg: number; nzMd: number; nzSm: number; nzXs: number } = {
    nzXl: 5,
    nzLg: 5,
    nzMd: 5,
    nzSm: 5,
    nzXs: 24
  };
  @Input() khoaColSize: { nzXl: number; nzLg: number; nzMd: number; nzSm: number; nzXs: number } = {
    nzXl: 5,
    nzLg: 5,
    nzMd: 5,
    nzSm: 5,
    nzXs: 24
  };
  @Input() khoaHocColSize: { nzXl: number; nzLg: number; nzMd: number; nzSm: number; nzXs: number } = {
    nzXl: 4,
    nzLg: 4,
    nzMd: 4,
    nzSm: 4,
    nzXs: 24
  };
  @Input() chuyenNganhColSize: { nzXl: number; nzLg: number; nzMd: number; nzSm: number; nzXs: number } = {
    nzXl: 5,
    nzLg: 5,
    nzMd: 5,
    nzSm: 5,
    nzXs: 24
  };

  @Output() readonly heChange = new EventEmitter<any>();
  @Output() readonly khoaChange = new EventEmitter<any>();
  @Output() readonly khoaHocChange = new EventEmitter<any>();
  @Output() readonly chuyenNganhChange = new EventEmitter<any>();
  @Output() readonly lopChange = new EventEmitter<any>();
  @Output() readonly daoTaoChange = new EventEmitter<any>();
  @Output() readonly dataReady = new EventEmitter<void>();
  constructor(
    private readonly userApiService: SharedUserApiService,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    private aclService: ACLService
  ) {
    this.title = this.i18n.fanyi('lop-tree-view.title');
  }

  ngOnInit(): void {
    this.userApiService.getUserAccessLop().subscribe({
      next: (res: any) => {
        this.listAccessLop = res.data;

        // Bóc tách các thông tin
        this.listHe = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idHe: item.idHe, he: item.he })))].map(item =>
          JSON.parse(item)
        );
        // log(this.listHe);
        // this.listKhoa = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idKhoa: item.idKhoa, khoa: item.khoa })))].map(item =>
        //   JSON.parse(item)
        // );
        // log(this.listKhoa);
        // this.listKhoaHoc = [
        //   ...new Set(this.listAccessLop.map(item => JSON.stringify({ nienKhoa: item.nienKhoa, nienKhoa: item.nienKhoa })))
        // ].map(item => JSON.parse(item));
        // log(this.listKhoaHoc);
        // this.listNganh = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idNganh: item.idNganh, nganh: item.nganh })))].map(
        //   item => JSON.parse(item)
        // );
        // log(this.listNganh);
        // this.listChuyenNganh = [
        //   ...new Set(this.listAccessLop.map(item => JSON.stringify({ idChuyenNganh: item.idChuyenNganh, chuyenNganh: item.chuyenNganh })))
        // ].map(item => JSON.parse(item));
        // log(this.listChuyenNganh);
        // this.listLop = [...this.listAccessLop];
        // log(this.listLop);
        if (this.permission.isViewAll) {
          this.listIdLop = this.listAccessLop.map(x => x.idLop);
          this.listIdDaoTao = this.listAccessLop.map(x => x.idDt);
        }
        this.lopChange.emit(this.listIdLop);
        this.daoTaoChange.emit(this.listIdDaoTao);
        this.dataReady.emit();
      },
      error: (err: any) => {},
      complete: () => {}
    });
    this.initRightOfUser();
  }

  initRightOfUser(): void {
    // this.permission.isViewAll = this.aclService.canAbility('VIEW_SV_LOP_ALL');
    this.permission.isViewHe = true;
    this.permission.isViewKhoa = true;
    this.permission.isViewKhoaHoc = true;
    this.permission.isViewChuyenNganh = true;
  }

  onHeChange(data: any) {
    this.heChange.emit(data);
    this.idKhoa = null;
    this.khoaHoc = null;
    this.idChuyenNganh = null;
    this.idLop = null;
    this.listIdLop = [];
    this.listKhoa = [];
    this.listKhoaHoc = [];
    this.listChuyenNganh = [];
    this.listLop = [];
    this.listIdDaoTao = [];

    // this.listKhoa = this.listAccessLop.filter((item: any) => item.idHe === data);

    this.listKhoa = [
      ...new Set(
        this.listAccessLop.filter((item: any) => item.idHe === data).map(item => JSON.stringify({ idKhoa: item.idKhoa, khoa: item.khoa }))
      )
    ].map(item => JSON.parse(item));

    if (this.permission.isViewHe) {
      this.listIdLop = this.listAccessLop.filter((item: any) => item.idHe === data).map(x => x.idLop);
      this.listIdDaoTao = this.listAccessLop.filter((item: any) => item.idHe === data).map(x => x.idDt);
      this.lopChange.emit(this.listIdLop);
      this.daoTaoChange.emit(this.listIdDaoTao);
    }

    this.khoaChange.emit(null);
    this.khoaHocChange.emit(null);
    this.chuyenNganhChange.emit(null);
  }

  onKhoaChange(data: any) {
    this.khoaChange.emit(data);
    this.khoaHoc = null;
    this.idChuyenNganh = null;
    this.idLop = null;
    this.listIdLop = [];
    this.listKhoaHoc = [];
    this.listChuyenNganh = [];
    this.listLop = [];

    this.listKhoaHoc = [
      ...new Set(
        this.listAccessLop
          .filter((item: any) => item.idHe === this.idHe && item.idKhoa === data)
          .map(item => JSON.stringify({ khoaHoc: item.khoaHoc }))
      )
    ].map(item => JSON.parse(item));

    if (this.permission.isViewKhoa) {
      this.listIdLop = this.listAccessLop.filter((item: any) => item.idHe === this.idHe && item.idKhoa === data).map(x => x.idLop);
      this.listIdDaoTao = this.listAccessLop.filter((item: any) => item.idHe === this.idHe && item.idKhoa === data).map(x => x.idDt);
      this.lopChange.emit(this.listIdLop);
      this.daoTaoChange.emit(this.listIdDaoTao);
    }

    this.khoaHocChange.emit(null);
    this.chuyenNganhChange.emit(null);
  }

  onKhoaHocChange(data: any) {
    this.khoaHocChange.emit(data);
    this.idChuyenNganh = null;
    this.idLop = null;
    this.listIdLop = [];
    this.listChuyenNganh = [];
    this.listLop = [];

    // this.listChuyenNganh = this.listAccessLop.filter((item: any) => item.nienKhoa === data);

    this.listChuyenNganh = [
      ...new Set(
        this.listAccessLop
          .filter((item: any) => item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === data)
          .map(item =>
            JSON.stringify({
              idChuyenNganh: item.idChuyenNganh,
              chuyenNganh: item.chuyenNganh
            })
          )
      )
    ].map(item => JSON.parse(item));

    if (this.permission.isViewKhoaHoc) {
      this.listIdLop = this.listAccessLop
        .filter((item: any) => item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === data)
        .map(x => x.idLop);
      this.listIdDaoTao = this.listAccessLop
        .filter((item: any) => item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === data)
        .map(x => x.idDt);
      this.lopChange.emit(this.listIdLop);
      this.daoTaoChange.emit(this.listIdDaoTao);
    }

    this.chuyenNganhChange.emit(null);
  }

  onChuyenNganhChange(data: any) {
    this.chuyenNganhChange.emit(data);
    this.idLop = null;
    this.listIdLop = [];
    this.listLop = [];

    // this.listLop = this.listAccessLop.filter((item: any) => item.idChuyenNganh === data);

    this.listLop = [
      ...new Set(
        this.listAccessLop
          .filter(
            (item: any) =>
              item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === data
          )
          .map(item => JSON.stringify({ idLop: item.idLop, tenLop: item.tenLop }))
      )
    ].map(item => JSON.parse(item));

    if (this.permission.isViewChuyenNganh) {
      this.listIdLop = this.listAccessLop
        .filter(
          (item: any) =>
            item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === data
        )
        .map(x => x.idLop);
      this.listIdDaoTao = this.listAccessLop
        .filter(
          (item: any) =>
            item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === data
        )
        .map(x => x.idDt);
      this.lopChange.emit(this.listIdLop);
      this.daoTaoChange.emit(this.listIdDaoTao);
    }
  }

  onLopChange(data: any) {
    this.idLop = data;
    let lop = this.listAccessLop.find(
      (item: any) =>
        item.idHe === this.idHe &&
        item.idKhoa == this.idKhoa &&
        item.khoaHoc === this.khoaHoc &&
        item.idChuyenNganh === this.idChuyenNganh &&
        item.idLop === data
    );
    this.listIdLop = [lop?.idLop];
    this.listIdDaoTao = [lop?.idDt];
    // log(this.lop);
    this.lopChange.emit(this.listIdLop);
    this.daoTaoChange.emit(this.listIdDaoTao);
  }
  // Hàm cập nhật giá trị cho idHe và gọi sự kiện thay đổi
  setIdHe(value: any): void {
    this.idHe = value;
    this.onHeChange(value); // Gọi hàm xử lý sự kiện onHeChange để cập nhật các combobox liên quan
  }

  setIdKhoa(value: any): void {
    this.idKhoa = value;
    this.onKhoaChange(value);
  }

  setKhoaHoc(value: any): void {
    this.khoaHoc = value;
    this.onKhoaHocChange(value);
  }

  setIdChuyenNganh(value: any): void {
    this.idChuyenNganh = value;
    this.onChuyenNganhChange(value);
  }

  setIdLop(value: any): void {
    this.idLop = value;
    this.onLopChange(value);
  }
}
