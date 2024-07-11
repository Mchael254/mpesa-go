import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionDetailsComponent } from './revision-details.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../../../../../shared/shared.module";
import {TableModule} from "primeng/table";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {AppConfigService} from "../../../../../../../core/config/app-config-service";

import {AuthService} from "../../../../../../../shared/services/auth.service";
import {ViewClaimService} from "../../../../../../gis/services/claims/view-claim.service";
import {ReinsuranceService} from "../../../../../../gis/reinsurance/reinsurance.service";
import {LocalStorageService} from "../../../../../../../shared/services/local-storage/local-storage.service";
import {PoliciesService} from "../../../../../../gis/services/policies/policies.service";
import {
  CompletionRemarksService
} from "../../../../../../gis/components/setups/services/completion-remarks/completion-remarks.service";
import {of} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {TicketsDTO} from "../../../../../data/ticketsDTO";
import {TabViewModule} from "primeng/tabview";

const mockTicketDTO: TicketsDTO = {
  agentName: "",
  clientName: "",
  task: {
    activityName: "",
    assignee: "",
    code: 0,
    description: "",
    executionId: "",
    name: "",
    priority: 0,
    state: "",
    taskClass: "",
    taskDefinitionName: ""
  },
  ticket: {
    active: "",
    adhocName: "",
    agentCode: 0,
    assignee: "",
    claimNo: "",
    claimTransactionNumber: 0,
    claimTransactionType: "",
    claimType: "",
    clientCode: 0,
    code: 0,
    date: undefined,
    endorsment: "",
    endorsmentCode: 0,
    externalReferenceNo: "",
    ggtNo: 0,
    groupUser: "",
    policyCode: 0,
    policyNo: "",
    processId: "",
    processSubAreaCode: 0,
    productType: "",
    prpCode: 0,
    quotationCode: 0,
    quotationNo: "",
    reassigned: "",
    reassignedDate: undefined,
    remarks: "",
    reporter: "",
    sysCode: 0,
    sysModule: "",
    transNo: 0,
    transactionEffectiveDate: undefined,
    transactionNumber: 0,
    type: ""
  }

}
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
        "fms_services":  "fms",
      }
    };
  }
}

export class MockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue('testUser')
}

export class MockTranslateService {
  getTranslation = jest.fn().mockReturnValue(of());
  get = jest.fn().mockReturnValue(of());
}

export class MockViewClaimService {
  getListOfPerilsLRV = jest.fn().mockReturnValue(of());
  getTreatyCedingLRV = jest.fn().mockReturnValue(of());
  getFacultativeCedingLRV = jest.fn().mockReturnValue(of());
  getNonPropTreatyLRV = jest.fn().mockReturnValue(of());
  getPenaltiesLRV = jest.fn().mockReturnValue(of());
  getTreatyCessions = jest.fn().mockReturnValue(of());
  getFacultativeCessions = jest.fn().mockReturnValue(of());
  getNonPropReinsurers = jest.fn().mockReturnValue(of());
  getClaimsBankDetails = jest.fn().mockReturnValue(of());
  getListOfPerilsPayment = jest.fn().mockReturnValue(of());
  getRemarks = jest.fn().mockReturnValue(of());
  getClaimsPaymentItems = jest.fn().mockReturnValue(of());
  getListOfExceptionsByClaimNo = jest.fn().mockReturnValue(of());
  claimMakeReady = jest.fn().mockReturnValue(of());
}

export class MockPoliciesService {
  getPolicyAuthorizationLevels = jest.fn().mockReturnValue(of());
  authorizeAuthorizationLevels = jest.fn().mockReturnValue(of());
  saveExceptionRemark = jest.fn().mockReturnValue(of());
  authoriseExceptions = jest.fn().mockReturnValue(of());
}

