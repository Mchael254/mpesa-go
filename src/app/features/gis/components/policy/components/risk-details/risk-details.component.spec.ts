import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDetailsComponent } from './risk-details.component';
import { of, throwError } from 'rxjs';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '../../../../../../shared/shared.module';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserStorage } from "../../../../../../shared/services/storage";
import { APP_BASE_HREF } from '@angular/common';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { MessageService } from 'primeng/api';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { Products, Subclasses, introducers } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
// import { TranslateService } from '@ngx-translate/core/dist/lib/translate.service';
import { DEFAULT_LANGUAGE, TranslateService, TranslateModule, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE } from '@ngx-translate/core';
import { TranslateStore } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateCompiler } from '@ngx-translate/core';
import { TranslateParser } from '@ngx-translate/core';
import { MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateFakeLoader } from '@ngx-translate/core'
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { QuotationsService } from '../../../quotation/services/quotations/quotations.service';
import { IntermediaryService } from '../.../../../../../../entities/services/intermediary/intermediary.service';
import { AgentDTO } from '../../../../../entities/data/AgentDTO';
import { IntroducersService } from '../../../setups/services/introducers/introducers.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { ContractNamesService } from '../../services/contract-names/contract-names.service';
import { PolicyService } from '../../services/policy.service';
import { PolicyContent, PolicyResponseDTO } from '../../data/policy-dto';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { StaffService } from '../../../../../entities/services/staff/staff.service';
import { StaffDto } from '../../../../../entities/data/StaffDto';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { CountryDto, StateDto, TownDto } from '../../../../../../shared/data/common/countryDto';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';

export class mockPolicyService {
  createPolicy = jest.fn().mockReturnValue(of());
  getPaymentModes = jest.fn().mockReturnValue(of());
  getPolicy = jest.fn().mockReturnValue(of());
}
export class mockProductSubclassService {
  getProductSubclasses = jest.fn().mockReturnValue(of());

} export class mockSubclassService {
  getAllSubclasses = jest.fn().mockReturnValue(of());

}
export class mockBinderService {
  getAllBindersQuick = jest.fn().mockReturnValue(of());
}
export class mockSubclassCovertypeService {
  getSubclassCovertypeBySCode = jest.fn().mockReturnValue(of());
}
export class mockVehicleMakeService {
  getAllVehicleMake = jest.fn().mockReturnValue(of());
}
 export class mockVehicleModelService {
  getAllVehicleModel = jest.fn().mockReturnValue(of());
}
export class MockBrowserStorage {

}
export class mockStaffService {
  getStaffById = jest.fn().mockReturnValue(of());
}export class mockCountryService {
  getMainCityStatesByCountry = jest.fn().mockReturnValue(of());
  getTownsByMainCityState = jest.fn().mockReturnValue(of());
  getCountries = jest.fn().mockReturnValue(of());
}
export class mockPremiumService {
  getAllPremiums = jest.fn().mockReturnValue(of());
}

