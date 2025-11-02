import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ACLService } from '@delon/acl';
import { MenuService } from '@delon/theme';
import { log } from '@delon/util';
import { Observable } from 'rxjs';

/**
 * Dynamically load the start page
 *
 * 动态加载启动页
 */
export const startPageGuard: CanActivateFn = (_, state): boolean | Observable<boolean> => {
  // Re-jump according to the first item of the menu, you can re-customize the logic
  const menuSrv = inject(MenuService);
  const aclSrv = inject(ACLService);
  let menu = menuSrv.find({ url: state.url });
  if (menu == null) {
    inject(Router).navigateByUrl('/');
    return false;
  }
  if (menu.acl && !aclSrv.can(menu.acl)) {
    inject(Router).navigateByUrl('/');
    return false;
  }
  return true;
};
