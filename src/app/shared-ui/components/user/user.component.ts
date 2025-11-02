import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { CacheApiService, PermissionApiService, SharedAuthService } from '@shared-service';
import { NzMessageService } from 'ng-zorro-antd/message';

import { SharedWidgetChangePasswordComponent } from '../change-password/change-password.component';
import { SharedWidgetUpdateUserInfoComponent } from '../update-user-info/update-user-info.component';

@Component({
  selector: 'shared-pro-user',
  templateUrl: 'user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedProWidgetUserComponent implements OnInit {
  public _user: any = { id: 0, userName: '', fullName: '', email: '' };
  public tokenModel: any = {};
  public canClearCache = false;

  modal: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };

  modalUpdateUserInfo: any = {
    type: '',
    item: {},
    isShow: false,
    option: {}
  };

  @ViewChild(SharedWidgetChangePasswordComponent, { static: false }) changePasswordModal!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };

  @ViewChild(SharedWidgetUpdateUserInfoComponent, { static: false }) updateUserInfoModal!: {
    initData: (arg0: {}, arg1: string, option: any) => void;
  };

  constructor(
    public settings: SettingsService,
    private readonly router: Router,
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: SharedAuthService,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    private readonly message: NzMessageService,
    private readonly cacheApiService: CacheApiService,
    private readonly aclService: ACLService,
    private readonly permissionApiService: PermissionApiService
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

  openChangePassword(): void {
    this.modal.isShow = true;
    this.changePasswordModal.initData({}, '', {});
  }

  openUpdateUserInfo(): void {
    this.modalUpdateUserInfo.isShow = true;
    this.updateUserInfoModal.initData({}, '', {});
  }

  removeAllCache(): void {
    this.cacheApiService.removeAllCache().subscribe({
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
