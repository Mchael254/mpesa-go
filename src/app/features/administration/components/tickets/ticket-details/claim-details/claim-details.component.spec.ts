import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDetailsComponent } from './claim-details.component';
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {LocalStorageService} from "../../../../../../shared/services/local-storage/local-storage.service";
import {ViewClaimService} from "../../../../../gis/services/claims/view-claim.service";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {of} from "rxjs";
import {TranslateLoader, TranslateService, TranslateStore} from "@ngx-translate/core";
import {RevisionDetailsComponent} from "./revision-details/revision-details.component";
import {SharedModule} from "../../../../../../shared/shared.module";
import {TicketsDTO} from "../../../../data/ticketsDTO";

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "gis_services":  "gis",
      }
    };
  }
}

export class MockViewClaimService {
  getClaimsTransactionsDetails = jest.fn().mockReturnValue(of());
  getClaimsPaymentTransactionsDetails = jest.fn().mockReturnValue(of());
  getClaimRevisionDetails = jest.fn().mockReturnValue(of());
  authorizeClaims = jest.fn().mockReturnValue(of());
}

export class MockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue(of());
}

export class MockTranslateService {
  getTranslation = jest.fn().mockReturnValue(of());
  get = jest.fn().mockReturnValue(of());
}

describe('ClaimDetailsComponent', () => {
  let component: ClaimDetailsComponent;
  let fixture: ComponentFixture<ClaimDetailsComponent>;
  let claimsServiceStub: ViewClaimService;
  let messageServiceStub: GlobalMessagingService;
  let authServiceStub: AuthService;
  let localStorageServiceStub: LocalStorageService;
  let appConfigServiceStub: AppConfigService;
  let translateServiceStub: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimDetailsComponent, RevisionDetailsComponent],
      imports: [
        SharedModule,
      ],
      providers: [
        { provide: ViewClaimService, useClass: MockViewClaimService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: LocalStorageService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: TranslateStore },
        { provide: TranslateLoader },
      ]
    });
    fixture = TestBed.createComponent(ClaimDetailsComponent);
    component = fixture.componentInstance;
    claimsServiceStub = TestBed.inject(ViewClaimService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    authServiceStub = TestBed.inject(AuthService);
    localStorageServiceStub = TestBed.inject(LocalStorageService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    translateServiceStub = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

      // Successfully fetches claim transaction details when service returns data
      it('should fetch claim transaction details successfully when service returns data', () => {
        const localStorageServiceMock = {
          setItem: jest.fn()
        };
        component.fetchClaimTransactionDetails();

        expect(component.claimTransaction).toEqual({ transactionId: 1, details: 'one transaction' });
        expect(component.claimTransactionData).toEqual([{ transactionId: 1, details: 'transaction array' }]);
        expect(localStorageServiceMock.setItem).toHaveBeenCalledWith('claimTransactionDetails', { transactionId: 1, details: 'some details' });
      });

          // Successfully fetches claim payment transaction details
    it('should set claimPaymentTransactionData and claimPaymentTransaction when data is fetched successfully', () => {

      component.selectedSpringTickets = <TicketsDTO>{ticket: {claimNo: '123'}};
      component.claimTransaction = { claimVoucherCode: 'abc' };

      component.fetchClaimPaymentsTransactionDetails();

      expect(component.claimPaymentTransactionData).toEqual([{ transactionId: 1 }]);
      expect(component.claimPaymentTransaction).toEqual({ transactionId: 1 });
      expect(component.isLoadingTransactionData).toBe(false);
    });

  it('should fetch claim revision details successfully when valid ticket and transaction numbers are provided', () => {
    component.selectedSpringTickets = <TicketsDTO>{ticket: {claimNo: '123'}};
    component.claimTransaction = { transactionNo: '456' };

    component.fetchClaimRevision();
    jest.spyOn(claimsServiceStub, 'getClaimRevisionDetails');

    // expect(component.claimRevisionData).toEqual({ id: 1, detail: 'revision detail' });
    expect(claimsServiceStub.getClaimRevisionDetails).toHaveBeenCalledWith('123', '456');
  });

  // Authorizes claim successfully when valid payload is provided
  it('should authorize claim successfully when valid payload is provided', () => {
    component.selectedSpringTickets = <TicketsDTO>{ ticket: { claimNo: '123' } };
    component.claimRevisionData = [{ code: 'rev1' }];
    component.claimTransaction = { transactionNo: 'trans123', transactionCode: 'type1' };

    component.authorizeClaim();

    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully authorized claim');
    expect(component.isLoadingAuthClaim).toBe(false);
  });
});
