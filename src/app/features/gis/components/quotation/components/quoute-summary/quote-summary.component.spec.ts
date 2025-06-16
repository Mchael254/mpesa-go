import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuoteSummaryComponent } from './quote-summary.component';
import { of } from 'rxjs';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { ClaimsService } from '../../../claim/services/claims.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { QuotationDetails } from '../../data/quotationsDTO';

class MockQuotationService {
  getQuotationDetails = jest.fn().mockReturnValue(of());
  updateQuotationStatus = jest.fn().mockReturnValue(of());
  convertQuoteToPolicy = jest.fn().mockReturnValue(of());
  convertToNormalQuote = jest.fn().mockReturnValue(of());
  updateQuotationComment = jest.fn().mockReturnValue(of());
  updateQuotation = jest.fn().mockReturnValue(of());
}

class MockClaimsService {
  getUsers = jest.fn().mockReturnValue(of());
}

class MockGlobalMessageService {
  displayErrorMessage = jest.fn();
  displaySuccessMessage = jest.fn();
  displayInfoMessage = jest.fn();
}

// More complete PDF viewer mock
jest.mock('ng2-pdf-viewer', () => ({
  PdfViewerComponent: class MockPdfViewerComponent {
    static ngModule = {
      declarations: [MockPdfViewerComponent],
      exports: [MockPdfViewerComponent]
    };
  }
}));

const mockResponse: QuotationDetails = {
  code: 531,
  clientCode: null,
  quotationNo: "Q/HDO/PMT/25/0001697",
  revisionNo: 0,
  quotPropHoldingCoPrpCode: null,
  agentShortDescription: "DIRECT",
  currencyCode: 268,
  coverFrom: "2025-06-04",
  coverTo: "2026-06-03",
  totalPropertyValue: null,
  comments: "test",
  status: "Draft",
  expiryDate: "2025-09-02",
  ok: "N",
  premium: 892892.5,
  commissionAmount: null,
  internalComments: null,
  authorisedBy: null,
  authorisedDate: null,
  confirmed: null,
  confirmedBy: null,
  confirmedDate: null,
  ready: "N",
  madeReadyBy: null,
  madeReadyDate: null,
  revised: null,
  preparedBy: "hope.ibrahim@turnkeyafrica.com",
  quotFactor: null,
  quotGspCode: null,
  divisionCode: null,
  creditDateNotified: undefined,
  agentWithin: "Y",
  newAgent: null,
  quotIncsCode: null,
  web: "Y",
  introducerCode: null,
  ipayReferenceNumber: null,
  sourceCode: "37",
  chequeRequisition: null,
  parentRevision: null,
  subAgentCode: null,
  subAgentShortDescription: null,
  subCommissionAmount: null,
  prospectCode: null,
  marketerAgentCode: null,
  clientType: "I",
  marketerCommissionAmount: null,
  originalQuotationNumber: "Q/HDO/PMT/25/0001697",
  quotTrvDstCouCode: null,
  remarks: null,
  reasonCancelled: null,
  webClientCode: null,
  quotTcbCode: null,
  clientRef: null,
  loanDisbursed: "N",
  tenderNumber: null,
  preparedDate: "2025-06-04",
  quotCancelReason: null,
  quotCmpCode: null,
  sourceCampaign: null,
  frequencyOfPayment: "A",
  currencyRate: 1,
  webPolId: null,
  travelQuote: "N",
  likelihood: null,
  quotQscCode: 37,
  quotLtaCommAmt: null,
  ginQuotations: null,
  quotPipCode: null,
  organizationCode: null,
  rfqDate: null,
  multiUser: "N",
  subQuote: "N",
  premiumFixed: "N",
  dateCreated: null,
  agentCode: 0,
  currency: "NGN",
  quotationProducts: [
    {
      code: 2024207851,
      productCode: 8293,
      quotationCode: 531,
      quotationNo: "Q/HDO/PMT/25/0001697",
      premium: 892892.5,
      wef: "2025-06-04",
      wet: "2026-06-03",
      revisionNo: 497,
      totalSumInsured: 8900000,
      commission: null,
      binder: null,
      agentShortDescription: "DIRECT",
      productName: "PRIVATE MOTOR",
      converted: null,
      policyNumber: null,
      productShortDescription: "Private motor",
      taxInformation: [
        {
          code: 4062,
          rateDescription: "STAMP DUTY",
          rate: 0.075,
          rateType: "FXD",
          taxAmount: 667.5,
          transactionCode: "SD",
          renewalEndorsement: null,
          taxRateCode: null,
          levelCode: "U",
          taxType: null,
          riskProductLevel: "P"
        },
        {
          code: 4063,
          rateDescription: "POLICYHOLDERS FUND",
          rate: 0.25,
          rateType: "FXD",
          taxAmount: 2225,
          transactionCode: "PHFUND",
          renewalEndorsement: null,
          taxRateCode: null,
          levelCode: "U",
          taxType: null,
          riskProductLevel: "P"
        }
      ],
      riskInformation: [], // Trimmed for brevity. You can plug the full array here if needed.
      limitsOfLiability: [] // Same here.
    }
  ],
  branchCode: 1,
  source: {
    code: 37,
    description: "",
    applicableModule: ""
  },
  agentName: "DIRECT",
  clientName: null,
  sumInsured: 8900000
};


describe('QuoteSummaryComponent', () => {
  let component: QuoteSummaryComponent;
  let fixture: ComponentFixture<QuoteSummaryComponent>;
    let quotationService: QuotationsService;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteSummaryComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
       
      ],
      providers: [
        { provide: QuotationsService, useClass: MockQuotationService },
        { provide: ClaimsService, useClass: MockClaimsService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteSummaryComponent);
    component = fixture.componentInstance;
    quotationService = TestBed.inject(QuotationsService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
    it('should load quotation details and call flattenQuotationProducts on ngOnInit', () => {
   // simulate session storage
    sessionStorage.setItem('quotationNumber', 'Q12345');
    jest.spyOn(quotationService, 'getQuotationDetails').mockReturnValue(of(mockResponse) as any);
 jest.spyOn(component, 'flattenQuotationProducts').mockImplementation(() => {
    component.totalSumInsured = 8900000; // simulate the result of flattenQuotationProducts
  });
    component.ngOnInit();

    expect(quotationService.getQuotationDetails).toHaveBeenCalledWith(123);
    expect(component.quotationDetails).toEqual(mockResponse);
    expect(component.flattenQuotationProducts).toHaveBeenCalledWith(mockResponse.quotationProducts);
    expect(component.totalSumInsured).toBe(8900000);
    expect(component.comments).toBe('test');
  });
  it('should open the share modal', () => {
    // Ensure initial state is false
    expect(component.isShareModalOpen).toBe(false);

    // Call the method
    component.openShareModal();

    // Expect the state to be true
    expect(component.isShareModalOpen).toBe(true);
  });
    it('should close the share modal', () => {
    component.isShareModalOpen = true;
    expect(component.isShareModalOpen).toBe(true);

    // Call the method
    component.closeShareModal();

    // Expect the state to be true
    expect(component.isShareModalOpen).toBe(false);
  });

});