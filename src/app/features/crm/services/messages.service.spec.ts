import { TestBed } from '@angular/core/testing';

import { MessagesService } from './messages.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { UtilService } from '../../../shared/services/util/util.service';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagesService, ApiService, UtilService],
    });
    service = TestBed.inject(MessagesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
