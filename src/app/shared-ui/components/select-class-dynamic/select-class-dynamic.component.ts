import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { log } from '@delon/util';
import { environment } from '@env/environment';
import { SharedUserApiService } from '@shared-service';

@Component({
  selector: 'select-class-dynamic',
  templateUrl: './select-class-dynamic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectClassDynamicComponent implements OnInit {
  listAccessLop: any[] = [];
  listHe: any[] = [];
  listKhoa: any[] = [];
  listKhoaHoc: any[] = [];
  listNganh: any[] = [];
  listChuyenNganh: any[] = [];
  listLop: any[] = [];

  idHe: any = 0;
  idKhoa: any = 0;
  khoaHoc: any = 0;
  idChuyenNganh: any = 0;
  idLop: any = 0;
  listLopRes: any[] = [];

  title = '';

  colSpan = 5;
  colSpanMid = 4;

  permission = {
    isViewAll: true,
    isViewHe: true,
    isViewKhoa: true,
    isViewKhoaHoc: true,
    isViewChuyenNganh: true
  };

  @Output() readonly heChange = new EventEmitter<any>();
  @Output() readonly khoaChange = new EventEmitter<any>();
  @Output() readonly khoaHocChange = new EventEmitter<any>();
  @Output() readonly chuyenNganhChange = new EventEmitter<any>();
  @Output() readonly lopChange = new EventEmitter<any>();
  @Output() readonly dataReady = new EventEmitter<void>();

  @Output() readonly maHeChange = new EventEmitter<any>();
  @Output() readonly maChuyenNganhChange = new EventEmitter<any>();

  @Input() isHiddenKhoa: boolean = false;
  @Input() isHiddenKhoaHoc: boolean = false;
  @Input() isHiddenChuyenNganh: boolean = false;
  @Input() isHiddenLop: boolean = false;

  constructor(
    private readonly userApiService: SharedUserApiService,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    private aclService: ACLService
  ) {
    this.title = this.i18n.fanyi('lop-tree-view.title');
  }

  ngOnInit(): void {
    this.setColSpan();
    this.userApiService.getUserAccessLop().subscribe({
      next: (res: any) => {
        this.listAccessLop = res.data;

        // Bóc tách các thông tin
        this.listHe = [...new Set(this.listAccessLop.map(item => JSON.stringify({ idHe: item.idHe, he: item.he })))].map(item =>
          JSON.parse(item)
        );
        if (this.permission.isViewAll) {
          this.listLopRes = this.listAccessLop.map(x => ({
            idLop: x.idLop,
            tenLop: x.tenLop,
            idDt: x.idDt,
            nienKhoa: x.nienKhoa
          }));
        }
        this.lopChange.emit(this.listLopRes);
        this.dataReady.emit();
      },
      error: (err: any) => {},
      complete: () => {}
    });
    this.initRightOfUser();
  }

  setColSpan(): void {
    let countHidden: number = 0;
    countHidden = this.isHiddenLop ? countHidden + 1 : countHidden;
    countHidden = this.isHiddenChuyenNganh ? countHidden + 1 : countHidden;
    countHidden = this.isHiddenKhoaHoc ? countHidden + 1 : countHidden;
    countHidden = this.isHiddenKhoa ? countHidden + 1 : countHidden;

    if (countHidden == 1) {
      this.colSpan = 6;
      this.colSpanMid = 6;
    } else if (countHidden == 2) {
      this.colSpan = 8;
      this.colSpanMid = 8;
    } else if (countHidden == 3) {
      this.colSpan = 12;
      this.colSpanMid = 12;
    } else if (countHidden == 4) {
      this.colSpan = 24;
      this.colSpanMid = 24;
    } else {
      this.colSpan = 5;
      this.colSpanMid = 4;
    }
  }

  initRightOfUser(): void {
    this.permission.isViewAll = false; //this.aclService.canAbility('VIEW_SV_LOP_ALL');
    // this.permission.isViewHe = this.aclService.canAbility('VIEW_SV_LOP_HE');
    // this.permission.isViewKhoa = this.aclService.canAbility('VIEW_SV_LOP_KHOA');
    // this.permission.isViewKhoaHoc = this.aclService.canAbility('VIEW_SV_LOP_KHOA_HOC');
    // this.permission.isViewChuyenNganh = this.aclService.canAbility('VIEW_SV_LOP_CHUYEN_NGANH');
  }

  onHeChange(data: any) {
    this.heChange.emit(data);

    let maHe = this.listAccessLop.find((x: any) => x.idHe == data)?.maHe ?? '';
    this.maHeChange.emit(maHe);

    this.idKhoa = null;
    this.khoaHoc = null;
    this.idChuyenNganh = null;
    this.idLop = null;
    this.listLopRes = [];
    this.listKhoa = [];
    this.listKhoaHoc = [];
    this.listChuyenNganh = [];
    this.listLop = [];

    // this.listKhoa = this.listAccessLop.filter((item: any) => item.idHe === data);

    if (this.isHiddenKhoa) {
      this.listKhoaHoc = [
        ...new Set(this.listAccessLop.filter((item: any) => item.idHe === this.idHe).map(item => JSON.stringify({ khoaHoc: item.khoaHoc })))
      ].map(item => JSON.parse(item));
    } else {
      this.listKhoa = [
        ...new Set(
          this.listAccessLop.filter((item: any) => item.idHe === data).map(item => JSON.stringify({ idKhoa: item.idKhoa, khoa: item.khoa }))
        )
      ].map(item => JSON.parse(item));
    }

    if (this.permission.isViewHe) {
      this.listLopRes = this.listAccessLop
        .filter((item: any) => item.idHe === data)
        .map(x => ({
          idLop: x.idLop,
          tenLop: x.tenLop,
          idDt: x.idDt,
          nienKhoa: x.nienKhoa
        }));
      this.lopChange.emit(this.listLopRes);
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
    this.listLopRes = [];
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
      this.listLopRes = this.listAccessLop
        .filter((item: any) => item.idHe === this.idHe && item.idKhoa === data)
        .map(x => ({
          idLop: x.idLop,
          tenLop: x.tenLop,
          idDt: x.idDt,
          nienKhoa: x.nienKhoa
        }));
      this.lopChange.emit(this.listLopRes);
    }

    this.khoaHocChange.emit(null);
    this.chuyenNganhChange.emit(null);
  }

  onKhoaHocChange(data: any) {
    this.khoaHocChange.emit(data);
    this.idChuyenNganh = null;
    this.idLop = null;
    this.listLopRes = [];
    this.listChuyenNganh = [];
    this.listLop = [];

    // this.listChuyenNganh = this.listAccessLop.filter((item: any) => item.nienKhoa === data);

    if (this.isHiddenKhoa) {
      this.listChuyenNganh = [
        ...new Set(
          this.listAccessLop
            .filter((item: any) => item.idHe === this.idHe && item.khoaHoc === data)
            .map(item => JSON.stringify({ idChuyenNganh: item.idChuyenNganh, chuyenNganh: item.chuyenNganh }))
        )
      ].map(item => JSON.parse(item));
    } else {
      this.listChuyenNganh = [
        ...new Set(
          this.listAccessLop
            .filter((item: any) => item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === data)
            .map(item => JSON.stringify({ idChuyenNganh: item.idChuyenNganh, chuyenNganh: item.chuyenNganh }))
        )
      ].map(item => JSON.parse(item));
    }

    if (this.permission.isViewKhoaHoc) {
      this.listLopRes = this.listAccessLop
        .filter((item: any) => item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === data)
        .map(x => ({
          idLop: x.idLop,
          tenLop: x.tenLop,
          idDt: x.idDt,
          nienKhoa: x.nienKhoa
        }));
      this.lopChange.emit(this.listLopRes);
    }

    this.chuyenNganhChange.emit(null);
  }

  onChuyenNganhChange(data: any) {
    this.chuyenNganhChange.emit(data);

    let maChuyenNganh = this.listAccessLop.find((x: any) => x.idChuyenNganh == data)?.maChuyenNganh ?? '';
    this.maChuyenNganhChange.emit(maChuyenNganh);

    this.idLop = null;
    this.listLopRes = [];
    this.listLop = [];

    // this.listLop = this.listAccessLop.filter((item: any) => item.idChuyenNganh === data);

    if (this.isHiddenKhoa) {
      this.listLop = [
        ...new Set(
          this.listAccessLop
            .filter((item: any) => item.idHe === this.idHe && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === data)
            .map(item => JSON.stringify({ idLop: item.idLop, tenLop: item.tenLop }))
        )
      ].map(item => JSON.parse(item));
    } else {
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
    }

    if (this.permission.isViewChuyenNganh) {
      if (this.isHiddenKhoa) {
        this.listLopRes = this.listAccessLop
          .filter((item: any) => item.idHe === this.idHe && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === data)
          .map(x => ({
            idLop: x.idLop,
            tenLop: x.tenLop,
            idDt: x.idDt,
            nienKhoa: x.nienKhoa
          }));
      } else {
        this.listLopRes = this.listAccessLop
          .filter(
            (item: any) =>
              item.idHe === this.idHe && item.idKhoa == this.idKhoa && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === data
          )
          .map(x => ({
            idLop: x.idLop,
            tenLop: x.tenLop,
            idDt: x.idDt,
            nienKhoa: x.nienKhoa
          }));
      }

      this.lopChange.emit(this.listLopRes);
    }
  }

  onLopChange(data: any) {
    this.idLop = data;
    let lop = [];
    if (this.isHiddenKhoa) {
      lop = this.listAccessLop.find(
        (item: any) =>
          item.idHe === this.idHe && item.khoaHoc === this.khoaHoc && item.idChuyenNganh === this.idChuyenNganh && item.idLop === data
      );
    } else {
      lop = this.listAccessLop.find(
        (item: any) =>
          item.idHe === this.idHe &&
          item.idKhoa == this.idKhoa &&
          item.khoaHoc === this.khoaHoc &&
          item.idChuyenNganh === this.idChuyenNganh &&
          item.idLop === data
      );
    }
    this.listLopRes = lop ? [{ idLop: lop.idLop, tenLop: lop.tenLop, idDt: lop.idDt, nienKhoa: lop.nienKhoa }] : [];
    // log(this.lop);
    this.lopChange.emit(this.listLopRes);
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
