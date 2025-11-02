import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { BaseCacheService } from '@shared-service';
import { Observable } from 'rxjs';

import { monHocRouter } from '../utils/shared-api-router';

@Injectable({
  providedIn: 'root'
})
export class MonHocApiService extends BaseCacheService {
  constructor(private http: _HttpClient) {
    super();
  }
  getMonHoc(): Observable<any> {
    return this.http.get(environment.api.baseUrl + monHocRouter.getCombobox);
  }

  getFilter(filter: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + monHocRouter.getFilter, filter);
  }
  create(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + monHocRouter.create, model);
  }
  update(id: any, model: any): Observable<any> {
    return this.http.put(environment.api.baseUrl + monHocRouter.update + id, model);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(environment.api.baseUrl + monHocRouter.delete + id);
  }
  getCombobox(): Observable<any> {
    return this.createCache('MonHocApiService', () => this.http.get(environment.api.baseUrl + monHocRouter.getCombobox));
  }
}
