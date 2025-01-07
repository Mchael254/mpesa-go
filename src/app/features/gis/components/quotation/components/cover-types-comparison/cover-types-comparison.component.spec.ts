import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTypesComparisonComponent } from './cover-types-comparison.component';
import { MessageService, SharedModule } from 'primeng/api';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { BrowserStorage } from "../../../../../../shared/services/storage";
import { Premiums } from '../../../setups/data/gisDTO';
import { QuotationDetails, PremiumComputationRequest, quotationDTO } from '../../data/quotationsDTO';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';



export class mockQuotationService {
  getAllQuotationSources = jest.fn().mockReturnValue(of());
  getFormFields = jest.fn().mockReturnValue(of());
  createQuotationRisk = jest.fn().mockReturnValue(of());
  premiumComputationEngine = jest.fn().mockReturnValue(of());
}
export class mockProductService {
  getAllProducts = jest.fn().mockReturnValue(of());
  getCoverToDate = jest.fn().mockReturnValue(of());
  getYearOfManufacture = jest.fn().mockReturnValue(of());
  getProductSubclasses = jest.fn().mockReturnValue(of());

}
export class mockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue(of());
  getCurrentUser = jest.fn().mockReturnValue(of());
}
export class mockBranchService {
  getAllBranches = jest.fn().mockReturnValue(of());
}
export class mockClientService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById = jest.fn().mockReturnValue(of());
}
export class mockCountryService {
  getCountries = jest.fn().mockReturnValue(of());
}
export class mockSubclassService {
  getAllSubclasses = jest.fn().mockReturnValue(of());
}
export class mockBinderService {
  getAllBindersQuick = jest.fn().mockReturnValue(of());
}
export class mockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of());
}
export class mockSubclassCovertypeService {
  getSubclassCovertypeBySCode = jest.fn().mockReturnValue(of());
}
export class mockSubclassSectionCovertypeService {
  getSubclassCovertypeSections = jest.fn().mockReturnValue(of());
}
export class mockSectionService {
  getSectionByCode = jest.fn().mockReturnValue(of());
}
export class mockPremiumRateService {
  getAllPremiums = jest.fn().mockReturnValue(of());
}
export class MockBrowserStorage {

}
jest.mock('ng2-pdf-viewer', () => ({
  PdfViewerComponent: jest.fn(),
}));
export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}


