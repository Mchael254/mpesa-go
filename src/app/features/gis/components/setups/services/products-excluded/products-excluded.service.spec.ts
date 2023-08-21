import { TestBed } from '@angular/core/testing';

import { ProductsExcludedService } from './products-excluded.service';

describe('ProductsExcludedService', () => {
  let service: ProductsExcludedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsExcludedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
