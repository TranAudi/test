import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedExceptionComponent } from 'src/app/shared-ui/components/exception/exception.component';

import { ExceptionTriggerComponent } from './trigger.component';

const routes: Routes = [
  { path: '403', component: SharedExceptionComponent, data: { type: 403 } },
  { path: '404', component: SharedExceptionComponent, data: { type: 404 } },
  { path: '500', component: SharedExceptionComponent, data: { type: 500 } },
  { path: 'trigger', component: ExceptionTriggerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExceptionRoutingModule {}
