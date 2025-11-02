import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN, SettingsService } from '@delon/theme';
import { QueryFilerModel } from '@model';
import { QUERY_FILTER_DEFAULT } from '@util';

@Component({
  selector: 'app-ag-grid-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnChanges {
  constructor(public settings: SettingsService, @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService, @Inject(DOCUMENT) private doc: any) {}
  paginationMessage = '';

  @Input() filter: QueryFilerModel = QUERY_FILTER_DEFAULT;
  @Input() pageSizeOptions: any[] = [];
  @Input() grid: any;

  @Output() readonly pageNumberChange = new EventEmitter<string>();
  @Output() readonly pageSizeChange = new EventEmitter<string>();

  showPagination: boolean = true;

  onPageNumberChange(): any {
    this.pageNumberChange.emit();
  }
  onPageSizeChange(): any {
    this.pageSizeChange.emit();
  }

  ngOnChanges(): void {
    this.showPagination = this.grid?.totalData > 0;
    const i =
      (this.filter.pageSize === undefined ? 0 : this.filter.pageSize) *
      ((this.filter.pageNumber === undefined ? 0 : this.filter.pageNumber) - 1);
    this.paginationMessage = `${this.i18n.fanyi('layout.grid.pagination.shows')} <b>${this.grid?.dataCount > 0 ? i + 1 : 0} - ${
      i + this.grid?.dataCount
    }</b> ${this.i18n.fanyi('layout.grid.pagination.total')} <b>${this.grid?.totalData}</b> ${this.i18n.fanyi(
      'layout.grid.pagination.result'
    )}`;
  }
}
