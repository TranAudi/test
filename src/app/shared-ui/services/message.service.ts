import { Inject, Injectable, Injector } from '@angular/core';
import { I18NService } from '@core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private readonly injector: Injector, @Inject(ALAIN_I18N_TOKEN) private readonly i18n: I18NService) {}

  messages: string[] = [];

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  add(content: string, title: string = 'http.request.error'): void {
    if (this.messages.length === 0) {
      this.showMessage(content, title);
    }
    this.messages.push(content);
    setTimeout(() => {
      this.clear();
    }, 10100);
  }

  clear(): void {
    this.messages = [];
  }

  showMessage(content: string, title: string = 'http.request.error'): void {
    // const mess = 'Chưa đăng nhập hoặc phiên đăng nhập hết hạn';
    // const context = 'Vui lòng đăng nhập để sử dụng dịch vụ.';
    // this.notification.error(`${this.i18n.fanyi('http.request.error')} Lỗi 123`, 'errortext', {
    //   nzPauseOnHover: true,
    // });
    this.notification.error(`${this.i18n.fanyi(title)}`, `${this.i18n.fanyi(content)}`, {
      nzPauseOnHover: true,
      nzDuration: 10000
    });
  }
}
