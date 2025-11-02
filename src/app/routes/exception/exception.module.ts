import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExceptionModule as DelonExceptionModule } from '@delon/abc/exception';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SharedExceptionModule } from '../../shared-ui/components/exception/exception.module';

import { ExceptionRoutingModule } from './exception-routing.module';
import { ExceptionTriggerComponent } from './trigger.component';

@NgModule({
  imports: [CommonModule, DelonExceptionModule, NzButtonModule, NzCardModule, SharedExceptionModule, ExceptionRoutingModule],
  declarations: [ExceptionTriggerComponent]
})
export class ExceptionModule {}
