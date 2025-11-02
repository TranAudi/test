import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { getBaseClientUrl } from 'src/app/shared-ui/utils/shared-utils';

@Injectable({
  providedIn: 'root'
})
export class HouCasService {
  private clientUrl = '';

  constructor() {
    this.clientUrl = getBaseClientUrl();
  }

  public login() {
    const loginUrl = `${environment['houCasServer'].serverUrl}/cas/login` + `?service=${this.clientUrl}/oidc-callback`;
    window.location.href = loginUrl;
  }

  public logout = () => {
    const logoutUrl = `${environment['houCasServer'].logoutUrl}`;
    window.location.href = logoutUrl;
  };
}
