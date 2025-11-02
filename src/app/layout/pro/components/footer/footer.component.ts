import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';

@Component({
  selector: 'layout-pro-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProFooterComponent {
  get year(): number {
    return this.setting.app['year'];
  }
  version: string = '';
  build: any = '';

  constructor(private setting: SettingsService) {
    this.version = environment['version'];
    this.build = environment['build'];
  }
}
