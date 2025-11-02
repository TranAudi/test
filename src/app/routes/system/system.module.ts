import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { WorkflowDesignerModule } from '@optimajet/workflow-designer-angular';
import { SharedModule } from '@shared';
import { AgGridModule } from 'ag-grid-angular';

import { EmailTemplateItemComponent } from './email-template/email-template-item/email-template-item.component';
import { EmailTemplateComponent } from './email-template/email-template/email-template.component';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  declarations: [EmailTemplateComponent, EmailTemplateItemComponent],
  imports: [SharedModule, SystemRoutingModule, AgGridModule, CKEditorModule, WorkflowDesignerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SystenModule {}
