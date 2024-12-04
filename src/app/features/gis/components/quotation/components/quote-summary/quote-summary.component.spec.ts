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
const mockQuotationDetails = {
  no: "Q/LG/PMT/24/0000182",
  premium: null,
  expiryDate: "2024-05-01",
  status: "Draft",
  coverFrom: "2024-02-01",
  coverTo: "2025-01-31",
  clientCode: 1195472,
  currency: "NGN",
  agentCode: 0,
  branch: {
    id: 332,
    name: "ELDORET",
    countryName: null,
    townName: null
  },
  source: {
    code: 36,
    description: "WALK IN",
    applicableModule: "B"
  },
  likelihood: null,
  frequencyOfPayment: "A",
  marketerCommissionAmount: null,
  commissionAmount: null,
  quotationProduct: [
    {
      code: 2024136738,
      proCode: 8293,
      quotCode: 202446065,
      productShortDescription: null,
      quotationNo: "Q/LG/PMT/24/0000182",
      premium: null,
      revisionNo: 0,
      totalSumInsured: null,
      commission: null,
      binder: null,
      agentShortDescription: "DIRECT",
      wet: "2025-01-31",
      wef: "2024-02-01"
    }
  ],
  riskInformation: [
    {
      code: 2024217732,
      quotationRiskNo: "Q/LG/PMT/24/0000182",
      quotationCode: 202446065,
      value: null,
      propertyId: "KDD 567H",
      covertypecode: 302,
      covertypeShortDescription: "COMP",
      sectionsDetails: [
        {
          code: 425333,
          description: "SI",
          limitAmount: 1000000,
          freeLimit: 0,
          rate: 10,
          premium: 0,
          rateType: "FXD",
          sectionShortDescription: "SI",
          rowNumber: 1,
          calculationGroup: 1
        },
        {
          code: 425334,
          description: "WINDSCREEN",
          limitAmount: 1000000,
          freeLimit: 0,
          rate: 50000,
          premium: 0,
          rateType: "FXD",
          sectionShortDescription: "WINDSCREEN",
          rowNumber: 1,
          calculationGroup: 1
        }
      ],
      scheduleDetails: null
    },
    {
      code: 2024217733,
      quotationRiskNo: "Q/LG/PMT/24/0000182",
      quotationCode: 202446065,
      value: null,
      propertyId: "FGT 567U",
      covertypecode: 302,
      covertypeShortDescription: "COMP",
      sectionsDetails: [
        {
          code: 425335,
          description: "SI",
          limitAmount: 3000000,
          freeLimit: 0,
          rate: 10,
          premium: 0,
          rateType: "FXD",
          sectionShortDescription: "SI",
          rowNumber: 1,
          calculationGroup: 1
        }
      ],
      scheduleDetails: null
    },
    {
      code: 2024217734,
      quotationRiskNo: "Q/LG/PMT/24/0000182",
      quotationCode: 202446065,
      value: null,
      propertyId: "EDR 345T",
      covertypecode: 302,
      covertypeShortDescription: "COMP",
      sectionsDetails: [
        {
          code: 425336,
          description: "SI",
          limitAmount: 4000000,
          freeLimit: 0,
          rate: 10,
          premium: 0,
          rateType: "FXD",
          sectionShortDescription: "SI",
          rowNumber: 1,
          calculationGroup: 1
        }
      ],
      scheduleDetails: null
    }
  ],
  taxInformation: [
    {
      description: "SD",
      quotationRate: 0.075,
      rateType: null,
      amount: null
    }
  ]
}
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
        // { provide: Router, useFactory: spy },

        GlobalMessagingService, MessageService,Router, 
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
    expect(component.quotationNo).toEqual(mockQuotationDetails.no);
    expect(component.insuredCode).toEqual(mockQuotationDetails.clientCode);
    expect(component.coverFrom).toEqual(mockQuotationDetails.coverFrom);
    expect(component.coverTo).toEqual(mockQuotationDetails.coverTo);
    expect(component.productCode).toEqual(mockQuotationDetails.quotationProduct[0].proCode);

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

    sessionStorage.setItem('passedQuotationDetails','JSON.stringify(component.quotationDetails');
    sessionStorage.setItem('passedClientDetails','JSON.stringify(component.clientDetails');
    sessionStorage.setItem('isAddRisk','JSON.stringify(component.isAddRisk');

   
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
