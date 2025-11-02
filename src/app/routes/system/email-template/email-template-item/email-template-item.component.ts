import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { I18NService } from '@core';
import { ACLService } from '@delon/acl';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { log } from '@delon/util';
import { ButtonModel } from '@model';
import { EmailTemplateApiService } from '@service';
import { cleanForm, EVENT_TYPE, FORM_TYPE } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email-template-item',
  templateUrl: './email-template-item.component.html',
  styleUrls: ['./email-template-item.component.less']
})
export class EmailTemplateItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() readonly eventEmmit = new EventEmitter<any>();

  form: FormGroup;

  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = '';

  isLoading = false;

  btnSave: ButtonModel;
  btnCancel: ButtonModel;
  btnEdit: ButtonModel;

  public Editor = ClassicEditor;

  config = {
    toolbar: {
      shouldNotGroupWhenFull: true
    }
  };

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private emailTemplateApiService: EmailTemplateApiService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private aclService: ACLService
  ) {
    this.btnSave = {
      title: this.i18n.fanyi('app.common.button.save'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.save();
      }
    };
    this.btnCancel = {
      title: this.i18n.fanyi('app.common.button.close'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.handleCancel();
      }
    };
    this.btnEdit = {
      title: this.i18n.fanyi('app.common.button.edit'),
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.updateFormToEdit();
      }
    };
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      isActive: true,
      order: 1,
      fromEmail: [null],
      fromUser: [null],
      isHighPriority: false,
      cc: [null],
      bcc: [null],
      subject: [null, [Validators.required]],
      template: [null, [Validators.required]]
    });
  }

  onEditorReady(editor: any): void {
    log('Editor is ready to use!', editor);
  }

  handleCancel(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.CLOSE });
  }

  ngOnInit(): void {
    this.initRightOfUser();
  }

  initRightOfUser(): void {
    // this.btnSave.grandAccess = this.aclService.canAbility('EMAIL_TEMPLATE_ADD') || this.aclService.canAbility('EMAIL_TEMPLATE_EDIT');
    // this.btnEdit.grandAccess = this.aclService.canAbility('EMAIL_TEMPLATE_EDIT');
  }

  //#region Update-form-type
  updateFormToAdd(): void {
    this.isInfo = false;
    this.isEdit = false;
    this.isAdd = true;
    this.tittle = this.i18n.fanyi('function.email-template.modal.title-add');
    this.item = {};
    this.form.get('code')?.enable();
    this.form.get('name')?.enable();
    this.form.get('description')?.enable();
    this.form.get('isActive')?.enable();
    this.form.get('order')?.enable();
    this.form.get('fromEmail')?.enable();
    this.form.get('fromUser')?.enable();
    this.form.get('isHighPriority')?.enable();
    this.form.get('cc')?.enable();
    this.form.get('bcc')?.enable();
    this.form.get('subject')?.enable();
    this.form.get('template')?.enable();
  }
  updateFormToEdit(): void {
    this.isInfo = false;
    this.isEdit = true;
    this.isAdd = false;
    this.tittle = this.i18n.fanyi('function.email-template.modal.title-edit');
    this.form.get('code')?.disable();
    this.form.get('name')?.enable();
    this.form.get('description')?.enable();
    this.form.get('isActive')?.enable();
    this.form.get('order')?.enable();
    this.form.get('fromEmail')?.enable();
    this.form.get('fromUser')?.enable();
    this.form.get('isHighPriority')?.enable();
    this.form.get('cc')?.enable();
    this.form.get('bcc')?.enable();
    this.form.get('subject')?.enable();
    this.form.get('template')?.enable();
  }
  updateFormToInfo(): void {
    this.isInfo = true;
    this.isEdit = false;
    this.isAdd = false;
    this.tittle = this.i18n.fanyi('function.email-template.modal.title-info');
    this.form.get('code')?.disable();
    this.form.get('name')?.disable();
    this.form.get('description')?.disable();
    this.form.get('isActive')?.disable();
    this.form.get('order')?.disable();
    this.form.get('fromEmail')?.disable();
    this.form.get('fromUser')?.disable();
    this.form.get('isHighPriority')?.disable();
    this.form.get('cc')?.disable();
    this.form.get('bcc')?.disable();
    this.form.get('subject')?.disable();
    this.form.get('template')?.disable();
  }

  resetForm(): void {
    this.form.reset();
    this.form.get('isActive')?.setValue(true);
    this.form.get('order')?.setValue(1);
    this.form.get('isHighPriority')?.setValue(false);
  }

  updateDataToForm(data: any): void {
    this.form.get('code')?.setValue(data.code);
    this.form.get('name')?.setValue(data.name);
    this.form.get('description')?.setValue(data.description);
    this.form.get('isActive')?.setValue(data.isActive);
    this.form.get('order')?.setValue(data.order);
    this.form.get('fromEmail')?.setValue(data.fromEmail);
    this.form.get('fromUser')?.setValue(data.fromUser);
    this.form.get('isHighPriority')?.setValue(data.isHighPriority);
    this.form.get('cc')?.setValue(data.cc);
    this.form.get('bcc')?.setValue(data.bcc);
    this.form.get('subject')?.setValue(data.subject);
    this.form.get('template')?.setValue(data.template);
  }

  //#endregion Update-form-type

  public initData(data: any, type: any = null, option: any = {}): void {
    this.resetForm();
    this.isLoading = false;
    this.item = data;
    this.type = type;
    this.option = option;
    if (this.item?.id) {
      this.getDataInfo(this.item.id);
    }
    switch (type) {
      case FORM_TYPE.ADD:
        this.updateFormToAdd();
        break;
      case FORM_TYPE.INFO:
        this.updateFormToInfo();
        break;
      case FORM_TYPE.EDIT:
        this.updateFormToEdit();
        break;
      default:
        this.updateFormToAdd();
        break;
    }
  }

  closeModalReloadData(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: EVENT_TYPE.SUCCESS });
  }

  getDataInfo(id: any): Subscription | undefined {
    this.isLoading = true;
    const rs = this.emailTemplateApiService.getById(id).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.data === null || res.data === undefined) {
          this.messageService.error(`${res.message}`);
          return;
        }
        this.item = res.data;
        this.updateDataToForm(res.data);
      },
      error: (err: any) => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
    return rs;
  }

  save(): Subscription | undefined {
    this.isLoading = true;

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

    const data = {
      id: this.item.id,
      code: this.form.get('code')?.value,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      isActive: this.form.get('isActive')?.value,
      order: this.form.get('order')?.value,
      fromEmail: this.form.get('fromEmail')?.value,
      fromUser: this.form.get('fromUser')?.value,
      isHighPriority: this.form.get('isHighPriority')?.value,
      cc: this.form.get('cc')?.value,
      bcc: this.form.get('bcc')?.value,
      subject: this.form.get('subject')?.value,
      template: this.form.get('template')?.value
    };

    if (this.isAdd) {
      const promise = this.emailTemplateApiService.create(data).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.data === null || res.data === undefined) {
            this.messageService.error(`${res.message}`);
            return;
          }
          this.messageService.success(`${res.message}`);
          this.closeModalReloadData();
        },
        error: (err: any) => {
          this.isLoading = false;
          if (err.error) {
            this.messageService.error(`${err.error.message}`);
          } else {
            this.messageService.error(`${err.status}`);
          }
        },
        complete: () => (this.isLoading = false)
      });
      return promise;
    } else if (this.isEdit) {
      const promise = this.emailTemplateApiService.update(this.item.id, data).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.data === null || res.data === undefined) {
            this.messageService.error(`${res.message}`);
            return;
          }
          this.messageService.success(`${res.message}`);
          this.closeModalReloadData();
        },
        error: (err: any) => {
          this.isLoading = false;
          if (err.error) {
            this.messageService.error(`${err.error.message}`);
          } else {
            this.messageService.error(`${err.status}`);
          }
        },
        complete: () => (this.isLoading = false)
      });
      return promise;
    } else {
      return;
    }
  }
}
