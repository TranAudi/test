import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { cacheRouter } from '../utils/shared-api-router';

@Injectable({
  providedIn: 'root'
})
export class CacheApiService {
  constructor(private readonly http: _HttpClient) {}

  removeAllCache(): Observable<any> {
    return this.http.post(environment.api.baseUrl + cacheRouter.removeAllCache);
  }
}
