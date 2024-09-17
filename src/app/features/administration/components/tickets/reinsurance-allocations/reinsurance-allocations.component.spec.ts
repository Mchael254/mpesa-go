import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsuranceAllocationsComponent } from './reinsurance-allocations.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Logger, SharedModule} from "../../../../../shared/shared.module";
import {TableModule} from "primeng/table";
import {ReinsuranceService} from "../../../../gis/reinsurance/reinsurance.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {of} from "rxjs";
import {SubclassesService} from "../../../../gis/components/setups/services/subclasses/subclasses.service";
import {IntermediaryService} from "../../../../entities/services/intermediary/intermediary.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {ReinsuranceRiskDetailsDTO, RiskReinsuranceRiskDetailsDTO} from "../../../../gis/data/reinsurance-dto";
import {TranslateLoader, TranslateService, TranslateStore} from "@ngx-translate/core";


const reinsuranceRiskMock: ReinsuranceRiskDetailsDTO = {
  batchNo: 0,
  cessionPolicyCovertype: "",
  code: 0,
  currencyCode: 0,
  endorsementNo: "",
  exchangeRate: "",
  ipuCode: 0,
  policyNo: "",
  policyReinsuranceRiskDetailsCode: 0,
  rate: 0,
  reinsuranceCode: 0,
  riskCurrencySymbol: "",
  riskPremiumPolicyCurrency: "",
  riskPremiumTreatyCurrency: "",
  riskSumInsuredPolicyCurrency: 0,
  riskSumInsuredTreatyCurrency: "",
  subclassCode: 0,
  treatyCode: 0,
  treatyCommissionPolicyCurrency: "",
  treatyCurrencyCode: 0,
  treatyCurrencySymbol: "",
  treatyPremiumPolicyCurrency: "",
  treatyPremiumTreatyCurrency: "",
  treatyShortDescription: "",
  treatySumInsuredPolicyCurrency: "",
  treatySumInsuredTreatyCurrency: "",
  underwritingYear: 0

}

const mockRiskReinsuranceRiskDetails: RiskReinsuranceRiskDetailsDTO[] = [
  {
    batchNo: 0,
    clientCode: 0,
    clientName: '',
    code: 0,
    emlBasedOn: '',
    endorsementDiffAmount: 0,
    escalationRate: 0,
    maximumExposure: 0,
    overrideReinsureRetention: 0,
    policyEstimateMaximumLoss: 0,
    policyNo: '',
    previousIpuCode: 0,
    propertyId: '',
    reinsuranceAmount: 0,
    riskRelationsCode: 0,
    sectionSubclassCode: 0,
    underWritingYear: 0,
    value: 0,
    wefDate: '',
    checked: true
  }];

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
        "accounts_services": "crm/accounts"
      }
    };
  }
}

export class MockReinsuranceService {
  getTreatyParticipant = jest.fn().mockReturnValue(of())
  getRiskReinsuranceRiskDetails = jest.fn().mockReturnValue(of())
  getRiskReinsurance = jest.fn().mockReturnValue(of())
  getReinsuranceRiskDetails = jest.fn().mockReturnValue(of(reinsuranceRiskMock))
  getReinsuranceFacreCeding = jest.fn().mockReturnValue(of())
  getReinsurancePool = jest.fn().mockReturnValue(of())
  getReinsuranceXolPremium = jest.fn().mockReturnValue(of())
  getReinsuranceXolPremiumParticipants = jest.fn().mockReturnValue(of())
  getPreviousCeding = jest.fn().mockReturnValue(of())
  getTreatySetups = jest.fn().mockReturnValue(of())
  getPolicyFacreSetups = jest.fn().mockReturnValue(of())
  populateTreaties = jest.fn().mockReturnValue(of())
}

export class MockTranslateService {
  getTranslation = jest.fn().mockReturnValue(of());
  get = jest.fn().mockReturnValue(of());
}

