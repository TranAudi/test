import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-login3',
  templateUrl: './login3.component.html',
  styleUrls: ['./login3.component.less'],
  host: {
    '[class.ant-row]': 'true',
    '[class.pro-passport]': 'true'
  }
})
export class UserLogin3Component implements OnDestroy {
  form = this.fb.nonNullable.group({
    mobilePrefix: ['+86'],
    mobile: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
    captcha: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  error = '';

  constructor(private fb: FormBuilder, private router: Router, private msg: NzMessageService, public http: _HttpClient) {}

  count = 0;
  interval$: any;

  getCaptcha(): void {
    const { mobile } = this.form.controls;
    if (mobile.invalid) {
      mobile.markAsDirty({ onlySelf: true });
      mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  // #endregion

  submit(): void {
    this.error = '';
    const data = this.form.value;
    this.http.post('/register', data).subscribe(() => {
      this.router.navigate(['passport', 'register-result'], { queryParams: { email: data.mobile } });
    });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
