import { Component, ChangeDetectionStrategy, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { HouCasService, IdentityApiService, SharedAuthService } from '@shared-service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedLogoutComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly identityApiService: IdentityApiService,
    private readonly authService: SharedAuthService,
    private readonly houCasService: HouCasService,
    private readonly router: Router,
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService
  ) {}

  ngOnInit(): void {
    this.tokenService.clear();
    const authType = environment['authType'];
    if (authType == 'sso' || authType == 'keycloak' || authType == null || authType == undefined || authType == '') {
      for (var key in localStorage) {
        if (key.startsWith('oidc.')) {
          localStorage.removeItem(key);
        }
      }
      this.authService.logout();
    } else if (authType == 'hou') {
      localStorage.clear();
      this.houCasService.logout();
    } else if (authType == 'jwt') {
      this.tokenService.clear();
      this.router.navigateByUrl('/passport/login');
    }
  }
}