describe('ReinsuranceAllocationsComponent', () => {
  let component: ReinsuranceAllocationsComponent;
  let fixture: ComponentFixture<ReinsuranceAllocationsComponent>;
  let reinsuranceServiceStub : ReinsuranceService;
  let messageServiceStub: GlobalMessagingService;
  let subclassServiceStub: SubclassesService;
  let intermediaryServiceStub: IntermediaryService;
  let appConfigServiceStub: AppConfigService;
  let loggerSpy: jest.SpyInstance;
  let translateServiceStub: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReinsuranceAllocationsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule
      ],
      providers: [
        { provide: ReinsuranceService, useClass: MockReinsuranceService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: SubclassesService },
        { provide: IntermediaryService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: TranslateStore },
        { provide: TranslateLoader },

      ]
    });
    fixture = TestBed.createComponent(ReinsuranceAllocationsComponent);
    component = fixture.componentInstance;
    reinsuranceServiceStub = TestBed.inject(ReinsuranceService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    subclassServiceStub = TestBed.inject(SubclassesService);
    intermediaryServiceStub = TestBed.inject(IntermediaryService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    loggerSpy = jest.spyOn(Logger.prototype, 'info');
    translateServiceStub = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch treaty participants data', () => {
    const mockData = {  };

    jest.spyOn(reinsuranceServiceStub, 'getTreatyParticipant');
    component.selectRiskRiSummary(mockData);
    component.getTreatyParticipant();
    expect(reinsuranceServiceStub.getTreatyParticipant).toHaveBeenCalledWith(component.reinsuranceRiskDetailsData.content[0].code, component.reinsuranceRiskDetailsData.content[0].code);

  });

  test('should fetch risk reinsurance risk data', () => {
    jest.spyOn(reinsuranceServiceStub, 'getRiskReinsuranceRiskDetails');
    component.getRiskReinsuranceRiskDetails();
    expect(reinsuranceServiceStub.getRiskReinsuranceRiskDetails).toHaveBeenCalled();

  });

  test('should fetch reinsurance risk data', () => {
    const code = 1;
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getReinsuranceRiskDetails');

    component.selectTreatyRiskCeding(mockData);
    component.getReinsuranceRiskDetails(code);

    expect(reinsuranceServiceStub.getReinsuranceRiskDetails).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith('treaty RI selected output>>', mockData);
    // expect(loggerSpy).toHaveBeenCalledWith('ReinsuranceRiskDetail>>', mockData);
  });

  test('should fetch facre ceding data', () => {
    const code = 1;

    jest.spyOn(reinsuranceServiceStub, 'getReinsuranceFacreCeding');
    component.getReinsuranceFacreCeding();
    expect(reinsuranceServiceStub.getReinsuranceFacreCeding).toHaveBeenCalled();

  });
  test('should fetch reinsurance pool data', () => {
    const code = 1;
    const riskCode= [{
      code: 1
    }];
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getReinsurancePool');
    component.selectRiskRiSummary(mockData);
    component.getReinsurancePool();
    expect(reinsuranceServiceStub.getReinsurancePool).toHaveBeenCalledWith(riskCode[0].code, code);
    expect(loggerSpy).toHaveBeenCalledWith('ReinsurancePool>>', mockData);

  });

  test('should fetch reinsurance xol premium data', () => {
    const code = 1;
    const riskCode= [{
      code: 1
    }];
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getReinsuranceXolPremium');
    component.selectRiskRiSummary(mockData);
    component.getReinsuranceXolPremium();
    expect(reinsuranceServiceStub.getReinsuranceXolPremium).toHaveBeenCalledWith(code, riskCode[0].code);
    expect(loggerSpy).toHaveBeenCalledWith('ReinsuranceXOLPremium>>', mockData);

  });

  test('should fetch reinsurance xol premium participants data', () => {
    const code = 1;
    const riskCode= [{
      code: 1
    }];
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getReinsuranceXolPremiumParticipants');
    component.selectRiskRiSummary(mockData);
    component.getReinsuranceXolPremiumParticipants();
    expect(reinsuranceServiceStub.getReinsuranceXolPremiumParticipants).toHaveBeenCalledWith(code);
    expect(loggerSpy).toHaveBeenCalledWith('ReinsuranceXOLPremiumPart>>', mockData);

  });

  test('should fetch previous ceding data', () => {
    const code = 1;
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getPreviousCeding');
    component.populateAllocations();
    component.getPreviousCeding();
    expect(reinsuranceServiceStub.getPreviousCeding).toHaveBeenCalledWith(code);
    expect(loggerSpy).toHaveBeenCalledWith('previousCeding>>', mockData);

  });

  test('should fetch treaty cessions data', () => {
    const code = 1;
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getReinsuranceRiskDetails');
    component.selectPreviousCedingDetails(mockData);
    component.getTreatyCessions();
    expect(reinsuranceServiceStub.getReinsuranceRiskDetails).toHaveBeenCalledWith(code);
    expect(loggerSpy).toHaveBeenCalledWith('treatyCessionsData>>', mockData);

  });

  test('should fetch previous facre ceding data', () => {
    const code = 1;
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getReinsuranceFacreCeding');
    component.selectPreviousCedingDetails(mockData);
    component.getPreviousFacreCeding();
    expect(reinsuranceServiceStub.getReinsuranceFacreCeding).toHaveBeenCalledWith(code);
    expect(loggerSpy).toHaveBeenCalledWith('previousFacreCedingData>>', mockData);

  });

  test('should fetch treaty setups data', () => {
    const code = 1;
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getTreatySetups');
    component.selectPreviousCedingDetails(mockData);
    component.getTreatySetups();
    expect(reinsuranceServiceStub.getTreatySetups).toHaveBeenCalledWith(code);
    expect(loggerSpy).toHaveBeenCalledWith('treatySetups>>', mockData);

  });

  test('should fetch policy facre setups data', () => {
    const code = 1;
    const mockData = {  };
    jest.spyOn(reinsuranceServiceStub, 'getPolicyFacreSetups');
    component.selectPreviousCedingDetails(mockData);
    component.getPolicyFacreSetups();
    expect(reinsuranceServiceStub.getPolicyFacreSetups).toHaveBeenCalledWith(code);
    expect(loggerSpy).toHaveBeenCalledWith('policyFacreSetups>>', mockData);

  });

  it('should call reinsuranceService.populateTreaties with correct payload', () => {
    // Call the method to be tested
    const payload: any = {
      batchNumber: 123,
      riskIpuCodes: []
    }
    component.populateAllocations();

    // Expect that populateTreaties is called with correct payload
    expect(reinsuranceServiceStub.populateTreaties).toHaveBeenCalledWith(payload);
    expect(messageServiceStub).toHaveBeenCalledWith(
      'Success',
      'Successfully populated'
    );
  });

  it('should select risk details', () => {
    const selectedRisk = mockRiskReinsuranceRiskDetails[0];
    component.selectRiskDetails(selectedRisk);
    component.populateAllocations();
    expect(component.populateAllocations).toHaveBeenCalled();
  });

  it('should select a treaty risk ceding', () => {
    const treatyRiskCeding: any = [];
    component.selectTreatyRiskCeding(treatyRiskCeding);
    // expect(component.getReinsuranceRiskDetails).toHaveBeenCalled();
    expect(loggerSpy).toHaveBeenCalledWith('risk selected output>>', treatyRiskCeding?.code);
  });

  it('should select previous ceding', () => {
    const previousCeding: any = [];
    component.selectPreviousCedingDetails(previousCeding);

    expect(loggerSpy).toHaveBeenCalledWith('previous ceding selected output>>', previousCeding);
  });

  it('should select risk SI summary', () => {
    const treatyRISummary: any = [];
    component.selectRiskRiSummary(treatyRISummary);

    expect(loggerSpy).toHaveBeenCalledWith('treaty RI selected output>>', treatyRISummary);
  });

  it('should fetch subclass data', () => {
    const subClassCode = 12;
    jest.spyOn(subclassServiceStub, 'getSubclasses');
    component.getSubclasses(subClassCode);
    expect(subclassServiceStub.getSubclasses).toHaveBeenCalledWith(subClassCode);
  });

  it('should fetch risk reinsurance risk data', () => {
    const agentCode = 12;
    jest.spyOn(intermediaryServiceStub, 'getAgentById');
    component.getIntermediaryId(agentCode);
    expect(intermediaryServiceStub.getAgentById).toHaveBeenCalledWith(agentCode);

  });

  it('should reinsure a risk', () => {
    const batchNo = 12;
    const data: [] = [];
    jest.spyOn(reinsuranceServiceStub, 'reinsureRisk');
    component.reinsureRisk();
    expect(reinsuranceServiceStub.reinsureRisk).toHaveBeenCalledWith(batchNo, data);
    expect(messageServiceStub).toHaveBeenCalledWith(
      'Success',
      'Successfully reinsured'
    );
  });
});
