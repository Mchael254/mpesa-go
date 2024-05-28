import { TestBed } from '@angular/core/testing';

import { GlobalMessagingService } from './global-messaging.service';
import {MessageService} from "primeng/api";

describe('GlobalMessagingService', () => {
  let service: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService
      ]
    });
    service = TestBed.inject(GlobalMessagingService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
