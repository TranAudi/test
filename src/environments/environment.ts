// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '@delon/theme';

export const environment = {
  serverUrl: `./`,
  build: '000001',
  version: 'dev-1.0.0',
  production: false,
  useHash: false,
  phanHe: 'UniSystem',
  authType: 'jwt', // authorizeType support list: sso, hou, jwt, keycloak
  externalAuthenticator: {
    isEnabled: false
  },
  vaultToken: '',
  api: {
    baseUrl: 'http://localhost:8002',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  pro: {
    theme: 'light',
    menu: 'side',
    contentWidth: 'fluid',
    fixedHeader: false,
    autoHideHeader: false,
    fixSiderbar: true,
    onlyIcon: false
  }
} as Environment;

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 *
 *
 * Configure in [src/styles/theme.less]:
@primary-color: #2F54EB;

Configure in [src/environments/*]:
export const environment = {
  ...
  pro: {
    theme: 'dark',
    menu: 'side',
    contentWidth: 'fluid',
    fixedHeader: true,
    autoHideHeader: true,
    fixSiderbar: true,
    onlyIcon: false,
  }
}
 *
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
