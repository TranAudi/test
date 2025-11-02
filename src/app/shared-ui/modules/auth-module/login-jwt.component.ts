import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { log } from '@delon/util';
import { environment } from '@env/environment';
import { ButtonModel } from '@model';
import { AuthJWTApiService, SharedAuthService } from '@shared-service';
import { EVENT_TYPE, cleanForm } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'login-jwt',
  templateUrl: 'login-jwt.component.html',
  styleUrls: ['./login-jwt.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedLoGinJWTComponent implements OnInit {
  @Input() type = 'login';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() readonly eventEmmit = new EventEmitter<any>();
  @Output() readonly loginSuccess = new EventEmitter<any>();
  @Output() readonly loginError = new EventEmitter<any>();

  form: FormGroup;

  currentLang = 'vi';
  tittle = 'Đăng nhập';
  isLoading = false;
  error = '';
  success = '';

  btnSave: ButtonModel;
  btnCancel: ButtonModel;

  isShowExternalLogin = false;

  showPassword = false;
  typePassword = 'password';

  switchShowPass = () => {
    this.showPassword = !this.showPassword;
    if (!this.showPassword) {
      this.typePassword = 'password';
    } else {
      this.typePassword = 'text';
    }
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly messageService: NzMessageService,
    public readonly authApiService: AuthJWTApiService,
    private readonly cdRef: ChangeDetectorRef,
    @Inject(ALAIN_I18N_TOKEN) public readonly i18n: I18NService,
    private readonly aclService: ACLService,
    private readonly router: Router,
    private readonly settingsService: SettingsService,
    private readonly modal: NzModalService,
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly authService: SharedAuthService,
    @Inject(DOCUMENT) private readonly doc: any
  ) {
    this.btnSave = {
      title: 'Đăng nhập', // Changed button text
      visible: true,
      enable: true,
      grandAccess: true,
      click: () => {
        this.submit();
      }
    };
    this.btnCancel = {
      title: this.i18n.fanyi('app.common.button.close'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: () => {
        this.handleCancel();
      }
    };

    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [false]
    });

    if (environment['externalAuthenticator'] != undefined && environment['externalAuthenticator'] != null) {
      this.isShowExternalLogin = environment['externalAuthenticator']['isEnabled'] ?? false;
    }
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

  showUserIsNotActive(): void {
    this.modal.error({
      nzTitle: 'Tài khoản bị khóa',
      nzContent: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên để được hỗ trợ.',
      nzOkText: 'Đồng ý',
      nzWidth: '600px'
    });
  }
  get userName(): AbstractControl | null {
    return this.form.get('userName');
  }
  get password(): AbstractControl | null {
    return this.form.get('password');
  }
  get remember(): AbstractControl | null {
    return this.form.get('remember');
  }
  submit = () => {
    this.isLoading = true;
    this.error = '';
    this.userName?.markAsDirty();
    this.userName?.updateValueAndValidity();
    this.password?.markAsDirty();
    this.password?.updateValueAndValidity();

    if (this.userName?.invalid || this.password?.invalid) {
      this.isLoading = false;
      return;
    }

    const helper = new JwtHelperService();
    this.authApiService
      .login({
        username: this.userName?.value,
        password: this.password?.value,
        rememberMe: this.remember?.value
      })
      .subscribe({
        next: (res: any) => {
          if (res.code !== 200) {
            this.error = res.message;
            return;
          }
          if (res.data === null || res.data === undefined) {
            this.error = res.message;
            return;
          }

          if (res.data === null || res.data === undefined) {
            this.modal.error({
              nzTitle: 'Tên đăng nhập hoặc mật khẩu không đúng',
              nzContent: 'Bạn vui lòng liên hệ Quản trị viên để được thiết lập quyền đăng nhập hệ thống.',
              nzOkText: 'Đồng ý',
              nzWidth: '600px'
            });
            return;
          }

          if (res.data.userInfo === null || res.data.userInfo === undefined) {
            this.error = res.message;
            return;
          }

          if (!res.data?.userInfo?.isActive) {
            this.showUserIsNotActive();
            return;
          }

          var token: ITokenModel = res.data;
          token.token = res.data.accessToken;
          const expirationDate = helper.getTokenExpirationDate(res.data.accessToken);
          token.expired = expirationDate?.getTime();
          this.tokenService.set(token);
          this.router.navigateByUrl('/');
          this.authService.finishLogin(res.data.userInfo);

          // Emit success event
          this.loginSuccess.emit(res);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.modal.error({
            nzTitle: 'Có lỗi xảy ra',
            nzContent:
              err.error?.message || err.message || 'Bạn vui lòng liên hệ Quản trị viên để được thiết lập quyền đăng nhập hệ thống.',
            nzOkText: 'Đồng ý',
            nzWidth: '600px'
          });

          // Emit error event
          this.loginError.emit(err);

          this.cdRef.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
  };

  loginWithGoogle = () => {
    this.isLoading = true;
    this.error = '';

    this.isLoading = false;
  };

  toggleRememberMe = () => {
    const currentValue = this.form.get('rememberMe')?.value;
    this.form.get('rememberMe')?.setValue(!currentValue);
  };

  forgotPassword = () => {};

  switchLanguage = (lang: string) => {
    const fullLangCode = lang === 'vi' ? 'vi-VN' : 'en-US';
    this.i18n.loadLangData(fullLangCode).subscribe({
      next: (langData: any) => {
        this.i18n.use(fullLangCode, langData);

        this.settingsService.setLayout('lang', fullLangCode);

        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.i18n.use(fullLangCode, {});
        this.settingsService.setLayout('lang', fullLangCode);

        this.cdRef.detectChanges();
      }
    });
  };
}
