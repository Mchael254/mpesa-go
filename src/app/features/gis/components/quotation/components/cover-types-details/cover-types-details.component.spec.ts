import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverTypesDetailsComponent } from './cover-types-details.component';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from '../../../setups/services/products/products.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { BrowserStorage } from "../../../../../../shared/services/storage";
import { APP_BASE_HREF } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedModule, untilDestroyed } from '../../../../../../shared/shared.module';
import { Binders, Premiums, Products, Subclass, Subclasses, subclassCoverTypeSection } from '../../../setups/data/gisDTO';
import { RouterTestingModule } from '@angular/router/testing';

import { Limit, PremiumComputationRequest, QuotationDetails, quotationDTO } from '../../data/quotationsDTO';
import { HttpErrorResponse } from '@angular/common/http';

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

describe('CoverTypesDetailsComponent', () => {
  let component: CoverTypesDetailsComponent;
  let fixture: ComponentFixture<CoverTypesDetailsComponent>;
  let globalMessagingService: GlobalMessagingService;
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

  beforeEach(() => {
    messageService = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    TestBed.configureTestingModule({
      declarations: [CoverTypesDetailsComponent],
      imports: [HttpClientTestingModule, SharedModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: quotationService, useClass: mockQuotationService },
        { provide: productService, useClass: mockProductService },
        { provide: authService, useClass: mockAuthService },
        { provide: branchService, useClass: mockBranchService },
        { provide: clientService, useClass: mockClientService },
        { provide: countryService, useClass: mockCountryService },
        { provide: subclassService, useClass: mockSubclassService },
        { provide: binderService, useClass: mockBinderService },
        { provide: currencyService, useClass: mockCurrencyService },
        { provide: subclassCoverTypesService, useClass: mockSubclassCovertypeService },
        { provide: subclassSectionCovertypeService, useClass: mockSubclassSectionCovertypeService },
        { provide: sectionService, useClass: mockSectionService },
        { provide: premiumRateService, useClass: mockPremiumRateService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: APP_BASE_HREF, useValue: '/' },

        GlobalMessagingService, MessageService,
        FormBuilder,
        { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis/setups/api/v1' } } } }


      ]
    });
    fixture = TestBed.createComponent(CoverTypesDetailsComponent);
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
    component.emailForm = new FormGroup({});
    component.riskDetailsForm = new FormGroup({});
    component.quotationForm = new FormGroup({});
    component.sectionDetailsForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle the isCollapsibleOpen property', () => {
    // Initial value of isCollapsibleOpen should be false
    expect(component.isCollapsibleOpen).toBe(false);

    // Call the toggleCollapsible method
    component.toggleCollapsible();

    // After calling the method, isCollapsibleOpen should be true
    expect(component.isCollapsibleOpen).toBe(true);

    // Call the toggleCollapsible method again
    component.toggleCollapsible();

    // After calling the method again, isCollapsibleOpen should be false
    expect(component.isCollapsibleOpen).toBe(false);
  });
  it('should open and close the modal', () => {
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
  it('should set properties and filter sections based on cover type', () => {
    // Mock data for testing
    const data = "COMP";
    const code = 123;

    // Call the passCovertypeDesc method
    component.passCovertypeDesc(data, code);

    // Assertions based on the provided logic in the method
    expect(component.passedCovertypeDescription).toBe(data);
    expect(component.passedCovertypeCode).toBe(code);
    expect(component.passedCoverTypeShortDes).toBe(data);

    // If the passedCoverTypeShortDes is "COMP", the filteredSection should have "COMPREHENSIVE"
    if (component.passedCoverTypeShortDes === 'COMP') {
      expect(component.filteredSection).toEqual(component.quickQuoteSectionList?.filter(section =>
        section.coverTypeShortDescription === 'COMPREHENSIVE'
      ));
    } else {
      // If passedCoverTypeShortDes is not "COMP", filter based on the value
      expect(component.filteredSection).toEqual(component.quickQuoteSectionList.filter(section =>
        section.coverTypeShortDescription === component.passedCoverTypeShortDes
      ));
    }
  });
  it('should calculate total payable premium correctly', () => {
    // Call the calculateTotalPayablePremium method
    const result = component.calculateTotalPayablePremium(mockQuotationDetail);

    // Calculate the expected total premium (sum of premium and all tax amounts)
    const expectedTotalPremium = mockQuotationDetail.premium +
      (mockQuotationDetail.taxInformation ? mockQuotationDetail.taxInformation.reduce((total, tax) => total + (tax.amount || 0), 0) : 0);

    // Assert that the result matches the expected total premium
    expect(result).toBe(expectedTotalPremium);
  });
  it('should update section and add to selectedSections on keyup', () => {
    // Mock data for testing
    const section = {
      // Assuming a structure with 'typedWord' and 'isChecked' properties
      typedWord: 0,
      isChecked: false,
    };

    // Mock keyboard event using type assertion
    const mockEvent = {
      target: {
        value: '123',
      },
    } as unknown as KeyboardEvent;

    // Call the onKeyUp method
    component.onKeyUp(mockEvent, section);

    // Assertions
    expect(section.typedWord).toBe(123);
    expect(section.isChecked).toBe(true);
    expect(component.passedSections).toEqual([section]);
    expect(sessionStorage.getItem('Added Benefit')).toEqual(JSON.stringify([section]));

    // You might want to spy on the loadAllPremiums method and check if it's called
    // Example:
    // const loadAllPremiumsSpy = jest.spyOn(component, 'loadAllPremiums');
    // expect(loadAllPremiumsSpy).toHaveBeenCalled();
  });
  it('should return true if section is checked', () => {
    // Mock data for testing
    const checkedSection = { isChecked: true };
    const uncheckedSection = { isChecked: false };

    // Call the isSectionChecked method
    const checkedResult = component.isSectionChecked(checkedSection);
    const uncheckedResult = component.isSectionChecked(uncheckedSection);

    // Assertions
    expect(checkedResult).toBe(true);
    expect(uncheckedResult).toBe(false);
  });
  it('should log payload and store it in session storage', () => {
    // Mock data for testing
    const mockPayload = {

    };

    // Spy on console.log
    const consoleLogSpy = jest.spyOn(console, 'log');

    // Call the createRiskSection method
    component.createRiskSection(mockPayload);

    // Assertions
    expect(consoleLogSpy).toHaveBeenCalledWith('createRiskSection called with payload:', mockPayload);
    expect(sessionStorage.getItem('Added Benefit')).toEqual(JSON.stringify(mockPayload));
  });
  it('should load all premiums for passed sections', () => {

    const mockPassedSections = [
      { sectionCode: 789 },
      // Add more sections as needed
    ];

    // Set the mock data in the component
    component.premiumPayload = mockPremiumPayload;
    component.passedSections = mockPassedSections;

    // Mock premium data for the service call
    const mockPremiumList = [{ /* mock premium data */ }];
    // Spy on premiumRateService.getAllPremiums
    jest.spyOn(premiumRateService, 'getAllPremiums').mockReturnValue(of(mockPremiumList) as any);

    // Call the loadAllPremiums method
    component.loadAllPremiums();

    // Assertions
    expect(premiumRateService.getAllPremiums).toHaveBeenCalledTimes(mockPassedSections.length);

    // If you need to test other behaviors or states, add assertions accordingly
    // Add more assertions based on the expected behavior of loadAllPremiums
  });
  it('should load subclass section cover types', () => {
    const mockSubclassSectionCoverList = [
      { subClassCode: '123', isMandatory: 'Y', coverTypeCode: '456' /* add more properties as needed */ },
      { subClassCode: '123', isMandatory: 'N', coverTypeCode: '789' /* add more properties as needed */ },
      // Add more subclass section cover types as needed
    ];

    jest.spyOn(subclassSectionCovertypeService, 'getSubclassCovertypeSections').mockReturnValue(of(mockSubclassSectionCoverList) as any);

    // Set initial state
    component.selectedSubclassCode = '123'; // Example subclass code
    component.passedCovertypeCode = '789'; // Example passed cover type code

    // Call the method
    component.loadSubclassSectionCovertype();

    // Expectations
    expect(subclassSectionCovertypeService.getSubclassCovertypeSections).toHaveBeenCalled();
    expect(component.subclassSectionCoverList).toEqual(mockSubclassSectionCoverList);

    const notMandatorySections = mockSubclassSectionCoverList.filter(section =>
      section.subClassCode === '123' && section.isMandatory === null
    );
    expect(component.covertypeSectionList).toEqual(notMandatorySections);

    const coverTypeSpecificSections = notMandatorySections.filter(sec => sec.coverTypeCode === '789');
    expect(component.covertypeSpecificSection).toEqual(coverTypeSpecificSections);

    // Add more expectations as needed
  });
  it('should load all currencies', () => {
    const mockCurrencyList = [
      { id: 'USD', name: 'US Dollar' /* add more properties as needed */ },
      { id: 'EUR', name: 'Euro' /* add more properties as needed */ },
      // Add more currencies as needed
    ];

    jest.spyOn(currencyService, 'getAllCurrencies').mockReturnValue(of(mockCurrencyList));

    // Set initial state
    component.currencyCode = 'USD'; // Example currency code

    // Call the method
    component.loadAllCurrencies();

    // Expectations
    expect(currencyService.getAllCurrencies).toHaveBeenCalled();
    expect(component.currencyList).toEqual(mockCurrencyList);

    const selectedCurrency = mockCurrencyList.find(currency => currency.id === 'USD');
    expect(component.selectedCurrency).toEqual(selectedCurrency?.name);

    expect(component.selectedCurrencyCode).toEqual('USD'); // Assuming 'USD' is the initial value

    // Add more expectations as needed
  });
  it('should set riskLevelPremium in sessionStorage and update selectedQuotationNo', () => {
    // Arrange
    const data = { /* your test data here */ };

    // Act
    component.selectedRiskLevelPremium(data);

    // Assert
    // expect(loggerService.info).toHaveBeenCalledWith('RiskLevelPremium::::::', data);

    const storedData = JSON.parse(sessionStorage.getItem('riskLevelPremium') || '');
    expect(storedData).toEqual(data);

    expect(component.selectedQuotationNo).toEqual(component.quotationNo);
  });
  it('should navigate to quote-summary when passedQuotationNumber is null and quotationData is not empty', () => {
    // Arrange
    component.passedQuotationNumber = null;
    component.quotationData = { _embedded: [/* your test data here */] };
    component.quotationNo = '223'; // Ensure quotationNo is a string
    component.quotationCode = 456; // Replace with a valid quotation code as a number

    // Set session storage values directly before the test
    sessionStorage.setItem('quotationNumber', '"223"');
    sessionStorage.setItem('quickQuotationNum', '223');
    sessionStorage.setItem('quickQuotationCode', '456');

    // Act
    component.SelectCover();

    // Assert
    expect(sessionStorage.getItem('quotationNumber')).toEqual('"223"');
    expect(sessionStorage.getItem('quickQuotationNum')).toEqual('223');
    expect(sessionStorage.getItem('quickQuotationCode')).toEqual('456');
    // expect(router.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quote-summary']);
  });
  it('should call createQuotation and getQuotationNumber when passedQuotationNumber is null and quotationData is empty', () => {
    // Arrange
    component.passedQuotationNumber = null;
    component.quotationData = { _embedded: [] };

    // Mock createQuotation and getQuotationNumber methods
    component.createQuotation = jest.fn();
    component.getQuotationNumber = jest.fn();

    // Act
    component.SelectCover();

    // Assert
    expect(component.createQuotation).toHaveBeenCalled();
    expect(component.getQuotationNumber).toHaveBeenCalled();
  });
  it('should navigate to quote-summary when passedQuotationNumber is not null', () => {
    // Arrange
    component.passedQuotationNumber = 123; // Replace with a valid quotation number

    // Act
    component.SelectCover();

    // Assert
    expect(sessionStorage.getItem('quotationNumber')).toEqual("123");
    // expect(router.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quote-summary']);
  });
  it('should handle quotation number generation with a timeout', async () => {
    // Arrange
    jest.useFakeTimers(); // Use Jest's fake timers to control time

    // Act
    const promise = component.getQuotationNumber();

    // Move the timer ahead by 2000 milliseconds
    jest.advanceTimersByTime(2000);

    // Await the promise
    await promise;

    // Assert
    // Add your assertions here based on the expected behavior after the timeout

    jest.useRealTimers(); // Restore real timers to avoid interference with other tests
  });
  it('should call callQuotationUtilsService when computeQuotePremium is called', async () => {
    // Arrange
    const spyOnCallQuotationUtilsService = jest.spyOn(component, 'callQuotationUtilsService');

    // Set up the mock response for quotationUtils (modify as needed)
    const mockResponse = { /* Your mock response data here */ };
    jest.spyOn(quotationService, 'quotationUtils').mockReturnValueOnce(of(mockResponse));

    // Act
    await component.computeQuotePremium();

    // Assert
    expect(spyOnCallQuotationUtilsService).toHaveBeenCalled();
    // Add more assertions based on the expected behavior of your method
  });
  it('should extract unique section codes from risks with limits', () => {
    // Arrange
    const risks = [
      {
        limits: [
          { section: { code: 1 } },
          { section: { code: 2 } },
        ],
      },
      {
        limits: [
          { section: { code: 3 } },
        ],
      },
      {
        // No limits
      },
    ];

    // Act
    component.extractSectionCodes(risks);

    // Assert
    expect(component.sectionCodesArray).toEqual([1, 2, 3]);
  });

  // it('should send email and display success message on success', fakeAsync(async () => {
  //   // Arrange
  //   const mockResponse = {};
  //   jest.spyOn(quotationService, 'sendEmail').mockReturnValueOnce(of(mockResponse));

  //   // Act
  //   await component.emaildetails();
  //   tick(); // Advance the fake timer to allow asynchronous operations to complete

  //   // Assert
  //   expect(quotationService.sendEmail).toHaveBeenCalled();
  //   expect(globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Email sent successfully');
  // }));
  // it('should handle error and display error message on failure', async () => {
  //   // Arrange
  //   const mockError = new HttpErrorResponse({ status: 500 });
  //   quotationService.sendEmail = jest.fn(() => throwError(mockError));

  //   // Act
  //   await component.emaildetails();

  //   // Assert
  //   expect(quotationService.sendEmail).toHaveBeenCalled();
  //   expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Error, try again later');
  // });


  // it('should create risk section and handle success', () => {

  //   component.passedSections = [
  //     { code: 'Code1', sectionShortDescription: 'Section 1' },
  //     { code: 'Code2', sectionShortDescription: 'Section 2' },
  //   ];

  //   component.premiumList = mockPremiumRates;
  //   component.riskCode = 'mockRiskCode';
  //   component.sumInsuredValue = 1000;

  //   jest.spyOn(quotationService, 'createRiskSection').mockReturnValue(of({}));

  //   // Act
  //   component.onCreateRiskSection();

  //   // Assert
  //   expect(quotationService.createRiskSection).toHaveBeenCalledWith(
  //     'mockRiskCode',
  //     [
  //       {
  //         calcGroup: 1,
  //         code: 1, // Change to number
  //         compute: 'Y',
  //         description: 'Mock Description 1',
  //         freeLimit: 0,
  //         multiplierDivisionFactor: 1,
  //         multiplierRate: 1,
  //         premiumAmount: 0,
  //         premiumRate: 1,
  //         rateDivisionFactor: 1,
  //         rateType: 'MockRateType1',
  //         rowNumber: 1,
  //         sumInsuredLimitType: 'MockLimitType1',
  //         sumInsuredRate: 0,
  //         sectionShortDescription: 'Mock Section 1',
  //         sectionCode: 101, // Change to number
  //         limitAmount: 1000,
  //         quotRiskCode: 23456,
  //         sectionType: 'MockSectionType1',
  //       },
  //       {
  //         calcGroup: 1,
  //         code: 2, // Change to number
  //         compute: 'Y',
  //         description: 'Mock Description 2',
  //         freeLimit: 0,
  //         multiplierDivisionFactor: 2,
  //         multiplierRate: 2,
  //         premiumAmount: 0,
  //         premiumRate: 2,
  //         rateDivisionFactor: 2,
  //         rateType: 'MockRateType2',
  //         rowNumber: 2,
  //         sumInsuredLimitType: 'MockLimitType2',
  //         sumInsuredRate: 0,
  //         sectionShortDescription: 'Mock Section 2',
  //         sectionCode: 102, // Change to number
  //         limitAmount: 2000,
  //         quotRiskCode: 567899,
  //         sectionType: 'MockSectionType2',
  //       },
  //       // Add more if needed
  //     ]
  //   );

  //   // You can also add more assertions based on your component's behavior
  // });
  it('should navigate to quote-summary if passedQuotationNumber is null and quotationData is not empty', () => {
    // Arrange
    component.passedQuotationNumber = null;
    component.quotationData = { _embedded: [{ /* your test data here */ }] };
    component.quotationNo = '123';

    // Act
    component.SelectCover();

    // Assert
    expect(sessionStorage.getItem('quotationNumber')).toBe(JSON.stringify(component.quotationNo));
    expect(sessionStorage.getItem('quickQuotationNum')).toBe(component.quotationNo);
    // Check if component.quotationCode is defined before using it in the assertion
    if (component.quotationCode) {
      expect(sessionStorage.getItem('quickQuotationCode')).toBe(component.quotationCode);
    } else {
      console.warn("quotationCode is undefined in this test case.");
    }
    // expect(component.router.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quote-summary']);
  });
  it('should update computation details and log the updated data on successful service call', () => {
    // Arrange
    component.passedQuotationCode = null;
    component.quotationCode = 'yourQuotationCode';

    // Mocking the quotationUtils function
    jest.spyOn(component.quotationService, 'quotationUtils').mockReturnValue(of(mockUtilServiceResponse));
    jest.spyOn(component, 'computePremiumQuickQuote');

    // Act
    component.callQuotationUtilsService();

    // Assert
    expect(component.computationDetails).toEqual(mockUtilServiceResponse);
    expect(component.computationDetails.underwritingYear).toBe(new Date().getFullYear());

    component.computationDetails.risks?.forEach((risk: any) => {
      expect(risk.prorata).toBe('F');
      risk.limits.forEach((limit: any) => {
        expect(limit.multiplierDivisionFactor).toBe(1);
      });
    });

    expect(component.computePremiumQuickQuote).toHaveBeenCalled();
    // expect(component.log.debug).toHaveBeenCalledWith("Updated computational details", component.computationDetails);
  });
  it('should display error message on service call failure', () => {
    // Arrange
    // Mocking the quotationUtils function to return an error
    jest.spyOn(component.quotationService, 'quotationUtils').mockReturnValue(throwError('Error'));
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');

    // Act
    component.callQuotationUtilsService();

    // Assert
    // expect(component.log.info).toHaveBeenCalled();
    expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error', 'Error, you cannot compute premium, check quotation details and try again.'
    );
  });
  it('should compute premium and update data on successful service call', async () => {
   
    component.riskLevelPremiums = []; // Ensure initialization as an array
    jest.spyOn(component.quotationService, 'premiumComputationEngine').mockReturnValue(of(mockRiskLevelPremiumResponse));
    jest.spyOn(component.globalMessagingService, 'displaySuccessMessage');
  
    // Act
    await component.computePremiumQuickQuote();
  
    // Assert
    // Ensure that global messaging service is called with expected parameters
    expect(component.globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Premium successfully computed');
  
    // Check if the logic to update riskLevelPremiums is correct
    // expect(component.log.debug).toHaveBeenCalledWith('Updated Risk Level Premium:', expect.any(Array));
  
    // Ensure that component.riskLevelPremiums is defined before attempting to loop through it
    if (component.riskLevelPremiums && Array.isArray(mockRiskLevelPremiumResponse.riskLevelPremiums)) {
      for (let i = 0; i < component.riskLevelPremiums.length; i++) {
        const coverTypeFirstPayload = component.riskLevelPremiums[i].coverTypeDetails;
        const matchingCoverTypeSecondPayload = mockRiskLevelPremiumResponse.riskLevelPremiums.find(
          (coverTypeSecondPayload) => coverTypeSecondPayload.coverTypeDetails.coverTypeCode === coverTypeFirstPayload.coverTypeCode
        );
  
        if (matchingCoverTypeSecondPayload) {
          // Ensure that the data in the first payload is replaced
          expect(component.riskLevelPremiums[i]).toEqual(matchingCoverTypeSecondPayload);
        }
      }
    } else {
      throw new Error('component.riskLevelPremiums or mockResponse.riskLevelPremiums is not as expected');
    }
  
    // Check if the logic to update premiumPayload is correct
    // expect(component.log.debug).toHaveBeenCalledWith('COVERTYPE TO REPLACE', expect.any(Array));
    // expect(component.log.debug).toHaveBeenCalledWith('UPDATED PREMIUM PAYLOAD', expect.any(Object));
  
    // Additional assertions based on your specific logic
  
    // NEW ASSERTIONS FOR THE SPECIFIC LOGIC
    for (let i = 0; i < component.riskLevelPremiums.length; i++) {
      const coverTypeFirstPayload = component.riskLevelPremiums[i].coverTypeDetails;
      const matchingCoverTypeSecondPayload = mockRiskLevelPremiumResponse.riskLevelPremiums.find(
        (coverTypeSecondPayload) => coverTypeSecondPayload.coverTypeDetails.coverTypeCode === coverTypeFirstPayload.coverTypeCode
      );
  
      if (matchingCoverTypeSecondPayload) {
        // Ensure that the data in the first payload is replaced
        expect(component.riskLevelPremiums[i]).toEqual(matchingCoverTypeSecondPayload);
      }
    }
  });
  
  it('should handle error and display error message on service call failure', () => {
    // Arrange
    jest.spyOn(component.quotationService, 'premiumComputationEngine').mockReturnValue(throwError(new HttpErrorResponse({})));
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');

    // Act
    component.computePremiumQuickQuote();

    // Assert
    // expect(component.log.info).toHaveBeenCalled();
    expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Error, try again later');
  });

 
  it('should create risk section successfully', async () => {
    // Mock data
    const premiumRates = [
      // ... mock premium rates data
    ];

    const passedSections = [
      // ... mock passed sections data
    ];

    component.passedSections = passedSections;
    component.premiumList = premiumRates;
    component.sumInsuredValue = 1000; // Set a sample value for sumInsuredValue

    // Mock the response from the createRiskSection API call
    const mockApiResponse = {}; // You can customize this based on your API response structure
    (quotationService.createRiskSection as jest.Mock).mockReturnValueOnce(of(mockApiResponse));

    // Call the method
    await component.onCreateRiskSection();

    // Assert that the necessary methods were called
    expect(quotationService.createRiskSection).toHaveBeenCalledWith(
      component.riskCode,
      passedSections.map((section, index) => expect.objectContaining([
        { 
          calcGroup: 1,
          code: 1, // Change to number
          compute: 'Y',
          description: 'Mock Description 1',
          freeLimit: 0,
          multiplierDivisionFactor: 1,
          multiplierRate: 1,
          premiumAmount: 0,
          premiumRate: 1,
          rateDivisionFactor: 1,
          rateType: 'MockRateType1',
          rowNumber: 1,
          sumInsuredLimitType: 'MockLimitType1',
          sumInsuredRate: 0,
          sectionShortDescription: 'Mock Section 1',
          sectionCode: 101, // Change to number
          limitAmount: 1000,
          quotRiskCode: 23456,
          sectionType: 'MockSectionType1',
        }      ])
    );

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Section Created',
    });

    // Add more assertions as needed based on the behavior of your method
  });





});
