import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTypesComparisonComponent } from './cover-types-comparison.component';
import { MessageService } from 'primeng/api';
// import { SharedModule, untilDestroyed } from '../../../../../../shared/shared.module';

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
import { Logger, SharedModule } from '../../../../../../shared/shared.module';



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
    { amount: 200, description: 'Tax 1', quotationRate: 10, rateType: 'percentage' },
    { amount: 150, description: 'Tax 2', quotationRate: 15, rateType: 'percentage' },
    { amount: 50, description: 'Tax 3', quotationRate: 5, rateType: 'percentage' }
  ]

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
const mockTemporaryPremiumList: Premiums[] =[
  {
    code: 1,
    sectionCode: 101,
    sectionShortDescription: 'Premium 1',
    sectionType: 'Type A',
    rate: 1500,
    dateWithEffectFrom: '2025-01-01',
    dateWithEffectTo: '2025-12-31',
    subClassCode: 2001,
    binderCode: 3001,
    rangeFrom: 5000,
    rangeTo: 10000,
    rateDescription: 'Basic Rate',
    divisionFactor: 1.5,
    rateType: 'Fixed',
    premiumMinimumAmount: 100,
    territoryCode: 1,
    proratedOrFull: 'Full',
    premiumEndorsementMinimumAmount: 50,
    multiplierRate: 1.1,
    multiplierDivisionFactor: 1.2,
    maximumRate: 2000,
    minimumRate: 100,
    freeLimit: 500,
    isExProtectorApplication: 'No',
    isSumInsuredLimitApplicable: 'Yes',
    sumInsuredLimitType: 'Type 1',
    sumInsuredRate: '10%',
    grpCode: 'GRP01',
    isNoClaimDiscountApplicable: 'Yes',
    currencyCode: 1,
    agentName: 'Agent A',
    rangeType: 'Range A',
    limitAmount: 10000,
    noClaimDiscountLevel: 'Level 1',
    doesCashBackApply: 'Yes',
    cashBackLevel: 5,
    rateFrequencyType: 'Annual'
  },
  {
    code: 2,
    sectionCode: 102,
    sectionShortDescription: 'Premium 2',
    sectionType: 'Type B',
    rate: 2000,
    dateWithEffectFrom: '2025-02-01',
    dateWithEffectTo: '2025-12-31',
    subClassCode: 2002,
    binderCode: 3002,
    rangeFrom: 10000,
    rangeTo: 20000,
    rateDescription: 'Premium Rate',
    divisionFactor: 1.7,
    rateType: 'Tiered',
    premiumMinimumAmount: 200,
    territoryCode: 2,
    proratedOrFull: 'Prorated',
    premiumEndorsementMinimumAmount: 100,
    multiplierRate: 1.2,
    multiplierDivisionFactor: 1.3,
    maximumRate: 2500,
    minimumRate: 150,
    freeLimit: 1000,
    isExProtectorApplication: 'Yes',
    isSumInsuredLimitApplicable: 'No',
    sumInsuredLimitType: 'Type 2',
    sumInsuredRate: '15%',
    grpCode: 'GRP02',
    isNoClaimDiscountApplicable: 'No',
    currencyCode: 2,
    agentName: 'Agent B',
    rangeType: 'Range B',
    limitAmount: 15000,
    noClaimDiscountLevel: 'Level 2',
    doesCashBackApply: 'No',
    cashBackLevel: 0,
    rateFrequencyType: 'Quarterly'
  }
]

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
    globalThis.sessionStorage = {
      getItem: jest.fn().mockReturnValue('{"someKey": "someValue"}'),  // Mocked valid JSON
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 1,
      key: jest.fn(),
    };
    TestBed.configureTestingModule({
      declarations: [CoverTypesComparisonComponent],
      imports: [
        HttpClientTestingModule,
        // SharedModule,
        // RouterTestingModule,
        // FormsModule,
        // ReactiveFormsModule,
        TranslateModule.forRoot(),

        // CommonModule,

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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  test('should open and close the modal', () => {
    // Initial value of isModalOpen should be false
    expect(component.isModalOpen).toBe(false);

    // Call the openModal method
    component.openModal();

    // After calling the openModal method, isModalOpen should be true
    expect(component.isModalOpen).toBe(true);

    // Call the closeModal method
    component.closeModal();

    // After calling the closeModal method, isModalOpen should be false
    expect(component.isModalOpen).toBe(false);
  });

  test('should pass the correct cover type description and related methods', () => {
    // Mocking necessary data
    const selectedCoverCode = 'someCode';
    const mockCoverObject = {
      coverTypeDetails: {
        coverTypeCode: selectedCoverCode,
        coverTypeDescription: 'Mocked Cover Description',
        coverTypeShortDescription: 'COMP',
      }
    };
    const mockQuickQuoteSections = [
      { coverTypeDescription: 'COMPREHENSIVE', coverTypeCode: selectedCoverCode, coverTypeShortDescription: 'COMP' },
      { coverTypeDescription: 'STANDARD', coverTypeCode: 'anotherCode', coverTypeShortDescription: 'STD' }
    ];

    // Mocking component properties
    component.riskLevelPremiums = [mockCoverObject];
    component.quickQuoteSectionList = mockQuickQuoteSections;

    // Spying on methods that should be called
    jest.spyOn(component, 'fetchClauses');
    jest.spyOn(component, 'fetchExcesses');
    jest.spyOn(component, 'fetchLimitsOfLiability');
    jest.spyOn(component, 'loadSubclassSectionCovertype');
    jest.spyOn(component, 'loadAllPremiums');

    // Call the method to test
    component.passCovertypeDesc(selectedCoverCode);

    // Expectations
    expect(component.passedCovertypeDescription).toBe('Mocked Cover Description');
    expect(component.passedCovertypeCode).toBe(selectedCoverCode);
    expect(component.passedCoverTypeShortDes).toBe('COMP');
    expect(component.filteredSection).toEqual([mockQuickQuoteSections[0]]);
    expect(component.passedSections).toEqual([mockQuickQuoteSections[0]]);

    // Check if internal methods were called
    expect(component.fetchClauses).toHaveBeenCalled();
    expect(component.fetchExcesses).toHaveBeenCalled();
    expect(component.fetchLimitsOfLiability).toHaveBeenCalled();
    expect(component.loadSubclassSectionCovertype).toHaveBeenCalled();
    expect(component.loadAllPremiums).toHaveBeenCalled();
  });
  test('should correctly calculate total payable premium', () => {
    // Mock QuotationDetails object with premium and tax information
    // const mockQuotationDetail = {
    //   premium: 1000,
    //   taxInformation: [
    //     { amount: 200 },
    //     { amount: 150 },
    //     { amount: 50 }
    //   ]
    // };

    // Call the method to test
    const result = component.calculateTotalPayablePremium(mockQuotationDetail);

    // Expected total premium (1000 + 200 + 150 + 50)
    const expectedTotal = 1000 + 200 + 150 + 50;

    // Assert that the calculated total matches the expected value
    expect(result).toBe(expectedTotal);
  });
  test('should correctly load subclass sections and process them', () => {
    // Mock the response of the subclassSectionCovertypeService
    const mockSubclassCovertypeSections = [
      { subClassCode: 'A', isMandatory: null, coverTypeCode: 'B', description: 'Section 1' },
      { subClassCode: 'A', isMandatory: null, coverTypeCode: 'C', description: 'Section 2' },
      { subClassCode: 'B', isMandatory: null, coverTypeCode: 'B', description: 'Section 3' },
    ];

    // Mock the service method
    jest.spyOn(subclassSectionCovertypeService, 'getSubclassCovertypeSections').mockReturnValue(of(mockSubclassCovertypeSections) as any);

    // Set up mock values for selectedSubclassCode and passedCovertypeCode
    component.selectedSubclassCode = 'A';
    component.passedCovertypeCode = 'B';

    // Spy on the sessionStorage.setItem and findTemporaryPremium methods
    // const setItemSpy = jest.spyOn(sessionStorage, 'setItem');
    const setItemMock = jest.fn();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: setItemMock,
      },
      writable: true,
    });
    const findTemporaryPremiumSpy = jest.spyOn(component, 'findTemporaryPremium');

    // Call the method to test
    component.loadSubclassSectionCovertype();

    // Expectations:
    // Ensure the response is processed correctly and stored in passedSections
    expect(component.subclassSectionCoverList).toEqual(mockSubclassCovertypeSections);

    // Filtered list based on selectedSubclassCode and isMandatory being null
    const filteredSections = mockSubclassCovertypeSections.filter(section =>
      section.subClassCode === component.selectedSubclassCode && section.isMandatory === null
    );
    expect(component.covertypeSectionList).toEqual(filteredSections);

    // Further filter based on passedCovertypeCode
    const specificSection = filteredSections.filter(section => section.coverTypeCode === component.passedCovertypeCode);
    expect(component.covertypeSpecificSection).toEqual(specificSection);

    // Set passedMandatorySections
    expect(component.passedMandatorySections).toEqual(specificSection);

    // Ensure the sessionStorage.setItem was called with the correct parameters
    expect(setItemMock).toHaveBeenCalledWith("Added Benefit", JSON.stringify(component.passedSections));

    // Ensure findTemporaryPremium was called
    expect(findTemporaryPremiumSpy).toHaveBeenCalled();
  });

  test('should use existing temporaryPremiumList if the coverTypeCodes match and the list is updated', () => {
    // Setup initial conditions
    component.isTempPremiumListUpdated = true;
    component.lastUpdatedCoverTypeCode = 'someCoverTypeCode';
    component.passedCovertypeCode = 'someCoverTypeCode';
    component.temporaryPremiumList = mockTemporaryPremiumList;
    // Spy on methods that should be called within findTemporaryPremium
    // Mock detectChanges method
    jest.spyOn(component.cdr, 'detectChanges');

    jest.spyOn(console, 'debug'); // Optional: for logging/debugging purposes
// Spy on the sessionStorage.setItem and findTemporaryPremium methods
    // const setItemSpy = jest.spyOn(sessionStorage, 'setItem');
    const getItemMock = jest.fn();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: getItemMock,
      },
      writable: true,
    });
    // Call the method
    component.findTemporaryPremium();

    // Expect that detectChanges is called and method exits early
    expect(component.cdr.detectChanges).toHaveBeenCalled();

    // expect(console.debug).toHaveBeenCalledWith('Premium List',mockTemporaryPremiumList);
    expect(component.temporaryPremiumList).toEqual(mockTemporaryPremiumList);
  });
  
  // test('should fetch new premiums if the coverTypeCodes do not match', () => {
  //   // Setup initial conditions
  //   component.isTempPremiumListUpdated = false;
  //   component.lastUpdatedCoverTypeCode = 'coverTypeCode1';
  //   component.passedCovertypeCode = 'coverTypeCode2';
  //   component.premiumPayload = {
  //     frequencyOfPayment: 'Annual',
  //     product: { code: 123, expiryPeriod: '12 months' },
  //     taxes: [], // Empty or provide mock tax details
  //     currency: { rate: 1.2 },
  //     risks: [
  //       {
  //         binderDto: { code: 101, currencyCode: 1, currencyRate: 1.5 },
  //         subclassSection: { code: 202 },
  //         withEffectFrom: '2025-01-01',
  //         withEffectTo: '2025-12-31',
  //         prorata: 'Full',
  //         subclassCoverTypeDto: { subclassCode: 202, coverTypeCode: 303, minimumAnnualPremium: 1000, minimumPremium: 500, coverTypeShortDescription: 'Type A', coverTypeDescription: 'Description A' },
  //         enforceCovertypeMinimumPremium: 'No',
  //         noClaimDiscountLevel: 1,
  //         limits: [
  //           {
  //             description: 'Limit 1',
  //             riskCode: 123,
  //             calculationGroup: 1,
  //             declarationSection: null,
  //             rowNumber: 1,
  //             rateDivisionFactor: 1.2,
  //             premiumRate: 10,
  //             rateType: 'Fixed',
  //             sectionType: 'Type A',
  //             limitAmount: 10000,
  //             compute: 'RateBased',
  //             section: { code: 101 },
  //             dualBasis: 'No',
  //             minimumPremium: 100,
  //             annualPremium: 1200,
  //             premiumAmount: 1100,
  //             limitPeriod: 'Yearly',
  //             indemFstPeriod: 1,
  //             indemPeriod: 12,
  //           }
  //         ]
  //       }
  //     ],
  //     dateWithEffectTo: '2025-12-31',
  //     dateWithEffectFrom: '2025-01-01',
  //     underwritingYear: 2025,
  //     age: 30,
  //     coinsuranceLeader: 'Leader A',
  //     coinsurancePercentage: 20,
  //   };
  
  //   component.passedMandatorySections = [
  //     { sectionCode: 100 },
  //     { sectionCode: 102 }
  //   ];
  
  //   // Define mockTemporaryPremiumList that matches the Premiums interface
   
  
  //   // Mock the service call response with mockTemporaryPremiumList
  //   jest.spyOn(premiumRateService, 'getAllPremiums').mockReturnValue(of(mockTemporaryPremiumList));
  //   jest.spyOn(premiumRateService, 'getAllPremiums').mockReturnValue(of(mockTemporaryPremiumList));
    
  
  //   // Spy on methods that should be called within findTemporaryPremium
  //   jest.spyOn(component.cdr, 'detectChanges');
  //   jest.spyOn(console, 'debug');
  
  //   // Call the method
  //   component.findTemporaryPremium();
  
  //   // Expectations
  //   expect(premiumRateService.getAllPremiums).toHaveBeenCalledTimes(2); // Two calls for 'section1' and 'section2'
  //   expect(premiumRateService.getAllPremiums).toHaveBeenCalledWith(100,   component.premiumPayload.risks[0].binderDto.code, component.premiumPayload.risks[0].subclassSection.code);
  //   expect(premiumRateService.getAllPremiums).toHaveBeenCalledWith(102, component.premiumPayload.risks[0].binderDto.code, component.premiumPayload.risks[0].subclassSection.code);
  //   expect(component.cdr.detectChanges).toHaveBeenCalled();

  //   expect(component.temporaryPremiumList).toEqual(mockTemporaryPremiumList); // Expect the list to match mockTemporaryPremiumList
  //   // expect(component.cdr.detectChanges).toHaveBeenCalled();
  //   // expect(console.debug).toHaveBeenCalledWith('Premium List', component.temporaryPremiumList);
  // });
  
  test('should update section, add it to passedSections, and call dependent methods', () => {
    const mockEvent = {
      target: { value: '123' },
    } as unknown as KeyboardEvent;
    const mockSection = { typedWord: null, isChecked: false };
    const initialSessionStorageSetItem = jest.spyOn(sessionStorage, 'setItem');
    jest.spyOn(component, 'loadAllPremiums');

    component.onKeyUp(mockEvent, mockSection);
 // Create a spy on the debug method of the log object
    const debugSpy = jest.spyOn(Logger.prototype, 'debug');

    // Expectations for section updates
    expect(mockSection.typedWord).toEqual(123);
    expect(mockSection.isChecked).toBe(true);

    // Expectations for passedSections
    expect(component.passedSections).toContain(mockSection);

    // Verify if sessionStorage was updated
    expect(initialSessionStorageSetItem).toHaveBeenCalledWith(
      'Added Benefit',
      JSON.stringify(component.passedSections)
    );

    // Verify if loadAllPremiums was called
    expect(component.loadAllPremiums).toHaveBeenCalled();

    // Check if log.debug was called with the expected value
    // expect(debugSpy).toHaveBeenCalledWith('Selected Sections:', component.passedSections);
  });
  test('should return true if section is checked', () => {
    const mockSection = { isChecked: true };

    const result = component.isSectionChecked(mockSection);

    expect(result).toBe(true);
  });
  test('should call log.debug and save payload to sessionStorage', () => {
    const mockPayload = { id: 1, name: 'Test Risk Section' };
    const sessionStorageSetItemSpy = jest.spyOn(sessionStorage, 'setItem');
    const debugSpy = jest.spyOn(Logger.prototype, 'debug');

    component.createRiskSection(mockPayload);

    // Verify log.debug was called with the correct arguments
    // expect(debugSpy).toHaveBeenCalledWith('createRiskSection called with payload:', mockPayload);

    // Verify the payload was saved to sessionStorage
    expect(sessionStorageSetItemSpy).toHaveBeenCalledWith(
      'Added Benefit',
      JSON.stringify(mockPayload)
    );
  });
});
