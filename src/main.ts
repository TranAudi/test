import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { preloaderFinished } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

preloaderFinished();

if (environment.production) {
  enableProdMode();
  if (window) {
    // window.console.log = () => {};
    // Nếu là môi trường prod thì ẩn log error đi
    window.console.error = () => {};
    // window.console.warn = () => {};
    // window.console.debug = () => {};
    // window.console.info = () => {};
    // window.console.assert = () => {};
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    defaultEncapsulation: ViewEncapsulation.Emulated,
    preserveWhitespaces: false
  })
  .then(res => {
    const win = window as NzSafeAny;
    if (win && win.appBootstrap) {
      win.appBootstrap();
    }
    return res;
  })
  .catch(err => console.error(err));
