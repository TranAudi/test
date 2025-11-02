import { LayoutModule as CDKLayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { AlainThemeModule } from '@delon/theme';
import { ThemeBtnModule } from '@delon/theme/theme-btn';
import { LangsModule, ScrollbarModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { SharedChangePasswordModule } from '../shared-ui/components/change-password/change-password.module';
import { SharedProWidgetUserModule } from '../shared-ui/components/user/user.module';
import { LayoutPassportComponent } from './passport/passport.component';
import { PRO_COMPONENTS } from './pro/index';

const COMPONENTS: Array<Type<any>> = [...PRO_COMPONENTS, LayoutPassportComponent];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AlainThemeModule,
    GlobalFooterModule,
    CDKLayoutModule,
    NzSpinModule,
    NzDropDownModule,
    NzIconModule,
    NzDrawerModule,
    NzAutocompleteModule,
    NzAvatarModule,
    NzSwitchModule,
    NzToolTipModule,
    NzSelectModule,
    NzDividerModule,
    NzAlertModule,
    NzLayoutModule,
    NzButtonModule,
    NzBadgeModule,
    NzTimelineModule,
    NoticeIconModule,
    ThemeBtnModule,
    LangsModule,
    ScrollbarModule,
    NzMessageModule,
    SharedChangePasswordModule,
    SharedProWidgetUserModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class LayoutModule {}
