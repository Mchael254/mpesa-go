import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MessagesComponent } from './messages.component';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SystemsService } from '../../../../shared/services/setups/systems/systems.service';
import {
  SystemModule,
  SystemsDto,
} from '../../../../shared/data/common/systemsDto';
import { SharedModule } from '../../../../shared/shared.module';
import { MessagesService } from '../../services/messages.service';
import { EmailHistoryDto, SmsHistoryDto } from '../../data/messages';
import { Pagination } from 'src/app/shared/data/common/pagination';

const mockSmsHistoryData: SmsHistoryDto = {
  agentCode: 0,
  agentName: '',
  claimNo: '',
  clientCode: 0,
  clientName: '',
  code: 0,
  countryCode: 0,
  countryName: '',
  countryZipCode: '',
  divisionName: '',
  message: '',
  policyCode: '',
  policyNo: '',
  policyStatus: '',
  sendDate: '',
  sentResponse: '',
  smsAggregator: '',
  smsPreparedBy: '',
  status: '',
  systemCode: 0,
  systemModule: '',
  telephoneNumber: '',
};

const mockEmailHistoryData: EmailHistoryDto = {
  address: [],
  agentCode: 0,
  agentName: '',
  attachmentName: '',
  attachments: [
    {
      content: '',
      contentId: '',
      disposition: '',
      name: '',
      type: '',
    },
  ],
  claimCode: '',
  claimNo: '',
  clientCode: 0,
  clientName: '',
  code: '',
  emailAggregator: '',
  emailRecipient: '',
  from: '',
  fromName: '',
  message: '',
  policyCode: 0,
  policyNo: '',
  preparedBy: '',
  preparedDate: '',
  quotationCode: 0,
  quotationNo: '',
  response: '',
  sendOn: '',
  status: '',
  subject: '',
  systemCode: 0,
  systemModule: '',
};

const mockSystemsData: SystemsDto[] = [
  { id: 0, shortDesc: '', systemName: '' },
];
const mockSystemModulesData: SystemModule[] = [
  { description: '', id: 0, shortDescription: '', systemId: 0, systemName: '' },
];

export class MockMessageService {
  getSmsHistroy = jest.fn().mockReturnValue(of(mockSmsHistoryData));
  getEmailHistroy = jest.fn().mockReturnValue(of(mockEmailHistoryData));
}

export class MockSystemService {
  getSystems = jest.fn().mockReturnValue(of(mockSystemsData));
  getSystemModules = jest.fn().mockReturnValue(of(mockSystemModulesData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageServiceStub: MessagesService;
  let globalmessageServiceStub: GlobalMessagingService;
  let systemsServiceStub: SystemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
      ],
      providers: [
        { provide: MessagesService, useClass: MockMessageService },
        { provide: SystemsService, useClass: MockSystemService },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(MessagesService);
    systemsServiceStub = TestBed.inject(SystemsService);
    globalmessageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch system apps and handle success', () => {
    component.fetchSystemApps();
    expect(systemsServiceStub.getSystems).toHaveBeenCalled();
    expect(component.systems).toEqual(mockSystemsData);
    expect(globalmessageServiceStub.displayErrorMessage).not.toHaveBeenCalled();
  });

  test('should fetch system modules and handle success', () => {
    component.fetchSystemModules();
    expect(systemsServiceStub.getSystemModules).toHaveBeenCalled();
    expect(component.systemModules).toEqual(mockSystemModulesData);
  });

  test('should fetch SMS history', () => {
    component.fetchSmsHistory(1);
    expect(messageServiceStub.getSmsHistroy).toHaveBeenCalled();
    // expect(component.smsHistoryData).toEqual(mockSmsHistoryData);
  });

  test('should fetch Email history', () => {
    component.fetchEmailHistory(1);
    expect(messageServiceStub.getEmailHistroy).toHaveBeenCalled();
    // expect(component.emailHistoryData).toEqual(mockEmailHistoryData);
  });

  test('should call checkFiltersAndFetch on system change', () => {
    const spy = jest.spyOn(component, 'checkFiltersAndFetch');
    component.onSystemChange();
    expect(spy).toHaveBeenCalled();
  });

  test('should call checkFiltersAndFetch on date change', () => {
    const spy = jest.spyOn(component, 'checkFiltersAndFetch');
    component.onDateChange();
    expect(spy).toHaveBeenCalled();
  });

  test('should call fetchSmsHistory and fetchEmailHistory if filters are valid', () => {
    const spySms = jest.spyOn(component, 'fetchSmsHistory');
    const spyEmail = jest.spyOn(component, 'fetchEmailHistory');
    component.selectedSystem = 1;
    component.dateFrom = new Date();
    component.dateTo = new Date();
    component.checkFiltersAndFetch();
    expect(spySms).toHaveBeenCalled();
    expect(spyEmail).toHaveBeenCalled();
  });

  test('should filter SMS history table', () => {
    const event = { target: { value: 'test' } } as any;
    component.smsHistoryTable = { filterGlobal: jest.fn() } as any;
    component.filterSmsHistory(event);
    expect(component.smsHistoryTable.filterGlobal).toHaveBeenCalledWith(
      'test',
      'contains'
    );
  });

  test('should filter Email history table', () => {
    const event = { target: { value: 'test' } } as any;
    component.emailHistoryTable = { filterGlobal: jest.fn() } as any;
    component.filterEmailHistory(event);
    expect(component.emailHistoryTable.filterGlobal).toHaveBeenCalledWith(
      'test',
      'contains'
    );
  });
});
