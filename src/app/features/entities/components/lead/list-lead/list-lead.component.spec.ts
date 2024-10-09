import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { ListLeadComponent } from './list-lead.component';
import { LeadsService } from '../../../../../features/crm/services/leads.service';
import { AccountService } from '../../../services/account/account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Leads } from '../../../../../features/crm/data/leads';
import { TranslateModule } from '@ngx-translate/core';
import { Pagination } from '../../../../../shared/data/common/pagination';

const mockLeadsData: Pagination<Leads> = {
  content: [
    {
      accountCode: 0,
      activityCodes: [],
      annualRevenue: 0,
      campCode: 0,
      campTel: '',
      code: 0,
      companyName: '',
      converted: '',
      countryCode: 0,
      currencyCode: 0,
      description: '',
      divisionCode: 0,
      emailAddress: '',
      clientType: '',
      industry: '',
      leadDate: '',
      leadSourceCode: 0,
      leadStatusCode: 0,
      mobileNumber: '',
      occupation: '',
      organizationCode: 0,
      otherNames: '',
      physicalAddress: '',
      postalAddress: '',
      postalCode: '',
      productCode: 0,
      stateCode: 0,
      surname: '',
      systemCode: 0,
      teamCode: 0,
      title: '',
      townCode: 0,
      userCode: 0,
      userName: '',
      website: '',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  last: true,
  size: 1,
  number: 0,
  first: true,
  numberOfElements: 1,
};

// const mockLeadsData = {
//   content: [
//     { firstName: 'John', idNumber: '1234', clientTypeName: 'Individual' },
//   ],
//   totalElements: 1,
//   totalPages: 1,
// };

export class MockLeadsService {
  getAllLeads = jest.fn().mockReturnValue(of(mockLeadsData));
  searchLeads = jest.fn().mockReturnValue(of(mockLeadsData));
}

export class MockAccountService {
  getAccountDetailsByAccountCode = jest
    .fn()
    .mockReturnValue(of({ partyId: 1 }));
  setCurrentAccounts = jest.fn();
}

export class MockNgxSpinnerService {
  show = jest.fn();
  hide = jest.fn();
}

describe('ListLeadComponent', () => {
  let component: ListLeadComponent;
  let fixture: ComponentFixture<ListLeadComponent>;
  let leadServiceStub: LeadsService;
  let accountServiceStub: AccountService;
  let spinnerServiceStub: NgxSpinnerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListLeadComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: LeadsService, useClass: MockLeadsService },
        { provide: AccountService, useClass: MockAccountService },
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService },
        ChangeDetectorRef,
      ],
    });
    fixture = TestBed.createComponent(ListLeadComponent);
    component = fixture.componentInstance;
    leadServiceStub = TestBed.inject(LeadsService);
    accountServiceStub = TestBed.inject(AccountService);
    spinnerServiceStub = TestBed.inject(NgxSpinnerService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show spinner on init', () => {
    component.ngOnInit();
    expect(spinnerServiceStub.show).toHaveBeenCalled();
  });

  test('should fetch leads on lazy load when not searching', () => {
    const mockEvent = {
      first: 0,
      rows: 5,
      sortField: 'leadDate',
      sortOrder: 1,
    };
    jest
      .spyOn(leadServiceStub, 'getAllLeads')
      .mockReturnValue(of(mockLeadsData));

    component.lazyLoadLeads(mockEvent);

    expect(leadServiceStub.getAllLeads).toHaveBeenCalledWith(
      0,
      5,
      'leadDate',
      'desc'
    );
    expect(component.leadsData).toEqual(mockLeadsData);
    expect(spinnerServiceStub.hide).toHaveBeenCalled();
  });

  test('should call filter method on lazy load when searching', () => {
    const filterSpy = jest.spyOn(component, 'filter');
    component.isSearching = true;
    const mockEvent = {
      first: 0,
      rows: 5,
      sortField: 'leadDate',
      sortOrder: 1,
    };

    component.lazyLoadLeads(mockEvent);
    expect(filterSpy).toHaveBeenCalled();
  });

  test('should handle error during lazy loading leads', () => {
    const mockEvent = {
      first: 0,
      rows: 5,
      sortField: 'leadDate',
      sortOrder: 1,
    };
    jest
      .spyOn(leadServiceStub, 'getAllLeads')
      .mockReturnValue(throwError({ message: 'Error' }));

    component.lazyLoadLeads(mockEvent);

    expect(spinnerServiceStub.hide).toHaveBeenCalled();
  });

  test('should handle error when searching leads', () => {
    const mockEvent = { target: { value: 'John' } };
    jest
      .spyOn(leadServiceStub, 'searchLeads')
      .mockReturnValue(throwError({ message: 'Error' }));

    component.filter(mockEvent, 0, 5);

    expect(spinnerServiceStub.hide).toHaveBeenCalled();
  });

  test('should navigate to lead detail page with party ID', () => {
    const mockPartyId = 1;
    const routerSpy = jest.spyOn(router, 'navigate');
    jest
      .spyOn(accountServiceStub, 'getAccountDetailsByAccountCode')
      .mockReturnValue(of({ partyId: mockPartyId }));

    component.viewDetailsWithId(1);

    expect(
      accountServiceStub.getAccountDetailsByAccountCode
    ).toHaveBeenCalledWith(1);
    expect(routerSpy).toHaveBeenCalledWith([
      `/home/entity/view/${mockPartyId}`,
    ]);
  });

  test('should set filter object when input methods are called', () => {
    const mockEvent = { target: { value: 'John' } };

    component.inputName(mockEvent);
    expect(component.filterObject.name).toBe('John');

    component.inputModeOfIdentity(mockEvent);
    expect(component.filterObject.modeOfIdentity).toBe('John');

    component.inputIdNumber(mockEvent);
    expect(component.filterObject.idNumber).toBe('John');

    component.inputClientTypeName(mockEvent);
    expect(component.filterObject.clientTypeName).toBe('John');
  });

  test('should call filter method on lazy load when searching', () => {
    const filterSpy = jest.spyOn(component, 'filter');
    component.isSearching = true;
    const mockEvent = {
      first: 0,
      rows: 5,
      sortField: 'leadDate',
      sortOrder: 1,
    };

    component.lazyLoadLeads(mockEvent);
    expect(filterSpy).toHaveBeenCalled();
  });

  test('should navigate to entity creation page', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    component.gotoEntityPage();
    expect(routerSpy).toHaveBeenCalledWith(['/home/entity/new'], {
      queryParams: { entityType: 'Lead' },
    });
  });
});
