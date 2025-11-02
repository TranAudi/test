import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResultModule } from '@delon/abc/result';
import { SEModule } from '@delon/abc/se';
import { AlainThemeModule } from '@delon/theme';
import { LangsModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SharedAuthenticationModule } from 'src/app/shared-ui/modules/auth-module/authentication.module';
import { SharedRecoverPasswordComponent } from 'src/app/shared-ui/routes/recover-password/recover-password.component';

import { CallbackComponent } from './callback.component';
import { UserLockComponent } from './lock/lock.component';
import { UserLoginComponent } from './login/login.component';
import { UserLogin2Component } from './login2/login2.component';
import { UserLogin3Component } from './login3/login3.component';
import { UserLogin4Component } from './login4/login4.component';
import { PassportRoutingModule } from './passport-routing.module';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { UserRegisterComponent } from './register/register.component';

const COMPONENTS = [
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  UserLockComponent,
  UserLogin4Component,
  // single pages
  UserLogin2Component,
  UserLogin3Component,
  CallbackComponent,
  SharedRecoverPasswordComponent
];

@NgModule({
  imports: [
    PassportRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    NzTabsModule,
    NzAlertModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule,
    NzToolTipModule,
    NzPopoverModule,
    NzProgressModule,
    NzAvatarModule,
    SEModule,
    ResultModule,
    LangsModule,
    SharedAuthenticationModule
  ],
  declarations: COMPONENTS
})
export class PassportModule {}