const mockQuotationDetail: QuotationDetails = {
  agentCode: 123,
  clientCode: 456,
  coverFrom: '2024-02-12',
  coverTo: '2025-02-12',
  currency: 'USD',
  expiryDate: '2025-02-12',
  no: 'Q123456',
  premium: 1000,
  quotationProduct: [
    {
      WEF: '2024-02-12',
      WET: '2025-02-12',
      agentShortDescription: 'Agent ABC',
      binder: 'Binder XYZ',
      code: 789,
      commission: 10,
      premium: 500,
      product: 987,
      productShortDescription: 'Product ABC',
      quotCode: 654,
      quotationNo: 'Q123456',
      revisionNo: 1,
      totalSumInsured: 10000,
      wef: '2024-02-12',
      wet: '2025-02-12',
    },
    // Add more quotation products as needed
  ],
  riskInformation: [
    {
      code: 567,
      covertypeShortDescription: 'CoverType ABC',
      covertypecode: 876,
      quotationCode: 654,
      quotationRiskNo: 'R123',
      sectionsDetails: [
        {
          description: 'Section ABC',
          freeLimit: 2000,
          limitAmount: 5000,
          premium: 200,
          rate: 0.1,
        },
        // Add more section details as needed
      ],
      value: 3000,
    },
    // Add more risk information as needed
  ],
  status: 'Active',
  taxInformation: [
    {
      amount: 50,
      description: 'Tax ABC',
      quotationRate: 0.05,
      rateType: 'Percentage',
    },
    // Add more tax information as needed
  ],
};
const mockPremiumPayload: PremiumComputationRequest = {
  entityUniqueCode: 123,
  interfaceType: 'someValue', // Replace with the actual type expected
  frequencyOfPayment: 'Monthly',
  transactionStatus: 'someValue', // Replace with the actual type expected
  quotationStatus: 'Active', // Replace with the actual status expected
  product: {
    code: 1,
    expiryPeriod: '12 months',
  },
  currency: {
    rate: 1.0,
  },
  risks: [
    {
      code: 456,
      limits: [
        {
          description: 'Limit 1',
          riskCode: 1,
          calculationGroup: 1,
          declarationSection: {}, // Replace with the actual structure
          rowNumber: 1,
          rateDivisionFactor: 1.0,
          premiumRate: 100,
          rateType: 'Percentage',
          sectionType: 'SomeType',
          firstLoss: {}, // Replace with the actual structure
          firstLossAmountPercent: 10,
          firstLossValue: {}, // Replace with the actual structure
          limitAmount: 100000,
          freeLimit: {}, // Replace with the actual structure
          topLocRate: {}, // Replace with the actual structure
          topLocDivFact: {}, // Replace with the actual structure
          emlPercentage: {}, // Replace with the actual structure
          compute: 'SomeComputeType',
          section: { code: 1 },
          multiplierRate: {}, // Replace with the actual structure
          multiplierDivisionFactor: {}, // Replace with the actual structure
          minimumPremium: 50,
          annualPremium: 500,
          premiumAmount: 200,
          dualBasis: 'SomeDualBasis',
          limitPeriod: {}, // Replace with the actual structure
          indemFstPeriod: {}, // Replace with the actual structure
          indemPeriod: {}, // Replace with the actual structure
          indemFstPeriodPercentage: 5,
          indemRemPeriodPercentage: 3,
          // Add other limit properties as needed
        },
        // Add more limits as needed
      ],
      propertyId: 'Property123',
      binderDto: {
        code: 123,
        maxExposure: 50000,
        currencyCode: 456,
        currencyRate: 1.0,
      },
      baseCurrencyCode: 'USD',
      withEffectFrom: '2024-02-12',
      withEffectTo: '2025-02-12',
      prorata: 'Prorata Value',
      rescueServiceDto: {}, // Replace with the actual structure
      subclassSection: {
        code: 789,
      },
      itemDescription: 'Item ABC',
      emlBasedOn: 'someValue', // Replace with the actual type expected
      noClaimDiscountLevel: 1,
      subclassCoverTypeDto: {
        subclassCode: 789,
        coverTypeCode: 1,
        minimumAnnualPremium: 1000,
        minimumPremium: 100,
        coverTypeShortDescription: 'Cover Type 1',
        coverTypeDescription: ''
      },
      enforceCovertypeMinimumPremium: 'Yes',
      futurePremium: {}, // Replace with the actual structure
      commissionRate: {}, // Replace with the actual structure
      effectiveDateWithEffectTo: {}, // Replace with the actual structure
      endorseRemove: {}, // Replace with the actual structure
      // Add other risk properties as needed
    },
    // Add more risks as needed
  ],
  dateWithEffectTo: '2025-02-12',
  dateWithEffectFrom: '2024-02-12',
  underwritingYear: 2024,
  age: '25', // Assuming it's a string, adjust accordingly
  coinsuranceLeader: 'Company ABC',
  coinsurancePercentage: 20,
  taxes: []
};
const mockPremiumRates: Premiums[] = [
  {
    code: 1,
    sectionCode: 101,
    sectionShortDescription: 'Collision Damage',
    sectionType: 'Damage',
    rate: 0.75,
    dateWithEffectFrom: '2024-01-01',
    dateWithEffectTo: '2024-12-31',
    subClassCode: 301,
    binderCode: 401,
    rangeFrom: 0,
    rangeTo: 100000,
    rateDescription: 'Standard Rate',
    divisionFactor: 1.5,
    rateType: 'Percentage',
    premiumMinimumAmount: 50,
    territoryCode: 501,
    proratedOrFull: 'Prorated',
    premiumEndorsementMinimumAmount: 25,
    multiplierRate: 1.2,
    multiplierDivisionFactor: 1.2,
    maximumRate: 1.5,
    minimumRate: 0.5,
    freeLimit: 1000,
    isExProtectorApplication: 'No',
    isSumInsuredLimitApplicable: 'Yes',
    sumInsuredLimitType: 'Fixed',
    sumInsuredRate: '0.2',
    grpCode: 'GRP001',
    isNoClaimDiscountApplicable: 'Yes',
    currencyCode: 601,
    agentName: 'John Doe',
    rangeType: 'Fixed',
    limitAmount: 100000,
    noClaimDiscountLevel: 'Level 1',
    doesCashBackApply: 'No',
    cashBackLevel: 0,
    rateFrequencyType: 'Monthly',
  }
];
const quotationData: quotationDTO = {
  actionType: 'exampleActionType',
  addEdit: 'exampleAddEdit',
  agentCode: 0,
  agentShortDescription: 'DIRECT',
  bdivCode: 123,   // Replace with the correct type for bdivCode
  bindCode: 456,   // Replace with the correct type for bindCode
  branchCode: 789,  // Replace with the correct type for branchCode
  clientCode: 1011, // Replace with the correct type for clientCode
  clientType: 'I',
  coinLeaderCombined: 'exampleCoinLeaderCombined',
  comments: 'exampleComments',
  consCode: 'exampleConsCode',
  currencyCode: 1213, // Replace with the correct type for currencyCode
  currencySymbol: 'USD',
  fequencyOfPayment: 'exampleFequencyOfPayment',
  internalComments: 'exampleInternalComments',
  introducerCode: 1415, // Replace with the correct type for introducerCode
  isBinderPolicy: 'exampleIsBinderPolicy',
  paymentMode: 'examplePaymentMode',
  proInterfaceType: 'exampleProInterfaceType',
  productCode: 1617, // Replace with the correct type for productCode
  source: 'exampleSource',
  withEffectiveFromDate: '2022-01-01',
  withEffectiveToDate: '2022-12-31',
};
const mockUtilServiceResponse = {
  entityUniqueCode: 202445718,
  interfaceType: null,
  frequencyOfPayment: "A",
  transactionStatus: null,
  quotationStatus: "Draft",
  product: {
    code: 8293,
    expiryPeriod: "Y"
  },
  currency: {
    rate: 415.25
  },
  risks: [
    {
      code: 2024217368,
      limits: [
        {
          description: "SI",
          code: 424970,
          riskCode: 2024217368,
          calculationGroup: 1,
          declarationSection: null,
          rowNumber: 1,
          rateDivisionFactor: 100.0,
          premiumRate: 10.0,
          rateType: "FXD",
          sectionType: "SS",
          firstLoss: null,
          firstLossAmountPercent: null,
          firstLossValue: null,
          limitAmount: 6745500,
          freeLimit: null,
          topLocRate: null,
          topLocDivFact: null,
          emlPercentage: null,
          compute: "Y",
          section: {
            code: 3514
          },
          multiplierRate: null,
          multiplierDivisionFactor: null,
          minimumPremium: 5000,
          annualPremium: 5000,
          premiumAmount: 5000,
          dualBasis: "N",
          limitPeriod: null,
          indemFstPeriod: null,
          indemPeriod: null,
          indemFstPeriodPercentage: null,
          indemRemPeriodPercentage: null
        }
        // ... other limits if applicable
      ],
      propertyId: "KDD 567H",
      binderDto: {
        code: 202420207353,
        maxExposure: null,
        currencyCode: 268,
        currencyRate: 415.25
        // ... other binderDto properties
      },
      baseCurrencyCode: null,
      withEffectFrom: "2024-01-07",
      withEffectTo: "2025-01-06",
      prorata: "F",
      rescueServiceDto: null,
      itemDescription: "volvo 4e",
      emlBasedOn: null,
      noClaimDiscountLevel: 0,
      subclassCoverTypeDto: {
        subclassCode: 460,
        coverTypeCode: 302,
        minimumAnnualPremium: null,
        minimumPremium: null,
        coverTypeShortDescription: "COMP"
        // ... other subclassCoverTypeDto properties
      },
      enforceCovertypeMinimumPremium: "Y",
      futurePremium: null,
      commissionRate: null,
      effectiveDateWithEffectTo: null,
      endorseRemove: null,
      subclassSection: {
        code: 460
        // ... other subclassSection properties
      }
      // ... other risk properties
    }
    // ... other risks if applicable
  ],
  dateWithEffectTo: "2025-01-06",
  dateWithEffectFrom: "2024-01-07",
  underwritingYear: 2024,
  age: null,
  coinsuranceLeader: "Y",
  coinsurancePercentage: 100.0
};
const mockRiskLevelPremiumResponse = {
  riskLevelPremiums: [
    {
      code: 2024217727,
      propertyId: 'KDD 567H',
      propertyDescription: 'volvo 4e',
      premium: 100120.40939193257,
      minimumPremiumUsed: null,
      coverTypeDetails: {
        subclassCode: 460,
        coverTypeCode: 302,
        minimumAnnualPremium: null,
        minimumPremium: null,
        coverTypeShortDescription: 'COMP'
      }
    },
    {
      code: 2024217733,
      propertyId: 'XYZ 123',
      propertyDescription: 'example property',
      premium: 85000.0,
      minimumPremiumUsed: null,
      coverTypeDetails: {
        subclassCode: 460,
        coverTypeCode: 305,
        minimumAnnualPremium: null,
        minimumPremium: null,
        coverTypeShortDescription: 'OTHER'
      }
    },
    {
      code: 2024217740,
      propertyId: 'ABC 789',
      propertyDescription: 'another property',
      premium: 120000.0,
      minimumPremiumUsed: null,
      coverTypeDetails: {
        subclassCode: 460,
        coverTypeCode: 308,
        minimumAnnualPremium: null,
        minimumPremium: null,
        coverTypeShortDescription: 'ANOTHER'
      }
    }
  ]
};

