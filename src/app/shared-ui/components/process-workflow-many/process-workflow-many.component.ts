import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { AuthJWTApiService } from '@shared-service';
import { SendCommentWorkflowModalComponent } from '../send-comment-workflow-modal/send-comment-workflow.component';
import { NzModalService } from 'ng-zorro-antd/modal';

interface ProcessWorkflowMany {
  commands: any[];
  listId: number[];
  listState: string[];
}

@Component({
  selector: 'process-workflow-many',
  templateUrl: 'process-workflow-many.component.html'
})
export class ProcessWorkflowManyComponent implements OnInit {
  @Output() readonly eventEmit = new EventEmitter<any>();

  @ViewChild(SendCommentWorkflowModalComponent, { static: false })
  sendCommentWorkflowModalComponent!: {
    initData: (data: any) => void;
    handleCancel: () => void;
  };

  data: ProcessWorkflowMany = {
    commands: [],
    listId: [],
    listState: []
  };
  lstCommand: any[] = [];

  constructor(
    public readonly authApiService: AuthJWTApiService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly modalService: NzModalService,
    @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService
  ) {}

  ngOnInit(): void {}

  public initData(data: ProcessWorkflowMany): void {
    this.data = data;
    this.updateCommandAvailability(data);
    this.cdRef.detectChanges();
  }

  public handleCancel(): void {
    this.lstCommand = [];
  }

  private updateCommandAvailability(data: ProcessWorkflowMany): void {
    const uniqueStates = new Set(data.listState);
    this.lstCommand = uniqueStates.size === 1 ? data.commands : [];
    this.cdRef.detectChanges();
  }

  private handleProcess(listId: number[], command: any, commentary: any): void {
    this.eventEmit.emit({ listId, command, commentary });
  }

  public onProccessWorkflowItem(command: any, params: any[] = []): void {
    if (params.includes('RequireComment')) {
      this.sendCommentWorkflowModalComponent.initData({
        id: this.data.listId,
        command
      });
    } else {
      const title = this.i18n.fanyi('bai-bao.confirm-process-workflow.title');
      const content = `${this.i18n.fanyi('bai-bao.confirm-process-workflow.content')} ${command}`;

      this.modalService.confirm({
        nzTitle: title,
        nzContent: content,
        nzOkText: command,
        nzOkType: 'primary',
        nzOnOk: () => this.handleProcess(this.data.listId, command, ''),
        nzCancelText: this.i18n.fanyi('layout.btn.cancel.label'),
        nzOnCancel: () => {}
      });
    }
  }

  public onModalSendCommentEventEmmit(event: { id: number[]; command: any; commentary: any }): void {
    this.handleProcess(event.id, event.command, event.commentary);
    this.sendCommentWorkflowModalComponent.handleCancel();
  }
}