// const mockLogger = {
//   debug: jest.fn()
// };
const mockPolicyContent: PolicyContent = {
  agency: 123,
  authorizedStatus: "Authorized",
  basicPremium: 70000,
  batchNo: 2020247746,
  clientCode: 324,
  currency: "USD",
  debitOwner: "John Doe",
  endorsementNo: "ENDORSE123",
  insureds: [
    {
      client: {
        firstName: "Jane",
        id: 456,
        lastName: "Doe"
      },
      prpCode: 789
    }
  ],
  introducerCode: 101,
  marketerCode: 202,
  policyNo: "MPC/MSA/2019/200026",
  policyRemarks: "Renewal due next month",
  policyStatus: "RN",
  policyType: "Standard",
  premium: 75000,
  preparedBy: "Alice Smith",
  preparedDate: "2024-04-17",
  product: {
    acceptUniqueRisks: "N",
    acceptsMultipleClasses: "Y",
    allowAccommodation: "Y",
    allowMotorClass: "N",
    allowOpenPolicy: "N",
    allowSameDayRenewal: "N",
    areInstallmentAllowed: "y",
    autoGenerateCoverNote: "Y",
    autoPostReinsurance: "N",
    checkSchedule: "N",
    claimPrefix: "AVI_CLM",
    claimScreenCode: "AVI_CLM",
    code: 2907,
    commissionRate: 3,
    description: "AVIATION HULL",
    doFullRemittance: "Y",
    doesEscalationReductionApply: "N",
    enableSpareParts: "N",
    enableWeb: "Y",
    endorsementMinimumPremium: 100000,
    expires: "Y",
    industryCode: 234,
    insuranceType: "GENERAL",
    insuredAccumulationLimit: 1400000,
    interfaceType: "CASH",
    isAssignmentAllowed: "N",
    isDefault: "N",
    isLoanApplicable: "Y",
    isMarine: "N",
    isPinRequired: "Y",
    isPolicyNumberEditable: "N",
    isRenewable: "N",
    maximumAge: 35,
    maximumExtensions: 10,
    maximumTerm: 5,
    minimumAge: 10,
    minimumPremium: 10000,
    minimumSubClasses: 1,
    minimumTerm: 4,
    openCover: "N",
    order: 2,
    organizationCode: 2,
    policyAccumulationLimit: 5000000,
    policyCodePages: 20,
    policyDocumentPages: 20,
    policyPrefix: "P-AVIH",
    policyWordDocument: "path",
    prerequisiteProductCode: 534,
    productGroupCode: 80,
    productReportGroupsCode: 3323,
    productType: "Prod B",
    prorataType: "D",
    scheduleOrder: 2,
    shortDescription: 801,
    shortName: "AVIH",
    showFap: "Y",
    showOnWebPortal: "N",
    showSumInsured: "Y",
    termDistribution: 2,
    totalCompanyAccumulationLimit: 839900,
    underwritingScreenCode: "AVI_UNDWR",
    webDetails: "Details",
    withEffectFrom: "2015-01-01",
    withEffectTo: "2015-01-14",
    years: 3
  },
  promiseDate: "2024-04-17",
  renewalDate: "2021-02-25",
  riskInformation: [
    {
      allowedCommissionRate: 0,
      basicPremium: 0,
      binderCode: 0,
      commissionAmount: 0,
      commissionRate: 0,
      coverTypeCode: 0,
      coverTypeShortDescription: "string",
      currencyCode: 0,
      dateCoverFrom: "2024-04-17",
      dateCoverTo: "2024-04-17",
      delSect: "string",
      grossPremium: 0,
      insureds: {
        client: {
          firstName: "string",
          id: 0,
          lastName: "string"
        },
        prpCode: 0
      },
      ipuNcdCertNo: "string",
      loaded: "string",
      ltaCommission: 0,
      netPremium: 0,
      paidPremium: 0,
      policyBatchNo: 0,
      policyNumber: "string",
      policyStatus: "string",
      productCode: 0,
      propertyDescription: "string",
      propertyId: "string",
      quantity: 0,
      reinsuranceEndorsementNumber: "string",
      renewalArea: "string",
      riskFpOverride: 0,
      riskIpuCode: 0,
      sections: [
        {
          divFactor: 0,
          freeLimit: 0,
          limitAmount: 0,
          multiplierRate: 0,
          pilPremRate: 0,
          premium: 0,
          rateType: "string",
          sectCode: 0,
          sectIpuCode: 0,
          sectionCode: 0,
          sectionDesc: "string",
          sectionShortDesc: "string"
        }
      ],
      stampDuty: 0,
      subClassCode: 0,
      subClassDescription: "string",
      transactionType: "string",
      underwritingYear: 0,
      value: 0
    }
  ],
  taxInformation: [
    {
      amount: 0,
      batchNo: 0,
      description: "string",
      rate: 0,
      rateType: "string",
      transactionTypeCode: "string"
    }
  ],
  totalPremium: 0,
  totalSumInsured: 800000,
  transactionType: "string",
  type: "string",
  underWritingOnly: "string",
  wefDt: "2020-02-25",
  wetDt: "2020-02-25"
};

