import { TestBed } from '@angular/core/testing';

import { RequiredDocumentService } from './required-document.service';

describe('RequiredDocumentService', () => {
  let service: RequiredDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequiredDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
