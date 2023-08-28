import { TestBed } from '@angular/core/testing';

import { ClientRemarksService } from './client-remarks.service';

describe('ClientRemarksService', () => {
  let service: ClientRemarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRemarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
