import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyProductComponent } from './policy-product.component';
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
import { Products, introducers } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
// import { TranslateService } from '@ngx-translate/core/dist/lib/translate.service';
import { DEFAULT_LANGUAGE, TranslateService,TranslateModule, USE_DEFAULT_LANG, USE_EXTEND, USE_STORE } from '@ngx-translate/core';
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


export class mockClientService {
  getClients = jest.fn().mockReturnValue(of());
  getClientById = jest.fn().mockReturnValue(of());
}
export class mockProductService {
  getAllProducts = jest.fn().mockReturnValue(of());
 

}
export class MockBrowserStorage {

}

export class mockBranchService {
  getAllBranches = jest.fn().mockReturnValue(of());
}
export class mockQuotationService {
  getAllQuotationSources = jest.fn().mockReturnValue(of());
 
}
export class mockInterMediaryService {
  getAgents = jest.fn().mockReturnValue(of());
 
}
export class mockIntroducerService {
  getAllIntroducers = jest.fn().mockReturnValue(of());
 
}
export class mockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of());
 
}
export class mockContractService {
  getContractNames = jest.fn().mockReturnValue(of());
 
}
export class mockPolicyService {
  createPolicy = jest.fn().mockReturnValue(of());
  getPaymentModes = jest.fn().mockReturnValue(of());

 
}

const mockLogger = {
  debug: jest.fn()
};

const mockClientData = {
  content: [{
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
  }],
};
const mockClientDataID: ClientDTO = {
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
};

// Now you can use this object wherever a ClientDTO is expected.

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
const mockSourceData = { content: [{ id: 1, name: 'Source 1' }, { id: 2, name: 'Source 2' }] };
const mockIntroducersData: introducers []= [
  {
  agentCode: 2345,
  bruCode: 3452,
  code: 101,
  dateOfBirth: "2000-02-03",
  email: "ABC@gmail.com",
  feeAllowed: "N",
  groupCompany: "Geminia",
  idRegistration: "XCLK",
  introducerTown: "Nairobi",
  introducerZip: "XCLP",
  introducerZipName: "Mark",
  mobileNumber: 8906,
  otherNames: "AD",
  pin: "ADLA",
  postalAddress: 124,
  remarks: "XCLK",
  staffNo: 896,
  surName: "AD",
  telephoneNumber: 8906,
  type: "S",
  userId: 3452,
  wef: "2000-02-03",
  wet: "2001-02-03"
  },
];

