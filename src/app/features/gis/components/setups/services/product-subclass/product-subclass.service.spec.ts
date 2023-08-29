import { TestBed } from '@angular/core/testing';

import { ProductSubclassService } from './product-subclass.service';

describe('ProductSubclassService', () => {
  let service: ProductSubclassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSubclassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
