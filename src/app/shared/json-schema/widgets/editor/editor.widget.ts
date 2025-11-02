import { Component } from '@angular/core';
import { ControlUIWidget } from '@delon/form';

import type { EditorWidgetSchema } from './schema';

@Component({
  selector: 'sf-editor',
  template: `
    <sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
      <editor [ngModel]="value" name="sf.editor" (ngModelChange)="_change($event)"></editor>
    </sf-item-wrap>
  `,
  preserveWhitespaces: false
})
export class EditorWidget extends ControlUIWidget<EditorWidgetSchema> {
  static readonly KEY = 'editor';

  _change(value: string): void {
    this.setValue(value);
    if (this.ui.contentChanged) {
      this.ui.contentChanged(value);
    }
  }
}
