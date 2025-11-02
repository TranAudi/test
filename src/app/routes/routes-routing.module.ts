import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// layout
import { LayoutProComponent } from '@brand';
import { startPageGuard } from '@core';
import { environment } from '@env/environment';

// dashboard pages
import { AuthGuard } from '../shared-ui/core/guards/auth.guard';
import { SharedLogoutComponent } from '../shared-ui/routes/logout/logout.component';
import { SharedOIDCCallBackComponent } from '../shared-ui/routes/oidc-callback/oidc-callback.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutProComponent,
    children: [
      { path: '', redirectTo: '/sys/email-template', pathMatch: 'full' },
      {
        path: 'sys',
        loadChildren: () => import('./system/system.module').then(m => m.SystenModule)
      }
    ]
  },
  {
    path: '',
    children: [
      { path: 'oidc-callback', component: SharedOIDCCallBackComponent },
      { path: 'logout', component: SharedLogoutComponent }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/passport.module').then(m => m.PassportModule) },
  { path: 'exception', loadChildren: () => import('./exception/exception.module').then(m => m.ExceptionModule) },
  // 单页不包裹Layout
  { path: '**', redirectTo: 'exception/404' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class RouteRoutingModule {}
