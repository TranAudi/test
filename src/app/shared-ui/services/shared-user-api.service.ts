import { Inject, Injectable } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
// RxJS
import { BehaviorSubject, Observable } from 'rxjs';

import { sharedUserRouter } from '../utils/shared-api-router';
@Injectable({
  providedIn: 'root'
})
export class SharedUserApiService {
  //Khởi tạo biến check đã đăng nhập hay chưa
  private isLoadUserPermission = false;
  constructor(private http: _HttpClient, @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService) {}

  getUserPermission(): Observable<any> {
    return this.http.get(`${environment.api.baseUrl + sharedUserRouter.getUserPermission}?phanHe=${environment['phanHe']}`);
  }

  updateUserInfo(model: any): Observable<any> {
    return this.http.put(environment.api.baseUrl + sharedUserRouter.updateUserInfo, model);
  }

  getUserAccessLop(): Observable<any> {
    return this.http.get(`${environment.api.baseUrl + sharedUserRouter.getUserAccessLop}`);
  }
  getCurrentUser(): Observable<any> {
    return this.http.get(environment.api.baseUrl + sharedUserRouter.getCurrentUser);
  }

  changeLoadUserPermissionState(state: any) {
    this.isLoadUserPermission = state;
  }

  getLoadUserPermissionState() {
    return this.isLoadUserPermission;
  }

  getUserAccessLopMockData(): Observable<any> {
    return this.http.get(`assets/tmp/mock-data/mock-data-he-khoa-lop.json`);
  }
}