describe('PolicyProductComponent', () => {
  let component: PolicyProductComponent;
  let fixture: ComponentFixture<PolicyProductComponent>;
  let clientService: ClientService;
  let productService: ProductsService;
  let globalMessagingService: GlobalMessagingService;
  let branchService: BranchService;
  let quotationService: QuotationsService;
  let intermediaryService: IntermediaryService;
  let introducerService:IntroducersService;
  let currencyService: CurrencyService;
  let contractService:ContractNamesService;
  let policyService:PolicyService;



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyProductComponent],
      imports: [HttpClientTestingModule, SharedModule, FormsModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader } // Use TranslateFakeLoader
      })],
      providers:[
        { provide: ClientService, useClass: mockClientService }, 
        { provide: ProductsService, useClass: mockProductService }, 
        { provide: BrowserStorage, useClass: MockBrowserStorage },
        { provide: BranchService, useClass: mockBranchService },
        { provide: QuotationsService, useClass: mockQuotationService },
        { provide: IntermediaryService, useClass: mockInterMediaryService },
        { provide: IntroducersService, useClass: mockIntroducerService },
        { provide: CurrencyService, useClass: mockCurrencyService },
        { provide: ContractNamesService, useClass: mockContractService },
        { provide: PolicyService, useClass: mockPolicyService },

        { provide: APP_BASE_HREF, useValue: '/' },
        GlobalMessagingService, MessageService,
        FormBuilder,
        { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis/setups/api/v1' } } } },
        { provide: USE_DEFAULT_LANG, useValue: true },
        { provide: USE_STORE, useValue: true },
        { provide: USE_EXTEND, useValue: true },
        { provide: DEFAULT_LANGUAGE, useValue: true }
      ]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyProductComponent);
    component = fixture.componentInstance;
    globalMessagingService = TestBed.inject(GlobalMessagingService);
    clientService = TestBed.inject(ClientService);
    productService = TestBed.inject(ProductsService);
    branchService = TestBed.inject(BranchService);
    quotationService = TestBed.inject(QuotationsService);
    intermediaryService = TestBed.inject(IntermediaryService);
    introducerService = TestBed.inject(IntroducersService);
    currencyService = TestBed.inject(CurrencyService);
    contractService = TestBed.inject(ContractNamesService);
    policyService = TestBed.inject(PolicyService);

    component.policyProductForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });
  afterEach(() => {
    // Optionally clear mock function calls
    jest.clearAllMocks();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load all clients successfully', () => {
    const mockClientData = { content: [/* your mock client data */] };
    jest.spyOn(clientService, 'getClients').mockReturnValue(of(mockClientData) as any);

    jest.spyOn(globalMessagingService, 'displayErrorMessage');

    component.loadAllClients();

    expect(clientService.getClients).toHaveBeenCalledWith(0, 100);
    expect(component.clientList).toEqual(mockClientData);
    expect(component.clientData).toEqual(mockClientData.content);
    expect(globalMessagingService.displayErrorMessage).not.toHaveBeenCalled();
  });
  it('should handle error when loading clients', () => {
    const errorMessage = 'Mock error message';

    jest.spyOn(clientService, 'getClients').mockReturnValue(throwError(errorMessage));
    jest.spyOn(globalMessagingService, 'displayErrorMessage');


    component.loadAllClients();

    expect(jest.spyOn(clientService, 'getClients')).toHaveBeenCalledWith(0, 100);
    expect(jest.spyOn(globalMessagingService, 'displayErrorMessage')).toHaveBeenCalledWith('Error', component.errorMessage);
  });
  it('should load all products successfully', () => {
   

    // Mock the ProductService
    jest.spyOn(productService, 'getAllProducts').mockReturnValue(of(mockProducts));
    jest.spyOn(globalMessagingService, 'displayErrorMessage');

    component.loadAllproducts();

    // Expectations for the successful case
    expect(productService.getAllProducts).toHaveBeenCalled();
    expect(component.productList).toEqual(mockProducts);

    // Additional expectations for processing the product descriptions
    const capitalizedDescriptions = mockProducts.map(product => ({
      code: product.code,
      description: product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase(),
    }));

    const combinedWords = capitalizedDescriptions.map(product => product.description).join(',');
    expect(component.ProductDescriptionArray).toEqual(capitalizedDescriptions);
    expect(globalMessagingService.displayErrorMessage).not.toHaveBeenCalled();
  });
  it('should handle error when loading products', () => {
    const errorMessage = 'Mock error message';

    // Mock the ProductService to throw an error
    jest.spyOn(productService, 'getAllProducts').mockReturnValue(throwError(errorMessage));
    jest.spyOn(globalMessagingService, 'displayErrorMessage');

    component.loadAllproducts();

    // Expectations for the error case
    expect(productService.getAllProducts).toHaveBeenCalled();
    expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', component.errorMessage);
  });
  it('should set the selectedProductCode on product selection', () => {
    const selectedValue = { code: 'ABC123' };

    component.onProductSelected(selectedValue);

    expect(component.selectedProductCode).toEqual(selectedValue.code);
    // You can add more expectations if needed, such as checking console.log output
  });
  it('should load client details and update sessionStorage', () => {
    const clientId = 123;
   

    jest.spyOn(clientService, 'getClientById').mockReturnValue(of(mockClientDataID));

    // Mock the closebutton native element
    const mockCloseButton = { nativeElement: { click: jest.fn() } };
    component.closebutton = mockCloseButton;

    component.loadClientDetails(clientId);

    // Expectations for the successful case
    expect(clientService.getClientById).toHaveBeenCalledWith(clientId);
    expect(component.clientDetails).toEqual(mockClientDataID);

   
    expect(mockCloseButton.nativeElement.click).toHaveBeenCalled();
  });
  it('should update showIntermediaryFields and showFacultativeFields based on value', () => {
    component.onPolicyInterfaceTypeChange('N');
    expect(component.showIntermediaryFields).toBe(true);
    expect(component.showFacultativeFields).toBe(false);

    component.onPolicyInterfaceTypeChange('F');
    expect(component.showIntermediaryFields).toBe(false);
    expect(component.showFacultativeFields).toBe(true);
  });
  it('should reset form controls when showIntermediaryFields is false', () => {
    component.showIntermediaryFields = false;
    component.onPolicyInterfaceTypeChange('N');
    expect(component.policyProductForm.get('agentCode').value).toBeNull();
    // Add expectations for other form controls here
  });
  it('should reset form controls when showFacultativeFields is false', () => {
    component.showFacultativeFields = false;
    component.onPolicyInterfaceTypeChange('F');
    expect(component.policyProductForm.get('agentCode').value).toBeNull();
    // Add expectations for other form controls here
  });
  it('should fetch branches and update branchList and userBranchName on successful response', () => {
    const mockUserBranchId = 1;
    const mockResponse = of(mockBranchList);
    jest.spyOn(branchService, 'getAllBranches').mockReturnValue(mockResponse as any);

    component.userBranchId = mockUserBranchId;
    component.fetchBranches();

    expect(branchService.getAllBranches).toHaveBeenCalledWith(undefined, undefined);
    expect(component.branchList).toEqual(mockBranchList);
    expect(component.userBranchName).toEqual('Branch 1');
    // Add more expectations as needed
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    
    // Spy on displayErrorMessage method
    const displayErrorMessageSpy = jest.spyOn(component.globalMessagingService, 'displayErrorMessage');
  
    jest.spyOn(branchService, 'getAllBranches').mockReturnValue(mockResponse);
  
    component.fetchBranches();
  
    expect(branchService.getAllBranches).toHaveBeenCalledWith(undefined, undefined);
    
    // Subscribe to the observable to trigger the error callback
    mockResponse.subscribe({
      error: () => {
        // Expectations to cover the lines within the error callback
        expect(component.errorOccurred).toBe(true);
        expect(component.errorMessage).toEqual('Something went wrong. Please try Again');
        
        // Additional expectations to ensure proper error handling
        expect(displayErrorMessageSpy).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
      }
    });
  }); 
  it('should update selectedBranchCode and selectedBranchDescription when a branch is selected', () => {
    const selectedValue = 1; // Example selected value
  
    component.branchList = mockBranchList;

    component.onBranchSelected(selectedValue);

    expect(component.selectedBranchCode).toBe(selectedValue);
    const selectedBranch = mockBranchList.find(branch => branch.id === selectedValue);
    const selectedBranchDescription = selectedBranch.name;
    // expect(component.selectedBranchDescription).toBe(selectedBranchDescription); 

    // You can add more assertions here based on your requirements
  });
  it('should load policy sources and update sourceList and sourceDetail on successful response', () => {
    const mockResponse = of(mockSourceData);
    
    // Spy on displayErrorMessage method
    const displayErrorMessageSpy = jest.spyOn(component.globalMessagingService, 'displayErrorMessage');
  
    jest.spyOn(quotationService, 'getAllQuotationSources').mockReturnValue(mockResponse);
  
    component.loadPolicySources();
  
    expect(quotationService.getAllQuotationSources).toHaveBeenCalled();
    
    // Subscribe to the observable to trigger the next callback
    mockResponse.subscribe({
      next: () => {
        // Expectations to cover the lines within the next callback
        expect(component.sourceList).toEqual(mockSourceData.content);
        expect(component.sourceDetail).toEqual(mockSourceData.content);
        
        // Additional expectations to ensure proper behavior
        expect(displayErrorMessageSpy).not.toHaveBeenCalled(); // Ensure displayErrorMessage is not called
      }
    });
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(quotationService, 'getAllQuotationSources').mockReturnValue(mockResponse);

    component.loadPolicySources();

    expect(quotationService.getAllQuotationSources).toHaveBeenCalled();
    
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
  it('should retrieve marketers correctly', () => {
    const mockAgentData: { content: AgentDTO[] } = {
      content: [
        { accountTypeId: 10, /* other properties of AgentDto */ },
        { accountTypeId: 20, /* other properties of AgentDto */ },
        // Add more test data as needed
      ]
    };

    jest.spyOn(intermediaryService, 'getAgents').mockReturnValue(of(mockAgentData)as any);

    component.getMarketers(0, 10); // Assuming pageIndex and pageSize values

    expect(component.agentList).toEqual(mockAgentData.content);
    expect(component.marketerList).toEqual(mockAgentData.content.filter(agent => agent.accountTypeId == 10));
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(intermediaryService, 'getAgents').mockReturnValue(mockResponse);

    component.getMarketers(0,10);

    expect(intermediaryService.getAgents).toHaveBeenCalled();
    
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
  it('should select source correctly', () => {
    // Arrange
    const event = { target: { value: '123' } };
    const mockSourceDetail = [
        { code: '123', name: 'Source 1' },
        { code: '456', name: 'Source 2' },
        { code: '789', name: 'Source 3' }
    ];
    component.sourceDetail = mockSourceDetail;

    // Act
    component.onSourceSelected(event);

    // Assert
    expect(component.selectedSourceCode).toEqual('123');
    expect(component.selectedSource.length).toEqual(1);
    expect(component.selectedSource[0]).toEqual(mockSourceDetail[0]);
    // Add more assertions if needed
});

  // it('should handle error properly', () => {
  //   const errorMessage = 'Some error message';
  //   jest.spyOn(intermediaryService, 'getAgents').mockReturnValue(throwError(errorMessage));

  //   jest.spyOn(component.globalMessagingService, 'displayErrorMessage');
  //   jest.spyOn(console, 'log'); // Spy on console.log

  //   component.getMarketers(0, 10);
  //   // expect(intermediaryService.getAgents).toHaveBeenCalled();
  //   expect(intermediaryService.getAgents).toHaveBeenCalledWith(0, 10, 'createdDate', 'desc');

  //   expect(component.errorOccurred).toBe(true);
  //   expect(component.errorMessage).toBe('Something went wrong. Please try Again');
  //   expect(component.globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Something went wrong. Please try Again');
  //   expect(console.log).toHaveBeenCalledWith('error >>>', errorMessage);
  // });

  it('should update selectedMarkterIdcorrectly', () => {
    const selectedValue = { id: 123, name: 'Marketer Name' };
    
    component.onMarketerSelected(selectedValue);

    expect(component.selectedMarketerCode).toEqual(selectedValue.id);
  });
  
  it('should retrieve Introducers correctly', () => {
   
    jest.spyOn(introducerService, 'getAllIntroducers').mockReturnValue(of(mockIntroducersData)as any);

    component.getIntroducers(); 

    expect(component.introducersList).toEqual(mockIntroducersData as any);
  });
  it('should handle error and display error message on error response', () => {
    const mockErrorResponse = new Error('Test error');
    const mockResponse = throwError(mockErrorResponse);
    jest.spyOn(introducerService, 'getAllIntroducers').mockReturnValue(mockResponse);

    component.getIntroducers();

    expect(introducerService.getAllIntroducers).toHaveBeenCalled();
    
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
  it('should call filterGlobal with correct parameters', () => {
    // Arrange
    const eventMock = {
      target: {
        value: 'test value'
      }
    } as any; // Mocking the $event object
    const stringVal = 'someStringVal';
    const filterGlobalSpy = jest.spyOn(component.dt2, 'filterGlobal');

    // Act
    component.applyIntroducersFilterGlobal(eventMock, stringVal);

    // Assert
    expect(filterGlobalSpy).toHaveBeenCalledWith('test value', 'someStringVal');
  });
  it('should load introducer details correctly', () => {
    // Arrange
    const code = 101;
    const logSpy = jest.spyOn(console, 'info');
    const filterSpy = jest.spyOn(Array.prototype, 'filter');
   

    // Mock data
    const mockIntroducer = mockIntroducersData.find(introducer => introducer.code === code);
    component.introducersList = mockIntroducersData;

    // Mock the closebutton element
    component.closebuttonIntroducers = { nativeElement: { click: jest.fn() } } as any;

    // Mock the saveIntroducer method
    jest.spyOn(component, 'saveIntroducer').mockImplementation(() => { });

    // Act
    component.loadIntroducerDetails(code);

    // Assert
    expect(filterSpy).toHaveBeenCalled();
    expect(component.selectedIntroducer).toEqual([mockIntroducer]); 
    expect(component.saveIntroducer).toHaveBeenCalled();
    expect(component.closebuttonIntroducers.nativeElement.click).toHaveBeenCalled();
    
});
// it('should log an error when no introducer is found', () => {
//   // Arrange
//   const code = 999; // Assuming this code does not exist in the mock data
//   const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
//   const filterSpy = jest.spyOn(Array.prototype, 'filter');

//   // Mock data
//   component.introducersList = mockIntroducersData;

//   // Act
//   component.loadIntroducerDetails(code);

//   // Assert
//   expect(filterSpy).toHaveBeenCalled();
//   expect(component.selectedIntroducer).toEqual([]); // Ensure selected introducer is an empty array
//   expect(errorMock).toHaveBeenCalledWith("No introducer found with code:", code); // Ensure console.error is called with the correct message
//   errorMock.mockRestore(); // Restore console.error
// });

it('should save introducer correctly', () => {
  // Arrange
  const mockSelectedIntroducer = mockIntroducersData[0]; // Assuming mockIntroducersData is an array of introducer objects

  // Mock selected introducer
  component.selectedIntroducer = [mockSelectedIntroducer];

  // Act
  component.saveIntroducer();

  // Assert
  expect(component.introducerCode).toEqual(mockSelectedIntroducer.code);
  expect(component.introducerName).toEqual(mockSelectedIntroducer.surName);
  // Add more assertions if needed
});
it('should call filterGlobal with correct parameters', () => {
  // Arrange
  const eventMock = {
    target: {
      value: 'test value'
    }
  } as any; 
  const stringVal = 'someStringValue';
  const filterGlobalSpy = jest.spyOn(component.dt3, 'filterGlobal');

  // Act
  component.applyJointAccountFilterGlobal(eventMock, stringVal);

  // Assert
  expect(filterGlobalSpy).toHaveBeenCalledWith('test value', 'someStringValue');
});
it('should load Joint Account details and update sessionStorage', () => {
  const clientId = 123;
 

  jest.spyOn(clientService, 'getClientById').mockReturnValue(of(mockClientDataID));

  // Mock the closebutton native element
  const mockCloseButton = { nativeElement: { click: jest.fn() } };
  component.closebuttonJointAccount = mockCloseButton;

  component.loadJointAccountDetails(clientId);

  // Expectations for the successful case
  expect(clientService.getClientById).toHaveBeenCalledWith(clientId);
  expect(component.jointAccountDetails).toEqual(mockClientDataID);

 
  expect(mockCloseButton.nativeElement.click).toHaveBeenCalled();
});
it('should update joint account data when client code is not null', () => {
  // Set up test data
  component.clientData = [mockClientDataID]; // Use the mockClientDataID
  
  // Set clientCode to a value other than null
  component.clientCode = mockClientDataID.id;

  // Call the method to be tested
  component.updateJointAccountData();

  // Expectations
  expect(component.jointAccountData).toEqual([]); // Since the filter condition won't match, it should result in an empty array
  
  // Expect that log.debug is called with the correct arguments
  // expect(mockLogger.debug).toHaveBeenCalledWith("Joint Account Client", []);
});
it('should set joint account data to an empty array when client code is null', () => {
  // Set up test data
  component.clientData = [
    mockClientDataID
  ];
  component.clientCode = null;

  // Call the method to be tested
  component.updateJointAccountData();

  // Expectations
  expect(component.jointAccountData).toEqual([]);
  
  // Expect that log.debug is called with the correct arguments
  // expect(mockLogger.debug).toHaveBeenCalledWith("Joint Account Client", []);
});
it('should retrieve Cuurencies correctly', () => {
  const currencies = [{ name: 'USD', code: 'USD' }, { name: 'EUR', code: 'EUR' }]; 

  jest.spyOn(currencyService, 'getAllCurrencies').mockReturnValue(of(currencies)as any);

  component.getCurrencies(); 

  expect(component.currency).toEqual(currencies as any);
});
// it('should update cover to date correctly', () => {
//   const fromDate = new Date('2024-04-16'); // example date
//   const toDate = new Date(fromDate);
//   toDate.setDate(fromDate.getDate() + 365);

//   component.updateCoverTo();

//   const expectedToDate = toDate.toISOString().substring(0, 10); // Get YYYY-MM-DD format
//   const actualToDate = component.policyProductForm.get('with_effective_to_date').value;
//   expect(actualToDate).toEqual(expectedToDate);
// });
it('should set contractNamesList and contractDetails when data is received', () => {
  const mockData = {
    embedded: [{ /* mock contract details */ }]
  };

  jest.spyOn(contractService, 'getContractNames').mockReturnValue(of(mockData)as any);

  component.getContractNames();

  expect(component.contractNamesList).toEqual(mockData);
  expect(component.contractDetails).toEqual(mockData.embedded[0]);
});
it('should handle error and display error message on error response', () => {
  const mockErrorResponse = new Error('Test error');
  const mockResponse = throwError(mockErrorResponse);
  jest.spyOn(contractService, 'getContractNames').mockReturnValue(mockResponse);

  component.getContractNames();

  expect(contractService.getContractNames).toHaveBeenCalled();
  
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
// it('should call createPolicy and handle success response', () => {
//   const mockPolicyForm = {}; // Mock your policy form
//   const mockUser = {}; // Mock your user object
//   const mockPolicyResponse = {}; // Mock your policy response

//   // Stub the createPolicy method of PolicyService to return a mock observable
//   jest.spyOn(policyService, 'createPolicy').mockReturnValue(of(mockPolicyResponse)as any);

//   // Trigger the method call
//   component.createPolicy();

//   // Assert the behavior after success response
//   expect(component.policyResponse).toEqual(mockPolicyResponse);
//   // Add more assertions as needed
// });

it('should handle error and display error message on error response', () => {
  const mockErrorResponse = new Error('Test error');
  const mockResponse = throwError(mockErrorResponse);
  jest.spyOn(policyService, 'createPolicy').mockReturnValue(mockResponse);

  component.createPolicy();

  expect(policyService.createPolicy).toHaveBeenCalled();
  
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
it('should call createPolicy and handle success response', () => {
  const mockPolicyForm = {}; // Mock your policy form
  const mockUser = {}; // Mock your user object
  const mockPolicyResponse = {
    _embedded: [{}] // Mock embedded data structure as needed
  };

  // Stub the createPolicy method of PolicyService to return a mock observable
  jest.spyOn(policyService, 'createPolicy').mockReturnValue(of(mockPolicyResponse)as any);
  // Spy on other methods or services as needed
  jest.spyOn(globalMessagingService, 'displaySuccessMessage');

  // spyOn(component.router, 'navigate');
  jest.spyOn(sessionStorage, 'setItem');
  jest.spyOn(component.cdr, 'detectChanges');

  // Trigger the method call
  component.createPolicy();

  // Assert the behavior after success response
  expect(component.policyResponse).toEqual(mockPolicyResponse);
  expect(component.policyDetails).toEqual(mockPolicyResponse._embedded[0]);
  expect(component.globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Policy has been created');
  // expect(sessionStorage.setItem).toHaveBeenCalledWith('passedPolicyDetails', JSON.stringify(mockPolicyResponse.embedded[0]));
  // expect(component.router.navigate).toHaveBeenCalledWith(['/home/gis/policy/risk-details']);
  expect(component.cdr.detectChanges).toHaveBeenCalled();
  // Add more assertions as needed
});
it('should call createPolicy and set transaction type correctly for "new-business"', () => {
  // Set selectedTransactionType to 'new-business'
  component.selectedTransactionType = 'new-business';
  
  // Other necessary mocks and stubs...
  
  // Trigger the method call
  component.createPolicy();

  // Assert the transaction type value
  expect(component.policyProductForm.get('transactionType').value).toEqual('NB');
});

it('should call createPolicy and set transaction type correctly for "endorsement"', () => {
  // Set selectedTransactionType to 'endorsement'
  component.selectedTransactionType = 'endorsement';
  
  // Other necessary mocks and stubs...
  
  // Trigger the method call
  component.createPolicy();

  // Assert the transaction type value
  expect(component.policyProductForm.get('transactionType').value).toEqual('ED');
});

it('should call createPolicy and set transaction type correctly for "contra-transaction"', () => {
  // Set selectedTransactionType to 'contra-transaction'
  component.selectedTransactionType = 'contra-transaction';
  
  // Other necessary mocks and stubs...
  
  // Trigger the method call
  component.createPolicy();

  // Assert the transaction type value
  expect(component.policyProductForm.get('transactionType').value).toEqual('CT');
});

it('should call getPaymentModes and handle success response', () => {
  const mockPaymentModes = {
    _embedded: [{ /* mock contract details */ }]
  };

  jest.spyOn(policyService, 'getPaymentModes').mockReturnValue(of(mockPaymentModes)as any);

  component.getPaymentModes();

  expect(component.paymentModesList).toEqual(mockPaymentModes);
  expect(component.paymentDetails).toEqual(mockPaymentModes._embedded);
});

});


