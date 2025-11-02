import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { ButtonModel } from '@model';
import { AuthJWTApiService } from '@shared-service';
import { EVENT_TYPE, cleanForm } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'shared-change-password',
  templateUrl: 'change-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedWidgetChangePasswordComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  form: FormGroup;

  tittle = 'Đổi mật khẩu';

  isLoading = false;

  error = '';
  success = '';

  btnSave: ButtonModel;
  btnCancel: ButtonModel;

  showPassword = false;
  showOldPassword = false;
  showPassword1 = false;
  typePassword = 'password';
  typeOldPassword = 'password';
  typePassword1 = 'password';

  switchShowOldPass = () => {
    this.showOldPassword = !this.showOldPassword;
    if (!this.showOldPassword) {
      this.typeOldPassword = 'password';
    } else {
      this.typeOldPassword = 'text';
    }
  };

  switchShowPass = () => {
    this.showPassword = !this.showPassword;
    if (!this.showPassword) {
      this.typePassword = 'password';
    } else {
      this.typePassword = 'text';
    }
  };

  switchShowPass1 = () => {
    this.showPassword1 = !this.showPassword1;
    if (!this.showPassword1) {
      this.typePassword1 = 'password';
    } else {
      this.typePassword1 = 'text';
    }
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: NzMessageService,
    public readonly authApiService: AuthJWTApiService,
    private readonly cdRef: ChangeDetectorRef,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    private readonly aclService: ACLService
  ) {
    this.btnSave = {
      title: this.i18n.fanyi('app.common.button-change-pass.save'),
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
      oldPassword: [null, [Validators.required]],
      newPassword: [
        null,
        [
          Validators.required,
          Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$')
        ]
      ],
      confirmNewPassword: [null, [Validators.required]]
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

  get oldPassword(): AbstractControl | null {
    return this.form.get('oldPassword');
  }

  get newPassword(): AbstractControl | null {
    return this.form.get('newPassword');
  }
  get confirmNewPassword(): AbstractControl | null {
    return this.form.get('confirmNewPassword');
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
  }

  closeModalReloadData(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.SUCCESS });
  }

  submit = () => {
    this.isLoading = true;
    this.success = '';
    this.error = '';
    this.oldPassword?.markAsDirty();
    this.oldPassword?.updateValueAndValidity();
    this.newPassword?.markAsDirty();
    this.newPassword?.updateValueAndValidity();
    this.confirmNewPassword?.markAsDirty();
    this.confirmNewPassword?.updateValueAndValidity();

    if (this.newPassword?.value !== this.confirmNewPassword?.value) {
      this.confirmNewPassword?.setErrors({ passwordMismatch: true });
    }

    if (this.newPassword?.invalid || this.confirmNewPassword?.invalid) {
      this.isLoading = false;
      return;
    }

    this.authApiService
      .changePassword({
        oldPassword: this.oldPassword?.value,
        newPassword: this.newPassword?.value,
        confirmNewPassword: this.confirmNewPassword?.value
      })
      .subscribe({
        next: (res: any) => {
          this.success = 'Cập nhật mật khẩu thành công, vui lòng đăng nhập để sử dụng dịch vụ';
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
}
