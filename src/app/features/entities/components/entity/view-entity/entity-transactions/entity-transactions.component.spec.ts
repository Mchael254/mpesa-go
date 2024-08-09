import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTransactionsComponent } from './entity-transactions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createSpyObj } from 'jest-createspyobj';
import { of, throwError } from 'rxjs';
import { EntityService } from '../../../../services/entity/entity.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

const transaction = {
  quotation_no: 100,
  client_name: 'Test Client',
  sum_insured: 25000,
  premium: 2500,
  intermediary: 'Agent',
  date_created: '08-08-2024',
  cover_from: '08-08-2024',
  cover_to: '08-08-2024',
  status: 'A',
};

describe('EntityTransactionsComponent', () => {
  const entityServiceStub = createSpyObj('EntityService', [
    'fetchGisQuotationsByClientId',
    'fetchGisClaimsByClientId',
    'fetchGisPoliciesByClientId',
    'fetchGisQuotationsByUser',
    'fetchGisClaimsByUser',
    'fetchGisPoliciesByUser',
    'fetchGisPoliciesByAgentCode',
    'fetchGisClaimsByAgentCode',
    'fetchGisQuotationsByAgentCode',
  ]);
  let component: EntityTransactionsComponent;
  let fixture: ComponentFixture<EntityTransactionsComponent>;

  beforeEach(() => {
    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByClientId')
      .mockReturnValue(of([transaction]));
    jest
      .spyOn(entityServiceStub, 'fetchGisClaimsByClientId')
      .mockReturnValue(of([transaction]));
    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByClientId')
      .mockReturnValue(of([transaction]));

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByUser')
      .mockReturnValue(of([transaction]));
    jest
      .spyOn(entityServiceStub, 'fetchGisClaimsByUser')
      .mockReturnValue(of([transaction]));
    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByUser')
      .mockReturnValue(of([transaction]));

    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByAgentCode')
      .mockReturnValue(of([transaction]));
    jest
      .spyOn(entityServiceStub, 'fetchGisClaimsByAgentCode')
      .mockReturnValue(of([transaction]));
    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByAgentCode')
      .mockReturnValue(of([transaction]));

    TestBed.configureTestingModule({
      declarations: [EntityTransactionsComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: EntityService, useValue: entityServiceStub },
        MessageService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(EntityTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch agent transactions', () => {
    component.fetchTransactionsByPartyAndAccountCode('A', 1111, 'ADMIN');

    expect(component.fetchTransactionsByAgentCode.call).toBeTruthy();
    expect(component.fetchGisClaimsByAgentCode.call).toBeTruthy();
    expect(component.fetchGisPoliciesByAgentCode.call).toBeTruthy();
    expect(component.fetchGisQuotationsByAgentCode.call).toBeTruthy();

    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByAgentCode')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisClaimsByAgentCode')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByAgentCode')
      .mockReturnValue(throwError({ status: 404 }));

    component.fetchTransactionsByPartyAndAccountCode('A', 1111, 'ADMIN');

    expect(component.isPolicyDataReady).toBe(true);
    expect(component.isClaimDataReady).toBe(true);
    expect(component.isQuotationDataReady).toBe(true);
  });

  test('should fetch admin transactions', () => {
    component.fetchTransactionsByPartyAndAccountCode('S', 1111, 'ADMIN');

    expect(component.fetchTransactionsByAgentCode.call).toBeTruthy();
    expect(component.fetchGisQuotationsByUser.call).toBeTruthy();
    expect(component.fetchGisPoliciesByUser.call).toBeTruthy();
    expect(component.fetchGisClaimsByUser.call).toBeTruthy();

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByUser')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByUser')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisClaimsByUser')
      .mockReturnValue(throwError({ status: 404 }));

    component.fetchTransactionsByPartyAndAccountCode('S', 1111, 'ADMIN');

    expect(component.isPolicyDataReady).toBe(true);
    expect(component.isClaimDataReady).toBe(true);
    expect(component.isQuotationDataReady).toBe(true);
  });

  test('should fetch client transactions', () => {
    component.fetchTransactionsByPartyAndAccountCode('C', 1111, 'ADMIN');

    expect(component.fetchTransactionsByAgentCode.call).toBeTruthy();
    expect(component.fetchGisQuotationsByClientId.call).toBeTruthy();
    expect(component.fetchGisClaimsByClientId.call).toBeTruthy();
    expect(component.fetchGisPoliciesByClientId.call).toBeTruthy();

    jest
      .spyOn(entityServiceStub, 'fetchGisQuotationsByClientId')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisClaimsByClientId')
      .mockReturnValue(throwError({ status: 404 }));

    jest
      .spyOn(entityServiceStub, 'fetchGisPoliciesByClientId')
      .mockReturnValue(throwError({ status: 404 }));

    component.fetchTransactionsByPartyAndAccountCode('C', 1111, 'ADMIN');

    expect(component.isPolicyDataReady).toBe(true);
    expect(component.isClaimDataReady).toBe(true);
    expect(component.isQuotationDataReady).toBe(true);
  });
});
