import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Injector,
  OnDestroy,
  Optional,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { I18NService, StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { AuthJWTApiService, PermissionApiService, SharedAuthService, SharedUserApiService } from '@shared-service';
import { isNullOrEmpty, TOKEN_KEY } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface JwtTokenInfo {
  role: string;
  exp: any;
}
@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserLoginComponent {
  // @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component | undefined;
  @ViewChild('langInput', { static: false }) langInput: ElementRef | undefined;

  constructor(
    fb: FormBuilder,
    private router: Router,
    // private userRoleService: UserRoleService,
    private settingsService: SettingsService,
    @Optional()
    @Inject(ReuseTabService)
    @Inject(DA_SERVICE_TOKEN)
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    public authApiService: AuthJWTApiService,
    private authService: SharedAuthService,
    private aclService: ACLService,
    private cdRef: ChangeDetectorRef,
    private modal: NzModalService,
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private permissionApiService: PermissionApiService,
    private readonly sharedUserApiService: SharedUserApiService,
    private readonly injector: Injector,
    private readonly activeRoute: ActivatedRoute,
    private menuService: MenuService
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [false],
      recaptcha: ['']
    });

    this.redirectUrl = isNullOrEmpty(activeRoute.snapshot.queryParams['redirectUrl'])
      ? '/'
      : activeRoute.snapshot.queryParams['redirectUrl'];
  }

  // #region fields

  get userName(): AbstractControl | null {
    return this.form.get('userName');
  }
  get password(): AbstractControl | null {
    return this.form.get('password');
  }
  get remember(): AbstractControl | null {
    return this.form.get('remember');
  }

  form: FormGroup;
  error = '';
  captcha = '';
  isLoading = false;
  loading = false;
  redirectUrl = '/';
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
  typePassword = 'password';
  switchShowPass = () => {
    this.showPassword = !this.showPassword;
    if (!this.showPassword) {
      this.typePassword = 'password';
    } else {
      this.typePassword = 'text';
    }
  };

  // #endregion
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
        next: async (res: any) => {
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
          await this.initPermissionOfUser();
          this.goTo();
          this.authService.finishLogin(res.data.userInfo);

          // const tokenModel = {
          //   id: res.data.userId,
          //   token: res.data.accessToken,
          //   timeExpride: res.data.timeExpride,
          //   time: res.data.timeExpride,
          //   email: res.data.userInfo?.email,
          //   name: res.data.userInfo?.name,
          //   userName: res.data.userInfo?.userName
          // };
          // this.tokenService.set(tokenModel);

          // this.settingsService.setUser({
          //   name: res.data.userInfo?.name,
          //   avatar: './assets/tmp/img/user.png',
          //   email: res.data.userInfo?.email
          // });

          // // Retrieving StartupService content,
          // // we always believe that application information will generally be affected by the scope of the current user authorization

          // this.startupSrv.load().subscribe(() => {
          //   let url = this.tokenService.referrer!.url || '/';
          //   if (url.includes('/passport')) {
          //     url = '/';
          //   }
          //   this.router.navigateByUrl(url);
          // });

          // this.startupSrv.load().then(() => {
          //   let url = this.tokenService.referrer?.url || '/home';
          //   if (url.includes('/passport')) {
          //     url = '/home';
          //   }
          //   this.router.navigateByUrl(url);
          // });
        },
        error: (err: any) => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        complete: () => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        }
      });
  };

  async initPermissionOfUser() {
    var res = await this.sharedUserApiService.getUserPermission().toPromise();

    // Chuyển về trang lỗi 403 nếu người dùng không có quyền truy cập
    if (res.data === null || res.data === undefined || !res.data.isActive || res.data.roles.length === 0) {
      this.router.navigateByUrl(`/exception/403`);
      return;
    }
    this.aclService.setRole([]);
    this.aclService.setAbility([]);
    const token = this.tokenService.get();
    token!['permissions'] = res.data?.permissions;
    token!['roles'] = res.data?.roles;
    this.tokenService.set(token);
    this.aclService.add({ role: res.data?.permissions, ability: res.data?.permissions });
    this.menuService.resume();
    this.cdr.detectChanges();
    this.permissionApiService.updatePermission(res.data?.permissions);
    this.sharedUserApiService.changeLoadUserPermissionState(true);
  }

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

  private goTo(): void {
    localStorage.removeItem(TOKEN_KEY.REDIRECT_AFTER_LOGIN_URL);
    setTimeout(() => this.injector.get(Router).navigateByUrl(this.redirectUrl));
  }
}
