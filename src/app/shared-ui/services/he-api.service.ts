import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
// RxJS
import { Observable } from 'rxjs';

import { heRouter } from '../utils/shared-api-router';
import { BaseCacheService } from './base-cache.service';

@Injectable({
  providedIn: 'root'
})
export class HeApiService extends BaseCacheService {
  constructor(private http: _HttpClient) {
    super();
  }

  getCombobox(): Observable<any> {
    return this.createCache('HeApiService', () => this.http.get(environment.api.baseUrl + heRouter.getCombobox));
  }
}
