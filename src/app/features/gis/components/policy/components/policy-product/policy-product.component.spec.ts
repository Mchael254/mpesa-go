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
import { Products } from '../../../setups/data/gisDTO';
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


describe('PolicyProductComponent', () => {
  let component: PolicyProductComponent;
  let fixture: ComponentFixture<PolicyProductComponent>;
  let clientService: ClientService;
  let productService: ProductsService;
  let globalMessagingService: GlobalMessagingService;
  let translateService:TranslateService;
  let branchService: BranchService;
  let quotationService: QuotationsService;



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
        { provide: TranslateService, useClass: TranslateService }, 
        { provide: BranchService, useClass: mockBranchService },
        { provide: QuotationsService, useClass: mockQuotationService },

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
    translateService= TestBed.inject(TranslateService);
    branchService = TestBed.inject(BranchService);
    quotationService = TestBed.inject(QuotationsService);

    component.policyProductForm = new FormGroup({});
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();
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
    expect(component.policyProductForm.get('agent_code').value).toBeNull();
    // Add expectations for other form controls here
  });
  it('should reset form controls when showFacultativeFields is false', () => {
    component.showFacultativeFields = false;
    component.onPolicyInterfaceTypeChange('F');
    expect(component.policyProductForm.get('agent_code').value).toBeNull();
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
  it('should update selectedBranchCode and selectedBranchDescription correctly', () => {
    const selectedValue = { id: 123, name: 'Branch Name' };
    
    component.onBranchSelected(selectedValue);

    expect(component.selectedBranchCode).toEqual(selectedValue.id);
    expect(component.selectedBranchDescription).toEqual(selectedValue.name);
    // Add more expectations as needed
  });
  it('should load policy sources and update sourceList and sourceDetail on successful response', () => {
    const mockSourceData = { content: [{ id: 1, name: 'Source 1' }, { id: 2, name: 'Source 2' }] };
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
});
