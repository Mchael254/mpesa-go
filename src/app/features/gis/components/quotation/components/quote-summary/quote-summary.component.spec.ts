import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { QuoteSummaryComponent } from './quote-summary.component';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { of } from 'rxjs';
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
import { JwtService } from 'src/app/shared/services';
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


  beforeEach(() => {
    jest.mock('@angular/router', () => ({
      ...jest.requireActual('@angular/router'),
      Router: jest.fn(),
    }));

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
  it('should load client quotation details', () => {


    jest.spyOn(quotationService, 'getClientQuotations').mockReturnValue(of(mockQuotationDetails));

    component.loadClientQuotation();

    // Expectations for the state changes or actions triggered by the method
    expect(component.quotationDetails).toEqual(mockQuotationDetails);
    expect(component.quotationNo).toEqual(mockQuotationDetails.quotOriginalQuotNo);
    expect(component.insuredCode).toEqual(mockQuotationDetails.clientCode);
    expect(component.coverFrom).toEqual(mockQuotationDetails.coverFrom);
    expect(component.coverTo).toEqual(mockQuotationDetails.coverTo);
    expect(component.productCode).toEqual(mockQuotationDetails.quotationProducts[0].proCode);

    // Example of testing a function call
    // expect(component.getClient).toHaveBeenCalled();
    // expect(component.getQuotationProduct).toHaveBeenCalled();


  });
  it('should toggle showOptions property', () => {
    const mockItem = { showOptions: false };

    component.showOptions(mockItem);

    expect(mockItem.showOptions).toBe(true);

    // Call showOptions again to toggle it back
    component.showOptions(mockItem);

    expect(mockItem.showOptions).toBe(false);
  });

  it('should log "Edit item clicked"', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const mockItem = { /* some mock data */ };

    component.editItem(mockItem);

    expect(consoleSpy).toHaveBeenCalledWith('Edit item clicked', mockItem);
  });

  it('should log "Delete item clicked"', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const mockItem = { /* some mock data */ };

    component.deleteItem(mockItem);

    expect(consoleSpy).toHaveBeenCalledWith('Delete item clicked', mockItem);
  });

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
});
