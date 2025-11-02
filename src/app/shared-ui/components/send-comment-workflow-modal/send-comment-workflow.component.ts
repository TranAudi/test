import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { ButtonModel } from '@model';
import { AuthJWTApiService } from '@shared-service';
import { EVENT_TYPE, cleanForm } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'shared-send-comment-workflow',
  templateUrl: 'send-comment-workflow.component.html'
})
export class SendCommentWorkflowModalComponent implements OnInit {
  @Input() item: any;
  @Input() isVisible = false;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  isLoading = false;
  data: any;
  commentary: string = '';
  actionDate: any;
  form: FormGroup;
  constructor(
    public readonly authApiService: AuthJWTApiService,
    private readonly cdRef: ChangeDetectorRef,
    private messageService: NzMessageService,
    private fb: FormBuilder,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService
  ) {
    this.form = this.fb.group({
      actionDate: [null],
      commentary: [null]
    });
  }

  public handleCancel(): void {
    this.isVisible = false;
  }

  ngOnInit(): void {
    this.initRightOfUser();
  }

  initRightOfUser(): void {}

  resetForm(): void {}

  //#endregion Update-form-type

  public initData(data: any): void {
    this.data = data;
    this.isVisible = true;
    this.commentary = '';
    this.cdRef.detectChanges();
    // Nếu command yêu cầu ngày
    if (this.data.commandObject?.params?.includes('RequireDate')) {
      this.form.get('actionDate')?.setValidators([Validators.required]);
    }
    // Nếu command yêu cầu lý do
    if (this.data.commandObject?.params?.includes('RequireComment')) {
      this.form.get('commentary')?.setValidators([Validators.required]);
    }
    // Cập nhật lại form
    this.form.updateValueAndValidity();
  }

  handleOk(): void {
    cleanForm(this.form);
    // tslint:disable-next-line:forin
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (!this.form.valid) {
      this.isLoading = false;
      this.messageService.error(this.i18n.fanyi('app.common.form.dirty'));
      return;
    }
    this.eventEmmit.emit({ ...this.data, commentary: this.form.get('commentary')?.value, actionDate: this.form.get('actionDate')?.value });
  }
}
