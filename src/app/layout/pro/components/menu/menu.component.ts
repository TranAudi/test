import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuService } from '@delon/theme';
import { InputBoolean } from '@delon/util';
import { NzMenuModeType } from 'ng-zorro-antd/menu';
import { Subject, filter, takeUntil } from 'rxjs';

import { BrandService } from '../../pro.service';
import { ProMenu } from '../../pro.types';

@Component({
  selector: '[layout-pro-menu]',
  templateUrl: './menu.component.html',
  host: {
    '[class.alain-pro__menu]': 'true',
    '[class.alain-pro__menu-only-icon]': 'pro.onlyIcon'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutProMenuComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  menus?: ProMenu[];

  @Input() @InputBoolean() disabledAcl = false;
  @Input() mode: NzMenuModeType = 'inline';

  constructor(private menuSrv: MenuService, private router: Router, public pro: BrandService, private cdr: ChangeDetectorRef) {}

  private cd(): void {
    this.cdr.markForCheck();
  }

  private genMenus(data: ProMenu[]): void {
    const res: ProMenu[] = [];
    // ingores category menus
    const ingoreCategores = data.reduce((prev, cur) => prev.concat(cur.children as ProMenu[]), [] as ProMenu[]);
    this.menuSrv.visit(ingoreCategores, (item, parent, _) => {
      const proItem = item as ProMenu;
      if (!proItem._aclResult) {
        if (this.disabledAcl) {
          proItem.disabled = true;
        } else {
          proItem._hidden = true;
        }
      }
      if (proItem._hidden === true) {
        return;
      }
      if (parent === null) {
        res.push(proItem);
      }
    });
    this.menus = res;

    this.openStatus();
  }

  private openStatus(): void {
    const inFn = (list: ProMenu[]) => {
      for (const i of list) {
        i.open = false;
        i._selected = false;
        if (i.children!.length > 0) {
          inFn(i.children!);
        }
      }
    };
    inFn(this.menus!);

    let item = this.menuSrv.find({
      url: this.router.url,
      recursive: true,
      data: this.menus!
    }) as ProMenu | null;
    if (!item) {
      this.cd();
      return;
    }
    do {
      item._selected = true;
      if (!this.pro.isTopMenu && !this.pro.collapsed) {
        item.open = true;
      }
      item = item._parent!;
    } while (item);
    this.cd();
  }

  openChange(item: ProMenu, statue: boolean): void {
    const data = item._parent ? item._parent.children : this.menus;
    if (data && data.length <= 1) {
      return;
    }
    data!.forEach(i => (i.open = false));
    item.open = statue;
  }

  closeCollapsed(): void {
    const { pro } = this;
    if (pro.isMobile) {
      setTimeout(() => pro.setCollapsed(true), 25);
    }
  }

  ngOnInit(): void {
    const { unsubscribe$, router, pro } = this;
    this.menuSrv.change.pipe(takeUntil(unsubscribe$)).subscribe(res => this.genMenus(res as ProMenu[]));

    router.events
      .pipe(
        takeUntil(unsubscribe$),
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(() => this.openStatus());

    pro.notify
      .pipe(
        takeUntil(unsubscribe$),
        filter(() => !!this.menus)
      )
      .subscribe(() => this.cd());
  }

  ngOnDestroy(): void {
    const { unsubscribe$ } = this;
    unsubscribe$.next();
    unsubscribe$.complete();
  }
}
