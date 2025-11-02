import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AgGridModule } from 'ag-grid-angular';

import { ApplicationImportItemComponent } from './application/application-import-item/application-import-item.component';
import { ApplicationItemComponent } from './application/application-item/application-item.component';
import { ApplicationComponent } from './application/application/application.component';
import { ResourceRoutingModule } from './resource-routing.module';

@NgModule({
  declarations: [ApplicationComponent, ApplicationItemComponent, ApplicationImportItemComponent],
  imports: [SharedModule, ResourceRoutingModule, AgGridModule]
})
export class ConfigModule {}
