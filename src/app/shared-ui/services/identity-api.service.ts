import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
// RxJS
import { Observable } from 'rxjs';

import { authenticationRouter } from '../utils/shared-api-router';

@Injectable({
  providedIn: 'root'
})
export class IdentityApiService {
  constructor(private readonly http: _HttpClient) {}

  getTokenInfo(model: any): Observable<any> {
    return this.http.post(`${environment.api.baseUrl}${authenticationRouter.getAccessToken}`, model);
  }

  validateHouTicket(model: any): Observable<any> {
    return this.http.post(`${environment.api.baseUrl}${authenticationRouter.validateHouTicket}`, model);
  }
}
