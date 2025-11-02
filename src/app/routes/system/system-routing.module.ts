import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { startPageGuard } from '@core';

import { EmailTemplateComponent } from './email-template/email-template/email-template.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'email-template', pathMatch: 'full' },
      { path: 'email-template', component: EmailTemplateComponent, canActivate: [startPageGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
