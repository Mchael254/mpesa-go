import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHistoryComponent } from './transaction-history.component';
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../../../shared/services/auth.service";
import {PoliciesService} from "../../../../../../gis/services/policies/policies.service";
import {ViewClaimService} from "../../../../../../gis/services/claims/view-claim.service";
import {ReinsuranceService} from "../../../../../../gis/reinsurance/reinsurance.service";
import {
  CompletionRemarksService
} from "../../../../../../gis/components/setups/services/completion-remarks/completion-remarks.service";
import {LocalStorageService} from "../../../../../../../shared/services/local-storage/local-storage.service";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedModule} from "../../../../../../../shared/shared.module";
import {TableModule} from "primeng/table";
import {TabViewModule} from "primeng/tabview";

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue('testUser')
}

export class MockTranslateService {
  getTranslation = jest.fn().mockReturnValue(of());
  get = jest.fn().mockReturnValue(of());
}

export class MockPoliciesService {
  saveExceptionRemark = jest.fn().mockReturnValue(of());
  getPolicyAuthorizationLevels = jest.fn().mockReturnValue(of());
  authorizeAuthorizationLevels = jest.fn().mockReturnValue(of());
}

export class MockViewClaimService {
  getClaimsTransactionsDetails = jest.fn().mockReturnValue(of());
  getListOfExceptionsByClaimNo = jest.fn().mockReturnValue(of());
  getClaimsPaymentTransactionsDetails = jest.fn().mockReturnValue(of());
  getClaimRevisionDetails = jest.fn().mockReturnValue(of());
  getListOfPerilsLRV = jest.fn().mockReturnValue(of());
  getTreatyCedingLRV = jest.fn().mockReturnValue(of());
  getFacultativeCedingLRV = jest.fn().mockReturnValue(of());
  getNonPropTreatyLRV = jest.fn().mockReturnValue(of());
  getPenaltiesLRV = jest.fn().mockReturnValue(of());
  getListOfPerilsPayment = jest.fn().mockReturnValue(of());
  getTreatyCessions = jest.fn().mockReturnValue(of());
  getFacultativeCessions = jest.fn().mockReturnValue(of());
  getNonPropReinsurers = jest.fn().mockReturnValue(of());
  getClaimsBankDetails = jest.fn().mockReturnValue(of());
  getClaimsPaymentItems = jest.fn().mockReturnValue(of());
  getRemarks = jest.fn().mockReturnValue(of());
}

describe('TransactionHistoryComponent', () => {
  let component: TransactionHistoryComponent;
  let fixture: ComponentFixture<TransactionHistoryComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let authServiceStub: AuthService;
  let policiesServiceStub: PoliciesService;
  let claimServiceStub: ViewClaimService;
  let reinsuranceServiceStub: ReinsuranceService;
  let completionRemarksServiceStub: CompletionRemarksService;
  let localStorageServiceStub: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionHistoryComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        TableModule,
        TabViewModule
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: PoliciesService, useClass: MockPoliciesService },
        { provide: ViewClaimService, useClass: MockViewClaimService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: CompletionRemarksService },
        { provide: ReinsuranceService },
        { provide: LocalStorageService },
      ]
    });
    fixture = TestBed.createComponent(TransactionHistoryComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    authServiceStub = TestBed.inject(AuthService);
    policiesServiceStub = TestBed.inject(PoliciesService);
    claimServiceStub = TestBed.inject(ViewClaimService);
    reinsuranceServiceStub = TestBed.inject(ReinsuranceService);
    completionRemarksServiceStub = TestBed.inject(CompletionRemarksService);
    localStorageServiceStub = TestBed.inject(LocalStorageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change event of a dropdown, saves exception remark data', () => {
    const remark = 'testremark';
    const exceptionCode = 123;
    const payload: any = {
      exceptionCode: exceptionCode,
      exceptionUnderwritingDecision: remark
    }
    component.onDropdownChange(remark, exceptionCode);
    expect(policiesServiceStub.saveExceptionRemark.call).toBeTruthy();
    expect(policiesServiceStub.saveExceptionRemark.call.length).toBe(1);
  });

  it('should fetch a list of claim transaction details', () => {

    jest.spyOn(claimServiceStub, 'getClaimsTransactionsDetails').mockReturnValue(of());

    component.ngOnInit();
    component.fetchClaimTransactionDetails();

    expect(claimServiceStub.getClaimsTransactionsDetails).toHaveBeenCalled();
  });

  it('should fetch claim exceptions', () => {
    const remark = {name: 'testremark'};
    const exceptionCode = 123;

    component.onDropdownChange(remark.name, exceptionCode);
    component.fetchClaimExceptions();
    expect(claimServiceStub.getListOfExceptionsByClaimNo.call).toBeTruthy();
    expect(claimServiceStub.getListOfExceptionsByClaimNo.call.length).toBe(1);
  });

  it('should fetch claim payment detail', () => {
    const remark = {name: 'testremark'};

    // component.onDropdownChange(remark, exceptionCode);
    component.toggleTransactionDetails(remark.name, true);
    component.fetchClaimPaymentsTransactionDetails();
    expect(claimServiceStub.getClaimsPaymentTransactionsDetails.call).toBeTruthy();
    expect(claimServiceStub.getClaimsPaymentTransactionsDetails.call.length).toBe(1);
  });

  it('should fetch claim revision detail', () => {
    const remark = {name: 'testremark'};
    const expanded = false;

    component.toggleTransactionDetails(remark.name, expanded);

    expect(claimServiceStub.getClaimRevisionDetails.call).toBeTruthy();
    expect(claimServiceStub.getClaimRevisionDetails.call.length).toBe(1);
    expect(claimServiceStub.getClaimRevisionDetails).toHaveBeenCalled();
    expect(claimServiceStub.getClaimsPaymentTransactionsDetails).toHaveBeenCalled();
    expect(policiesServiceStub.getPolicyAuthorizationLevels).toHaveBeenCalled();
  });

  it('should call authorizeAuthorizationLevels and display success message on success', () => {
    const selectedAuthorizationLevel = [{ code: 'LEVEL1' }];
    const responseData = { code: 123 };
    component.selectedAuthorizationLevel = selectedAuthorizationLevel;
    jest.spyOn(policiesServiceStub, 'authorizeAuthorizationLevels').mockReturnValue(of(responseData))

    component.authorizeAuthorizationLevels();

    expect(policiesServiceStub.authorizeAuthorizationLevels).toHaveBeenCalledWith('LEVEL1');
    expect(component.authorizationLevelsData).toBe(responseData);
    expect(globalMessagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully authorized level');
  });

});
