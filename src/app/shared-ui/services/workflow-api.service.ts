import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
// RxJS
import { Observable } from 'rxjs';

import { workflowRouter } from '../utils/shared-api-router';
import { BaseCacheService } from './base-cache.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowApiService extends BaseCacheService {
  constructor(private http: _HttpClient) {
    super();
  }

  getHistoryWorkflow(processId: string): Observable<any> {
    return this.http.get(environment.api.baseUrl + workflowRouter.getHistoryWorkflow + processId);
  }

  getCombobox(): Observable<any> {
    return this.createCache('WorkflowApiService', () => this.http.get(environment.api.baseUrl + workflowRouter.getComboboxWorkflow));
  }
}
