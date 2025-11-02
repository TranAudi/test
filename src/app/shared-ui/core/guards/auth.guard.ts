import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Observable } from 'rxjs';

import { isNullOrEmpty, TOKEN_KEY } from '../../utils/shared-utils';

/**
 * Dynamically load the start page
 *
 * 动态加载启动页
 */
export const AuthGuard: CanActivateFn = (_, state): boolean | Observable<boolean> => {
  const tokenService = inject<ITokenService>(DA_SERVICE_TOKEN);
  const jwtHelperService = new JwtHelperService();

  var token = tokenService.get();
  var isLoggedIn = true;
  if (token === null || isNullOrEmpty(token.token)) {
    isLoggedIn = false;
  } else {
    if (jwtHelperService.isTokenExpired(token.token || '', 0)) {
      isLoggedIn = false;
    }
  }

  if (!isLoggedIn) {
    localStorage.setItem(TOKEN_KEY.REDIRECT_AFTER_LOGIN_URL, state.url);
  }

  return true;
};
