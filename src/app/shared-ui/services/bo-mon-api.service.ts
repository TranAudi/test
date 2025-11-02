import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
// RxJS
import { Observable } from 'rxjs';

import { boMonRouter } from '../utils/shared-api-router';
import { BaseCacheService } from './base-cache.service';

@Injectable({
  providedIn: 'root'
})
export class BoMonApiService extends BaseCacheService {
  constructor(private http: _HttpClient) {
    super();
  }

  getCombobox(): Observable<any> {
    return this.createCache('BoMonApiService', () => this.http.get(environment.api.baseUrl + boMonRouter.getCombobox));
  }

  getListBoMon(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.getListBoMon, model);
  }
  getGvThuocBoMon(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.getGvThuocBoMon, model);
  }
  getGvChuaGanBoMon(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.getGvChuaGanBoMon, model);
  }
  getMonHocThuocBoMon(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.getMonHocThuocBoMon, model);
  }
  getMonHocChuaGanBoMon(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.getMonHocChuaGanBoMon, model);
  }
  createBoMon(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.createBoMon, model);
  }
  updateBoMon(id: any, model: any): Observable<any> {
    return this.http.put(environment.api.baseUrl + boMonRouter.updateBoMon + id, model);
  }
  getById(id: string): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.getById + id);
  }
  deleteListBoMon(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.deleteListBoMon, model);
  }
  createGiangVienBoMon(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.createGiangVienBoMon, model);
  }
  deleteGiangVienBoMon(model: any): Observable<any> {
    return this.http.post(environment.api.baseUrl + boMonRouter.deleteGiangVienBoMon, model);
  }
  updateMonHocBoMon(model: any): Observable<any> {
    return this.http.put(environment.api.baseUrl + boMonRouter.updateMonHocBoMon, model);
  }
}
