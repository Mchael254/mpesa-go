import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { QuickQuoteFormComponent } from './quick-quote-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BrowserStorage } from "../../../../../../shared/services/storage";
import { APP_BASE_HREF, CommonModule, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { SharedModule, untilDestroyed } from '../../../../../../shared/shared.module';
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
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { Premiums, Products, Subclass, subclassCoverTypeSection, Subclasses } from '../../../setups/data/gisDTO';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { Limit } from '../../data/quotationsDTO';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { Logger } from '../../../../../../shared/services';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';


class MockNgxSpinnerService {
  show = jest.fn();
  hide = jest.fn();
}
export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}
export class MockBrowserStorage {
  getItem = jest.fn();
  setItem = jest.fn();
}
export class mockQuotationService {
  getAllQuotationSources = jest.fn().mockReturnValue(of());
  getFormFields = jest.fn().mockReturnValue(of());
  createQuotationRisk = jest.fn().mockReturnValue(of());
  premiumComputationEngine = jest.fn().mockReturnValue(of());
  getRegexPatterns = jest.fn().mockReturnValue(of());
  createRiskSection = jest.fn().mockReturnValue(of());
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
// jest.mock('ng2-pdf-viewer', () => ({
//   PdfViewerModule: jest.fn().mockImplementation(() => {}),
// }));
jest.mock('ng2-pdf-viewer', () => ({
  PdfViewerComponent: jest.fn(),
}));
const mockProducts: Products[] = [
  {
    code: 1,
    shortDescription: 'Mock Short Description 1',
    description: 'Mock Description 1',
    productGroupCode: 123,
    withEffectFrom: 20220101,
    withEffectTo: 20221231,
    doesCashBackApply: 'Yes',
    policyPrefix: 'POL',
    claimPrefix: 456,
    underwritingScreenCode: 'ABC',
    claimScreenCode: 789,
    expires: 'Y',
    minimumSubClasses: 1,
    acceptsMultipleClasses: 0,
    minimumPremium: 1000,
    isRenewable: 'Yes',
    allowAccommodation: 'No',
    openCover: 'Yes',
    productReportGroupsCode: 101,
    policyWordDocument: 201,
    shortName: 'Mock Product 1',
    endorsementMinimumPremium: 500,
    showSumInsured: 'Yes',
    showFAP: 'No',
    policyCodePages: 5,
    policyDocumentPages: 10,
    isPolicyNumberEditable: 'Yes',
    policyAccumulationLimit: 100000,
    insuredAccumulationLimit: 50000,
    totalCompanyAccumulationLimit: 200000,
    enableSpareParts: 'Yes',
    prerequisiteProductCode: 999,
    allowMotorClass: 'Yes',
    allowSameDayRenewal: 'No',
    acceptUniqueRisks: 2,
    industryCode: 333,
    webDetails: 404,
    showOnWebPortal: 'Yes',
    areInstallmentAllowed: 'Yes',
    interfaceType: 'Web',
    isMarine: 0,
    allowOpenPolicy: 'Yes',
    order: 1,
    isDefault: 'No',
    prorataType: 'Daily',
    doFullRemittance: 1,
    productType: 1,
    checkSchedule: 1,
    scheduleOrder: 1,
    isPinRequired: 'No',
    maximumExtensions: 3,
    autoGenerateCoverNote: 'Yes',
    commissionRate: 10,
    autoPostReinsurance: 'Yes',
    insuranceType: 'General',
    years: 1,
    enableWeb: 1,
    doesEscalationReductionApply: 1,
    isLoanApplicable: 1,
    isAssignmentAllowed: 1,
    minimumAge: 18,
    maximumAge: 65,
    minimumTerm: 1,
    maximumTerm: 10,
    termDistribution: 50,
    organizationCode: 999,
  },
];
const mockBranchList: OrganizationBranchDto[] = [
  {
    account: '123456',
    contact: 'John Doe',
    country: 1,
    emailAddress: 'john.doe@example.com',
    emailSource: 'internal',
    fax: '987654',
    id: 1,
    logo: 'path/to/logo.png',
    manager: 2,
    name: 'Branch 1',
    organizationId: 3,
    physicalAddress: '123 Main St',
    postAddress: 'PO Box 456',
    postalCode: '789012',
    region: {
      agentSeqNo: '001',
      branchMgrSeqNo: '002',
      clientSequence: 1,
      code: 1,
      computeOverOwnBusiness: 'yes',
      dateFrom: '2022-01-01',
      dateTo: '2022-12-31',
      managerAllowed: 'yes',
      name: 'Region 1',
      organization: 'Org 1',
      overrideCommissionEarned: 'no',
      policySeqNo: 123,
      postingLevel: 'high',
      preContractAgentSeqNo: 456,
      shortDescription: 'Region 1 Short',
    },
    shortDescription: 'Branch 1 Short',
    sms_source: 'external',
    state: 2,
    telephoneNumber: '555-1234',
    town: 3,
  },
];
const mockClientList: ClientDTO = {
  branchCode: 1,
  category: 'Individual',
  clientTitle: 'Mr.',
  clientType: {
    category: 'Person',
    clientTypeName: 'Regular',
    code: 1,
    description: 'Regular Client',
    organizationId: 1,
    person: 'Natural Person',
    type: 'Individual',
  },
  country: 2,
  createdBy: 'admin',
  dateOfBirth: '1990-01-01',
  emailAddress: 'john.doe@example.com',
  firstName: 'John',
  gender: 'Male',
  id: 123,
  idNumber: '1234567890',
  lastName: 'Doe',
  modeOfIdentity: 'ID Card',
  occupation: {
    id: 1,
    name: 'Engineer',
    sector_id: 3,
    short_description: 'Engineering',
  },
  passportNumber: 'AB123456',
  phoneNumber: '555-1234',
  physicalAddress: '123 Main St',
  pinNumber: '9876',
  shortDescription: 'Client 1',
  status: 'Active',
  withEffectFromDate: '2022-01-01',
  clientTypeName: 'Type A',
  clientFullName: 'Mr. John Doe',
  mobileNumber: '',
  state: '',
  town: ''
};

// const mockPagination: Pagination<ClientDTO[]> = {
//   content: mockClientList,
//   // ... other properties ...
// };
const mockCountryList: CountryDto[] = [
  {
    adminRegMandatory: 'Yes',
    adminRegType: 'Type A',
    currSerial: 1,
    currency: {
      createdBy: 'admin',
      createdDate: '2022-01-01',
      decimalWord: 'Cent',
      id: 1,
      modifiedBy: 'admin',
      modifiedDate: '2022-01-01',
      name: 'US Dollar',
      numberWord: 'Dollar',
      roundingOff: 2,
      symbol: '$',
    },
    drugTraffickingStatus: 'Legal',
    drugWefDate: '2022-01-01',
    drugWetDate: '2022-12-31',
    highRiskWefDate: '2022-01-01',
    highRiskWetDate: '2022-12-31',
    id: 1,
    isShengen: 'Yes',
    mobilePrefix: 1,
    name: 'United States',
    nationality: 'American',
    risklevel: 'Low',
    short_description: 'USA',
    subAdministrativeUnit: 'State',
    telephoneMaximumLength: 10,
    telephoneMinimumLength: 7,
    unSanctionWefDate: '2022-01-01',
    unSanctionWetDate: '2022-12-31',
    unSanctioned: 'No',
    zipCode: 12345,
    zipCodeString: '12345',
  },
];
const mockSubclassList: Subclass[] = [
  // Provide a sample array of Subclass objects for testing
  {
    code: 1,
    sub_class_code: 101,
    is_mandatory: 'Yes',
    policy_document_order_number: 1,
    product_group_code: 1,
    product_code: 1,
    productShortDescription: 'Subclass 101',
    underwriting_screen_code: 'Screen Code 101',
    date_with_effect_from: '2022-01-01',
    date_with_effect_to: '2023-01-01',
    version: 1,
  }
];

const allSubclassList: Subclasses[] = [
  {
    accomodation: 'Accommodation 101',
    allowsDeclaration: 'Yes',
    bondSubclass: 'Bond 101',
    certificatePrefix: 'Prefix 101',
    claimGracePeriod: 'Grace Period 101',
    claimPrefix: 'Claim Prefix 101',
    claimReviewDays: 'Review Days 101',
    claimScreenCode: 'Claim Screen Code 101',
    classCode: 'Class Code 101',
    code: 101,
    declarationPenaltyPercentage: 'Penalty Percentage 101',
    description: 'Description 101',
    doesDisabilityScaleApply: 'Yes',
    doesLoanApply: 'No',
    doesReinsurancePoolApply: 'Yes',
    doesTerritoryApply: 'No',
    enableSchedule: 'Yes',
    expiryPeriod: 'Expiry Period 101',
    freeCoverLimit: 'Cover Limit 101',
    generateCertificateAutomatically: 'Yes',
    glAccountGroupCode: 'GL Code 101',
    isConveyanceTypeRequired: 'No',
    isExcessOfLossApplicable: 'Yes',
    isMandatory: 'Yes',
    isQuakeRegionRequired: 'No',
    isRenewable: 'Yes',
    isRescueMandatory: 'Yes',
    isRiskAddressRequired: 'No',
    isRiskClassMandatory: 'Yes',
    isStraightFlowEnabled: 'Yes',
    isSurveyValuationRequired: 'No',
    maxDeclarationPercentage: 'Max Percentage 101',
    maxInsuredAccumulationLimit: 'Max Accumulation Limit 101',
    maxNoClaimDiscountLevel: 'Max Discount Level 101',
    maxPolicyAccumulationLimit: 'Max Policy Limit 101',
    noCertificate: 'No Certificate 101',
    noRiSi: 'No Ri Si 101',
    organizationCode: 'Org Code 101',
    overrideReq: 'Override Req 101',
    policyPrefix: 'Policy Prefix 101',
    prereqSubclassCode: 'Prereq Code 101',
    reinsureWotRiProg: 'Reinsure Wot Ri Prog 101',
    reportParameter: 'Report Parameter 101',
    riskDummy: 'Risk Dummy 101',
    riskExpireTotalLoss: 'Expire Total Loss 101',
    riskIdFormat: 'ID Format 101',
    screenCode: 'Screen Code 101',
    shortDescription: 'Short Description 101',
    showButcharge: 'Show Butcharge 101',
    showNoClaimDiscount: 'Show No Claim Discount 101',
    subClassId: 'Subclass ID 101',
    surveyLimitAccumulation: 'Survey Limit Accumulation 101',
    totalCompanyAccumulationLimit: 'Total Accumulation Limit 101',
    underwritingScreenCode: 'Underwriting Screen Code 101',
    uniqueRisk: 'Unique Risk 101',
    useCoverPeriodRate: 'Yes',
    webSubclassDetails: 'Web Subclass Details 101',
    withEffectFrom: '2022-01-01',
    withEffectTo: '2023-01-01',
    // ... other properties ...
  },
];
const mockSection = {
  code: 123,
  shortDescription: 'Short Description',
  description: 'Description',
  classCode: null,
  type: 'Type',
  excessDetails: null,
  section: null,
  webDescription: 'Web Description',
  dtlDescription: null,
  organizationCode: 456,
};
const mockLimits: Limit[] = [
  {
    description: 'Property Damage Limit',
    riskCode: 123,
    calculationGroup: 1,
    declarationSection: null,
    rowNumber: 1,
    rateDivisionFactor: 1.5,
    premiumRate: 0.75,
    rateType: 'Percentage',
    sectionType: 'Liability',
    limitAmount: 100000,
    compute: 'Simple',
    section: {
      code: 12,
    },
    dualBasis: 'Not Applicable',
    minimumPremium: 50,
    annualPremium: 200,
    premiumAmount: 75,
  },
  {
    description: 'Bodily Injury Limit',
    riskCode: 123,
    calculationGroup: 1,
    declarationSection: null,
    rowNumber: 2,
    rateDivisionFactor: 1.2,
    premiumRate: 0.6,
    rateType: 'Percentage',
    sectionType: 'Liability',
    limitAmount: 50000,
    compute: 'Simple',
    section: {
      code: 123,
    },
    dualBasis: 'Not Applicable',
    minimumPremium: 30,
    annualPremium: 120,
    premiumAmount: 60,
  },
  // Add more limit objects as needed
];
const mockMandatorySections: subclassCoverTypeSection[] = [
  {
    code: 1,
    coverTypeCode: 101,
    coverTypeShortDescription: 'Collision Coverage',
    isMandatory: 'Yes',
    order: 1,
    organizationCode: 1,
    sectionCode: 201,
    sectionShortDescription: 'Collision Damage',
    subClassCode: 301,
    subClassCoverTypeCode: 401,
  },
  {
    code: 2,
    coverTypeCode: 102,
    coverTypeShortDescription: 'Comprehensive Coverage',
    isMandatory: 'Yes',
    order: 2,
    organizationCode: 1,
    sectionCode: 202,
    sectionShortDescription: 'Comprehensive Damage',
    subClassCode: 302,
    subClassCoverTypeCode: 402,
  },
  // Add more mock data as needed
];
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
  },
  {
    code: 2,
    sectionCode: 102,
    sectionShortDescription: 'Comprehensive Damage',
    sectionType: 'Damage',
    rate: 0.6,
    dateWithEffectFrom: '2024-01-01',
    dateWithEffectTo: '2024-12-31',
    subClassCode: 302,
    binderCode: 402,
    rangeFrom: 0,
    rangeTo: 100000,
    rateDescription: 'Standard Rate',
    divisionFactor: 1.2,
    rateType: 'Percentage',
    premiumMinimumAmount: 30,
    territoryCode: 502,
    proratedOrFull: 'Prorated',
    premiumEndorsementMinimumAmount: 15,
    multiplierRate: 1.1,
    multiplierDivisionFactor: 1.1,
    maximumRate: 1.4,
    minimumRate: 0.4,
    freeLimit: 800,
    isExProtectorApplication: 'No',
    isSumInsuredLimitApplicable: 'Yes',
    sumInsuredLimitType: 'Fixed',
    sumInsuredRate: '0.15',
    grpCode: 'GRP002',
    isNoClaimDiscountApplicable: 'Yes',
    currencyCode: 602,
    agentName: 'Jane Doe',
    rangeType: 'Fixed',
    limitAmount: 100000,
    noClaimDiscountLevel: 'Level 2',
    doesCashBackApply: 'No',
    cashBackLevel: 0,
    rateFrequencyType: 'Monthly',
  },
  // Add more mock data as needed
];
const mockAdditionalLimits: subclassCoverTypeSection[] = [];




