import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QuoteSummaryComponent } from './quote-summary.component';
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
import { JwtService, Logger } from '../../../../../../shared/services';
import { APP_BASE_HREF } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedModule, untilDestroyed } from '../../../../../../shared/shared.module';
import { Binders, Premiums, Products, Subclass, Subclasses, subclassCoverTypeSection } from '../../../setups/data/gisDTO';
import { RouterTestingModule } from '@angular/router/testing';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { Limit } from '../../data/quotationsDTO';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';



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
// export class MockGlobalMessageService {
//   displayErrorMessage = jest.fn((summary, detail) => {
//     return;
//   });
//   displaySuccessMessage = jest.fn((summary, detail) => {
//     return;
//   });
// }
export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => { });
  displaySuccessMessage = jest.fn((summary, detail) => { });
  displayInfoMessage = jest.fn((summary, detail) => { }); // Add this line to mock displayInfoMessage
}

const mockQuotationDetails = {
  quotCode: null,
  quotPrpCode: 221243788,
  quotNo: null,
  quotRevisionNo: 0,
  quotPropHoldingCoPrpCode: null,
  quotAgntShtDesc: "DIRECT",
  quotCurCode: 268,
  coverFrom: "2025-01-07",
  coverTo: "2026-01-06",
  quotTotPropertyVal: null,
  quotComments: null,
  quotStatus: null,
  quotExpiryDate: null,
  quotOk: "N",
  quotPremium: 0,
  quotCommAmt: null,
  quotInternalComments: null,
  quotAuthorisedBy: null,
  quotAuthorisedDt: null,
  quotConfirmed: null,
  quotConfirmedBy: null,
  quotConfirmedDt: null,
  quotReady: null,
  quotReadyBy: null,
  quotReadyDate: null,
  quotRevised: "N",
  quotPreparedBy: null,
  quotFactor: null,
  quotGspCode: null,
  quotDivCode: null,
  quotAgnWithin: "Y",
  quotNewAgent: null,
  quotIncsCode: null,
  quotWeb: "Y",
  quotIntroCode: null,
  sourceCode: null,
  quotChequeRequistion: null,
  quotParentRevision: null,
  quotSubAgnCode: null,
  quotSubAgnShtDesc: null,
  quotSubCommAmt: null,
  quotPrsCode: null,
  quotMktrAgnCode: null,
  quotClntType: "I",
  marketerCommissionAmount: null,
  quotOriginalQuotNo: "Q/HDO/MAC/25/0000001",
  quotTrvDstCouCode: null,
  quotRemarks: null,
  quotCancelReasons: null,
  quotWclntCode: null,
  quotTcbCode: null,
  quotClntRef: null,
  quotLoanDisbursed: "N",
  quotTenderNumber: null,
  preparedDt: "2025-01-07",
  quotCancelReason: null,
  quotCmpCode: null,
  quotSourceCampaign: null,
  frequencyOfPayment: "A",
  quotCurRate: null,
  quotWebPolId: null,
  quotTravelQuote: "N",
  likelihood: null,
  quotQscCode: null,
  quotLtaCommAmt: null,
  ginQuotations: null,
  quotPipCode: null,
  quotOrgCode: null,
  rfqDate: null,
  quotMultiUser: null,
  quoteSubQuote: "N",
  quotPremFixed: "N",
  dateCreated: "2025-01-07",
  agentCode: 0,
  currency: "NGN",
  quotationProducts: [
    {
      code: 2024137989,
      proCode: 8173,
      quotCode: 202547085,
      productShortDescription: "MARINE CARGO",
      quotationNo: null,
      premium: null,
      revisionNo: 0,
      totalSumInsured: 890000,
      commission: null,
      binder: null,
      agentShortDescription: null,
      wef: "2025-01-07",
      wet: "2026-01-06"
    }
  ],
  riskInformation: [
    {
      insuredCode: null,
      location: null,
      town: null,
      ncdLevel: null,
      schedules: null,
      coverTypeCode: 305,
      addEdit: null,
      quotRevisionNo: 0,
      code: 20242186498,
      quotationRiskNo: "Q/HDO/MAC/25/0000001",
      quotationCode: 202547085,
      value: 890000,
      propertyId: "366",
      coverTypeShortDescription: "STD",
      sectionsDetails: [
        {
          code: 426529,
          description: "CL",
          limitAmount: 890000,
          freeLimit: 0,
          rate: 0.149,
          premium: 0,
          rateType: "FXD",
          sectionShortDescription: "CL",
          rowNumber: 1,
          calculationGroup: 1
        },
        {
          code: 426530,
          description: "ML",
          limitAmount: 90000,
          freeLimit: 0,
          rate: 10,
          premium: 0,
          rateType: "FXD",
          sectionShortDescription: "ML",
          rowNumber: 1,
          calculationGroup: 1
        }
      ],
      scheduleDetails: null,
      premium: null,
      sclCode: 301,
      itemDesc: "STD",
      quotProCode: 2024137989,
      binderCode: 20207154,
      wef: "2025-01-07",
      wet: "2026-01-06",
      commRate: null,
      commAmount: null,
      prpCode: 221243788,
      prpShtDesc: null,
      annualPrem: null,
      coverDays: 365,
      clntType: "I",
      prsCode: null,
      coverTypeDescription: "STANDARD"
    }
  ],
  branchCode: 1,
  taxInformation: [
    {
      rateDescription: "PHFUND",
      quotationRate: 0.25,
      rateType: "FXD",
      taxAmount: null
    },
    {
      rateDescription: "SD",
      quotationRate: 0.075,
      rateType: "FXD",
      taxAmount: null
    }
  ],
  source: null,
  agentName: "DIRECT",
  clientName: "DOE",
  sumInsured: 0,
  clientCode: null
};

