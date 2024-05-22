import { TestBed } from '@angular/core/testing';

import { ProductDocumentService } from './product-document.service';

describe('ProductDocumentService', () => {
  let service: ProductDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
