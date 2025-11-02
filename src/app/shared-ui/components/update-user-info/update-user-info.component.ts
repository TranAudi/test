import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { ButtonModel } from '@model';
import { SharedUserApiService } from '@shared-service';
import { EVENT_TYPE } from '@util';

@Component({
  selector: 'shared-update-user-info',
  templateUrl: 'update-user-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedWidgetUpdateUserInfoComponent implements OnInit {
  public _user: any = { id: 0, userName: '', fullName: '', email: '', dienThoai: '' };
  public tokenModel: any = {};

  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  form: FormGroup;

  tittle = 'Cập nhật thông tin cá nhân';

  isLoading = false;

  error = '';
  success = '';

  btnSave: ButtonModel;
  btnCancel: ButtonModel;

  constructor(
    private readonly fb: FormBuilder,
    public readonly sharedUserApiService: SharedUserApiService,
    private readonly cdRef: ChangeDetectorRef,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService
  ) {
    this.btnSave = {
      title: this.i18n.fanyi('app.common.button.save'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.submit();
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

    this.form = fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
      dienThoai: [null, [Validators.pattern(/^((\+84)|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/)]]
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.CLOSE });
  }

  ngOnInit(): void {
    this.initRightOfUser();
  }

  initRightOfUser(): void {}

  resetForm(): void {
    this.error = '';
    this.success = '';
    this.form.reset();
  }

  get fullName(): AbstractControl | null {
    return this.form.get('fullName');
  }

  get email(): AbstractControl | null {
    return this.form.get('email');
  }

  get dienThoai(): AbstractControl | null {
    return this.form.get('dienThoai');
  }

  updateDataToForm(data: any): void {
    this.form.get('fullName')?.setValue(data.fullName);
    this.form.get('email')?.setValue(data.email);
    this.form.get('dienThoai')?.setValue(data.dienThoai);
  }
  //#endregion Update-form-type

  public initData(data: any, type: any = null, option: any = {}): void {
    this.resetForm();
    this.isLoading = false;
    this.item = data;
    this.type = type;
    this.option = option;
    this.isVisible = true;
    log(this.isVisible);
    this.cdRef.detectChanges();
    this.getCurrentUser();
  }

  closeModalReloadData(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.SUCCESS });
  }

  submit = () => {
    this.isLoading = true;
    this.success = '';
    this.error = '';
    this.fullName?.markAsDirty();
    this.fullName?.updateValueAndValidity();
    this.email?.markAsDirty();
    this.email?.updateValueAndValidity();
    if (this.fullName?.invalid || this.email?.invalid) {
      this.isLoading = false;
      return;
    }

    var request = {
      fullName: this.fullName?.value,
      email: this.email?.value,
      dienThoai: this.dienThoai?.value
    };

    this.sharedUserApiService.updateUserInfo(request).subscribe({
      next: (res: any) => {
        this.success = 'Cập nhật thông tin thành công';
      },
      error: (err: any) => {
        if (err.error) {
          this.error = err.error.message;
        } else {
          this.error = err.status;
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  };

  getCurrentUser() {
    this.sharedUserApiService.getCurrentUser().subscribe({
      next: (res: any) => {
        this.updateDataToForm(res.data);
      },
      error: (err: any) => {
        if (err.error) {
          this.error = err.error.message;
        } else {
          this.error = err.status;
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    });
  }
}