export const mockClient: ClientDTO = {
  branchCode: 123,
  category: 'Individual',
  clientTitle: 'Mr.',
  clientType: {
    category: 'Person',
    clientTypeName: 'Individual',
    code: 456,
    description: 'Individual client',
    organizationId: 789,
    person: 'Natural',
    type: 'PersonType',
  },
  country: 1,
  createdBy: 'admin',
  dateOfBirth: '1990-01-01',
  emailAddress: 'john.doe@example.com',
  firstName: 'John',
  gender: 'Male',
  id: 101,
  idNumber: '123456789',
  lastName: 'Doe',
  modeOfIdentity: 'ID Card',
  occupation: {
    id: 201,
    name: 'Software Developer',
    sector_id: 301,
    short_description: 'Dev',
  },
  passportNumber: 'ABC123456',
  phoneNumber: '+1234567890',
  physicalAddress: '123 Main Street, City',
  pinNumber: '987654',
  shortDescription: 'Individual Client',
  status: 'Active',
  withEffectFromDate: '2020-01-01',
  clientTypeName: 'Individual',
  clientFullName: 'Mr. John Doe',
  mobileNumber: '',
  state: '',
  town: ''
};





describe('QuoteSummaryComponent', () => {
  let component: QuoteSummaryComponent;
  let fixture: ComponentFixture<QuoteSummaryComponent>;
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
  let routerSpy: jest.Mocked<Router>;
  // let router: Router;
  let router;
  let ngZone;



  beforeEach(() => {
    jest.mock('@angular/router', () => ({
      ...jest.requireActual('@angular/router'),
      Router: jest.fn(),
    }));
    // Mock the router
    router = {
      navigate: jest.fn()
    };
    // / Mock the NgZone
    ngZone = {
      run: jest.fn((fn) => fn())  // Executes the provided function immediately
    };



    TestBed.configureTestingModule({
      declarations: [QuoteSummaryComponent],
      imports: [
        HttpClientTestingModule,
        //  SharedModule, 
        //  FormsModule, 
        //  RouterTestingModule
        TranslateModule.forRoot(),

      ],
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
        // { provide: Router, useFactory: spy },

        GlobalMessagingService, MessageService, Router,
        FormBuilder,
        { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis/setups/api/v1' } } } }

      ],
    })
      .compileComponents();
    fixture = TestBed.createComponent(QuoteSummaryComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;

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

    component.fb = TestBed.inject(FormBuilder);
    // jest.spyOn(component, 'getClient').mockReturnValue(undefined);
    // jest.spyOn(component, 'getQuotationProduct').mockReturnValue(undefined);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should load client quotation details', () => {


  //   jest.spyOn(quotationService, 'getClientQuotations').mockReturnValue(of(mockQuotationDetails));

  //   component.loadClientQuotation();

  //   // Expectations for the state changes or actions triggered by the method
  //   expect(component.quotationDetails).toEqual(mockQuotationDetails);
  //   expect(component.quotationNo).toEqual(mockQuotationDetails.quotOriginalQuotNo);
  //   expect(component.insuredCode).toEqual(mockQuotationDetails.quotPrpCode);
  //   expect(component.coverFrom).toEqual(mockQuotationDetails.coverFrom);
  //   expect(component.coverTo).toEqual(mockQuotationDetails.coverTo);
  //   expect(component.productCode).toEqual(mockQuotationDetails.quotationProducts[0].proCode);

  //   // Example of testing a function call
  //   // expect(component.getClient).toHaveBeenCalled();
  //   // expect(component.getQuotationProduct).toHaveBeenCalled();


  // });
  test('should load client quotation details', () => {
    // Mock the response of getClientQuotations method
    jest.spyOn(quotationService, 'getClientQuotations').mockReturnValue(of(mockQuotationDetails));

    // Spy on the methods that should be called within loadClientQuotation
    jest.spyOn(component, 'calculateTaxes');
    jest.spyOn(component, 'getPremiumAmount');
    jest.spyOn(component, 'getClient');
    jest.spyOn(component, 'getQuotationProduct');

    // Call the method to test
    component.loadClientQuotation();

    // Expectations for the state changes or actions triggered by the method
    expect(component.quotationDetails).toEqual(mockQuotationDetails);
    expect(component.quotationNo).toEqual(mockQuotationDetails.quotOriginalQuotNo);
    expect(component.insuredCode).toEqual(mockQuotationDetails.quotPrpCode);
    expect(component.coverFrom).toEqual(mockQuotationDetails.coverFrom);
    expect(component.coverTo).toEqual(mockQuotationDetails.coverTo);
    expect(component.productCode).toEqual(mockQuotationDetails.quotationProducts[0].proCode);
    expect(component.quoteDate).toEqual(mockQuotationDetails.quotationProducts[0].wef);
    expect(component.agentDesc).toEqual(mockQuotationDetails.quotationProducts[0].agentShortDescription);

    // Check if internal methods were called
    expect(component.calculateTaxes).toHaveBeenCalled();
    expect(component.getPremiumAmount).toHaveBeenCalled();
    expect(component.getClient).toHaveBeenCalled();
    expect(component.getQuotationProduct).toHaveBeenCalled();
  });
  // it('should toggle showOptions property', () => {
  //   const mockItem = { showOptions: false };

  //   component.showOptions(mockItem);

  //   expect(mockItem.showOptions).toBe(true);

  //   // Call showOptions again to toggle it back
  //   component.showOptions(mockItem);

  //   expect(mockItem.showOptions).toBe(false);
  // });

  // it('should log "Edit item clicked"', () => {
  //   const consoleSpy = jest.spyOn(console, 'log');
  //   const mockItem = { /* some mock data */ };

  //   component.editItem(mockItem);

  //   expect(consoleSpy).toHaveBeenCalledWith('Edit item clicked', mockItem);
  // });

  // it('should log "Delete item clicked"', () => {
  //   const consoleSpy = jest.spyOn(console, 'log');
  //   const mockItem = { /* some mock data */ };

  //   component.deleteItem(mockItem);

  //   expect(consoleSpy).toHaveBeenCalledWith('Delete item clicked', mockItem);
  // });

  it('should set clientDetails and selectedClientName on successful getClientById', fakeAsync(() => {

    // Mock the service method
    jest.spyOn(clientService, 'getClientById').mockReturnValue(of(mockClient));

    // Set initial value for insuredCode
    component.insuredCode = 1234;

    // Call the method
    console.log('Before getClient:', component.clientDetails);
    component.getClient();
    console.log('After getClient:', component.clientDetails);

    // Simulate asynchronous operation completion
    tick();

    // Expectations for the state changes or actions triggered by the method
    expect(component.clientDetails).toEqual(mockClient);
    expect(component.selectedClientName).toEqual('John Doe');
  }));


  it('should set quotationproduct and productDesc on successful getProductByCode', fakeAsync(() => {
    const mockQuotationProduct = {
      description: 'Some product description',
      // ... (other product details)
    };

    // Mock the service method
    jest.spyOn(productService, 'getProductByCode').mockReturnValue(of(mockQuotationProduct as any));

    // Set initial value for productCode
    component.productCode = 'someProductCode';

    // Call the method
    component.getQuotationProduct();

    // Simulate asynchronous operation completion
    tick();

    // Expectations for the state changes or actions triggered by the method
    expect(component.quotationproduct).toEqual(mockQuotationProduct);
    expect(component.productDesc).toEqual(mockQuotationProduct.description);
  }));

  // it('should navigate to "/home/gis/quotation/quotations-client-details"', () => {
  //   // Act
  //   component.acceptQuote();

  //   // Assert
  //   // Since Router is part of the mocked module, TestBed.inject(Router) will work without providing a custom mock
  //   expect(component['router'].navigate).toHaveBeenCalledWith(['/home/gis/quotation/quotations-client-details']);
  // });

  it('should set sessionStorage', (() => {
    // Mock the necessary properties
    component.quotationDetails = mockQuotationDetails;
    component.clientDetails = mockClient;
    component.isAddRisk = true;

    // Mock the sessionStorage.setItem method
    // const setItemSpy = jest.spyOn(sessionStorage, 'setItem');

    // Mock the router.navigate method
    // const navigateSpy = jest.spyOn(router, 'navigate');

    // Call the method
    component.addAnotherRisk();

    // Simulate asynchronous operation completion

    sessionStorage.setItem('passedQuotationDetails', 'JSON.stringify(component.quotationDetails');
    sessionStorage.setItem('passedClientDetails', 'JSON.stringify(component.clientDetails');
    sessionStorage.setItem('isAddRisk', 'JSON.stringify(component.isAddRisk');


    // Additional expectations if needed
    // expect(navigateSpy).toHaveBeenCalledWith(['/home/gis/quotation/quick-quote']);
    // expect(router.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quote-summary']);

  }));
  // it('should store data in sessionStorage and log correctly', () => {
  //   const mockQuotationDetails = { /* mock quotation details */ };
  //   const mockClientDetails = { /* mock client details */ };
  //   const mockIsAddRisk = true; // Or any mock value you want

  //   component.quotationDetails = mockQuotationDetails;
  //   component.clientDetails = mockClient;
  //   component.isAddRisk = true;

  //   const spySetItem = spyOn(sessionStorage, 'setItem').and.callThrough();
  //   // const spyDebug = spyOn(loggerService, 'debug');

  //   component.addAnotherRisk();

  //   expect(spySetItem).toHaveBeenCalledTimes(3);
  //   expect(spySetItem.calls.allArgs()).toEqual([
  //     ['passedQuotationDetails', JSON.stringify(mockQuotationDetails)],
  //     ['passedClientDetails', JSON.stringify(mockClientDetails)],
  //     ['isAddRisk', JSON.stringify(mockIsAddRisk)]
  //   ]);

  //   // expect(spyDebug).toHaveBeenCalledTimes(4);
  //   // expect(spyDebug.calls.allArgs()).toEqual([
  //   //   ['isAddRisk:', mockIsAddRisk],
  //   //   ['quotation number:', component.quotationNo],
  //   //   ['Quotation Details:', mockQuotationDetails],
  //   //   ['Selected Client Details', mockClientDetails]
  //   // ]);
  // });
  // it('should store values in sessionStorage and log debug messages', () => {
  //   // Arrange
  //   spyOn(sessionStorage, 'setItem');
  //   spyOn(console, 'debug');

  //   // Act
  //   component.addAnotherRisk();

  //   // Assert
  //   // Check if sessionStorage.setItem was called with the expected parameters
  //   expect(sessionStorage.setItem).toHaveBeenCalledWith('passedQuotationDetails', JSON.stringify(component.quotationDetails));
  //   expect(sessionStorage.setItem).toHaveBeenCalledWith('passedClientDetails', JSON.stringify(component.clientDetails));
  //   expect(sessionStorage.setItem).toHaveBeenCalledWith('isAddRisk', JSON.stringify(component.isAddRisk));

  //   // Check if console.debug was called with the expected parameters
  //   expect(console.debug).toHaveBeenCalledWith('isAddRisk:', component.isAddRisk);
  //   expect(console.debug).toHaveBeenCalledWith('quotation number:', component.quotationNo);
  //   expect(console.debug).toHaveBeenCalledWith('Quotation Details:', component.quotationDetails);
  //   expect(console.debug).toHaveBeenCalledWith('Selected Client Details', component.clientDetails);
  // });


 
  test('should handle risk selection and call related methods', () => {
    // Mock the methods that should be called within onRiskSelect
    jest.spyOn(component, 'fetchClauses');
    jest.spyOn(component, 'fetchExcesses');
    jest.spyOn(component, 'fetchLimitsOfLiability');

    const riskItem = { riskCode: 'R001', description: 'Sample Risk' };  // Example risk item

    // Call the onRiskSelect method with the mock riskItem
    component.onRiskSelect(riskItem);

    // Expectations
    expect(component.selectedRisk).toEqual(riskItem); // Ensure selectedRisk is set correctly
    expect(component.fetchClauses).toHaveBeenCalled(); // Ensure fetchClauses was called
    expect(component.fetchExcesses).toHaveBeenCalled(); // Ensure fetchExcesses was called
    expect(component.fetchLimitsOfLiability).toHaveBeenCalled(); // Ensure fetchLimitsOfLiability was called
  });

  test('should return 0 if sectionsDetails is null or undefined', () => {
    // Test case when sectionsDetails is null
    expect(component.getSumInsuredForSection(null, 'Sample Section')).toBe(0);

    // Test case when sectionsDetails is undefined
    expect(component.getSumInsuredForSection(undefined, 'Sample Section')).toBe(0);
  });
  test('should return the correct limitAmount when sectionDescription matches', () => {
    const sectionsDetails = [
      { description: 'Sample Section', limitAmount: 1000 },
      { description: 'Other Section', limitAmount: 2000 }
    ];

    // Test case when sectionDescription matches
    expect(component.getSumInsuredForSection(sectionsDetails, 'Sample Section')).toBe(1000);
  });
  test('should set showHelperModal to true when openHelperModal is called', () => {
    const selectedClause = { showHelperModal: false }; // initial state

    // Call the openHelperModal method
    component.openHelperModal(selectedClause);

    // Expect showHelperModal to be set to true
    expect(selectedClause.showHelperModal).toBe(true);
  });

  test('should update modalHeight when onResize is called with an event', () => {
    const event = { height: 500 }; // Example event with height

    // Call the onResize method
    component.onResize(event);

    // Expect modalHeight to be updated with the event height
    expect(component.modalHeight).toBe(500);
  });
  test('should calculate total taxes and populate taxList correctly', () => {
    // Mock the quotationDetails and its taxInformation
    component.quotationDetails = {
      taxInformation: [
        { taxAmount: 100, rateDescription: 'Tax 1', quotationRate: 10, rateType: 'percentage' },
        { taxAmount: 200, rateDescription: 'Tax 2', quotationRate: 20, rateType: 'fixed' }
      ]
    };

    // Spy on the log methods with mockImplementation
    const infoSpy = jest.spyOn(console, 'info').mockImplementation();
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Call the calculateTaxes method
    component.calculateTaxes();

    // Check if totalTaxes is calculated correctly
    expect(component.totalTaxes).toBe(300);  // 100 + 200 = 300

    // Check if taxList is populated correctly
    expect(component.taxList).toEqual([
      { description: 'Tax 1', amount: 100, rate: 10, rateType: 'percentage' },
      { description: 'Tax 2', amount: 200, rate: 20, rateType: 'fixed' }
    ]);

    // Ensure that the logs are called with the correct arguments
    // expect(infoSpy).toHaveBeenCalledWith("CALCULATE TAXES XALLED method starts");

    // // Check that debug logs are triggered as expected
    // expect(debugSpy).toHaveBeenCalledWith("Total Taxes:", 300);  // Directly check for 300
    // expect(debugSpy).toHaveBeenCalledWith("Total Taxes List:", [
    //   { description: 'Tax 1', amount: 100, rate: 10, rateType: 'percentage' },
    //   { description: 'Tax 2', amount: 200, rate: 20, rateType: 'fixed' }
    // ]);

    // Restore the spies after the test
    infoSpy.mockRestore();
    debugSpy.mockRestore();
  });


  test('should calculate premium amount correctly after deducting total taxes', () => {
    // Mock the quotationDetails with premium and tax information
    component.quotationDetails = {
      quotationProducts: [
        { premium: 1000 } // Mock premium amount
      ],
      taxInformation: [
        { taxAmount: 100 },
        { taxAmount: 50 }
      ]
    };

    // Spy on the log.debug method to check if it logs correctly
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });

    // Call the getPremiumAmount method
    component.getPremiumAmount();

    // Check if totalTaxes are calculated correctly
    expect(component.totalTaxes).toBe(150); // 100 + 50 = 150

    // Check if premiumAmount is calculated correctly (1000 - 150 = 850)
    expect(component.premiumAmount).toBe(850);

    // Check if the logs are called with the expected messages
    // expect(debugSpy).toHaveBeenCalledWith("Total Taxes:", 150);
    // expect(debugSpy).toHaveBeenCalledWith("premium amount:", 850);

    // Restore the spy after test
    debugSpy.mockRestore();
  });
  test('should generate correct tax tooltip string', () => {
    // Mock the taxList
    component.taxList = [
      { description: 'Tax 1', amount: 100, rate: 10, rateType: 'percentage' },
      { description: 'Tax 2', amount: 200, rate: 20, rateType: 'fixed' }
    ];

    // Call the getTaxTooltip method
    const tooltip = component.getTaxTooltip();

    // Define the expected tooltip string
    const expectedTooltip = `Tax 1: 100\nRate Type: percentage\n Rate: 10\n\nTax 2: 200\nRate Type: fixed\n Rate: 20`;

    // Check if the tooltip is generated correctly
    expect(tooltip).toBe(expectedTooltip);
  });
  test('should fetch clauses successfully and populate clauseList', () => {
    // Mock the response from getClauses with data matching the Clause interface
    const mockResponse = {
      _embedded: [
        { code: 1, coverTypeCode: 101, subclassCode: 202, classShortDescription: 'Clause 1', heading: 'Heading 1', isMandatory: 'Yes' },
        { code: 2, coverTypeCode: 102, subclassCode: 203, classShortDescription: 'Clause 2', heading: 'Heading 2', isMandatory: 'No' }
      ]
    };

    const getClausesMock = jest.spyOn(quotationService, 'getClauses').mockReturnValue(of(mockResponse) as any);

    // Spy on the log.debug method
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Spy on the global messaging service
    const displayErrorMessageSpy = jest.spyOn(globalMessagingService, 'displayErrorMessage').mockImplementation();

    // Set up the selectedRisk and selectedSubclassCode to trigger the method
    component.selectedRisk = { coverTypeCode: 101 };
    component.selectedSubclassCode = 202;

    // Call the fetchClauses method
    component.fetchClauses();

    // Check if getClauses was called with the correct arguments
    expect(getClausesMock).toHaveBeenCalledWith(101, 202);

    // Check if clauseList was populated correctly
    expect(component.clauseList).toEqual(mockResponse._embedded);

    // Check if log.debug was called with the correct arguments
    // expect(debugSpy).toHaveBeenCalledWith("Clause List ", mockResponse._embedded);

    // Ensure no error message was displayed
    expect(displayErrorMessageSpy).not.toHaveBeenCalled();

    // Restore the spies
    getClausesMock.mockRestore();
    debugSpy.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });
  test('should handle error and display error message when fetch fails', () => {
    // Mock the error response from getClauses
    const getClausesMock = jest.spyOn(quotationService, 'getClauses').mockReturnValue(throwError('Error'));

    // Spy on the global messaging service
    const displayErrorMessageSpy = jest.spyOn(globalMessagingService, 'displayErrorMessage').mockImplementation();

    // Call the fetchClauses method
    component.fetchClauses();

    // Check if the error message is displayed
    expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Failed to fetch clauses. Try again later');

    // Restore the spies
    getClausesMock.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });
  test('should fetch excesses successfully and populate excessesList', () => {
    // Mock the response from getExcesses with data matching the Excesses interface
    const mockResponse = {
      _embedded: [
        { code: 1, narration: 'Excess 1', value: '100', subclassCode: 202, quotationValueCode: 301 },
        { code: 2, narration: null, value: '200', subclassCode: 203, quotationValueCode: 302 }
      ]
    };

    const getExcessesMock = jest.spyOn(quotationService, 'getExcesses').mockReturnValue(of(mockResponse));

    // Spy on the log.debug method
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Spy on the global messaging service
    const displayErrorMessageSpy = jest.spyOn(globalMessagingService, 'displayErrorMessage').mockImplementation();

    // Set up the selectedSubclassCode to trigger the method
    component.selectedSubclassCode = 202;

    // Call the fetchExcesses method
    component.fetchExcesses();

    // Check if getExcesses was called with the correct argument
    expect(getExcessesMock).toHaveBeenCalledWith(202);

    // Check if excessesList was populated correctly
    expect(component.excessesList).toEqual(mockResponse._embedded);

    // Check if log.debug was called with the correct arguments
    // expect(debugSpy).toHaveBeenCalledWith("Excesses List ", mockResponse._embedded);

    // Ensure no error message was displayed
    expect(displayErrorMessageSpy).not.toHaveBeenCalled();

    // Restore the spies
    getExcessesMock.mockRestore();
    debugSpy.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });
  test('should handle error and display error message when fetch fails', () => {
    // Mock the error response from getExcesses
    const getExcessesMock = jest.spyOn(quotationService, 'getExcesses').mockReturnValue(throwError('Error'));

    // Spy on the global messaging service
    const displayErrorMessageSpy = jest.spyOn(globalMessagingService, 'displayErrorMessage').mockImplementation();

    // Call the fetchExcesses method
    component.fetchExcesses();

    // Check if the error message is displayed
    expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Failed to fetch excesses. Try again later');

    // Restore the spies
    getExcessesMock.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });
  test('should fetch limits of liability successfully and populate limitsOfLiabilityList', () => {
    // Mock response conforming to the LimitsOfLiability interface
    const mockResponse = {
      _embedded: [
        {
          code: 1,
          narration: 'Limit 1',
          value: '1000',
          subclassCode: 202,
          quotationValueCode: 101
        },
        {
          code: 2,
          narration: 'Limit 2',
          value: '2000',
          subclassCode: 202,
          quotationValueCode: 102
        },
      ],
    };

    const getLimitsOfLiabilityMock = jest
      .spyOn(quotationService, 'getLimitsOfLiability')
      .mockReturnValue(of(mockResponse));

    // Spy on log.debug
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Spy on globalMessagingService
    const displayErrorMessageSpy = jest
      .spyOn(globalMessagingService, 'displayErrorMessage')
      .mockImplementation();

    // Set up selectedSubclassCode
    component.selectedSubclassCode = 202;

    // Call the fetchLimitsOfLiability method
    component.fetchLimitsOfLiability();

    // Ensure getLimitsOfLiability was called with correct argument
    expect(getLimitsOfLiabilityMock).toHaveBeenCalledWith(202);

    // Check if limitsOfLiabilityList is populated correctly
    expect(component.limitsOfLiabilityList).toEqual(mockResponse._embedded);

    // Check if log.debug was called with the correct arguments
    // expect(debugSpy).toHaveBeenCalledWith('Limits of Liability List ', mockResponse._embedded);

    // Ensure no error message was displayed
    expect(displayErrorMessageSpy).not.toHaveBeenCalled();

    // Restore spies
    getLimitsOfLiabilityMock.mockRestore();
    debugSpy.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });

  test('should handle error and display error message when fetch fails', () => {
    // Mock error response from getLimitsOfLiability

    const getLimitsOfLiabilityMock = jest.spyOn(quotationService, 'getLimitsOfLiability').mockReturnValue(throwError('Error'));

    // Spy on globalMessagingService
    const displayErrorMessageSpy = jest.spyOn(globalMessagingService, 'displayErrorMessage').mockImplementation();

    // Call the fetchLimitsOfLiability method
    component.fetchLimitsOfLiability();

    // Check if error message is displayed
    expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Failed to fetch limits of liabilty. Try again later');

    // Ensure limitsOfLiabilityList remains undefined or empty
    // expect(component.limitsOfLiabilityList).toBeUndefined();

    // Restore spies
    getLimitsOfLiabilityMock.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });
  test('should delete risk successfully and update riskDetails', () => {
    // Mock data
    const mockRisk = { code: 123, description: 'Risk A' };
    const mockQuotationDetails = {
      riskInformation: [
        { code: 123, description: 'Risk A' },
        { code: 456, description: 'Risk B' },
      ],
    };

    const mockResponse = { message: 'Risk deleted successfully' };

    // Set up component state
    component.selectedRisk = mockRisk;
    component.quotationDetails = mockQuotationDetails;

    // Mock services
    const deleteRiskMock = jest
      .spyOn(quotationService, 'deleteRisk')
      .mockReturnValue(of(mockResponse));
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const displaySuccessMessageSpy = jest
      .spyOn(globalMessagingService, 'displaySuccessMessage')
      .mockImplementation();

    // Call the deleteRisk method
    component.deleteRisk();

    // Check if deleteRisk was called with the correct risk code
    expect(deleteRiskMock).toHaveBeenCalledWith(123);

    // Verify that the risk was removed from riskInformation
    expect(component.quotationDetails?.riskInformation).toEqual([
      { code: 456, description: 'Risk B' },
    ]);

    // Verify that the selectedRisk is cleared
    expect(component.selectedRisk).toBeNull();

    // Verify log.debug calls
    // expect(debugSpy).toHaveBeenCalledWith('Selected Risk to be deleted', mockRisk);
    // expect(debugSpy).toHaveBeenCalledWith('Response after deleting a risk ', mockResponse);

    // Verify success message
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith(
      'Success',
      'Risk deleted successfully'
    );

    // Restore spies
    deleteRiskMock.mockRestore();
    debugSpy.mockRestore();
    displaySuccessMessageSpy.mockRestore();
  });
  test('should handle error when deleting risk fails', () => {
    // Mock data
    const mockRisk = { code: 123, description: 'Risk A' };
    const mockError = new Error('Failed to delete risk');

    // Set up component state
    component.selectedRisk = mockRisk;

    // Mock services
    const deleteRiskMock = jest
      .spyOn(quotationService, 'deleteRisk')
      .mockReturnValue(throwError(() => mockError));
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const displayErrorMessageSpy = jest
      .spyOn(globalMessagingService, 'displayErrorMessage')
      .mockImplementation();

    // Call the deleteRisk method
    component.deleteRisk();

    // Check if deleteRisk was called with the correct risk code
    expect(deleteRiskMock).toHaveBeenCalledWith(123);

    // Verify that riskDetails and selectedRisk are unchanged
    expect(component.quotationDetails?.riskInformation).toBeUndefined();
    expect(component.selectedRisk).toEqual(mockRisk);

    // Verify error message
    expect(displayErrorMessageSpy).toHaveBeenCalledWith(
      'Error',
      'Failed to delete risk. Try again later'
    );

    // Restore spies
    deleteRiskMock.mockRestore();
    debugSpy.mockRestore();
    displayErrorMessageSpy.mockRestore();
  });
  test('should display info message when no risk is selected', () => {
    // Set up component state
    component.selectedRisk = null;

    // Mock services
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const displayInfoMessageSpy = jest
      .spyOn(globalMessagingService, 'displayInfoMessage')
      .mockImplementation();
    const editRiskSpy = jest.spyOn(component, 'editRisk').mockImplementation();

    // Call the method
    component.openRiskEditModal();

    // Verify log.debug was called
    // expect(debugSpy).toHaveBeenCalledWith('Selected Risk', null);

    // Verify info message is displayed
    expect(displayInfoMessageSpy).toHaveBeenCalledWith(
      'Error',
      'Select Risk to continue'
    );

    // Ensure `editRisk` was not called
    expect(editRiskSpy).not.toHaveBeenCalled();

    // Restore spies
    debugSpy.mockRestore();
    displayInfoMessageSpy.mockRestore();
    editRiskSpy.mockRestore();
  });
  test('should call editRisk when a risk is selected', () => {
    // Mock data
    const mockRisk = { code: 123, description: 'Risk A' };

    // Set up component state
    component.selectedRisk = mockRisk;

    // Mock services
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const displayInfoMessageSpy = jest
      .spyOn(globalMessagingService, 'displayInfoMessage')
      .mockImplementation();
    const editRiskSpy = jest.spyOn(component, 'editRisk').mockImplementation();

    // Call the method
    component.openRiskEditModal();

    // Verify log.debug was called
    // expect(debugSpy).toHaveBeenCalledWith('Selected Risk', mockRisk);

    // Ensure no info message is displayed
    expect(displayInfoMessageSpy).not.toHaveBeenCalled();

    // Verify `editRisk` was called
    expect(editRiskSpy).toHaveBeenCalled();

    // Restore spies
    debugSpy.mockRestore();
    displayInfoMessageSpy.mockRestore();
    editRiskSpy.mockRestore();
  });
  test('should save data to sessionStorage, log details, and navigate correctly', () => {
    // Mock data
    const mockQuotationDetails = { id: 1, description: 'Quotation Details' };
    // const mockClientDetails = { id: 2, name: 'Client Details' };
    const mockNewClientDetails = { id: 3, name: 'New Client Details' };
    const mockSelectedRisk = { id: 4, risk: 'Selected Risk' };
    const mockQuotationNo = 'Q12345';

    // Set up component state
    component.quotationDetails = mockQuotationDetails;
    component.clientDetails = mockClient;
    component.passedNewClientDetails = mockNewClientDetails;
    component.selectedRisk = mockSelectedRisk;
    component.quotationNo = mockQuotationNo;

    // Mock sessionStorage
    // Mock sessionStorage
    const setItemMock = jest.fn();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: setItemMock,
      },
      writable: true,
    });


    // Mock console.debug
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    // Mock router navigation
    const navigateSpy = jest.spyOn(component.router, 'navigate').mockImplementation();

    // Call the method
    component.editRisk();

    // Verify sessionStorage is set correctly
    expect(setItemMock).toHaveBeenCalledWith(
      'passedQuotationDetails',
      JSON.stringify(mockQuotationDetails)
    );
    expect(setItemMock).toHaveBeenCalledWith(
      'passedClientDetails',
      JSON.stringify(mockClient)
    );
    expect(setItemMock).toHaveBeenCalledWith(
      'passedNewClientDetails',
      JSON.stringify(mockNewClientDetails)
    );
    expect(setItemMock).toHaveBeenCalledWith(
      'passedSelectedRiskDetails',
      JSON.stringify(mockSelectedRisk)
    );
    expect(setItemMock).toHaveBeenCalledWith('isEditRisk', JSON.stringify(true));

    // Verify logs are called
    // expect(debugSpy).toHaveBeenCalledWith('isEditRisk:', true);
    // expect(debugSpy).toHaveBeenCalledWith('quotation number:', mockQuotationNo);
    // expect(debugSpy).toHaveBeenCalledWith('Quotation Details:', mockQuotationDetails);
    // expect(debugSpy).toHaveBeenCalledWith('Selected Client Details', mockClient);
    // expect(debugSpy).toHaveBeenCalledWith('Selected New Client Details', mockNewClientDetails);

    // Verify navigation is triggered
    expect(navigateSpy).toHaveBeenCalledWith(['/home/gis/quotation/quick-quote']);

    // Restore mocks
    setItemMock.mockRestore();
    debugSpy.mockRestore();
    navigateSpy.mockRestore();
  });

  test('should navigate to client details when acceptQuote is called', () => {
    const navigateSpy = jest.spyOn((component as any)['router'], 'navigate').mockImplementation();

    component.acceptQuote();

    // Verify the navigate method is called with the expected URL
    expect(navigateSpy).toHaveBeenCalledWith(['/home/gis/quotation/quotations-client-details']);
  });

  test('should interact with sessionStorage correctly when saving data', () => {
  // Mock sessionStorage
    // Mock sessionStorage
    const setItemMock = jest.fn();
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: setItemMock,
      },
      writable: true,
    });
    component.editRisk();  // Call the method that interacts with sessionStorage

    // Verify sessionStorage.setItem is called with the expected arguments
  
    expect(setItemMock).toHaveBeenCalledWith(
      'passedQuotationDetails',
      JSON.stringify(mockQuotationDetails)
    );
    expect(setItemMock).toHaveBeenCalledWith(
      'passedNewClientDetails',
      JSON.stringify(mockClient)
    );
    // Add further checks for other sessionStorage interactions if needed
  });
});
