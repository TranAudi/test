import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import { SharedChangePasswordModule } from '../change-password/change-password.module';
import { SharedUpdateUserInfoModule } from '../update-user-info/update-user-info.module';
import { SharedProWidgetUserComponent } from './user.component';

const COMPONENTS = [SharedProWidgetUserComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule, SharedChangePasswordModule, SharedUpdateUserInfoModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SharedProWidgetUserModule {}
