import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { emailTemplateRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';
import { BaseCacheService } from 'src/app/shared-ui/services/base-cache.service';

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateApiService extends BaseCacheService {
  constructor(private http: _HttpClient) {
    super();
  }

  create(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + emailTemplateRouter.create, model);
  }

  update(id: any, model: any): Observable<any> {
    return this.http.put(environment.api.baseUrl + emailTemplateRouter.update + id, model);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.api.baseUrl + emailTemplateRouter.getById + id);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(environment.api.baseUrl + emailTemplateRouter.delete + id);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.api.baseUrl + emailTemplateRouter.getFilter, model);
  }

  getCombobox(): Observable<any> {
    return this.createCache('EmailTemplateApiService', () => this.http.get(environment.api.baseUrl + emailTemplateRouter.getCombobox));
  }
}
