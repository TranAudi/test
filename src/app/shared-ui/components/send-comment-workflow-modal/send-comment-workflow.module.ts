import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { SendCommentWorkflowModalComponent } from './send-comment-workflow.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';

const COMPONENTS = [SendCommentWorkflowModalComponent];

@NgModule({
  imports: [CommonModule, SharedModule, NzAlertModule, NzModalModule, NzFormModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class SendCommentWorkflowModule {}
