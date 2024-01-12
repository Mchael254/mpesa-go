import { TestBed } from '@angular/core/testing';

import { TenantIdInterceptor } from './tenant-id.interceptor';

describe('TenantIdInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TenantIdInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TenantIdInterceptor = TestBed.inject(TenantIdInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
