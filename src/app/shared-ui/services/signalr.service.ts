import { Injectable, Injector } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import * as signalR from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { Observable } from 'rxjs';

import { signalRRouter } from '../utils/shared-api-router';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private readonly hubConnection: signalR.HubConnection;

  constructor(private readonly injector: Injector) {
    let token: any = this.tokenSrv.get()?.token;
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return token;
      },
      withCredentials: true
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.api.baseUrl + signalRRouter.hubUrl}`, options) // SignalR hub URL
      .build();
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  startConnection(): Observable<void> {
    return new Observable<void>(observer => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Websocket connected');
          observer.next();
          observer.complete();
        })
        .catch(error => {
          console.log(`Error while starting connection: ${error}`);
          observer.error(error);
        });
    });
  }

  // Nhận thông báo từ server: có tin nhắn mới
  receiveMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.hubConnection.on('ReceiveMessage', (message: string) => {
        observer.next(message);
      });
    });
  }

  // Nhận thông báo từ server: có thông báo mới phân hệ system
  receiveNotify(): Observable<string> {
    return new Observable<string>(observer => {
      this.hubConnection.on('SystemReceiveNotify', (message: string) => {
        observer.next(message);
      });
    });
  }

  // Gửi thông báo đến server: gửi message
  sendMessage(message: string): void {
    this.hubConnection.invoke('SendMessage', message);
  }

  // Gửi thông báo đến
  sendNotifyToUser(user: string, message: string): void {
    this.hubConnection.invoke('SendNotifyToUser', user, message);
  }
}
