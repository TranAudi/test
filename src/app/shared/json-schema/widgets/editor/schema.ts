import type { SFUISchemaItem } from '@delon/form';

export interface EditorWidgetSchema extends SFUISchemaItem {
  contentChanged?: (value: string) => void;
}
