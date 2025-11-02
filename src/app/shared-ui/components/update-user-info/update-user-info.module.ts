import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { SharedWidgetUpdateUserInfoComponent } from './update-user-info.component';

const COMPONENTS = [SharedWidgetUpdateUserInfoComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedUpdateUserInfoModule {}
