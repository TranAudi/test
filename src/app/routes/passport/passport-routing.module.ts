import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedLoGinJWTComponent } from 'src/app/shared-ui/modules/auth-module/login-jwt.component';
import { SharedRecoverPasswordComponent } from 'src/app/shared-ui/routes/recover-password/recover-password.component';

import { LayoutPassportComponent } from '../../layout/passport/passport.component';
import { CallbackComponent } from './callback.component';
import { UserLockComponent } from './lock/lock.component';
import { UserLoginComponent } from './login/login.component';
import { UserLogin2Component } from './login2/login2.component';
import { UserLogin3Component } from './login3/login3.component';
import { UserLogin4Component } from './login4/login4.component';
import { UserRegisterResultComponent } from './register-result/register-result.component';
import { UserRegisterComponent } from './register/register.component';

const routes: Routes = [
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: SharedLoGinJWTComponent,
        data: { title: 'Đăng nhập', titleI18n: 'app.login.login' }
      },
      // {
      //   path: 'register',
      //   component: UserRegisterComponent,
      //   data: { title: '注册', titleI18n: 'app.register.register' }
      // },
      // {
      //   path: 'register-result',
      //   component: UserRegisterResultComponent,
      //   data: { title: '注册结果', titleI18n: 'app.register.register' }
      // },
      // {
      //   path: 'lock',
      //   component: UserLockComponent,
      //   data: { title: '锁屏', titleI18n: 'app.lock' }
      // }
      {
        path: 'recover-password',
        component: SharedRecoverPasswordComponent,
        data: { title: 'Khôi phục mật khẩu', titleI18n: 'app.passport.recover-password' }
      }
    ]
  },
  // 单页不包裹Layout
  { path: 'login2', component: UserLogin2Component },
  { path: 'login3', component: UserLogin3Component },
  { path: 'passport/callback/:type', component: CallbackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassportRoutingModule {}
