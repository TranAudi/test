import { Component, ChangeDetectionStrategy, OnInit, Inject, Injector, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { HouCasService, IdentityApiService, PermissionApiService, SharedAuthService, SharedUserApiService } from '@shared-service';
import dayjs from 'dayjs';
import { NzModalService } from 'ng-zorro-antd/modal';

import { getBaseClientUrl, TOKEN_KEY } from '../../utils/shared-utils';

@Component({
  selector: 'app-oidc-callback',
  templateUrl: './oidc-callback.component.html',
  styleUrls: ['./oidc-callback.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedOIDCCallBackComponent implements OnInit {
  isLoading = true;
  code: string | null = '';
  ticket: string | null = '';
  clientUrl: string | null = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly identityApiService: IdentityApiService,
    private readonly authService: SharedAuthService,
    private readonly houCasService: HouCasService,
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly sharedUserApiService: SharedUserApiService,
    private readonly injector: Injector,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService,
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private aclService: ACLService,
    private permissionApiService: PermissionApiService,
    private cdr: ChangeDetectorRef,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.tokenService.clear();
    const authType = environment['authType'];

    this.clientUrl = getBaseClientUrl();

    // Xử lý xác thực qua SSO hoặc KeyCloak
    if (authType == 'sso' || authType == 'keycloak' || authType == null || authType == undefined || authType == '') {
      for (var key in localStorage) {
        if (key.startsWith('oidc.')) {
          let item = localStorage.getItem(key);
          if (item != null) {
            var obj = JSON.parse(item);
            if (obj.created != null) {
              let created = new Date(obj.created * 1000);
              let yesterday = dayjs().subtract(1, 'days').toDate();
              if (created < yesterday) {
                localStorage.removeItem(key);
              }
            }
          }
        }
      }
      this.route.queryParams.subscribe(async params => {
        this.code = params['code'];

        if (this.code == null || this.code == undefined || this.code == '') {
          this.authService.login();
        } else {
          var res = await this.authService.handleLoginCallback();
          if (res == null) {
            this.authService.login();
            return;
          }
          var user = await this.authService.getUserInfo();

          // Kiểm tra user dựa trên authType
          if (authType === 'keycloak') {
            // Với KeyCloak, kiểm tra thuộc tính sub
            if (!user?.sub) {
              console.error('KeyCloak authentication error: user.sub is null or undefined');
              this.showUserIsNotActive();
              return;
            }
          } else {
            // Với SSO, giữ logic cũ
            if (user == null || !user?.isActive) {
              this.showUserIsNotActive();
              return;
            }
          }
          var token: ITokenModel = res;
          token.token = res.access_token;
          token['userInfo'] = user;
          this.tokenService.set(token);
          await this.initPermissionOfUser();
          this.goTo('/');
          this.authService.finishLogin(user);
        }
      });
    }

    // Xử lý xác thực qua HOU CasServer
    if (authType == 'hou') {
      this.route.queryParams.subscribe(params => {
        this.ticket = params['ticket'];
        if (this.ticket == null || this.ticket == undefined || this.ticket == '') {
          this.houCasService.login();
        } else {
          const helper = new JwtHelperService();
          let requestModel = {
            ticket: this.ticket,
            service: `${this.clientUrl}/oidc-callback`
          };
          this.identityApiService.validateHouTicket(requestModel).subscribe({
            next: async (res: any) => {
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
              this.goTo('/');
              this.authService.finishLogin(res.data.userInfo);
            },
            error: (err: any) => {
              this.houCasService.login();
            },
            complete: () => {}
          });
        }
      });
    }

    if (authType == 'jwt') {
      // this.tokenService.clear();
      let url = localStorage.getItem(TOKEN_KEY.REDIRECT_AFTER_LOGIN_URL) || '';
      this.goTo(`/passport/login?redirectUrl=${url}`);
    }
  }

  showUserIsNotActive() {
    this.isLoading = false;
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
        this.goTo('/logout');
      },
      nzCancelText: `${this.i18n.fanyi('oidc-callback.try-again')}`,
      nzOnCancel: () => {
        this.tokenService.clear();
        this.goTo('/oidc-callback');
      }
    });
  }

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

  private goTo(url: string): void {
    url = localStorage.getItem(TOKEN_KEY.REDIRECT_AFTER_LOGIN_URL) || url;
    localStorage.removeItem(TOKEN_KEY.REDIRECT_AFTER_LOGIN_URL);
    window.location.href = url;
  }
}
