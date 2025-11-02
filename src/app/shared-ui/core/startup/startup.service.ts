import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { environment } from '@env/environment';
import { MENU_CONSTANTS, SETTING_KEY_BUILD, getLocation, getOperatingSystem } from '@util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, zip, catchError, map, tap, switchMap, of } from 'rxjs';

import { ICONS } from '../../../../style-icons';
import { ICONS_AUTO } from '../../../../style-icons-auto';
import { I18NService } from '../i18n/i18n.service';

export interface IEnvConfig {
  version: string;
  api: any;
  phanHe: string;
  authType: string;
  identiyServer: any;
  houCasServer: any;
  keycloakServer: any;
  externalAuthenticator: any;
  qrCodeDiemDanh: any;
}

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private router: Router,
    private modal: NzModalService
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  isConfirmNewVersionShowing = false;

  checkData(str1: any, str2: any): any {
    if (str1 === '' || str1 === null || str1 === undefined) {
      return str2;
    } else {
      return str1;
    }
  }

  // Thực hiện kiểm tra phiên bản mới (5 phút 1 lần)
  checkNewVersionInterval(): void {
    setInterval(() => {
      let ts = Math.floor(new Date().getTime() / 1000);
      this.httpClient.get(`assets/build.json?ts=${ts}`).subscribe({
        next: (res: any) => {
          if (res.build.toString() !== this.settingService.getData(SETTING_KEY_BUILD).toString() && !this.isConfirmNewVersionShowing) {
            this.isConfirmNewVersionShowing = true;
            this.modal.confirm({
              nzTitle: this.i18n.fanyi('app.common.message.new-version-detect.title'),
              nzContent: this.i18n.fanyi('app.common.message.new-version-detect.content'),
              nzOkText: this.i18n.fanyi('app.common.message.new-version-detect.button'),
              nzCancelText: this.i18n.fanyi('app.common.message.new-version-detect.button-cancel'),
              nzOnOk: () => {
                window.location.reload();
              },
              nzOnCancel: () => {
                this.isConfirmNewVersionShowing = false;
              }
            });
          }
        }
      });
    }, 60000);
  }

  convertDataToEnvironment(env: any): void {
    if (env) {
      const env_conf = env as IEnvConfig;
      environment.api.baseUrl = this.checkData(env_conf.api?.baseUrl, environment.api.baseUrl);
      environment.api.refreshTokenEnabled = this.checkData(env_conf.api?.refreshTokenEnabled, environment.api.refreshTokenEnabled);

      environment['vaultToken'] = this.checkData(env.vaultToken, environment['vaultToken']);
      environment['authType'] = this.checkData(env_conf.authType, environment['authType']);
      environment['houCasServer'] = this.checkData(env_conf.houCasServer, environment['houCasServer']);
      environment['identiyServer'] = this.checkData(env_conf.identiyServer, environment['identiyServer']);
      environment['keycloakServer'] = this.checkData(env_conf.keycloakServer, environment['keycloakServer']);
      environment['externalAuthenticator'] = this.checkData(env_conf.externalAuthenticator, environment['externalAuthenticator']);

      var storageBuild: any = '';
      try {
        storageBuild = this.settingService.getData(SETTING_KEY_BUILD);
      } catch (error) {}
      var codeBuild = environment[SETTING_KEY_BUILD];

      // Nếu phiên bản mới hơn thì reload lại trang
      if (storageBuild !== '' && storageBuild !== null && storageBuild !== undefined && storageBuild !== codeBuild) {
        setTimeout(() => window.location.reload());
      }

      // Lưu phiên bản hiện tại vào storage
      this.settingService.setData(SETTING_KEY_BUILD, codeBuild);

      // Nếu là production thì chạy job interval kiểm tra phiên bản mới
      if (environment.production) {
        this.checkNewVersionInterval();
      }
    }
  }

  load(): Observable<void> {
    return this.loadEnv().pipe(
      tap((env: any) => {
        this.convertDataToEnvironment(env);
      }),
      switchMap(() => this.loadConfig()),
      tap(() => {}),
      switchMap(() => of(void 0)) // Chuyển đổi thành Observable<void>
    );
  }

  private loadEnv(): Observable<any> {
    return this.httpClient.get(`assets/env${environment.production ? '.production' : ''}.json?build=${environment[SETTING_KEY_BUILD]}`);
  }

  loadConfig(): Observable<void> {
    const token = this.tokenService.get();
    if (token !== null) {
      if (token['permissions'] && this.aclService.data.roles.length === 0) {
        this.aclService.add({ ability: token['permissions'], role: token['permissions'] });
      }
    }

    // getLocation();
    getOperatingSystem();
    const defaultLang = this.i18n.defaultLang;
    const headers = new HttpHeaders().set('X-Vault-Token', environment['vaultToken']);
    let isHasVaultToken = environment['vaultToken'] !== '' && environment['vaultToken'] !== null && environment['vaultToken'] !== undefined;

    return zip(
      this.i18n.loadLangData(defaultLang),
      this.i18n.loadLangDataCustom(defaultLang),
      this.httpClient.get(`assets/tmp/app-data.json?build=${environment[SETTING_KEY_BUILD]}`),
      isHasVaultToken ? this.httpClient.get(`${environment.api.baseUrl}/vault/v1/${environment['phanHe']}`, { headers: headers }) : of(null)
    ).pipe(
      catchError(res => {
        console.warn(`StartupService.load: Network request failed`, res);
        setTimeout(() => this.router.navigateByUrl(`/exception/500`));
        return [];
      }),
      map(([langData, langDataCustom, appData, conf]: [Record<string, string>, Record<string, string>, NzSafeAny, any]) => {
        // setting language data
        langData = { ...langData, ...langDataCustom };
        this.i18n.use(defaultLang, langData);
        this.settingService.setApp(appData.app);
        this.settingService.setUser(appData.user);
        // this.aclService.setFull(true);
        this.menuService.add(MENU_CONSTANTS);
        this.titleService.default = '';
        this.titleService.suffix = appData.app.name;

        let env = conf?.data?.data;
        this.convertDataToEnvironment(env);
      })
    );
  }
}
