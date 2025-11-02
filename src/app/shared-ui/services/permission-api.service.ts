import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
// RxJS
import { BehaviorSubject, Observable } from 'rxjs';

import { permissionRouter } from '../utils/shared-api-router';
import { BaseCacheService } from './base-cache.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionApiService extends BaseCacheService {
  constructor(private readonly http: _HttpClient) {
    super();
  }

  getListCombobox(): Observable<any> {
    return this.createCache('PermissionApiService', () => this.http.get(environment.api.baseUrl + permissionRouter.getListCombobox));
  }

  private currentPermission = new BehaviorSubject<any>({});
  userPermission = this.currentPermission.asObservable();

  updatePermission(permission: any) {
    this.currentPermission.next(permission);
  }
}
