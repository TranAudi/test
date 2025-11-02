import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Subject } from 'rxjs';
import { getBaseClientUrl } from 'src/app/shared-ui/utils/shared-utils';

@Injectable({
  providedIn: 'root'
})
export class SharedAuthService {
  private _userManager: UserManager;
  private _user: User | undefined | null;
  private readonly _loginChangedSubject = new Subject<boolean>();

  public loginChanged = this._loginChangedSubject.asObservable();

  private clientUrl = '';

  private get idpSettings(): UserManagerSettings {
    const authType = environment['authType'];

    // Cấu hình cho KeyCloak
    if (authType === 'keycloak') {
      const keycloakConfig = environment['keycloakServer'];
      return {
        authority: `${keycloakConfig.baseUrl}/realms/${keycloakConfig.realm}`,
        client_id: keycloakConfig.clientId,
        redirect_uri: `${this.clientUrl}/oidc-callback`,
        scope: keycloakConfig.scopes || 'openid profile email',
        response_type: 'code',
        post_logout_redirect_uri: `${this.clientUrl}`,
        silentRequestTimeout: 10000,
        filterProtocolClaims: true,
        automaticSilentRenew: true
      };
    }

    // Cấu hình mặc định cho SSO (Identity Server)
    return {
      authority: environment['identiyServer'].baseUrl,
      client_id: environment['identiyServer'].clientId,
      redirect_uri: `${this.clientUrl}/oidc-callback`,
      scope: environment['identiyServer'].scopes,
      response_type: 'code',
      post_logout_redirect_uri: `${this.clientUrl}`,
      silentRequestTimeout: 10000,
      filterProtocolClaims: true,
      automaticSilentRenew: true
    };
  }

  constructor() {
    this.clientUrl = getBaseClientUrl();
    this._userManager = new UserManager(this.idpSettings);
    this._userManager.events.addAccessTokenExpired(_ => {
      this._loginChangedSubject.next(false);
    });

    this.startTokenRefresh();
  }

  public login = (): any => {
    const authType = environment['authType'];

    // Kiểm tra cấu hình dựa trên authType
    let hasValidConfig = false;
    if (authType === 'keycloak') {
      hasValidConfig = environment['keycloakServer']?.baseUrl;
    } else {
      hasValidConfig = environment['identiyServer']?.baseUrl;
    }

    if (hasValidConfig) {
      return this._userManager.signinRedirect();
    } else {
      setTimeout(() => {
        this._userManager = new UserManager(this.idpSettings);
        return this._userManager.signinRedirect();
      }, 500);
    }
  };

  async handleLoginCallback(): Promise<any | null> {
    try {
      const result = await this._userManager.signinRedirectCallback();
      return result;
    } catch (err) {
      console.error('Login Callback Error:', err);
      return null;
    }
  }

  async refreshToken(): Promise<User | null> {
    try {
      const user = await this._userManager.signinSilent();
      return user;
    } catch (error) {
      return null;
    }
  }

  startTokenRefresh() {
    this._userManager.events.addAccessTokenExpiring(() => {
      this.refreshToken();
    });
  }

  public isAuthenticated = (): Promise<boolean> => {
    return this._userManager.getUser().then(user => {
      if (this._user !== user) {
        this._loginChangedSubject.next(this.checkUser(user));
      }

      this._user = user;

      return this.checkUser(user);
    });
  };

  public finishLogin = (user: any) => {
    this._user = user;
    this._loginChangedSubject.next(user);
  };

  public logout = () => {
    // this._userManager.signinRedirect();
    // this._userManager.signoutCallback();
    this._userManager
      .signoutRedirect()
      .then(() => {
        console.log('Logout successful');
      })
      .catch(err => {
        console.error('Logout error', err);
      });
  };

  // public finishLogin = (user: any) => {
  // };

  public finishLogout = () => {
    this._user = null;
    this._loginChangedSubject.next(false);
    this._userManager.clearStaleState();
    return this._userManager.signoutRedirect();
  };

  public getAccessToken = (): Promise<string | null> => {
    return this._userManager.getUser().then(user => {
      return !!user && !user.expired ? user.access_token : null;
    });
  };

  async getUserInfo(): Promise<any | null> {
    let user = await this._userManager.getUser();

    if (user && user.profile) {
      const authType = environment['authType'];

      if (authType === 'keycloak') {
        // Với KeyCloak, trả về profile trực tiếp (đã có sub, email, name, etc.)
        return user.profile;
      } else {
        // Với SSO, giữ logic cũ (parse userInfo từ JSON)
        const userInfoJson = user.profile['userInfo'];
        if (userInfoJson) {
          const userInfo = JSON.parse(userInfoJson);
          return userInfo;
        }
      }
    }

    return null;
  }

  public checkIfUserIsAdmin = (): Promise<boolean> => {
    return this._userManager.getUser().then(user => {
      return !user?.expired && user?.profile['role'] === 'Admin';
    });
  };

  private checkUser = (user: User | null): boolean => {
    return !!user && !user.expired;
  };
}
