import { TestBed } from '@angular/core/testing';
import { AlainThemeModule } from '@delon/theme';
import { environment } from '@env/environment';
import { filter } from 'rxjs';

import { BrandService } from '../pro.service';

describe('pro: BrandService', () => {
  let injector: TestBed;
  let srv: BrandService;

  beforeEach(() => {
    injector = TestBed.configureTestingModule({
      imports: [AlainThemeModule.forRoot()],
      providers: [BrandService]
    });
  });

  afterEach(() => ((environment as any).pro = null));

  describe('should be initialized configuration', () => {
    it('with default', () => {
      (environment as any).pro = null;
      spyOn(localStorage, 'getItem').and.returnValue(`null`);
      srv = TestBed.inject(BrandService);
      expect(srv.theme).toBe('dark');
      expect(srv.menu).toBe('side');
      expect(srv.contentWidth).toBe('fluid');
    });
    it('with environment', () => {
      (environment as any).pro = { theme: 'light' };
      spyOn(localStorage, 'getItem').and.returnValue(`null`);
      srv = TestBed.inject(BrandService);
      expect(srv.theme).toBe('light');
    });
    it('with settings', () => {
      (environment as any).pro = null;
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ theme: 'light', menu: 'top' }));
      srv = TestBed.inject(BrandService);
      expect(srv.theme).toBe('light');
      expect(srv.menu).toBe('top');
    });
  });

  describe('should be trigger notify', () => {
    beforeEach(() => (srv = TestBed.inject(BrandService)));

    it('when mobile changed in constructor', done => {
      srv.notify.pipe(filter(v => v != null && v === 'mobile')).subscribe(type => {
        expect(true).toBe(true);
        done();
      });
    });
    it('when layout changed', done => {
      srv.notify.pipe(filter(v => v != null && v === 'layout')).subscribe(type => {
        expect(true).toBe(true);
        done();
      });
      srv.setLayout('a', 1);
    });
  });

  it('#setCollapsed', () => {
    srv = TestBed.inject(BrandService);
    srv.setCollapsed(false);
    expect(srv.collapsed).toBe(false);
    srv.setCollapsed();
    expect(srv.collapsed).toBe(true);
    srv.setCollapsed();
    expect(srv.collapsed).toBe(false);
  });

  it('should be onlyIcon always be false when menu is side', () => {
    srv = TestBed.inject(BrandService);
    srv.setLayout('menu', 'top');
    srv.setLayout('onlyIcon', true);
    expect(srv.onlyIcon).toBe(true);
    srv.setLayout('menu', 'side');
    expect(srv.onlyIcon).toBe(false);
  });
});
