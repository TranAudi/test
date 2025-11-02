import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { CacheApiService, PermissionApiService, SharedAuthService } from '@shared-service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'layout-pro-user',
  templateUrl: 'user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProWidgetUserComponent implements OnInit {
  public _user: any = { id: 0, userName: '', fullName: '', email: '' };
  public tokenModel: any = {};
  public canClearCache = false;

  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cdr: ChangeDetectorRef,
    private authService: SharedAuthService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private message: NzMessageService,
    private cacheApiService: CacheApiService,
    private aclService: ACLService,
    private permissionApiService: PermissionApiService
  ) {}

  ngOnInit(): void {
    this.tokenModel = this.tokenService.get();
    if (this.tokenModel.userInfo) {
      this._user = this.tokenModel.userInfo;
    }

    this.authService.loginChanged.subscribe((v: any) => {
      this.tokenModel = this.tokenService.get();
      if (this.tokenModel.userInfo) {
        this._user = this.tokenModel.userInfo;
      }
      this.cdr.detectChanges();
    });

    this.permissionApiService.userPermission.subscribe((value: any) => {
      this.initRightOfUser();
    });
  }

  initRightOfUser(): void {
    this.canClearCache = this.aclService.canAbility('CLEAR_ALL_CACHE');
  }

  removeAllCache(): void {
    const promise = this.cacheApiService.removeAllCache().subscribe({
      next: (res: any) => {
        this.message.success(this.i18n.fanyi('message.remove-cache-success'));
      },
      error: (err: any) => {
        if (err.status === 200) {
          this.message.success(this.i18n.fanyi('message.remove-cache-success'));
        } else {
          this.message.error(err);
        }
      }
    });
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl('/logout');
  }
}
