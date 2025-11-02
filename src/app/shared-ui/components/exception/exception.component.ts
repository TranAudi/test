import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { SharedAuthService, HouCasService } from '@shared-service';

interface ExceptionConfig {
  type: number;
  description: string;
  showLogout: boolean;
  showGoBack: boolean;
}

@Component({
  selector: 'shared-exception',
  template: `
    <div class="exception-page">
      <div class="exception-container">
        <!-- Error Icons -->
        <div class="icon-container">
          <!-- 404 Icon -->
          <div *ngIf="config.type === 404" class="error-icon">
            <i nz-icon nzType="exclamation-circle" nzTheme="fill"></i>
          </div>

          <!-- 403 Icon -->
          <div *ngIf="config.type === 403" class="error-icon">
            <i nz-icon nzType="lock" nzTheme="fill"></i>
          </div>

          <!-- 500 Icon -->
          <div *ngIf="config.type === 500" class="error-icon">
            <i nz-icon nzType="warning" nzTheme="fill"></i>
          </div>
        </div>

        <!-- Content -->
        <div class="content">
          <h1>{{ config.type }}</h1>
          <p>{{ config.description | i18n }}</p>

          <div class="actions">
            <button *ngIf="config.showGoBack" nz-button nzType="primary" (click)="goBack()">
              {{ 'exception.go-back' | i18n }}
            </button>
            <button *ngIf="config.showLogout" nz-button nzType="default" (click)="logout()">
              {{ 'exception.logout' | i18n }}
            </button>
            <button *ngIf="!config.showLogout && !config.showGoBack" nz-button nzType="primary" (click)="goHome()">
              {{ 'exception.back-home' | i18n }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Main Layout - Login Style */
      .exception-page {
        height: 100vh;
        background: linear-gradient(180deg, #eff3f8 10%, #eff3f8 55%, #eff3f8 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .exception-container {
        width: 600px;
        border-radius: 25px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(10px);
        padding: 60px 50px;
        text-align: center;
      }

      /* Icons */
      .icon-container {
        margin-bottom: 50px;
      }

      .error-icon {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        border-radius: 50%;
        display: inline-block;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }

      .error-icon i {
        font-size: 64px;
        display: block;
      }

      /* Icon Colors - Custom Theme */
      .error-icon i[nzType='exclamation-circle'] {
        color: #f59e0b;
      }

      .error-icon i[nzType='lock'] {
        color: #ef4444;
      }

      .error-icon i[nzType='warning'] {
        color: #ef4444;
      }

      /* Content - Login Style */
      .content {
        text-align: center;
        max-width: 500px;
        margin: 0 auto;
      }

      .content h1 {
        font-size: 72px;
        font-weight: 700;
        margin: 0 0 20px 0;
        line-height: 1;
        background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .content p {
        font-size: 16px;
        color: #6b7280;
        margin: 0 0 40px 0;
        line-height: 1.6;
        letter-spacing: 0.02em;
      }

      .actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      /* Buttons - Login Style */
      .actions .ant-btn {
        height: 48px;
        padding: 0 32px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .actions .ant-btn-primary {
        background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
        border: none;
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
      }

      .actions .ant-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(24, 144, 255, 0.4);
      }

      .actions .ant-btn-default {
        background: rgba(255, 255, 255, 0.8);
        border: 1px solid #d9d9d9;
        color: #595959;
      }

      .actions .ant-btn-default:hover {
        background: #f5f5f5;
        border-color: #40a9ff;
        color: #40a9ff;
      }

      /* Responsive - Login Style */
      @media (max-width: 768px) {
        .exception-container {
          width: 90%;
          padding: 40px 30px;
        }

        .content h1 {
          font-size: 56px;
        }

        .content p {
          font-size: 14px;
        }

        .error-icon i {
          font-size: 48px;
        }

        .error-icon {
          padding: 20px;
        }

        .actions {
          flex-direction: column;
          align-items: center;
        }

        .actions .ant-btn {
          width: 200px;
        }
      }

      @media (max-width: 480px) {
        .exception-container {
          padding: 30px 20px;
        }

        .content h1 {
          font-size: 48px;
        }

        .error-icon i {
          font-size: 40px;
        }

        .error-icon {
          padding: 15px;
        }
      }
    `
  ]
})
export class SharedExceptionComponent implements OnInit {
  config: ExceptionConfig = {
    type: 404,
    description: 'exception.404.description',
    showLogout: false,
    showGoBack: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private authService: SharedAuthService,
    private houCasService: HouCasService
  ) {}

  ngOnInit(): void {
    // Get exception type from route data
    const type = this.route.snapshot.data['type'] || 404;
    this.config = this.getExceptionConfig(type);
  }

  private getExceptionConfig(type: number): ExceptionConfig {
    switch (type) {
      case 403:
        return {
          type: 403,
          description: 'exception.403.description',
          showLogout: true,
          showGoBack: true
        };
      case 404:
        return {
          type: 404,
          description: 'exception.404.description',
          showLogout: false,
          showGoBack: true
        };
      case 500:
        return {
          type: 500,
          description: 'exception.500.description',
          showLogout: false,
          showGoBack: true
        };
      default:
        return {
          type: 404,
          description: 'exception.404.description',
          showLogout: false,
          showGoBack: true
        };
    }
  }

  goHome(): void {
    this.router.navigateByUrl('/');
  }

  goBack(): void {
    window.history.back();
  }

  logout(): void {
    this.tokenService.clear();
    const authType = environment['authType'];

    if (authType == 'sso' || authType == 'keycloak' || authType == null || authType == undefined || authType == '') {
      for (var key in localStorage) {
        if (key.startsWith('oidc.')) {
          localStorage.removeItem(key);
        }
      }
      this.authService.logout();
    } else if (authType == 'hou') {
      localStorage.clear();
      this.houCasService.logout();
    } else if (authType == 'jwt') {
      this.tokenService.clear();
      this.router.navigateByUrl('/passport/login');
    } else {
      this.router.navigateByUrl('/logout');
    }
  }
}