describe('CoverTypesComparisonComponent', () => {
  let component: CoverTypesComparisonComponent;
  let fixture: ComponentFixture<CoverTypesComparisonComponent>;
  let quotationService: QuotationsService;
  let productService: ProductsService;
  let authService: AuthService;
  let branchService: BranchService;
  let clientService: ClientService;
  let countryService: CountryService;
  let subclassService: SubclassesService;
  let binderService: BinderService;
  let currencyService: CurrencyService;
  let subclassCoverTypesService: SubClassCoverTypesService;
  let subclassSectionCovertypeService: SubClassCoverTypesSectionsService;
  let sectionService: SectionsService;
  let premiumRateService: PremiumRateService;
  let messageService: MessageService
  let globalMessagingService: GlobalMessagingService;


  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [CoverTypesComparisonComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),

        CommonModule,
          
      ],
      providers: [
        { provide: QuotationsService, useClass: mockQuotationService },
        { provide: ProductsService, useClass: mockProductService },
        { provide: AuthService, useClass: mockAuthService },
        { provide: BranchService, useClass: mockBranchService },
        { provide: ClientService, useClass: mockClientService },
        { provide: CountryService, useClass: mockCountryService },
        { provide: SubclassesService, useClass: mockSubclassService },
        { provide: BinderService, useClass: mockBinderService },
        { provide: CurrencyService, useClass: mockCurrencyService },
        { provide: SubClassCoverTypesService, useClass: mockSubclassCovertypeService },
        { provide: SubClassCoverTypesSectionsService, useClass: mockSubclassSectionCovertypeService },
        { provide: SectionsService, useClass: mockSectionService },
        { provide: PremiumRateService, useClass: mockPremiumRateService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: MessageService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

    });
    fixture = TestBed.createComponent(CoverTypesComparisonComponent);
    component = fixture.componentInstance;

    globalMessagingService = TestBed.inject(GlobalMessagingService);
        quotationService = TestBed.inject(QuotationsService);
        productService = TestBed.inject(ProductsService);
        authService = TestBed.inject(AuthService);
        branchService = TestBed.inject(BranchService);
        clientService = TestBed.inject(ClientService);
        countryService = TestBed.inject(CountryService);
        subclassService = TestBed.inject(SubclassesService);
        binderService = TestBed.inject(BinderService);
        currencyService = TestBed.inject(CurrencyService);
        subclassCoverTypesService = TestBed.inject(SubClassCoverTypesService);
        subclassSectionCovertypeService = TestBed.inject(SubClassCoverTypesSectionsService);
        sectionService = TestBed.inject(SectionsService);
        premiumRateService = TestBed.inject(PremiumRateService);
        // component.emailForm = new FormGroup({});
        // component.riskDetailsForm = new FormGroup({});
        // component.quotationForm = new FormGroup({});
        // component.sectionDetailsForm = new FormGroup({});
        // component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