const mockResponse: PolicyResponseDTO = {
  content: [mockPolicyContent],
  empty: false,
  first: true,
  last: true,
  number: 0,
  number_of_elements: 1,
  pageable: {
    offset: 0,
    page_number: 0,
    page_size: 0,
    paged: true,
    sort: {
      empty: true,
      sorted: true,
      unsorted: true
    },
    unpaged: true
  },
  size: 1,
  sort: {
    empty: true,
    sorted: true,
    unsorted: true
  },
  total_elements: 1,
  total_pages: 1
};
const mockAllSubclassList: Subclasses[] = [
  {
    accomodation: 'Some value',
    allowsDeclaration: 'Some value',
    bondSubclass: 'Some value',
    certificatePrefix: 'Some value',
    claimGracePeriod: 'Some value',
    claimPrefix: 'Some value',
    claimReviewDays: 'Some value',
    classCode: 'Some value',
    code: 2,
    declarationPenaltyPercentage: 'Some value',
    description: 'Some value',
    doesDisabilityScaleApply: 'Some value',
    doesLoanApply: 'Some value',
    doesReinsurancePoolApply: 'Some value',
    doesTerritoryApply: 'Some value',
    enableSchedule: 'Some value',
    expiryPeriod: 'Some value',
    freeCoverLimit: 'Some value',
    generateCertificateAutomatically: 'Some value',
    glAccountGroupCode: 'Some value',
    isConveyanceTypeRequired: 'Some value',
    isExcessOfLossApplicable: 'Some value',
    isMandatory: 'Some value',
    isQuakeRegionRequired: 'Some value',
    isRenewable: 'Some value',
    isRescueMandatory: 'Some value',
    isRiskAddressRequired: 'Some value',
    isRiskClassMandatory: 'Some value',
    isStraightFlowEnabled: 'Some value',
    isSurveyValuationRequired: 'Some value',
    maxDeclarationPercentage: 'Some value',
    maxInsuredAccumulationLimit: 'Some value',
    maxNoClaimDiscountLevel: 'Some value',
    maxPolicyAccumulationLimit: 'Some value',
    noCertificate: 'Some value',
    noRiSi: 'Some value',
    organizationCode: 'Some value',
    overrideReq: 'Some value',
    policyPrefix: 'Some value',
    prereqSubclassCode: 'Some value',
    reinsureWotRiProg: 'Some value',
    reportParameter: 'Some value',
    riskDummy: 'Some value',
    riskExpireTotalLoss: 'Some value',
    riskIdFormat: 'Some value',
    screenCode: 'Some value',
    shortDescription: 'Some value',
    showButcharge: 'Some value',
    showNoClaimDiscount: 'Some value',
    subClassId: 'Some value',
    surveyLimitAccumulation: 'Some value',
    totalCompanyAccumulationLimit: 'Some value',
    underwritingScreenCode: 'Some value',
    uniqueRisk: 'Some value',
    useCoverPeriodRate: 'Some value',
    webSubclassDetails: 'Some value',
    withEffectFrom: 'Some value',
    withEffectTo: 'Some value',
    claimScreenCode: 'Some value' // Add the missing property
  },
]
const mockAllSubclassList2: Subclasses[] = [
  {
    accomodation: 'Some value',
    allowsDeclaration: 'Some value',
    bondSubclass: 'Some value',
    certificatePrefix: 'Some value',
    claimGracePeriod: 'Some value',
    claimPrefix: 'Some value',
    claimReviewDays: 'Some value',
    classCode: 'Some value',
    code: 2,
    declarationPenaltyPercentage: 'Some value',
    description: 'Some value',
    doesDisabilityScaleApply: 'Some value',
    doesLoanApply: 'Some value',
    doesReinsurancePoolApply: 'Some value',
    doesTerritoryApply: 'Some value',
    enableSchedule: 'Some value',
    expiryPeriod: 'Some value',
    freeCoverLimit: 'Some value',
    generateCertificateAutomatically: 'Some value',
    glAccountGroupCode: 'Some value',
    isConveyanceTypeRequired: 'Some value',
    isExcessOfLossApplicable: 'Some value',
    isMandatory: 'Some value',
    isQuakeRegionRequired: 'Some value',
    isRenewable: 'Some value',
    isRescueMandatory: 'Some value',
    isRiskAddressRequired: 'Some value',
    isRiskClassMandatory: 'Some value',
    isStraightFlowEnabled: 'Some value',
    isSurveyValuationRequired: 'Some value',
    maxDeclarationPercentage: 'Some value',
    maxInsuredAccumulationLimit: 'Some value',
    maxNoClaimDiscountLevel: 'Some value',
    maxPolicyAccumulationLimit: 'Some value',
    noCertificate: 'Some value',
    noRiSi: 'Some value',
    organizationCode: 'Some value',
    overrideReq: 'Some value',
    policyPrefix: 'Some value',
    prereqSubclassCode: 'Some value',
    reinsureWotRiProg: 'Some value',
    reportParameter: 'Some value',
    riskDummy: 'Some value',
    riskExpireTotalLoss: 'Some value',
    riskIdFormat: 'Some value',
    screenCode: 'Some value',
    shortDescription: 'Some value',
    showButcharge: 'Some value',
    showNoClaimDiscount: 'Some value',
    subClassId: 'Some value',
    surveyLimitAccumulation: 'Some value',
    totalCompanyAccumulationLimit: 'Some value',
    underwritingScreenCode: 'Some value',
    uniqueRisk: 'Some value',
    useCoverPeriodRate: 'Some value',
    webSubclassDetails: 'Some value',
    withEffectFrom: 'Some value',
    withEffectTo: 'Some value',
    claimScreenCode: 'Some value' // Add the missing property
  },
]
const mockData = {
  _embedded: {
    product_subclass_dto_list: [
      {
        code: 1,
        is_mandatory: 'Yes',
        sub_class_code: 101,
        policy_document_order_number: 1001,
        product_group_code: 201,
        product_code: 301,
        productShortDescription: 'Short description',
        underwriting_screen_code: 'ABC',
        date_with_effect_from: '2022-01-01',
        date_with_effect_to: '2022-12-31',
        version: 1
      }
    ]
  }
};
const mockBinderList = {
  _embedded: {
    binder_dto_list: [
      // Provide sample binder data
      { binderId: 1, name: 'Binder 1', /* ... other properties ... */ },
      { binderId: 2, name: 'Binder 2', /* ... other properties ... */ },
    ],
  },
};
const userDetailsMock: StaffDto = {
  id: 1,
  name: 'John Doe',
  username: 'johndoe',
  userType: 'admin',
  emailAddress: 'john@example.com',
  status: 'active',
  profileImage: 'path/to/image.jpg',
  department: 'Engineering',
  manager: 'Jane Smith',
  telNo: '123-456-7890',
  phoneNumber: '987-654-3210',
  otherPhone: '555-555-5555',
  countryCode: 123,
  townCode: 456,
  personelRank: 'Manager',
  city: 789,
  physicalAddress: '123 Main St',
  postalCode: '12345',
  departmentCode: 101,
  activatedBy: 'Admin',
  updateBy: 'User',
  dateCreated: '2024-04-19',
  dateActivated: '2024-04-20',
  granter: 'Supervisor',
  branchId: 1001,
  accountId: 2001,
  accountManager: 3001,
  profilePicture: 'path/to/profile.jpg',
  organizationId: 4001,
  organizationGroupId: 5001,
  supervisorId: 6001,
  supervisorCode: 7001,
  organizationCode: 8001,
  pinNumber: '1234',
  gender: 'Male'
};
const mockCountry: CountryDto = {
  adminRegMandatory: 'Yes',
  adminRegType: 'Type A',
  currSerial: 123,
  currency: {
    createdBy: 'Admin',
    createdDate: '2024-04-19',
    decimalWord: 'Decimal',
    id: 456,
    modifiedBy: 'User',
    modifiedDate: '2024-04-20',
    name: 'Currency',
    numberWord: 'Number',
    roundingOff: 2,
    symbol: '$'
  },
  drugTraffickingStatus: 'High',
  drugWefDate: '2024-04-21',
  drugWetDate: '2024-04-22',
  highRiskWefDate: '2024-04-23',
  highRiskWetDate: '2024-04-24',
  id: 789,
  isShengen: 'No',
  mobilePrefix: 123,
  name: 'Country',
  nationality: 'National',
  risklevel: 'High',
  short_description: 'Country short description',
  subAdministrativeUnit: 'Unit',
  telephoneMaximumLength: 10,
  telephoneMinimumLength: 7,
  unSanctionWefDate: '2024-04-25',
  unSanctionWetDate: '2024-04-26',
  unSanctioned: 'No',
  zipCode: 12345,
  zipCodeString: '12345'
};
const mockCountries: CountryDto[] = [
  {
    adminRegMandatory: 'Sample',
    adminRegType: 'Sample',
    currSerial: 1,
    currency: {
      createdBy: 'Sample',
      createdDate: '2024-04-23',
      decimalWord: 'Sample',
      id: 1,
      modifiedBy: 'Sample',
      modifiedDate: '2024-04-23',
      name: 'Sample',
      numberWord: 'Sample',
      roundingOff: 1,
      symbol: 'Sample'
    },
    drugTraffickingStatus: 'Sample',
    drugWefDate: '2024-04-23',
    drugWetDate: '2024-04-23',
    highRiskWefDate: '2024-04-23',
    highRiskWetDate: '2024-04-23',
    id: 1,
    isShengen: 'Sample',
    mobilePrefix: 1,
    name: 'United States',
    nationality: 'Sample',
    risklevel: 'Sample',
    short_description: 'Sample',
    subAdministrativeUnit: 'Sample',
    telephoneMaximumLength: 1,
    telephoneMinimumLength: 1,
    unSanctionWefDate: '2024-04-23',
    unSanctionWetDate: '2024-04-23',
    unSanctioned: 'Sample',
    zipCode: 1,
    zipCodeString: 'Sample'
  }
];