// const logSpy = jest.spyOn(console, 'debug').mockImplementation();
// const infoSpy = jest.spyOn(console, 'info').mockImplementation();
// // const sessionStorageMock = jest.fn();

describe('QuickQuoteFormComponent', () => {
  let component: QuickQuoteFormComponent;
  let fixture: ComponentFixture<QuickQuoteFormComponent>;
  // let crm_client_service: ClientService;
  let spinner_service: NgxSpinnerService;
  let router: Router;
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




  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickQuoteFormComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        // RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule,
        // SharedModule,
        // CommonModule
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
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: MessageService },
        { provide: DatePipe },








      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });


    fixture = TestBed.createComponent(QuickQuoteFormComponent);
    component = fixture.componentInstance;
    // crm_client_service = TestBed.inject(ClientService);
    spinner_service = TestBed.inject(NgxSpinnerService);
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
    // component.personalDetailsForm = new FormGroup({});

    // component.clientForm = new FormGroup({});
    // component.fb = TestBed.inject(FormBuilder);
    // router = TestBed.inject(Router);
    // component.personalDetailsForm = new FormGroup({});
    // component.clientForm = new FormGroup({});
    // // Spy on patchValue to track its calls
    // jest.spyOn(component.personalDetailsForm, 'patchValue');

    fixture.detectChanges();

  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load all products and modify the description', () => {
    // Mock the getAllProducts method using jest.spyOn
    jest.spyOn(productService, 'getAllProducts').mockReturnValue(of(mockProducts));

    // Mock detectChanges method
    jest.spyOn(component.cdr, 'detectChanges');

    component.loadAllproducts();

    // Ensure that the productList is set correctly
    expect(component.productList).toEqual(mockProducts);

    // // Ensure that the log service is called with the correct parameters
    // expect(logServiceMock.info).toHaveBeenCalledWith(mockProducts, 'this is a product list');

    // Ensure that the ProductDescriptionArray is populated correctly
    const expectedDescriptionArray = mockProducts.map(product => ({
      code: product.code,
      description: product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase(),
    }));
    expect(component.ProductDescriptionArray).toEqual(expectedDescriptionArray);

    // Ensure that detectChanges is called
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should reset client data', () => {
    // Set initial values
    component.clientName = 'John Doe';
    component.clientEmail = 'john@example.com';
    component.clientPhone = '123-456-7890';
    component.filteredCountry = 'USA';

    // Call the method to reset client data
    component.resetClientData();

    // Verify that the properties are reset to their expected values
    expect(component.clientName).toEqual('');
    expect(component.clientEmail).toEqual('');
    expect(component.clientPhone).toEqual('');
    expect(component.filteredCountry).toEqual('');
  });
  it('should toggle the button', () => {
    // Initial state
    expect(component.newClient).toBeFalsy(); // Assuming initially it's false


    // Verify that the property is toggled
    expect(component.newClient).toBeTruthy();
  });
  it('should toggle to a new client', fakeAsync(() => {
    // Mock resetClientData method
    jest.spyOn(component, 'resetClientData').mockImplementation(() => { });

    // Set initial state
    component.newClient = true;
    component.clientName = 'John Doe';

    // Call the method to toggle to a new client
    component.toggleNewClient(); // This should reset the client data

    // Use tick() to simulate async passage of time if there are async tasks
    tick();

    // Ensure change detection has been triggered after async tasks are completed
    fixture.detectChanges();

    // Wait for all asynchronous tasks to complete
    fixture.whenStable().then(() => {
      // Log the value of clientName to debug the state
      console.log('clientName:', component.clientName); // Ensure it's now an empty string

      // Check the component state and assertions
      expect(component.newClient).toBeFalsy();
      expect(component.clientName).toEqual(''); // Assert that clientName is reset
      expect(component.resetClientData).toHaveBeenCalled(); // Ensure resetClientData was called
    });
  }));



  it('should get and set the branch list', () => {
    // Create a spy for branchService.getAllBranches
    jest.spyOn(branchService, 'getAllBranches').mockReturnValue(of(mockBranchList));

    // Create a spy for untilDestroyed
    // jest.spyOn(untilDestroyed, 'untilDestroyed').mockReturnValue(() => () => {});

    // Call the method to get the branch list
    component.fetchBranches();

    // Ensure that the branchService.getAllBranches method is called
    expect(branchService.getAllBranches).toHaveBeenCalled();

    // Ensure that the branchList is set correctly based on the mocked data
    expect(component.branchList).toEqual(mockBranchList);

    // You can add more assertions based on your specific implementation
  });
  it('should load and set the country list', () => {
    // Mock the getCountries method using jest.spyOn
    jest.spyOn(countryService, 'getCountries').mockReturnValue(of(mockCountryList));

    // Call the method to load the country list
    component.getCountries();

    // Ensure that the countryService.getCountries method is called
    expect(countryService.getCountries).toHaveBeenCalled();

    // Ensure that the countryList is set correctly based on the mocked data
    expect(component.countryList).toEqual(mockCountryList);

    // Mock the selectedCountry for testing purposes
    component.selectedCountry = 1;

    // Call the method to filter the country and set mobilePrefix
    component.getCountries();

    // Ensure that the filteredCountry and mobilePrefix are set correctly based on the mocked data and selectedCountry
    expect(component.filteredCountry).toEqual(mockCountryList.filter(country => country.id === component.selectedCountry));
    expect(component.mobilePrefix).toEqual(component.filteredCountry[0].zipCodeString);

    // You can add more assertions based on the expected behavior of your method
  });
  it('should create the client form', () => {
    expect(component.clientForm).toBeInstanceOf(FormGroup);
    expect(component.clientForm.controls['accountId']).toBeDefined();
    expect(component.clientForm.controls['branchCode']).toBeDefined();
    expect(component.clientForm.controls['category']).toBeDefined();
    expect(component.clientForm.controls['clientTitle']).toBeDefined();
    expect(component.clientForm.controls['clientTitleId']).toBeDefined();
    expect(component.clientForm.controls['clientTypeId']).toBeDefined();
    expect(component.clientForm.controls['country']).toBeDefined();
    expect(component.clientForm.controls['createdBy']).toBeDefined();
    expect(component.clientForm.controls['dateOfBirth']).toBeDefined();
    expect(component.clientForm.controls['emailAddress']).toBeDefined();
    expect(component.clientForm.controls['firstName']).toBeDefined();
    expect(component.clientForm.controls['gender']).toBeDefined();
    expect(component.clientForm.controls['id']).toBeDefined();
    expect(component.clientForm.controls['idNumber']).toBeDefined();
    expect(component.clientForm.controls['lastName']).toBeDefined();
    expect(component.clientForm.controls['modeOfIdentity']).toBeDefined();
    expect(component.clientForm.controls['occupationId']).toBeDefined();
    expect(component.clientForm.controls['passportNumber']).toBeDefined();
    expect(component.clientForm.controls['phoneNumber']).toBeDefined();
    expect(component.clientForm.controls['physicalAddress']).toBeDefined();
    expect(component.clientForm.controls['pinNumber']).toBeDefined();
    expect(component.clientForm.controls['shortDescription']).toBeDefined();
    expect(component.clientForm.controls['status']).toBeDefined();
    expect(component.clientForm.controls['withEffectFromDate']).toBeDefined();
  });
  it('should load client details and perform necessary actions', () => {

    // Mock the getClientById method using jest.spyOn
    jest.spyOn(clientService, 'getClientById').mockReturnValue(of(mockClientList) as any);

    // Mock the closebutton element
    component.closebutton = { nativeElement: { click: jest.fn() } } as any;

    // Mock the getCountries and saveclient methods
    jest.spyOn(component, 'getCountries').mockImplementation(() => { });
    jest.spyOn(component, 'saveclient').mockImplementation(() => { });

    // Call the method to load client details
    component.loadClientDetails(123); // Replace '123' with the actual client ID

    // Ensure that the clientService.getClientById method is called
    expect(clientService.getClientById).toHaveBeenCalledWith(123);

    // Ensure that client details are set correctly
    expect(component.clientDetails).toEqual(mockClientList as any);
    expect(component.clientType).toEqual(mockClientList.clientType.clientTypeName);
    expect(component.selectedCountry).toEqual(mockClientList.country);

    // Ensure that getCountries and saveclient methods are called
    expect(component.getCountries).toHaveBeenCalled();
    expect(component.saveclient).toHaveBeenCalled();

    // Ensure that closebutton click is triggered
    expect(component.closebutton.nativeElement.click).toHaveBeenCalled();
  });
  it('should set clientCode, clientName, clientEmail, and sessionStorage correctly', () => {

    // Assign mockClientDetails to clientDetails property
    component.clientDetails = mockClientList;

    // Call the saveclient method
    component.saveclient();

    // Check if properties are set correctly
    expect(component.clientCode).toEqual(mockClientList.id);
    expect(component.clientName).toEqual(`${mockClientList.firstName} ${mockClientList.lastName}`);
    expect(component.clientEmail).toEqual(mockClientList.emailAddress);

    // Ensure that sessionStorage is set correctly
    const storedClientCode = sessionStorage.getItem('clientCode');
    expect(storedClientCode).toEqual(`${mockClientList.id}`);
  });
  it('should set selectedProductCode, call methods, and log the correct message', () => {
    // Mock selectedValue
    const selectedValue = { code: 123 };

    // Spy on methods to check if they are called
    jest.spyOn(component, 'getProductSubclass').mockImplementation(() => { });
    jest.spyOn(component, 'LoadAllFormFields').mockImplementation(() => { });
    jest.spyOn(component, 'getProductExpiryPeriod').mockImplementation(() => { });

    // Create a spy on the debug method of the log object
    const debugSpy = jest.spyOn(Logger.prototype, 'debug');

    // Call the method
    component.onProductSelected(selectedValue);

    // Check if properties are set correctly
    expect(component.selectedProductCode).toEqual(selectedValue.code);

    // Check if methods are called
    expect(component.getProductSubclass).toHaveBeenCalledWith(selectedValue.code);
    expect(component.LoadAllFormFields).toHaveBeenCalledWith(selectedValue.code);
    expect(component.getProductExpiryPeriod).toHaveBeenCalled();

    // Check if log.debug is called with the correct message
    expect(debugSpy).toHaveBeenCalledWith('Selected Product Code:', component.selectedProductCode);
  });


  it('should call getCoverToDate and update passedCoverToDate', () => {
    // Mock data to be returned by the API
    const mockData = {
      _embedded: [
        { coverToDate: '2024-02-08' } // Replace with your expected data
      ]
    };

    // Spy on the ProductService method
    const productServiceSpy = jest.spyOn(component.productService, 'getCoverToDate').mockReturnValue(of(mockData));

    // Set values for coverFromDate and selectedProductCode
    component.coverFromDate = '2024-02-07';
    component.selectedProductCode = 'ABC';

    // Call the method
    component.getCoverToDate();

    // Expect the ProductService method to have been called
    expect(productServiceSpy).toHaveBeenCalledWith('2024-02-07', 'ABC');

    // Simulate the response from the API

    // Expect the values to be updated accordingly
    expect(component.passedCoverToDate).toEqual('2024-02-08');
  });
  // it('should set expiry period to "N" if selectedProductCode or productList is not provided', () => {
  //   component.selectedProductCode = null;
  //   component.productList = null;
  //   component.getProductExpiryPeriod();
  //   expect(component.expiryPeriod).toEqual('N');
  // });
  it('should set expiry period correctly when selectedProductCode and productList are provided', () => {
    component.selectedProductCode = 1; // Assuming 'code' property is used as the product code
    component.productList = mockProducts;
    component.getProductExpiryPeriod();
    expect(component.expiryPeriod).toEqual('Y');
  });
  it('should set expiry period to "N" if selectedProductCode does not match any product in productList', () => {
    component.selectedProductCode = 999; // Assuming an arbitrary product code that doesn't exist in mockProducts
    component.productList = mockProducts;
    component.getProductExpiryPeriod();
    expect(component.expiryPeriod).toEqual('N');
  });
  // it('should retrieve and process subclasses', async () => {
  //   const code = 123; // Provide a sample code for testing

  //   // Mock data for testing


  //   const productServiceMock = {
  //     getProductSubclasses: jest.fn().mockReturnValue(of({ _embedded: { product_subclass_dto_list: mockSubclassList } }))
  //   };

  //   // Manually inject the mocked service into the component
  //   component['productService'] = productServiceMock as any;
  //   component.allSubclassList = allSubclassList; // Set your allSubclassList

  //   // Trigger the method
  //   await component.getProductSubclass(code);

  //   // Verify that the properties are set as expected
  //   expect(component.subClassList).toEqual(mockSubclassList);

  //   // Verify filtering and merging logic
  //   expect(component.allMatchingSubclasses).toEqual([
  //     allSubclassList[0], // Should match sub_class_code 101
  //     allSubclassList[1], // Should match sub_class_code 102
  //   ]);

  //   // Verify that the detectChanges method is called
  //   // expect(component.cdr.detectChanges).toHaveBeenCalled();

  //   // Verify that the ProductService method is called with the correct arguments
  //   expect(productServiceMock.getProductSubclasses).toHaveBeenCalledWith(code);
  // });
  it('should load all subclasses', async () => {

    const subclassServiceMock = {
      getAllSubclasses: jest.fn().mockReturnValue(of(allSubclassList))
    };

    // Manually inject the mocked service into the component
    component['subclassService'] = subclassServiceMock as any;

    // Trigger the method
    await component.loadAllSubclass();

    // Verify that the allSubclassList property is set as expected
    expect(component.allSubclassList).toEqual(allSubclassList);

    // Verify that the detectChanges method is called
    // expect(component.cdr.detectChanges).toHaveBeenCalled();

    // Verify that the SubclassService method is called
    expect(subclassServiceMock.getAllSubclasses).toHaveBeenCalled();
  });
  it('should handle subclass selection', () => {
    // Mock data for testing
    const selectedValue = '101'; // Provide a sample selected value
    const eventMock = { target: { value: selectedValue } };

    // Mock the methods called within onSubclassSelected
    const loadCovertypeBySubclassCodeMock = jest.spyOn(component, 'loadCovertypeBySubclassCode');
    const loadAllBindersMock = jest.spyOn(component, 'loadAllBinders');
    const loadSubclassSectionCovertypeMock = jest.spyOn(component, 'loadSubclassSectionCovertype');

    // Trigger the method
    component.onSubclassSelected(eventMock);

    // Verify that the selectedSubclassCode property is set correctly
    expect(component.selectedSubclassCode).toEqual(selectedValue);

    // Verify that the methods are called
    expect(loadCovertypeBySubclassCodeMock).toHaveBeenCalledWith(selectedValue);
    expect(loadAllBindersMock).toHaveBeenCalled();
    expect(loadSubclassSectionCovertypeMock).toHaveBeenCalled();
  });
  test('should load all binders', async () => {
    // Mock data for testing
    const mockBinderList = {
      _embedded: {
        binder_dto_list: [
          { binderId: 1, name: 'Binder 1' }, // Simplified mock data
          { binderId: 2, name: 'Binder 2' },
        ],
      },
    };

    const binderServiceMock = {
      getAllBindersQuick: jest.fn().mockReturnValue(of(mockBinderList))
    };

    // Manually inject the mocked service into the component
    component['binderService'] = binderServiceMock as any;

    // Set a sample selectedSubclassCode
    component.selectedSubclassCode = '101';

    // Spy on the detectChanges method
    const detectChangesSpy = jest.spyOn(component.cdr, 'detectChanges');

    // Trigger the method
    await component.loadAllBinders(Number(component.selectedSubclassCode));


    // Verify that the binderList property is set correctly
    expect(component.binderList).toEqual(mockBinderList);

    // Verify that the binderListDetails property is set correctly
    expect(component.binderListDetails).toEqual(mockBinderList._embedded.binder_dto_list);

    // Verify that the detectChanges method is called
    expect(detectChangesSpy).toHaveBeenCalled();

    // Verify that the BinderService method is called with the correct arguments
    // expect(binderServiceMock.getAllBindersQuick).toHaveBeenCalledWith(component.selectedSubclassCode);
    expect(binderServiceMock.getAllBindersQuick).toHaveBeenCalledWith(101);

  });

  it('should load all currencies and set default currency', async () => {
    const mockCurrencyList = [
      { id: 'USD', name: 'US Dollar', currencyDefault: 'Y', symbol: '$' },
      { id: 'EUR', name: 'Euro', currencyDefault: 'N', symbol: '€' },
      // Add more currencies as needed
    ];

    // Spy on the currencyService method and mock its return value
    jest.spyOn(currencyService, 'getAllCurrencies').mockReturnValue(of(mockCurrencyList));

    // Set the mock currency code for testing
    component.currencyCode = 'USD';

    // Spy on the detectChanges method
    const detectChangesSpy = jest.spyOn(component.cdr, 'detectChanges');

    // Call the method
    await component.loadAllCurrencies();

    // Expectations
    expect(currencyService.getAllCurrencies).toHaveBeenCalled();

    // Check if the default currency is set correctly
    expect(component.defaultCurrencyName).toEqual('US Dollar');
    expect(component.defaultCurrencySymbol).toEqual('$');
    expect(component.personalDetailsForm.get('currencyCode')?.value).toEqual('US Dollar');

    // Check if the currencyObj is set with correct values
    expect(component.currencyObj.prefix).toEqual('$ ');
    expect(component.currencyObj.allowNegative).toBe(false);
    expect(component.currencyObj.allowZero).toBe(false);
    expect(component.currencyObj.decimal).toEqual('.');
    expect(component.currencyObj.precision).toEqual(0);
    expect(component.currencyObj.thousands).toEqual(component.currencyDelimiter);
    expect(component.currencyObj.suffix).toEqual('');
    expect(component.currencyObj.nullable).toBe(true);
    expect(component.currencyObj.align).toEqual('left');

    // Ensure detectChanges was called
    expect(detectChangesSpy).toHaveBeenCalled();
  });



  it('should load cover type by subclass code', async () => {
    const mockSubclassCoverType = [
      { coverTypeCode: 'CT001', coverTypeShortDescription: 'Description 1' },
      // Add more cover types as needed
    ];

    jest.spyOn(subclassCoverTypesService, 'getSubclassCovertypeBySCode').mockReturnValue(of(mockSubclassCoverType));

    // Set a mock subclass code for testing
    const mockSubclassCode = 123;

    // Call the method
    await component.loadCovertypeBySubclassCode(mockSubclassCode);

    // Expectations
    expect(subclassCoverTypesService.getSubclassCovertypeBySCode).toHaveBeenCalledWith(mockSubclassCode);
    expect(component.coverTypeCode).toEqual('CT001');
    expect(component.coverTypeDesc).toEqual('Description 1');
  });
  it('should load all quotation sources', () => {
    const mockQuotationSources = {
      content: [
        { id: 1, name: 'Source 1' },
        { id: 2, name: 'Source 2' },
        // Add more sources as needed
      ],
    };

    jest.spyOn(quotationService, 'getAllQuotationSources').mockReturnValue(of(mockQuotationSources));

    // Call the method
    component.loadAllQoutationSources();

    // Expectations
    expect(quotationService.getAllQuotationSources).toHaveBeenCalled();
    expect(component.sourceList.content).toEqual(mockQuotationSources.content);
    expect(component.sourceDetail).toEqual(mockQuotationSources.content);
    // Add more expectations as needed
  });
  it('should update selected source code and store in sessionStorage', () => {
    // Mocking event and data
    const mockEvent = { target: { value: 'sourceCode123' } };
    const mockSourceDetail = [
      { code: 'sourceCode123', name: 'Source 1' },
      { code: 'sourceCode456', name: 'Source 2' },
      // Add more sources as needed
    ];

    // Set initial state
    component.sourceDetail = mockSourceDetail;
    component.selectedSourceCode = ''; // Ensure it's empty initially

    // Call the method
    component.onSourceSelected(mockEvent);

    // Expectations
    expect(component.selectedSourceCode).toEqual('sourceCode123');
    expect(component.selectedSource).toEqual([{ code: 'sourceCode123', name: 'Source 1' }]);
    expect(sessionStorage.getItem('quotationSource')).toEqual(JSON.stringify([{ code: 'sourceCode123', name: 'Source 1' }]));
  });

  it('should load form fields based on selected product code', () => {
    const mockSelectedProductCode = 123;
    const mockFormContent = {
      fields: [
        { name: 'field1', regexPattern: 'pattern1' },
        { name: 'field2', regexPattern: 'pattern2' },
        // Add more fields as needed
      ],
    };

    // Wrap mockFormContent in an array to match the method's expectations
    const mockResponse = [mockFormContent];

    jest.spyOn(quotationService, 'getFormFields').mockReturnValue(of(mockResponse));

    // Set initial state
    component.dynamicForm = new FormGroup({}); // Initialize a new form group

    // Call the method
    component.LoadAllFormFields(mockSelectedProductCode);

    // Expectations
    expect(quotationService.getFormFields).toHaveBeenCalledWith('product-quick-quote-123');

    // Adjusted expectations: Expect formContent to be the array with the object
    expect(component.formContent).toEqual(mockResponse);  // Expecting the entire array, not just the object
    expect(component.formData).toEqual(mockResponse[0].fields);

    // Check if form controls are added
    mockResponse[0].fields.forEach((field) => {
      expect(component.dynamicForm.get(field.name)).toBeTruthy();
      expect(component.dynamicForm.get(field.name) instanceof FormControl).toBeTruthy();
    });
  });





  it('should handle invalid car registration number using regex pattern', () => {
    // Set initial state
    component.dynamicRegexPattern = '^\\d{3}-[A-Za-z]{2}-\\d{3}$'; // Example regex pattern
    component.carRegNoValue = 'invalid-reg-no'; // Example invalid car registration number

    // Call the method
    component.validateCarRegNo();

    // Expectations
    expect(component.carRegNoHasError).toBeTruthy();
  });
  it('should remove all form controls from dynamic form', () => {
    // Set initial state
    component.dynamicForm.addControl('field1', new FormControl(''));
    component.dynamicForm.addControl('field2', new FormControl(''));
    // Add more controls as needed

    // Call the method
    component.removeFormControls();

    // Expectations
    expect(component.dynamicForm.controls['field1']).toBeUndefined();
    expect(component.dynamicForm.controls['field2']).toBeUndefined();
    // Add more expectations as needed
  });
  it('should handle removing controls when no controls are present', () => {
    // Call the method
    component.removeFormControls();
  });

  it('should get section by code', () => {
    const mockSelectedSectionList = { sectionCode: 123 }; // Example selected section list


    jest.spyOn(sectionService, 'getSectionByCode').mockReturnValue(of(mockSection));

    // Set initial state
    component.selectedSectionList = mockSelectedSectionList;

    // Call the method
    component.getSectionByCode();

    // Expectations
    expect(sectionService.getSectionByCode).toHaveBeenCalledWith(123);
    expect(component.section).toEqual(mockSection);
    // Add more expectations as needed
  });
  it('should populate years with data from productService', () => {
    const mockData = {
      _embedded: [
        {
          'List of cover years': [2020, 2021, 2022], // Adjust the structure based on your actual data
        },
      ],
    };

    jest.spyOn(productService, 'getYearOfManufacture').mockReturnValue(of(mockData));

    // Call the method
    component.populateYears();

    // Expectations
    expect(productService.getYearOfManufacture).toHaveBeenCalled();
    expect(component.years).toEqual(mockData._embedded[0]['List of cover years']);
    // Add more expectations as needed
  });
  it('should get premium rates for each mandatory section', () => {
    // Mock mandatorySections and other dependencies as needed
    component.mandatorySections = [
      {
        code: 1,
        coverTypeCode: 2,
        coverTypeShortDescription: 'Cover Type 1',
        isMandatory: 'Y',
        order: 1,
        organizationCode: 3,
        sectionCode: 4,
        sectionShortDescription: 'Section 1',
        subClassCode: 5,
        subClassCoverTypeCode: 6,
      },
      // Add more objects as needed
    ];

    component.selectedBinderCode = 'BINDER_CODE';
    component.selectedSubclassCode = 'SUBCLASS_CODE';

    const mockPremiumList = [{ /* mock premium data */ }];

    jest.spyOn(premiumRateService, 'getAllPremiums').mockReturnValue(of(mockPremiumList));

    // Call the method
    component.getPremiumRates();


  });

  it('should set the risk premium DTO', () => {
    // Mock necessary properties and methods
    component.subclassCoverType = [
      // Adjust the structure to match subclassCoverTypes interface
      {
        code: 1,
        coverTypeCode: 12,
        coverTypeShortDescription: 'Short Description 1',
        subClassCode: 123,
        certificateTypeCode: 'CT1',
        certificateTypeShortDescription: 'Cert Type 1',
        minimumPremium: '50',
        description: 'Coverage Type 1',
        isDefault: 'Yes',
        defaultSumInsured: '1000',
        sumInsuredCurrencyCode: 1,
        sumInsuredExchangeRate: '1.0',
        installmentType: 'Monthly',
        paymentInstallmentPercentage: '20',
        maximumInstallments: '6',
        installmentPeriod: '30',
        surveyEvaluationRequired: 'Yes',
        organizationCode: 'Org1'
      },
      // Add more items as needed
    ];

    component.selectedSubclassCode = 'mockSubclassCode';
    component.dynamicForm.get = jest.fn().mockReturnValue({ value: 'mockCarRegNo' });
    component.coverFromDate = new Date().toISOString(); // Convert Date to string
    component.passedCoverToDate = new Date().toISOString(); // Convert Date to string
    component.selectedBinderCode = 'mockBinderCode';
    component.currencyCode = 'USD';
    component.selectedBinder = {
      code: 123,
      date_with_effect_from: '2024-02-09',
      date_with_effect_to: '2025-02-09',
      bind_remarks: 'Mock Binder',
      maximum_exposure: '10000',
      contract_document: 'Mock Contract Document',
      binder_short_description: 'Mock Binder Short Description',
      binder_type: 'Mock Binder Type',
      binder_name: 'Mock Binder Name',
      is_default: 'Yes',
      is_web_default: 'No',
      lta_type: 'Mock LTA Type',
      commission_type: 'Mock Commission Type',
      maximum_refund_premium: 500,
      minimum_refund_premium: 100,
      minimum_premium: 200,
      age_limit: 30,
      is_aa_applicable: 'Yes',
      web_name: 'Mock Web Name',
      escalation_percentage: 5,
      broker_code: 456,
      max_number_of_beneficiaries: 3,
      can_edit_premium_items: 'Yes',
      agent_code: 789,
      agent_short_description: 'Mock Agent Short Description',
      sub_class_code: 321,
      account_type_code: 'ATC123',
      product_code: 789,
      product_short_description: 'Mock Product Short Description',
      policy_code: 'Policy123',
      policy_batch_number: 987,
      agency_account_code: 'AAC789',
      currency_code: 456,
      certificate_type_code: 654,
      organization_code: 123,
      version: 1,
      // Add all properties as needed
    };

    // Mock setLimitPremiumDto method if needed
    jest.spyOn(component, 'setLimitPremiumDto').mockReturnValue(mockLimits);

    // Call the method to set the risk premium DTO
    const result = component.setRiskPremiumDto();


  });
  // it('should set limit premium DTO for a cover type', () => {
  //   // Mock necessary properties and methods
  //   component.dynamicForm.get = jest.fn().mockReturnValue({ value: '100000' }); // Mocking selfDeclaredValue
  //   component.mandatorySections = mockMandatorySections;
  //   component.allPremiumRate = mockPremiumRates;
  //   component.additionalLimit = mockAdditionalLimits;

  //   // Mock any other dependencies or methods as needed
  //   const result = component.setLimitPremiumDto(1); // Assuming coverTypeCode is 1

  //   // expect(result).toHaveLength(2); // Using Jest's directly without TypeScript interference
  //   expect(result[0].calculationGroup).toEqual(1); // Assuming the first section is not an additional limit
  //   expect(result[1].calculationGroup).toEqual(2);
  // });
  it('should create risk section and handle success', () => {

    // Mock data for passed sections and premium rates
    component.passedSections = [
      { code: 1, sectionShortDescription: 'Section 1' },
      { code: 2, sectionShortDescription: 'Section 2' },
    ];

    component.premiumList = [
      {
        sectionShortDescription: 'Collision Damage',
        multiplierDivisionFactor: 1.2,
        multiplierRate: 1.2,
        rate: 0.75,
        divisionFactor: 1.5,
        rateType: 'Percentage',
        code: 0,
        sectionCode: 0,
        sectionType: '',
        dateWithEffectFrom: '',
        dateWithEffectTo: '',
        subClassCode: 0,
        binderCode: 0,
        rangeFrom: 0,
        rangeTo: 0,
        rateDescription: '',
        premiumMinimumAmount: 0,
        territoryCode: 0,
        proratedOrFull: '',
        premiumEndorsementMinimumAmount: 0,
        maximumRate: 0,
        minimumRate: 0,
        freeLimit: 0,
        isExProtectorApplication: '',
        isSumInsuredLimitApplicable: '',
        sumInsuredLimitType: '',
        sumInsuredRate: '',
        grpCode: '',
        isNoClaimDiscountApplicable: '',
        currencyCode: 0,
        agentName: '',
        rangeType: '',
        limitAmount: 0,
        noClaimDiscountLevel: '',
        doesCashBackApply: '',
        cashBackLevel: 0,
        rateFrequencyType: ''
      },
      {
        sectionShortDescription: 'Comprehensive Damage',
        multiplierDivisionFactor: 1.1,
        multiplierRate: 1.1,
        rate: 0.6,
        divisionFactor: 1.2,
        rateType: 'Percentage',
        code: 0,
        sectionCode: 0,
        sectionType: '',
        dateWithEffectFrom: '',
        dateWithEffectTo: '',
        subClassCode: 0,
        binderCode: 0,
        rangeFrom: 0,
        rangeTo: 0,
        rateDescription: '',
        premiumMinimumAmount: 0,
        territoryCode: 0,
        proratedOrFull: '',
        premiumEndorsementMinimumAmount: 0,
        maximumRate: 0,
        minimumRate: 0,
        freeLimit: 0,
        isExProtectorApplication: '',
        isSumInsuredLimitApplicable: '',
        sumInsuredLimitType: '',
        sumInsuredRate: '',
        grpCode: '',
        isNoClaimDiscountApplicable: '',
        currencyCode: 0,
        agentName: '',
        rangeType: '',
        limitAmount: 0,
        noClaimDiscountLevel: '',
        doesCashBackApply: '',
        cashBackLevel: 0,
        rateFrequencyType: ''
      }
    ];

    component.riskCode = 'mockRiskCode';

    // Spying on the quotationService method to mock its return value
    jest.spyOn(quotationService, 'createRiskSection').mockReturnValue(of({}));


    // Assert: Check that the service was called with the correct arguments
    expect(quotationService.createRiskSection).toHaveBeenCalledWith(
      'mockRiskCode',
      [
        {
          calcGroup: 1,
          code: 1,
          compute: 'Y',
          description: 'Collision Damage',
          freeLimit: 0,
          multiplierDivisionFactor: 1.2,
          multiplierRate: 1.2,
          premiumAmount: 0,
          premiumRate: 0.75,
          rateDivisionFactor: 1.5,
          rateType: 'Percentage',
          rowNumber: 1,
          sumInsuredLimitType: null,
          sumInsuredRate: 0,
          sectionCode: undefined,
          sectionShortDescription: 'Section 1',
          sectionType: 'MockSectionType1',
          quotRiskCode: 23456,  // Add quotRiskCode here (example number)
          limitAmount: 34,
        },
        {
          calcGroup: 1,
          code: 2,
          compute: 'Y',
          description: 'Comprehensive Damage',
          freeLimit: 0,
          multiplierDivisionFactor: 1.1,
          multiplierRate: 1.1,
          premiumAmount: 0,
          premiumRate: 0.6,
          rateDivisionFactor: 1.2,
          rateType: 'Percentage',
          rowNumber: 1,
          sectionCode: undefined,
          sectionShortDescription: 'Section 2',
          sectionType: 'MockSectionType2',
          quotRiskCode: 567899,  // Add quotRiskCode here (example number)
          sumInsuredLimitType: null,
          sumInsuredRate: 0,
          limitAmount: 34,
        }
      ]
    );
  });


  // it('should set existingPropertyIds and log the car registration numbers when passedQuotation is present', () => {
  //   // Mock passedQuotation object with Kenyan car registration numbers
  //   component.passedQuotation = {
  //     riskInformation: [
  //       { propertyId: 'KBB 123A' },  // Kenyan car registration number
  //       { propertyId: 'KCD 456B' },  // Kenyan car registration number
  //       { propertyId: 'KDA 789C' }   // Kenyan car registration number
  //     ]
  //   };

  //   // Ensure ngOnInit is called after passedQuotation is set
  //   component.ngOnInit();

  //   // Assert that existingPropertyIds was set correctly
  //   expect(component.existingPropertyIds).toEqual(['KBB 123A', 'KCD 456B', 'KDA 789C']);
  //   const logSpy = jest.spyOn(console, 'debug').mockImplementation();

  //   // Assert log.debug was called with the correct message and data
  //   expect(logSpy).toHaveBeenCalledWith("existing property id", ['KBB 123A', 'KCD 456B', 'KDA 789C']);
  // });



  // it('should handle existing client details when passedQuotation and PassedClientDetails are defined', () => {
  //   // Arrange
  //   const mockPassedQuotation = {
  //     riskInformation: [{ propertyId: '123' }]
  //   };
  //   const mockClientDetails = {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     emailAddress: 'john.doe@example.com',
  //     phoneNumber: '123456789',
  //     country: 'Kenya'
  //   };
  //   sessionStorageMock.mockReturnValue('true'); // Mock session storage for isAddRisk

  //   // Set the mock data to the component
  //   component.passedQuotation = mockPassedQuotation;
  //   component.PassedClientDetails = mockClientDetails;

  //   // Act: Trigger ngOnInit
  //   component.ngOnInit();
  //   fixture.detectChanges(); // Trigger change detection

  //   // Assert: Verify client name and other details
  //   expect(component.clientName).toBe('John Doe');
  //   expect(component.clientEmail).toBe('john.doe@example.com');
  //   expect(component.clientPhone).toBe('123456789');
  //   expect(component.isNewClient).toBe(false);
  //   expect(component.selectedCountry).toBe('Kenya');
  //   expect(logSpy).toHaveBeenCalledWith('isAddRiskk Details:', true);
  //   expect(infoSpy).toHaveBeenCalledWith('Paased selected country:', 'Kenya');
  // });


  // it('should populate form with sessionStorage data', () => {
  //   // Mock data in sessionStorage
  //   sessionStorage.setItem('personalDetails', JSON.stringify({
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     emailAddress: 'john.doe@example.com',
  //     phoneNumber: '123456789'
  //   }));

  //   // Call the method that triggers patchValue
  //   component.loadFormData();

  //   // Check if patchValue was called with the expected data
  //   expect(component.personalDetailsForm.patchValue).toHaveBeenCalledWith({
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     emailAddress: 'john.doe@example.com',
  //     phoneNumber: '123456789'
  //   });
  // });
  it('should set selectedZipCode when onZipCodeSelected is called', () => {
    const event = { target: { value: '12345' } } as any; // Mocking the event object

    // Call the method
    component.onZipCodeSelected(event);

    // Assert that the selectedZipCode is correctly set
    expect(component.selectedZipCode).toBe('12345');
  });
  it('should call onInputChange and update sessionStorage', () => {
    // Mock sessionStorage.setItem directly
    const setItemMock = jest.fn();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: setItemMock,
      },
      writable: true,
    });

    // Set the selectedZipCode and newClientData correctly
    component.selectedZipCode = '12345';
    component.newClientData = {
      inputClientName: 'John Doe',
      inputClientZipCode: '',
      inputClientPhone: '555-5555',
      inputClientEmail: 'johndoe@example.com',
    };

    // Call the method
    component.onInputChange();

    // Assert that the inputClientZipCode is updated
    expect(component.newClientData.inputClientZipCode).toBe('12345');

    // Assert that sessionStorage.setItem was called with the correct arguments
    expect(setItemMock).toHaveBeenCalledWith(
      'newClientDetails',
      JSON.stringify(component.newClientData)
    );

    // Restore original sessionStorage.setItem (optional cleanup)
    jest.restoreAllMocks();
  });
  it('should load all clients and update clientList and clientData', fakeAsync(() => {
    // Sample data to be returned by the mock
    const mockClientData = {
      content: [
        { id: 1, name: 'Client 1' },
        { id: 2, name: 'Client 2' },
      ],
    };

    // Mock getClients to return an observable with mock data
    jest.spyOn(clientService, 'getClients').mockReturnValue(of(mockClientData)as any);

    // Set up the spy on console.debug before calling the method
    const logSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Call the method
    component.loadAllClients();

    // Simulate the passage of time for asynchronous operations
    tick();  // This ensures the observable completes

    // Check that getClients was called with the expected arguments
    expect(clientService.getClients).toHaveBeenCalledWith(0, 100);

    // Verify that clientList and clientData are updated correctly
    expect(component.clientList).toEqual(mockClientData);
    expect(component.clientData).toEqual(mockClientData.content);

    // Verify that the log.debug method was called with the expected values
    expect(logSpy).toHaveBeenCalledWith('CLIENT DATA:', mockClientData);
    expect(logSpy).toHaveBeenCalledWith('CLIENT DATA:', mockClientData.content);
  }));






});
