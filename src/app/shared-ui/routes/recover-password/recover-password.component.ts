import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { I18NService, StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, SettingsService, _HttpClient } from '@delon/theme';
import { AuthJWTApiService, SharedAuthService } from '@shared-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface JwtTokenInfo {
  role: string;
  exp: any;
}
@Component({
  selector: 'passport-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedRecoverPasswordComponent {
  // @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component | undefined;
  @ViewChild('langInput', { static: false }) langInput: ElementRef | undefined;

  token = '';
  secretKey = '';

  constructor(
    fb: FormBuilder,
    private readonly router: Router,
    // private userRoleService: UserRoleService,
    private readonly settingsService: SettingsService,
    private readonly route: ActivatedRoute,
    @Optional()
    @Inject(ReuseTabService)
    @Inject(DA_SERVICE_TOKEN)
    private readonly startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    public authApiService: AuthJWTApiService,
    private readonly authService: SharedAuthService,
    private readonly aclService: ACLService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly modal: NzModalService,
    private readonly cdr: ChangeDetectorRef,
    private readonly notification: NzNotificationService,
    private readonly modalService: NzModalService,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService
  ) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.secretKey = params['secretKey'];

      if (this.token === null || this.token === undefined || this.token === '') {
        if (this.secretKey === null || this.secretKey === undefined || this.secretKey === '') {
          this.error = 'Thông tin xác thực không hợp lệ';
        }
      }
    });

    this.form = fb.group({
      newPassword: [null, [Validators.required]],
      confirmNewPassword: [null, [Validators.required]]
    });
  }

  // #region fields

  get newPassword(): AbstractControl | null {
    return this.form.get('newPassword');
  }
  get confirmNewPassword(): AbstractControl | null {
    return this.form.get('confirmNewPassword');
  }

  form: FormGroup;
  error = '';
  success = '';
  captcha = '';
  isLoading = false;
  loading = false;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'vi';
  public type: 'image' | 'audio' = 'image';
  public useGlobalDomain: boolean = false;

  // #region get captcha

  // #endregion

  showPassword = false;
  showPassword1 = false;
  typePassword = 'password';
  typePassword1 = 'password';
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

  // #endregion
  submit = () => {
    this.isLoading = true;
    this.success = '';
    this.error = '';
    this.newPassword?.markAsDirty();
    this.newPassword?.updateValueAndValidity();
    this.confirmNewPassword?.markAsDirty();
    this.confirmNewPassword?.updateValueAndValidity();
    if (this.newPassword?.invalid || this.confirmNewPassword?.invalid) {
      this.isLoading = false;
      return;
    }

    const helper = new JwtHelperService();
    this.authApiService
      .updatePasswordForgotByUser({
        token: this.token,
        secretKey: this.secretKey,
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

  closeNotification(notification: any): void {
    notification.close();
  }

  handleReset(): void {
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }

  changeTheme(theme: 'light' | 'dark'): void {
    this.theme = theme;
  }

  changeSize(size: 'compact' | 'normal'): void {
    this.size = size;
  }

  changeType(type: 'image' | 'audio'): void {
    this.type = type;
  }

  setUseGlobalDomain(use: boolean): void {
    this.useGlobalDomain = use;
  }

  showUserIsNotActive() {
    let title = `${this.i18n.fanyi('oidc-callback.accout-deactive')}`;
    let content = `${this.i18n.fanyi('oidc-callback.accout-description')}`;
    this.modalService.confirm({
      nzTitle: title,
      nzContent: content,
      nzOkText: `${this.i18n.fanyi('oidc-callback.logout')}`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.tokenService.clear();
        this.router.navigateByUrl('/logout');
      },
      nzCancelText: `${this.i18n.fanyi('oidc-callback.try-again')}`,
      nzOnCancel: () => {
        this.tokenService.clear();
        this.router.navigateByUrl('/oidc-callback');
      }
    });
  }
}
