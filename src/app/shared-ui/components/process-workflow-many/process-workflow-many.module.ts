import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ProcessWorkflowManyComponent } from './process-workflow-many.component';
import { SendCommentWorkflowModule } from '../send-comment-workflow-modal/send-comment-workflow.module';

const COMPONENTS = [ProcessWorkflowManyComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule, NzModalModule, NzFormModule, SendCommentWorkflowModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class ProcessWorkflowManyModule {}
