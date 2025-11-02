import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
// RxJS
import { Observable } from 'rxjs';

import { authenticationRouter } from '../utils/shared-api-router';
@Injectable({
  providedIn: 'root'
})
export class AuthJWTApiService {
  constructor(private http: _HttpClient) {}

  login(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + authenticationRouter.loginJWT, model);
  }

  updatePasswordForgotByUser(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + authenticationRouter.updatePasswordForgotByUser, model);
  }

  changePassword(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + authenticationRouter.changePassword, model);
  }
}
