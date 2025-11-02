import { Component, Inject, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less']
})
export class LayoutPassportComponent implements OnInit {
  get year(): number {
    return this.setting.app['year'];
  }
  version: string = '';
  build: any = '';

  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService, private setting: SettingsService) {
    this.version = environment['version'];
    this.build = environment['build'];
  }

  ngOnInit(): void {
    this.tokenService.clear();
  }
}