describe('RevisionDetailsComponent', () => {
  let component: RevisionDetailsComponent;
  let fixture: ComponentFixture<RevisionDetailsComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let authServiceStub: AuthService;
  let viewClaimServiceStub: ViewClaimService;
  let reinsuranceServiceStub: ReinsuranceService;
  let localStorageServiceStub: LocalStorageService;
  let policiesServiceStub: PoliciesService;
  let completionRemarksServiceStub: CompletionRemarksService;
  let translateServiceStub: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RevisionDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule,
        TabViewModule
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: ViewClaimService, useClass: MockViewClaimService },
        { provide: ReinsuranceService},
        { provide: LocalStorageService },
        { provide: PoliciesService, useClass: MockPoliciesService },
        { provide: CompletionRemarksService }
      ]
    });
    fixture = TestBed.createComponent(RevisionDetailsComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    authServiceStub = TestBed.inject(AuthService);
    viewClaimServiceStub = TestBed.inject(ViewClaimService);
    reinsuranceServiceStub = TestBed.inject(ReinsuranceService);
    localStorageServiceStub = TestBed.inject(LocalStorageService);
    policiesServiceStub = TestBed.inject(PoliciesService);
    completionRemarksServiceStub = TestBed.inject(CompletionRemarksService);
    translateServiceStub = TestBed.inject(TranslateService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch a list of LRV perils', () => {

    jest.spyOn(viewClaimServiceStub, 'getListOfPerilsLRV').mockReturnValue(of());

    component.ngOnInit();
    component.getPerils();

    expect(viewClaimServiceStub.getListOfPerilsLRV).toHaveBeenCalled();
    // expect(viewClaimServiceStub.getListOfPerilsLRV).toHaveBeenCalledWith(claimNo.ticket.claimNo);
  });

  it('should fetch a list of LRV treaty ceding', () => {

    jest.spyOn(viewClaimServiceStub, 'getTreatyCedingLRV').mockReturnValue(of());

    component.ngOnInit();
    component.getTreatyCeding();

    expect(viewClaimServiceStub.getTreatyCedingLRV).toHaveBeenCalled();
  });

  it('should fetch a list of LRV facultative ceding', () => {

    jest.spyOn(viewClaimServiceStub, 'getFacultativeCedingLRV').mockReturnValue(of());

    component.ngOnInit();
    component.getFacultativeCeding();

    expect(viewClaimServiceStub.getFacultativeCedingLRV).toHaveBeenCalled();
  });

  it('should fetch a list of LRV Non-proportional treaty', () => {

    jest.spyOn(viewClaimServiceStub, 'getNonPropTreatyLRV').mockReturnValue(of());

    component.ngOnInit();
    component.getNonProportionalTreaty();

    expect(viewClaimServiceStub.getNonPropTreatyLRV).toHaveBeenCalled();
  });

  it('should fetch a list of LRV Non-proportional treaty', () => {

    jest.spyOn(viewClaimServiceStub, 'getPenaltiesLRV').mockReturnValue(of());

    component.ngOnInit();
    component.getPenalties();

    expect(viewClaimServiceStub.getPenaltiesLRV).toHaveBeenCalled();
  });

  it('should fetch a list of treaty cessions', () => {

    jest.spyOn(viewClaimServiceStub, 'getTreatyCessions').mockReturnValue(of());

    component.ngOnInit();
    component.getTreatyCession();

    expect(viewClaimServiceStub.getTreatyCessions).toHaveBeenCalled();
  });

  it('should fetch a list of facultative cessions', () => {

    jest.spyOn(viewClaimServiceStub, 'getFacultativeCessions').mockReturnValue(of());

    component.ngOnInit();
    component.getFacultativeCession();

    expect(viewClaimServiceStub.getFacultativeCessions).toHaveBeenCalled();
  });

  it('should fetch a list of Non-proportional reinsurers', () => {

    jest.spyOn(viewClaimServiceStub, 'getNonPropReinsurers').mockReturnValue(of()).mockReturnValue(of());

    component.ngOnInit();
    component.getNonPropReinsurers();

    expect(viewClaimServiceStub.getNonPropReinsurers).toHaveBeenCalled();
  });

  it('should fetch a list of bank details', () => {

    jest.spyOn(viewClaimServiceStub, 'getClaimsBankDetails');

    component.ngOnInit();
    component.getClaimBankDetails();

    expect(viewClaimServiceStub.getClaimsBankDetails).toHaveBeenCalled();
  });

  it('should fetch a list of Claim payment perils', () => {

    jest.spyOn(viewClaimServiceStub, 'getListOfPerilsPayment').mockReturnValue(of());

    component.ngOnInit();
    component.getPerilsClaimPayment();

    expect(viewClaimServiceStub.getListOfPerilsPayment).toHaveBeenCalled();
  });

  it('should fetch a list of Claim payment perils', () => {

    jest.spyOn(viewClaimServiceStub, 'getRemarks').mockReturnValue(of());

    component.ngOnInit();
    component.getRemarks();

    expect(viewClaimServiceStub.getRemarks).toHaveBeenCalled();
  });

  it('should fetch a list of Claim payment perils', () => {

    jest.spyOn(viewClaimServiceStub, 'getClaimsPaymentItems').mockReturnValue(of());

    component.ngOnInit();
    component.getPaymentItems();

    expect(viewClaimServiceStub.getClaimsPaymentItems).toHaveBeenCalled();
  });

  it('should fetch a list of exceptions by claim no', () => {

    jest.spyOn(viewClaimServiceStub, 'getListOfExceptionsByClaimNo').mockReturnValue(of());

    component.ngOnInit();
    component.fetchClaimExceptions();

    expect(viewClaimServiceStub.getListOfExceptionsByClaimNo).toHaveBeenCalled();
  });

  it('should fetch a list of authorization levels', () => {

    jest.spyOn(policiesServiceStub, 'getPolicyAuthorizationLevels').mockReturnValue(of());

    component.ngOnInit();
    component.getAuthorizationLevels();

    expect(policiesServiceStub.getPolicyAuthorizationLevels).toHaveBeenCalled();
  });

  it('should fetch a list of remarks', () => {

    jest.spyOn(completionRemarksServiceStub, 'getCompletionRemarks').mockReturnValue(of());

    component.ngOnInit();
    component.fetchCompletionRemarks();

    expect(completionRemarksServiceStub.getCompletionRemarks).toHaveBeenCalled();
  });

  it('should make ready', () => {
    component.makeReady();
    expect(viewClaimServiceStub.claimMakeReady.call).toBeTruthy();
    expect(viewClaimServiceStub.claimMakeReady.call.length).toBe(1);
  });

  it('should authorise exceptions', () => {
    component.authoriseExceptions();
    expect(policiesServiceStub.authoriseExceptions.call).toBeTruthy();
    expect(policiesServiceStub.authoriseExceptions.call.length).toBe(1);
  });

  it('should display an error message when no exception is selected', () => {
    component.selectedClaimException = null;

    component.authoriseExceptions();

    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No exception is selected.'
    );
  });

  it('should change event of a dropdown, saves exception remark data', () => {
    const remark = 'testremark';
    const exceptionCode = 123;
    component.onDropdownChange(remark, exceptionCode);
    expect(policiesServiceStub.saveExceptionRemark.call).toBeTruthy();
    expect(policiesServiceStub.saveExceptionRemark.call.length).toBe(1);
  });

  it('should authorize authorization levels', () => {
    component.authorizeAuthorizationLevels();
    expect(policiesServiceStub.authorizeAuthorizationLevels.call).toBeTruthy();
    expect(policiesServiceStub.authorizeAuthorizationLevels.call.length).toBe(1);
  });
});
