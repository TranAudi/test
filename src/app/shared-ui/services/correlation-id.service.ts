import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { generateCorrelationId } from '../utils/shared-utils';

@Injectable({
  providedIn: 'root'
})
export class CorrelationIDService {
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        sessionStorage.setItem('correlationId', generateCorrelationId());
      }
    });
  }

  getCorrelationId(): string | null {
    return sessionStorage.getItem('correlationId');
  }
}