const mockState: StateDto = {
  country: mockCountry,
  id: 123,
  shortDescription: 'State short description',
  name: 'State'
};
const mockTown: TownDto = {
  id: 456,
  country: mockCountry,
  shortDescription: 'Town short description',
  name: 'Town',
  state: mockState
};

describe('RiskDetailsComponent', () => {
  let component: RiskDetailsComponent;
  let fixture: ComponentFixture<RiskDetailsComponent>;
  let globalMessagingService: GlobalMessagingService;
  let policyService: PolicyService;
  let ProductService: ProductsService;
  let subclassService: SubclassesService;
  let binderService: BinderService;
  let subclassCoverTypesService: SubClassCoverTypesService;
  let vehicleMakeService: VehicleMakeService;
  let vehicleModelService: VehicleModelService;
  let staffService:StaffService;
  let countryService:CountryService;
  let premiumService:PremiumRateService;
  let mockLogger: jest.SpyInstance<void>;



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RiskDetailsComponent],
      imports: [HttpClientTestingModule, SharedModule, FormsModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } // Use TranslateFakeLoader
        })],
      providers: [
        { provide: PolicyService, useClass: mockPolicyService },
        { provide: ProductsService, useClass: mockProductSubclassService },
        { provide: SubclassesService, useClass: mockSubclassService },
        { provide: BinderService, useClass: mockBinderService },
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: SubClassCoverTypesService, useClass: mockSubclassCovertypeService },
        { provide: VehicleMakeService, useClass: mockVehicleMakeService },
        { provide: VehicleModelService, useClass: mockVehicleModelService },
        { provide: StaffService, useClass: mockStaffService },
        { provide: CountryService, useClass: mockCountryService },
        { provide: PremiumRateService, useClass: mockPremiumService },


        { provide: APP_BASE_HREF, useValue: '/' },
        GlobalMessagingService, MessageService,
        FormBuilder,
        { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis/setups/api/v1' } } } },
        { provide: USE_DEFAULT_LANG, useValue: true },
        { provide: USE_STORE, useValue: true },
        { provide: USE_EXTEND, useValue: true },
        { provide: DEFAULT_LANGUAGE, useValue: true }
      ]
    });
    fixture = TestBed.createComponent(RiskDetailsComponent);
    component = fixture.componentInstance;
    globalMessagingService = TestBed.inject(GlobalMessagingService);
    policyService = TestBed.inject(PolicyService);
    ProductService = TestBed.inject(ProductsService);
    subclassService = TestBed.inject(SubclassesService);
    binderService = TestBed.inject(BinderService);
    subclassCoverTypesService = TestBed.inject(SubClassCoverTypesService);
    vehicleMakeService = TestBed.inject(VehicleMakeService);
    vehicleModelService = TestBed.inject(VehicleModelService);
    staffService = TestBed.inject(StaffService);
    countryService = TestBed.inject(CountryService);
    premiumService = TestBed.inject(PremiumRateService);

    component.policyRiskForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);
    const mockFormValue = { binderCode: '123' }; // Mocked form value
    component.policyRiskForm = component.fb.group({
      binderCode: new FormControl(mockFormValue.binderCode)
    });
    mockLogger = jest.spyOn(console, 'debug').mockImplementation(() => {});


    fixture.detectChanges();
  });
  afterEach(() => {
    // Optionally clear mock function calls
    jest.clearAllMocks();
    mockLogger.mockRestore();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle NCD applicable field', () => {
    // Initially, isNcdApplicable should be false
    expect(component.isNcdApplicable).toBe(false);

    // Call toggleNcdApplicableFields() with checked as true
    component.toggleNcdApplicableFields(true);

    // Assert that isNcdApplicable has been updated to true
    expect(component.isNcdApplicable).toBe(true);

    // Call toggleNcdApplicableFields() with checked as false
    component.toggleNcdApplicableFields(false);

    // Assert that isNcdApplicable has been updated to false again
    expect(component.isNcdApplicable).toBe(false);
  });
  it('should toggle cash applicable field', () => {
    // Initially, isCashApplicable should be false
    expect(component.isCashApplicable).toBe(false);

    // Call toggleCashApplicableField() with checked as true
    component.toggleCashApplicableField(true);

    // Assert that isCashApplicable has been updated to true
    expect(component.isCashApplicable).toBe(true);

    // Call toggleCashApplicableField() with checked as false
    component.toggleCashApplicableField(false);

    // Assert that isCashApplicable has been updated to false again
    expect(component.isCashApplicable).toBe(false);
  });
  it('should call getPolicy and handle success response', () => {


    // Stub the getPolicy method of PolicyService to return a mock observable
    jest.spyOn(policyService, 'getPolicy').mockReturnValue(of(mockResponse) as any);

    // Spy on other methods or services as needed
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');
    jest.spyOn(component.policyRiskForm.controls['coverDays'], 'setValue');
    jest.spyOn(component, 'onProductSelected');
    jest.spyOn(component, 'getProductSubclass');
    jest.spyOn(component.cdr, 'detectChanges');

    // Debugging: Log values for debugging
    console.log('passedCoverFrom:', component.passedCoverFrom);
    console.log('passedCoverTo:', component.passedCoverTo);
    console.log('passedCoverDays (before calculation):', component.passedCoverDays);

    // Trigger the method call
    component.getPolicy();

    // Assert the behavior after success response
    // expect(component.batchNo).toEqual(mockResponse.content[0].batch_no);
    expect(component.policyResponse).toEqual(mockResponse);
    expect(component.policyDetails).toEqual(mockResponse.content[0]);
    expect(component.productCode).toEqual(mockResponse.content[0].product.code);
    expect(component.passedCoverFrom).toEqual(mockResponse.content[0].wefDt);
    expect(component.passedCoverTo).toEqual(mockResponse.content[0].wetDt);
    expect(component.policyRiskForm.controls['coverDays'].setValue).toHaveBeenCalledWith(0);
    expect(component.onProductSelected).toHaveBeenCalled();
    // expect(component.getProductSubclass).toHaveBeenCalled();
    expect(component.cdr.detectChanges).toHaveBeenCalled();
    // Add more assertions as needed
  });
  it('should display error message if no policy is created', async () => {

    jest.spyOn(policyService, 'getPolicy').mockReturnValue(of(null)); 

    component.getPolicy();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(policyService, 'getPolicy').mockReturnValue(mockResponse);

    component.getPolicy();

    expect(policyService.getPolicy).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should call loadAllSubclass and handle success response', () => {

    // Stub the getAllSubclasses method of SubclassService to return a mock observable
    jest.spyOn(subclassService, 'getAllSubclasses').mockReturnValue(of(mockAllSubclassList) as any);

    // Spy on other methods or services as needed
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');
    jest.spyOn(component.cdr, 'detectChanges');

    // Trigger the method call
    component.loadAllSubclass();

    // Assert the behavior after success response
    expect(component.allSubclassList).toEqual(mockAllSubclassList);
    // Add more assertions as needed

    // Ensure that change detection has been triggered
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should display error message if no subclass are received', async () => {

    jest.spyOn(subclassService, 'getAllSubclasses').mockReturnValue(of(null)); 

    component.loadAllSubclass();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(subclassService, 'getAllSubclasses').mockReturnValue(mockResponse);

    component.loadAllSubclass();

    expect(subclassService.getAllSubclasses).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should fetch product subclasses and update subclass list', () => {
    const mockProductCode = 123;


    jest.spyOn(ProductService, 'getProductSubclasses').mockReturnValue(of(mockData));
    component.allSubclassList = mockAllSubclassList;
    jest.spyOn(component.cdr, 'detectChanges');

    component.getProductSubclass();
    // expect(ProductService.getProductSubclasses).toHaveBeenCalledWith(mockProductCode);
    expect(component.cdr.detectChanges).toHaveBeenCalled();
    expect(component.subClassList).toEqual(mockData._embedded.product_subclass_dto_list);

    // Ensure allMatchingSubclasses is correctly populated based on allSubclassList and subClassList
    const expectedMatchingSubclasses = mockAllSubclassList.filter(subclass =>
      mockData._embedded.product_subclass_dto_list.some(dataSubclass =>
        dataSubclass.sub_class_code === subclass.code
      )
    );
    expect(component.allMatchingSubclasses).toEqual(expectedMatchingSubclasses);
  });
  it('should display error message if no product subclass are received', async () => {

    jest.spyOn(ProductService, 'getProductSubclasses').mockReturnValue(of(null)); 

    component.getProductSubclass();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(ProductService, 'getProductSubclasses').mockReturnValue(mockResponse);

    component.getProductSubclass();

    expect(ProductService.getProductSubclasses).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should update selected subclass code and load covertype by subclass code', () => {
    const selectedSubclassCode = 'mockSubclassCode';
    const event = { target: { value: selectedSubclassCode } };

    // Spy on the loadCovertypeBySubclassCode and loadAllBinders methods
    const loadCovertypeBySubclassCodeSpy = jest.spyOn(component, 'loadCovertypeBySubclassCode');
    const loadAllBindersSpy = jest.spyOn(component, 'loadAllBinders');

    // Trigger the method with the mock event
    component.onSubclassSelected(event);

    // Expectations
    expect(component.selectedSubclassCode).toEqual(parseInt(selectedSubclassCode)); // Parse as integer

    expect(loadCovertypeBySubclassCodeSpy).toHaveBeenCalledWith(parseInt(selectedSubclassCode));
    expect(loadAllBindersSpy).toHaveBeenCalled();
  });
  it('should load all binders', async () => {
    // Mock data for testing


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
    await component.loadAllBinders();

    // Verify that the binderList property is set correctly
    expect(component.binderList).toEqual(mockBinderList);

    // Verify that the binderListDetails property is set correctly
    expect(component.binderListDetails).toEqual(mockBinderList._embedded.binder_dto_list);

    // Verify that the detectChanges method is called
    expect(detectChangesSpy).toHaveBeenCalled();

    // Verify that the BinderService method is called with the correct arguments
    expect(binderServiceMock.getAllBindersQuick).toHaveBeenCalledWith(component.selectedSubclassCode);
  });
  it('should display error message if no binders are received', async () => {
    const mockSubclassCode = 123;

    jest.spyOn(binderService, 'getAllBindersQuick').mockReturnValue(of(null)); 

    component.loadAllBinders();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(binderService, 'getAllBindersQuick').mockReturnValue(mockResponse);

    component.loadAllBinders();

    expect(binderService.getAllBindersQuick).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
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

  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(subclassCoverTypesService, 'getSubclassCovertypeBySCode').mockReturnValue(mockResponse);
    const mockSubclassCode = 123;

    component.loadCovertypeBySubclassCode(mockSubclassCode);

    expect(subclassCoverTypesService.getSubclassCovertypeBySCode).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should display error message if no subclass Covertypes are received', async () => {
    const mockSubclassCode = 123;

    jest.spyOn(subclassCoverTypesService, 'getSubclassCovertypeBySCode').mockReturnValue(of(null)); 

    component.loadCovertypeBySubclassCode(mockSubclassCode);

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should update selected cover type code', () => {
    const selectedCoverTypeCode = 'mockCoverTypeCode';
    const event = { target: { value: selectedCoverTypeCode } };
  
    // Trigger the method with the mock event
    component.onCoverTypeSelected(event);
  
    // Expectations
    expect(component.coverTypeCode).toEqual(parseInt(selectedCoverTypeCode)); // Parse as integer
  });
  it('should fetch vehicle makes and update vehicle make list', () => {
    const mockData = ['Make1', 'Make2']; // Mock data for vehicle makes

    // Stub the getAllSubclasses method of SubclassService to return a mock observable
    jest.spyOn(vehicleMakeService, 'getAllVehicleMake').mockReturnValue(of(mockData) as any);

    // Spy on other methods or services as needed
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');
    jest.spyOn(component.cdr, 'detectChanges');

    // Trigger the method call
    component.getVehicleMake();

    // Assert the behavior after success response
    expect(component.vehicleMakeList).toEqual(mockData as any);
    // Add more assertions as needed

    // Ensure that change detection has been triggered
    expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(vehicleMakeService, 'getAllVehicleMake').mockReturnValue(mockResponse);

    component.getVehicleMake();

    expect(vehicleMakeService.getAllVehicleMake).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should display error message if no vehicle models are received', async () => {
    jest.spyOn(vehicleMakeService, 'getAllVehicleMake').mockReturnValue(of(null)); 

    component.getVehicleMake();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should update selected vehicle make code and fetch vehicle models', () => {
    // Mock data
    const selectedValue = 'mockCode1';
    const vehicleMakeList = [
      { code: 'mockCode1', name: 'Make1' },
      { code: 'mockCode2', name: 'Make2' }
    ];
    const expectedSelectedVehicleMakeCode = 'mockCode1';
    const expectedSelectedVehicleMakeName = 'Make1';

    // Set the vehicle make list in the component
    component.vehicleMakeList = vehicleMakeList as any;

    // Call the method
    component.onVehicleMakeSelected(selectedValue);

    // Expectations
    expect(component.selectedVehicleMakeCode).toEqual(expectedSelectedVehicleMakeCode);
    expect(component.selectedVehicleMakeName).toEqual(expectedSelectedVehicleMakeName);
  });
  it('should fetch vehicle models and update filtered vehicle model list', () => {
    const mockData = {
      _embedded: {
        vehicle_model_dto_list: [
          { id: 1, vehicle_make_code: 'make1', name: 'Model1' },
          { id: 2, vehicle_make_code: 'make2', name: 'Model2' }
        ]
      }
    };
    const expectedFilteredVehicleModel = [
      { id: 1, vehicle_make_code: 'make1', name: 'Model1' }
    ];
    const selectedVehicleMakeCode = 'make1';

    // Mock the return value of the service method
    jest.spyOn(vehicleModelService, 'getAllVehicleModel').mockReturnValue(of(mockData) as any);

    // Set selected vehicle make code in the component
    component.selectedVehicleMakeCode = selectedVehicleMakeCode;

    // Call the method
    component.getVehicleModel();
    jest.spyOn(component.cdr, 'detectChanges');


    // Expectations
    // expect(vehicleModelService.getAllVehicleModel).toHaveBeenCalled();
    expect(component.vehicleModelList).toEqual(mockData);
    expect(component.vehicleModelDetails).toEqual(mockData._embedded.vehicle_model_dto_list as any);
    expect(component.filteredVehicleModel).toEqual(expectedFilteredVehicleModel);
    // expect(component.cdr.detectChanges).toHaveBeenCalled();
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(vehicleModelService, 'getAllVehicleModel').mockReturnValue(mockResponse);

    component.getVehicleModel();

    expect(vehicleModelService.getAllVehicleModel).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should display error message if no vehicle models are received', async () => {
    jest.spyOn(vehicleModelService, 'getAllVehicleModel').mockReturnValue(of(null)); 

    component.getVehicleModel();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Empty response received from the server.');
  });
  it('should update selected vehicle model name and vehicle make model', () => {
    const selectedVehicleModel = { code: 'model1', name: 'Model1' };
    const expectedSelectedVehicleModelName = 'Model1';
    const expectedVehicleMakeModel = component.selectedVehicleMakeName + ' ' + expectedSelectedVehicleModelName;

    // Set filtered vehicle model list in the component
    component.filteredVehicleModel = [selectedVehicleModel];

    // Call the method
    component.onVehicleModelSelected(selectedVehicleModel.code);

    // Expectations
    expect(component.selectedVehicleModelName).toEqual(expectedSelectedVehicleModelName);
    expect(component.vehiclemakeModel).toEqual(expectedVehicleMakeModel);
  });
  // it('should handle case when selected vehicle model is not found', () => {
  //   const selectedVehicleModelCode = 'nonExistentCode';

  //   // Spy on console.error to capture the output
  //   const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

  //   // Call the method with a non-existent vehicle model code
  //   component.onVehicleModelSelected(selectedVehicleModelCode);

  //   // Expectations
  //   expect(consoleErrorSpy).toHaveBeenCalledWith('Selected Vehicle Model not found');
  //   // Ensure selectedVehicleModelName and vehiclemakeModel are not updated
  //   expect(component.selectedVehicleModelName).toBeUndefined();
  //   expect(component.vehiclemakeModel).toBeUndefined();
  // });
  it('should get user details', () => {
    

    jest.spyOn(staffService, 'getStaffById').mockReturnValue(of(userDetailsMock) as any);

    // Spy on other methods or services as needed
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');

    component.userId = 123; 

    component.getUserDetails();

    expect(component.detailedUserInfo).toEqual(userDetailsMock);
    expect(component.userCountryCode).toEqual(userDetailsMock.countryCode);
    // Add more assertions as needed

  });
  it('should display error message if no user details are received', async () => {
    jest.spyOn(staffService, 'getStaffById').mockReturnValue(of(null)); 

    component.getUserDetails();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(staffService, 'getStaffById').mockReturnValue(mockResponse);

    component.getUserDetails();

    expect(staffService.getStaffById).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should get risk locations', () => {
    
    jest.spyOn(countryService, 'getMainCityStatesByCountry').mockReturnValue(of(mockState) as any);

    // Spy on other methods or services as needed
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');

    component.userId = 123; 

    component.getRiskLocation();

    expect(component.statesList).toEqual(mockState as any);

  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(countryService, 'getMainCityStatesByCountry').mockReturnValue(mockResponse);

    component.getRiskLocation();

    expect(countryService.getMainCityStatesByCountry).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
  it('should display error message if no states are received', async () => {
    jest.spyOn(countryService, 'getMainCityStatesByCountry').mockReturnValue(of(null)); 

    component.getRiskLocation();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Empty response received from the server.');
  });
  it('should call getRiskTown when state is selected', () => {
    const selectedStateId = 123; // Example selected state ID

    // Mocking getRiskTown method
    component.getRiskTown = jest.fn();

    // Call the method
    component.onStateSelected(selectedStateId);

    // Expectations
    expect(component.selectedStateId).toEqual(selectedStateId);
    expect(component.getRiskTown).toHaveBeenCalled();
    // expect(mockLogger.debug).toHaveBeenCalledWith('SELECTED State Id:', selectedStateId);
  });
  it('should get risk Towns', () => {
    
    jest.spyOn(countryService, 'getTownsByMainCityState').mockReturnValue(of(mockTown) as any);

    // Spy on other methods or services as needed
    jest.spyOn(component.globalMessagingService, 'displayErrorMessage');

    component.userId = 123; 

    component.getRiskTown();

    expect(component.townList).toEqual(mockTown as any);

  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(countryService, 'getTownsByMainCityState').mockReturnValue(mockResponse);

    component.getRiskTown();

    expect(countryService.getTownsByMainCityState).toHaveBeenCalled();

    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        // Additional expectations to ensure proper error handling
        expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  });
   it('should display error message if no towns are received', async () => {
    jest.spyOn(countryService, 'getTownsByMainCityState').mockReturnValue(of(null)); // Mock empty response

    component.getRiskTown();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Empty response received from the server.');
  });
  it('should set userCountryName if country is found', async () => {
    const mockUserCountryCode = 1;

    jest.spyOn(countryService, 'getCountries').mockReturnValue(of(mockCountries) as any);
    component.userCountryCode = mockUserCountryCode
    component.getRiskTerritory();

    expect(component.countryList).toEqual(mockCountries);

    expect(component.userCountryName).toEqual('United States');
  });
  it('should display error message if countries response is empty', async () => {
    jest.spyOn(countryService, 'getCountries').mockReturnValue(of([]));

    component.getRiskTerritory();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('Empty response received from the server.');
  });
  it('should display error message if an error occurs during HTTP request', async () => {
    const mockError = new Error('An error occurred');
    jest.spyOn(countryService, 'getCountries').mockReturnValue(throwError(mockError));

    component.getRiskTerritory();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('An error occurred while fetching countries.');
  });
  it('should display error message if country is not found', async () => {
    const mockUserCountryCode = 56; // Mock user's country code that does not exist in the mock data
  
   
  
    jest.spyOn(countryService, 'getCountries').mockReturnValue(of(mockCountries)as any);
  
   
    component.userCountryCode = mockUserCountryCode
    component.getRiskTerritory();

  
    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toEqual('User country not found in the list.');
  });
  it('should fetch premiums correctly', () => {
    const binderCode = '123';
    const subclassCode = 456;
    const passedSections = [
      { sectionCode: 123 },
      { sectionCode: 254 }
    ];
  
    // Mock FormGroup with a binderCode control
    const mockFormGroup = new FormGroup({
      binderCode: new FormControl(binderCode)
    });
  
    // Spy on the get method of the FormGroup
    const getSpy = jest.spyOn(mockFormGroup, 'get').mockReturnValue(new FormControl(binderCode));
  
    // Assign the mock FormGroup to component's policyRiskForm
    component.policyRiskForm = mockFormGroup;
  
    component.selectedSubclassCode = subclassCode;
  
    // Mock premiumRateService.getAllPremiums responses
    const mockPremiumResponseA = [{ premium: 100 }];
    const mockPremiumResponseB = [{ premium: 150 }];
  
    jest.spyOn(premiumService, 'getAllPremiums').mockReturnValueOnce(of(mockPremiumResponseA));
    jest.spyOn(premiumService, 'getAllPremiums').mockReturnValueOnce(of(mockPremiumResponseB));
  
    // Call the method with mocked data
    component.getPremium(passedSections);
  
    // Expectations
    expect(component.selectedBinder).toEqual(parseInt(binderCode)); 
      
    expect(getSpy).toHaveBeenCalledWith('binderCode');
    expect(premiumService.getAllPremiums).toHaveBeenCalledWith(123, parseInt(binderCode), subclassCode);
    expect(premiumService.getAllPremiums).toHaveBeenCalledWith(254, parseInt(binderCode), subclassCode);
  
    // Simulate forkJoin completion (assuming you use Angular's testing utilities for async testing)
    // Ensure that the premiumList is updated correctly after service call completion
    expect(component.premiumList).toEqual([...mockPremiumResponseA, ...mockPremiumResponseB]);
  });
  it('should return true if description contains searchText (case-insensitive)', () => {
    // Set up test data
    component.searchText = 'sum'; // Text to search for
    const description = 'Sum Insured'; // Description to test against

    // Call the method with the test data
    const result = component.matchesSearch(description);

    // Expectations
    expect(result).toBe(true); 
  });
  it('should add a section to selectedSections and populate allTransformedSections when section is not yet selected', () => {
    // Arrange
    const section = { code: 'sectionCode1' };
    component.selectedSections = [];
    component.allTransformedSections = [];

    // Simulate necessary dependencies (e.g., covertypeSections, selectedCoverType) for the method
    component.covertypeSections = [
      { sectionCode: 'sectionCode1', coverTypeShortDescription: 'CoverTypeA' },
      { sectionCode: 'sectionCode1', coverTypeShortDescription: 'CoverTypeB' }
    ];
    component.selectedCoverType = { coverTypeShortDescription: 'CoverTypeA' }; // Set a selected cover type

    const initialSelectedCount = component.selectedSections.length;

    // Act
    component.onCheckboxChange(section);

    // Assert
    expect(component.selectedSections.length).toBe(initialSelectedCount + 1); // One section should be added
    expect(component.selectedSections).toContain(section); // New section should be in selectedSections array

    // Check that allTransformedSections is populated based on the selected cover type
    const transformedSections = component.allTransformedSections;
    expect(transformedSections.length).toBeGreaterThan(0); // Check that transformed sections are populated
    // Additional assertions based on the expected behavior of allTransformedSections
  });
  it('should remove a section from selectedSections when section is already selected', () => {
    // Arrange
    const section = { code: 'sectionCode2' };
    component.selectedSections = [section];
    const initialSelectedCount = component.selectedSections.length;

    // Act
    component.onCheckboxChange(section);

    // Assert
    expect(component.selectedSections.length).toBe(initialSelectedCount - 1); // One section should be removed
    expect(component.selectedSections).not.toContain(section); // Removed section should not be in selectedSections array
    // Add more specific assertions based on the expected behavior
  });
  
  // it('should log a debug message when no matching sections are found', () => {
  //   // Arrange
  //   const section = { code: 'sectionCode1' };
  //   component.selectedSections = [];
  //   component.covertypeSections = [
  //     { sectionCode: 'sectionCode2', coverTypeShortDescription: 'CoverTypeA' },
  //     { sectionCode: 'sectionCode3', coverTypeShortDescription: 'CoverTypeB' }
  //   ]; // Ensure no sections match the filter criteria
  //   component.selectedCoverType = { coverTypeShortDescription: 'CoverTypeA' };

  //   // Act
  //   component.onCheckboxChange(section);

  //   // Assert
  //   expect(mockLogger).toHaveBeenCalled(); // Check if logger was called
  //   expect(mockLogger).toHaveBeenCalledWith(
  //     'No matching sections found for',
  //     section
  //   );
  // });




  
});
