import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponseBase
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DA_SERVICE_TOKEN, ITokenModel, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, IGNORE_BASE_URL, _HttpClient, CUSTOM_ERROR, RAW_BODY } from '@delon/theme';
import { environment } from '@env/environment';
import { SharedAuthService } from '@shared-service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, of, throwError, catchError, filter, mergeMap, switchMap, take, from } from 'rxjs';

import { CorrelationIDService } from '../../services/correlation-id.service';
import { authenticationRouter } from '../../utils/shared-api-router';

const CODEMESSAGE: { [key: number]: string } = {
  200: '200 - Success',
  201: '201 - Success',
  202: '202 - Success',
  204: '204 - Success',
  400: '400 - Error',
  401: '401 - Unauthorized',
  403: '403 - Forbidden Error',
  404: '404 - Not Found',
  406: '406 - Not Acceptable',
  410: '410 - Gone',
  422: '422 - Unprocessable Entity',
  500: '500 - Internal Server Error',
  502: '502 - Bad Gateway',
  503: '503 - Service Unavailable',
  504: '504 - Gateway Timeout'
};

/**
 * The default HTTP interceptor, see the registration details `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  private refreshTokenEnabled = environment.api.refreshTokenEnabled;
  private refreshTokenType: 're-request' | 'auth-refresh' = environment.api.refreshTokenType;
  private refreshToking = false;
  private refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private injector: Injector, private correlationIDService: CorrelationIDService) {
    if (this.refreshTokenType === 'auth-refresh') {
      this.buildAuthRefresh();
    }
  }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private get authService(): SharedAuthService {
    return this.injector.get(SharedAuthService);
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  private get http(): _HttpClient {
    return this.injector.get(_HttpClient);
  }

  private goTo(url: string): void {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private checkStatus(ev: HttpResponseBase): void {
    if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
      return;
    }

    const errortext = CODEMESSAGE[ev.status] || ev.statusText;
    // this.notification.error(`wrong request ${ev.status}: ${ev.url}`, errortext);
  }

  /**
   * Refresh Token Request
   */
  private refreshTokenRequest(): Observable<any> {
    return from(this.authService.refreshToken());
    // const model = this.tokenSrv.get();
    // return this.http.post(
    //   `${environment.api.baseUrl}${authenticationRouter.refreshToken}?_allow_anonymous=true&refreshToken=${model?.['refreshToken']}`
    // );
  }

  // #region 刷新Token方式一：使用 401 重新刷新 Token

  private tryRefreshToken(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 1. If the request is a refresh token request, it means you can directly jump to the login page from the refresh token
    if ([authenticationRouter.refreshToken].some(url => req.url.includes(url))) {
      this.toLogin();
      return throwError(() => ev);
    }
    // 2. If `refreshToking` is `true`, it means that the refresh Token has been requested,
    //and all subsequent requests will be transferred to the waiting state until the result is returned before re-initiating the request
    if (this.refreshToking) {
      return this.refreshToken$.pipe(
        filter(v => !!v),
        take(1),
        switchMap(() => next.handle(this.reAttachToken(req)))
      );
    }
    // 3. Try to call Refresh Token
    this.refreshToking = true;
    this.refreshToken$.next(null);

    return this.refreshTokenRequest().pipe(
      switchMap(res => {
        // Notify subsequent requests to continue execution
        this.refreshToking = false;
        this.refreshToken$.next(res);
        let data = res.data;
        const helper = new JwtHelperService();
        var token: ITokenModel = data;
        token.token = data.access_token;
        const expirationDate = helper.getTokenExpirationDate(data.access_token);
        token.expired = expirationDate?.getTime();
        // token.expired = 3600;
        // Resave the new token
        this.tokenSrv.set(token);
        // Resend the request
        return next.handle(this.reAttachToken(req));
      }),
      catchError(err => {
        this.refreshToking = false;
        this.toLogin();
        return throwError(() => err);
      })
    );
  }

  /**
   * Re-attach the new Token information
   *
   * > Due to the request that has been initiated, `@delon/auth` will not go through again,
   * so it is necessary to re-attach a new Token based on the business situation
   */
  private reAttachToken(req: HttpRequest<any>): HttpRequest<any> {
    // The following example uses `SimpleInterceptor` by default with NG-ALAIN
    const token = this.tokenSrv.get()?.token;
    return req.clone({
      setHeaders: {
        token: `Bearer ${token}`
      }
    });
  }

  // #endregion

  // #region Refresh Token method 2: use the `refresh` interface of `@delon/auth`

  private buildAuthRefresh(): void {
    if (!this.refreshTokenEnabled) {
      return;
    }
    this.tokenSrv.refresh
      .pipe(
        filter(() => !this.refreshToking),
        switchMap(res => {
          this.refreshToking = true;
          return this.refreshTokenRequest();
        })
      )
      .subscribe({
        next: res => {
          // TODO: Mock expired value
          res.expired = +new Date() + 1000 * 60 * 5;
          this.refreshToking = false;

          let data = res.data;
          const helper = new JwtHelperService();
          var token: ITokenModel = data;
          token.token = data.accessToken;
          const expirationDate = helper.getTokenExpirationDate(res.data.accessToken);
          token.expired = expirationDate?.getTime();
          // Resave the new token
          this.tokenSrv.set(token);
        },
        error: () => this.toLogin()
      });
  }

  // #endregion

  private toLogin(): void {
    // this.notification.error(`Not logged in or login has expired, please log in again.`, ``);
    this.tokenSrv.clear();
    this.goTo(this.tokenSrv.login_url!);
  }

  private handleData(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.checkStatus(ev);
    // Business processing: some common operations
    switch (ev.status) {
      case 200:
        // Business-level error handling, the following is the assumption that restful has a unified output format (referring to the corresponding data format regardless of whether it is successful or not)
        break;
      case 401:
        if (!this.tokenSrv.get()?.token) {
          this.toLogin();
        } else {
          // TODO: Tạm comment vì luồng refresh token hiện tại đang bị lỗi
          // if (this.refreshTokenEnabled) {
          //   return this.tryRefreshToken(ev, req, next);
          // }
          this.toLogin();
        }

        break;
      case 403:
      case 404:
      case 500:
        // this.goTo(`/exception/${ev.status}?url=${req.urlWithParams}`);
        break;
      case 0:
        // this.toLogin();
        break;
      default:
        if (ev instanceof HttpErrorResponse) {
          console.warn(
            'Unknown errors, most of which are caused by the backend not supporting cross-domain CORS or invalid configuration, please refer to https://ng-alain.com/docs/server to solve cross-domain problems',
            ev
          );
        }
        break;
    }
    if (ev instanceof HttpErrorResponse) {
      return throwError(() => ev);
    } else {
      return of(ev);
    }
  }

  private getAdditionalHeaders(headers?: HttpHeaders): { [name: string]: string } {
    const res: { [name: string]: string } = {};
    const lang = this.injector.get(ALAIN_I18N_TOKEN).currentLang;
    if (!headers?.has('X-Language') && lang) {
      res['X-Language'] = lang;
    }

    const location = sessionStorage.getItem('location') ?? '';
    if (location) {
      res['location'] = location;
    }
    res['X-Correlation-Id'] = this.correlationIDService.getCorrelationId() ?? '';

    res['x-language'] = 'vi-VN';
    res['phanHe'] = environment['phanHe'];

    if (this.tokenSrv.get()?.token) {
      res['Authorization'] = `Bearer ${this.tokenSrv.get()?.token}`;
    }

    return res;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Uniformly add the server prefix
    let url = req.url;
    if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
      const baseUrl = environment['serverUrl'];
      url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
    }
    const newReq = req.clone({ url, setHeaders: this.getAdditionalHeaders(req.headers) });
    return next.handle(newReq).pipe(
      mergeMap(ev => {
        // Allow unified handling of request errors
        if (ev instanceof HttpResponseBase) {
          return this.handleData(ev, newReq, next);
        }
        // If everything is normal, follow up operations
        return of(ev);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err, newReq, next))
    );
  }
}
