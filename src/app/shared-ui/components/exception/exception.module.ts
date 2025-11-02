import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { SharedExceptionComponent } from './exception.component';

@NgModule({
  imports: [CommonModule, NzButtonModule, SharedModule],
  declarations: [SharedExceptionComponent],
  exports: [SharedExceptionComponent]
})
export class SharedExceptionModule {}
