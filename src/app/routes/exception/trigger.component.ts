import { Component, Inject } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'exception-trigger',
  template: `
    <div class="pt-lg">
      <nz-card>
        <button *ngFor="let t of types" (click)="go(t)" nz-button nzDanger>trigger{{ t }}</button>
        <button nz-button nzType="link" (click)="refresh()">trigger refresh token</button>
      </nz-card>
    </div>
  `
})
export class ExceptionTriggerComponent {
  types = [401, 403, 404, 500];

  constructor(private http: _HttpClient, @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {}

  go(type: number): void {
    this.http.get(`/api/${type}`).subscribe();
  }

  refresh(): void {
    this.tokenService.set({ token: 'invalid-token' });
    // A backend address must be provided, which cannot be simulated by Mock
    this.http.post(`https://localhost:5001/auth`).subscribe({
      next: res => console.warn('success', res),
      error: err => {
        console.log('The final result failed', err);
      }
    });
  }
}
