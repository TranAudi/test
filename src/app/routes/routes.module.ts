import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { AgGridModule } from 'ag-grid-angular';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

// dashboard pages
import { SharedLogoutComponent } from '../shared-ui/routes/logout/logout.component';
import { SharedOIDCCallBackComponent } from '../shared-ui/routes/oidc-callback/oidc-callback.component';
import { RouteRoutingModule } from './routes-routing.module';

const COMPONENTS: Array<Type<void>> = [SharedLogoutComponent, SharedOIDCCallBackComponent];
const COMPONENTS_NOROUNT: Array<Type<void>> = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, AgGridModule, NzCheckboxModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule {}
