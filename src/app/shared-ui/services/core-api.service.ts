import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreApiService {
  constructor(private readonly http: _HttpClient) {}
  getEnvironment(): Observable<any> {
    const url = `assets/env.json`;
    return this.http.get(url);
  }
}
