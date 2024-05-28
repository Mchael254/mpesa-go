import { TestBed } from '@angular/core/testing';

import { MessagingService } from './messaging.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ApiService} from "../../../shared/services/api/api.service";
import {MessageTemplate} from "../data/messaging-template";
import {Pagination} from "../../../shared/data/common/pagination";

const messageTemplates: MessageTemplate = {
  content: "",
  id: 0,
  imageAttachment: "",
  imageUrl: "",
  name: "",
  productCode: 0,
  productName: "",
  status: "",
  subject: "",
  systemCode: 0,
  systemModule: "",
  templateType: ""
};

const messageTemplateResponse: Pagination<MessageTemplate> = {
  content: [messageTemplates],
  first: true,
  last: false,
  number: 0,
  numberOfElements: 1,
  size: 1,
  sort: undefined,
  totalElements: 1,
  totalPages: 1
}

export class MockApiService{
  /*api: {
    GET: () => {}
  }*/
}

describe('MessagingService', () => {
  let service: MessagingService;
  let httpTestingController: HttpTestingController;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ApiService, useClass: MockApiService }
      ]
    });
    service = TestBed.inject(MessagingService);
    httpTestingController = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*test('should get message templates', () => {

    service.getMessageTemplates(0).subscribe(res => {
      expect(res).toBeTruthy();
      expect(res).toBe(messageTemplateResponse);
    })
  })*/


});
