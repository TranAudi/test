import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'layout-pro-search',
  templateUrl: 'search.component.html',
  host: {
    '[class.alain-pro__header-item]': 'true',
    '[class.alain-pro__header-search]': 'true',
    '[class.alain-pro__header-search-show]': 'show'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProWidgetSearchComponent implements OnDestroy {
  @ViewChild('ipt', { static: true }) private ipt!: ElementRef<HTMLInputElement>;
  show = false;
  q = '';
  search$ = new Subject<string>();
  list: any[] = [];

  constructor(http: _HttpClient, cdr: ChangeDetectorRef) {
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q: string) => http.get('/user', { no: q, pi: 1, ps: 5 }))
      )
      .subscribe((res: any) => {
        this.list = res.list;
        cdr.detectChanges();
      });
  }

  onSearch(): void {
    this.search$.next(this.ipt.nativeElement.value);
  }

  @HostListener('click')
  _click(): void {
    this.ipt.nativeElement.focus();
    this.show = true;
  }

  ngOnDestroy(): void {
    this.search$.unsubscribe();
  }
}
