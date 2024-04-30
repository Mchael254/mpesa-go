import { TestBed } from '@angular/core/testing';

import { AccountStatusService } from './account-status.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AccountStatus} from "../../data/AccountStatus";
import {AppConfigService} from "../../../../core/config/app-config-service";
import {UpdateAccountStatusDto} from "../../data/UpdateAccountStatusDto";
import {Status} from "../../data/enums/Status";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
      },
    };
  }
}

const mockAllStatusList: AccountStatus[] = [
  {
    name: "ACTIVE",
    value: "A"
  },
  {
    name: "INACTIVE",
    value: "I"
  },
  {
    name: "SUSPENDED",
    value: "S"
  },
  {
    name: "DRAFT",
    value: "D"
  },
  {
    name: "PENDING",
    value: "P"
  },
  {
    name: "BLACKLISTED",
    value: "B"
  },
  {
    name: "READY",
    value: "R"
  },
  {
    name: "UNKNOWN",
    value: "U"
  }

]

describe('AccountStatusService', () => {
  let service: AccountStatusService;
  let appConfigService: AppConfigService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AccountStatusService,
        { provide: AppConfigService, useClass: MockAppConfigService }
      ]
    });
    service = TestBed.inject(AccountStatusService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a list of all statuses', () => {
    let expectedList = service.fetchAllStatuses();
    expect(expectedList).toBeTruthy();
    expect(expectedList).toEqual(mockAllStatusList);
  });

  it('should filter the correct statuses based on the account type', () => {
    let fetchedStatuses: AccountStatus[] = [];
    const fetchClientStatusSpy = jest.spyOn(AccountStatusService.prototype as any, 'fetchClientStatuses');
    const fetchStaffStatusSpy = jest.spyOn(AccountStatusService.prototype as any, 'fetchStaffStatuses');
    const fetchIntermediariesStatusSpy = jest.spyOn(AccountStatusService.prototype as any, 'fetchIntermediariesStatuses');
    const fetchServiceProviderStatusSpy = jest.spyOn(AccountStatusService.prototype as any, 'fetchServiceProviderStatuses');
    const fetchByStatusNameSpy = jest.spyOn(AccountStatusService.prototype as any, 'fetchByStatusName');
     jest.spyOn(service, 'fetchAllStatuses');
    // first test a Client Account Type
    fetchedStatuses = service.fetchStatusList('Client');

    // expect(service['fetchClientStatuses']).toHaveBeenCalled();
    expect(fetchClientStatusSpy).toHaveBeenCalled();
    expect(fetchByStatusNameSpy).toHaveBeenCalledWith(['ACTIVE', 'INACTIVE']);
    expect(fetchedStatuses.length).toEqual(2);

    // test a Staff Account Type
    fetchedStatuses = service.fetchStatusList('Staff');
    expect(fetchStaffStatusSpy).toHaveBeenCalled();
    expect(fetchByStatusNameSpy).toHaveBeenCalledWith(['ACTIVE', 'INACTIVE']);
    expect(fetchedStatuses.length).toEqual(2);

    // test a Service Provider Account Type
    fetchedStatuses = service.fetchStatusList('Service Provider');
    expect(fetchServiceProviderStatusSpy).toHaveBeenCalled();
    expect(fetchByStatusNameSpy).toHaveBeenCalledWith(['ACTIVE', 'INACTIVE']);
    expect(fetchedStatuses.length).toEqual(2);

    // test an Intermediary Account Type
    fetchedStatuses = service.fetchStatusList('Agent');
    expect(fetchServiceProviderStatusSpy).toHaveBeenCalled();
    expect(fetchedStatuses.length).toEqual(mockAllStatusList.length);

    // if no status defined default to all statuses
    fetchedStatuses = service.fetchStatusList(null);
    expect(service.fetchAllStatuses).toHaveBeenCalled();
    expect(fetchedStatuses.length).toEqual(mockAllStatusList.length);
  });

  it('should update status', () => {
    const baseUrl = appConfigService.config.contextPath.accounts_services;

    let accountId: number  = 1;
    const statusUpdateDetails: UpdateAccountStatusDto = {
      status: Status.ACTIVE,
      organizationId: 2
    };
    service.updateAccountStatus(accountId, statusUpdateDetails).subscribe(res => {
      expect(res).toBeTruthy();
    });
    // const req = httpTestingController.expectOne(`${baseUrl}/${accountId}/status`, JSON.stringify(statusUpdateDetails));
    // expect(req.request.method).toEqual('PATCH');
    // expect(req.request.body).toEqual(true);
    //
    // req.flush(statusUpdateDetails);
  });

});
