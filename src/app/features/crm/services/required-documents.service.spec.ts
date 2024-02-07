import { TestBed } from '@angular/core/testing';

import { RequiredDocumentsService } from './required-documents.service';

describe('RequiredDocumentsService', () => {
  let service: RequiredDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequiredDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
