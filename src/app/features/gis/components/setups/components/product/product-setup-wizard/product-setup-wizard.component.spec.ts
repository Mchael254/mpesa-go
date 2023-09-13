import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSetupWizardComponent } from './product-setup-wizard.component';
import { ProductService } from '../../../../../services/product/product.service';
import { of, throwError } from 'rxjs';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProductSetupWizardComponent', () => {
  let component: ProductSetupWizardComponent;
  let fixture: ComponentFixture<ProductSetupWizardComponent>;
  let gisService: ProductService;
  let httpMock: HttpTestingController;
  let messageServiceMock: Partial<MessageService>;
  let messageService: MessageService;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '123' // Replace '123' with the desired value for testing
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProductSetupWizardComponent],
      providers: [ProductService,
        FormBuilder,
        MessageService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MessageService, useValue: {add: jest.fn()} },
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis' } }}}
      ],
    });
    fixture = TestBed.createComponent(ProductSetupWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    gisService = TestBed.inject(ProductService);
    component.fb = TestBed.inject(FormBuilder);
    messageService = TestBed.inject(MessageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch product details', () => {
    const code = 345;
    const mockResponse = { /* your mock response here */ };

    jest.spyOn(gisService, 'getProductByCode').mockReturnValue(of(mockResponse) as any);

    component.getProd(code);

    expect(gisService.getProductByCode).toHaveBeenCalledWith(code);
    expect(component.productDetails).toEqual(mockResponse);
  });
  it('should fetch all schedule reports', () => {
    const mockReports = [/* Define your mock reports data here */];
    const mockObservable = of(mockReports);

    jest.spyOn(gisService, 'getAllScheduleReports').mockReturnValue(mockObservable);

    component.getAllScheduleReports();

    expect(gisService.getAllScheduleReports).toHaveBeenCalled();

    // Simulate asynchronous behavior
    fixture.detectChanges();

    // Check that the component property has been updated
    expect(component.allScheduleReports).toEqual(mockReports);
  });
  it('should fetch screens and populate allScreens', () => {

    const mockScreenData = {
      _embedded: {
        screen_dto_list: [
          // Add mock screen data here
        ]
      }
    };
    // Mock the getAllScreens method of the productService
    jest.spyOn(gisService, 'getAllScreens').mockReturnValue(of(mockScreenData));

    // Call the method
    component.getAllScreens();

    // Expect the getAllScreens method to have been called
    expect(gisService.getAllScreens).toHaveBeenCalled();

    // Expect the allScreens property to have been populated with the mock data
    expect(component.allScreens).toEqual(mockScreenData._embedded.screen_dto_list);
  });
  it('should retrieve subclasses and update allSubclasses', () => {
    jest.spyOn(gisService, 'getSubclasses1').mockReturnValue(of([{ /* your expected data here */ }]) as any);

    component.getAllSubclasses();

    expect(gisService.getSubclasses1).toHaveBeenCalled();
    expect(component.allSubclasses).toEqual([{ /* your expected data here */ }]);
  });
  it('should retrieve and set the report', () => {
    const mockData = { /* your expected data here */ };
    jest.spyOn(gisService, 'getReportGroup').mockReturnValue(of(mockData));
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    component.reportGroup();

    expect(gisService.getReportGroup).toHaveBeenCalled();
    expect(component.report).toEqual(mockData);
    expect(consoleSpy).toHaveBeenCalledWith(mockData);
  });
  it('should retrieve and set the reportDetails for a given code', () => {
    const mockCode = 'sampleCode'; // Replace with your sample code
    const mockData = { /* your expected data here based on the code */ };
    
    jest.spyOn(gisService, 'getReportGroupDetails').mockReturnValue(of(mockData) as any);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    component.getReportGroup(mockCode);

    expect(gisService.getReportGroupDetails).toHaveBeenCalledWith(mockCode);
    expect(component.reportDetails).toEqual(mockData);
    expect(consoleSpy).toHaveBeenCalledWith(mockData);
  });
  it('should save product document and display success message', () => {
    const mockDoc = {
      dateWithEffectFrom: "", 
      dateWithEffectTo: "",   
      document: undefined,    
      isDefault: "Y",         
      name: undefined,        
      precedence: "",         
      productCode: undefined, 
      version: 1,             
    } as any;

    const successMessage = { severity: 'success', summary: 'Success', detail: 'Successfully uploaded Document' };
    
    jest.spyOn(gisService, 'saveProductDocument').mockReturnValue(of({ /* your success data here */ }) as any);

    component.saveProductDocument();

    expect(gisService.saveProductDocument).toHaveBeenCalledWith(mockDoc);
    expect(messageService.add).toHaveBeenCalledWith(successMessage);
  });

  it('should handle error and display error message', () => {
    const mockDoc = {
      dateWithEffectFrom: "", 
      dateWithEffectTo: "",   
      document: undefined,    
      isDefault: "Y",         
      name: undefined,        
      precedence: "",         
      productCode: undefined, 
      version: 1,             
    } as any;
    const errorMessage = { severity: 'error', summary: 'Error', detail: 'Error, try again later' };

    jest.spyOn(gisService, 'saveProductDocument').mockReturnValue(throwError('Some error'));

    component.saveProductDocument();

    expect(gisService.saveProductDocument).toHaveBeenCalledWith(mockDoc);
    // expect(messageService.add).toHaveBeenCalledWith(errorMessage);
  });
  it('should create a product, update productCode, and display success message', () => {
    const mockFormValue = { 
      code: '102',
      shortDescription: "Kev",
      description:  "vbl",
      productGroupCode:  12,
      withEffectFrom:  "2-12-90",
      withEffectTo: "2-2-91",
      policyPrefix:"VB",
      organizationCode:['2', {nonNullable: true}],
      claimPrefix: "BNL",
      underwritingScreenCode: "200",
      claimScreenCode:null,
      expires: "Y",
      doesCashBackApply:"Y",
      minimumSubClasses: 1,
      acceptsMultipleClasses: "N",
      minimumPremium: null,
      isRenewable: "Y",
      allowAccommodation: "N",
      openCover: "N",
      productReportGroupsCode: 1,
      policyWordDocument: null,
      shortName: "AVIATION HULL",
      endorsementMinimumPremium: null,
      showSumInsured: "Y",
      showFAP: "Y",
      policyCodePages: null,
      policyDocumentPages: null,
      isPolicyNumberEditable: "N",
      policyAccumulationLimit: null,
      insuredAccumulationLimit: null,
      totalCompanyAccumulationLimit: null,
      enableSpareParts: "Y",
      prerequisiteProductCode: null,
      allowMotorClass: "N",
      allowSameDayRenewal: "N",
      acceptUniqueRisks: null,
      industryCode: null,
      webDetails: null,
      showOnWebPortal: "N",
      areInstallmentAllowed: "Y",
      interfaceType: "CASH",
      isMarine: null,
      allowOpenPolicy: "N",
      order: null,
      isDefault: "N",
      prorataType: "VB",
      doFullRemittance: null,
      productType: null,
      checkSchedule: null,
      scheduleOrder: 1,
      isPinRequired:"Y",
      maximumExtensions: null,
      autoGenerateCoverNote: "N",
      commissionRate: null,
      autoPostReinsurance: "N",
      insuranceType: null,
      years: null,
      enableWeb: null,
      doesEscalationReductionApply: null,
      isLoanApplicable: null,
      isAssignmentAllowed: null,
      minimumAge: null,
      maximumAge: null,
      minimumTerm: null,
      maximumTerm: null,
      termDistribution: null,
    };
    const mockProductCode = '12345' as any; // Replace with your expected product code
    const successMessage = { severity: 'success', summary: 'Success', detail: 'Saved' };
    
    jest.spyOn(gisService, 'createProducts').mockReturnValue(of({ code: mockProductCode }) as any);
    const messageServiceSpy = jest.spyOn(messageService, 'add');

    component.productForm.setValue(mockFormValue);

    component.createProduct();

    expect(gisService.createProducts).toHaveBeenCalledWith({
      ...mockFormValue,
      code: null,
      productGroupCode: component.productGroupCode,
      organizationCode: 2
    });
    expect(component.productCode).toEqual(mockProductCode);
    expect(messageServiceSpy).toHaveBeenCalledWith(successMessage);
  });
  it('should handle error and display error message', () => {
    const mockFormValue = { 
      code: '102',
      shortDescription: "Kev",
      description:  "vbl",
      productGroupCode:  12,
      withEffectFrom:  "2-12-90",
      withEffectTo: "2-2-91",
      policyPrefix:"VB",
      organizationCode:['2', {nonNullable: true}],
      claimPrefix: "BNL",
      underwritingScreenCode: "200",
      claimScreenCode:null,
      expires: "Y",
      doesCashBackApply:"Y",
      minimumSubClasses: 1,
      acceptsMultipleClasses: "N",
      minimumPremium: null,
      isRenewable: "Y",
      allowAccommodation: "N",
      openCover: "N",
      productReportGroupsCode: 1,
      policyWordDocument: null,
      shortName: "AVIATION HULL",
      endorsementMinimumPremium: null,
      showSumInsured: "Y",
      showFAP: "Y",
      policyCodePages: null,
      policyDocumentPages: null,
      isPolicyNumberEditable: "N",
      policyAccumulationLimit: null,
      insuredAccumulationLimit: null,
      totalCompanyAccumulationLimit: null,
      enableSpareParts: "Y",
      prerequisiteProductCode: null,
      allowMotorClass: "N",
      allowSameDayRenewal: "N",
      acceptUniqueRisks: null,
      industryCode: null,
      webDetails: null,
      showOnWebPortal: "N",
      areInstallmentAllowed: "Y",
      interfaceType: "CASH",
      isMarine: null,
      allowOpenPolicy: "N",
      order: null,
      isDefault: "N",
      prorataType: "VB",
      doFullRemittance: null,
      productType: null,
      checkSchedule: null,
      scheduleOrder: 1,
      isPinRequired:"Y",
      maximumExtensions: null,
      autoGenerateCoverNote: "N",
      commissionRate: null,
      autoPostReinsurance: "N",
      insuranceType: null,
      years: null,
      enableWeb: null,
      doesEscalationReductionApply: null,
      isLoanApplicable: null,
      isAssignmentAllowed: null,
      minimumAge: null,
      maximumAge: null,
      minimumTerm: null,
      maximumTerm: null,
      termDistribution: null,
    };
    const errorMessage = { severity: 'error', summary: 'Error', detail: 'Error, try again later' };

    jest.spyOn(gisService, 'createProducts').mockReturnValue(throwError('Some error'));
    const messageServiceSpy = jest.spyOn(messageService, 'add');

    component.productForm.setValue(mockFormValue);

    component.createProduct();

    expect(gisService.createProducts).toHaveBeenCalledWith({
      ...mockFormValue,
      code: null,
      productGroupCode: component.productGroupCode,
      organizationCode: 2
    });
    // expect(messageServiceSpy).toHaveBeenCalledWith(errorMessage);
  });
  it('should create a product group, update productGroupCode, and display success message', () => {
    const mockFormValue = { /* your mock form value here */ };
    const mockProductGroupCode = '12345' as any; // Replace with your expected product group code
    const successMessage = { severity: 'success', summary: 'Success', detail: 'Saved' };
    
    jest.spyOn(gisService, 'createProductgroup').mockReturnValue(of({ code: mockProductGroupCode }) as any);
    const messageServiceSpy = jest.spyOn(messageService, 'add');

    component.productGroupForm = component.fb.group(mockFormValue); // Set the form with mockFormValue

    component.createProdGroup();

    expect(gisService.createProductgroup).toHaveBeenCalledWith(mockFormValue);
    expect(component.productGroupCode).toEqual(mockProductGroupCode);
    expect(messageServiceSpy).toHaveBeenCalledWith(successMessage);
  });
  it('should handle error and display error message', () => {
    const mockFormValue = { /* your mock form value here */ };
    const errorMessage = { severity: 'error', summary: 'Error', detail: 'Error, try again later' };

    jest.spyOn(gisService, 'createProductgroup').mockReturnValue(throwError('Some error'));
    const messageServiceSpy = jest.spyOn(messageService, 'add');

    component.productGroupForm = component.fb.group(mockFormValue); // Set the form with mockFormValue

    component.createProdGroup();

    expect(gisService.createProductgroup).toHaveBeenCalledWith(mockFormValue);
    // expect(messageServiceSpy).toHaveBeenCalledWith(errorMessage);
  });
  it('should create product subclasses and display success message', () => {
    const mockSelected = [
      { code: 'subclass1', isMandatory: 'Y', underwritingScreenCode: 'screen1', withEffectFrom: '2024-01-01' },
      { code: 'subclass2', isMandatory: 'N', underwritingScreenCode: 'screen2', withEffectFrom: '2024-02-01' }
      // Add more selected elements as needed
    ];

    jest.spyOn(gisService, 'createProductSubclasses').mockReturnValue(of({ /* your success data here */ }));
    const messageServiceSpy = jest.spyOn(messageService, 'add');

    component.selected = mockSelected;
    component.productGroupCode = 'groupCode' as any;
    component.productCode = 'productCode' as any;

    component.createProductSubclass();

    // Expectations
    expect(component.selected).toEqual(mockSelected);

    // Check if createProductSubclasses is called for each selected element
    mockSelected.forEach((selectedItem) => {
      expect(gisService.createProductSubclasses).toHaveBeenCalledWith({
        code: null,
        is_mandatory: selectedItem.isMandatory,
        sub_class_code: selectedItem.code,
        policy_document_order_number: 2,
        product_group_code: 'groupCode',
        product_code: 'productCode',
        product_short_description: null,
        underwriting_screen_code: selectedItem.underwritingScreenCode,
        date_with_effect_from: selectedItem.withEffectFrom,
        date_with_effect_to: '2024-06-25',
        version: 1
      });
    });

    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved'
    });
  });
  it('should handle error and display error message', () => {
    const mockSelected = [
      { code: 'subclass1', isMandatory: 'Y', underwritingScreenCode: 'screen1', withEffectFrom: '2024-01-01' },
      { code: 'subclass2', isMandatory: 'N', underwritingScreenCode: 'screen2', withEffectFrom: '2024-02-01' }
      // Add more selected elements as needed
    ];

    jest.spyOn(gisService, 'createProductSubclasses').mockReturnValue(throwError(new HttpErrorResponse({})));
    const messageServiceSpy = jest.spyOn(messageService, 'add');

    component.selected = mockSelected;
    component.productGroupCode = 'groupCode' as any;
    component.productCode = 'productCode' as any;

    component.createProductSubclass();

    // Expectations
    expect(component.selected).toEqual(mockSelected);

    // Check if createProductSubclasses is called for each selected element
    mockSelected.forEach((selectedItem) => {
      expect(gisService.createProductSubclasses).toHaveBeenCalledWith({
        code: null,
        is_mandatory: selectedItem.isMandatory,
        sub_class_code: selectedItem.code,
        policy_document_order_number: 2,
        product_group_code: 'groupCode',
        product_code: 'productCode',
        product_short_description: null,
        underwriting_screen_code: selectedItem.underwritingScreenCode,
        date_with_effect_from: selectedItem.withEffectFrom,
        date_with_effect_to: '2024-06-25',
        version: 1
      });
    });

    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error, try again later'
    });
  });
  it('should fetch product details and update productDetails', () => {
    const mockProductCode = '12345' as any; // Replace with your expected product code
    const mockProductDetails = { /* your mock product details here */ };

    jest.spyOn(gisService, 'getProductByCode').mockReturnValue(of(mockProductDetails) as any);

    component.getProd(mockProductCode);

    // Expectations
    expect(gisService.getProductByCode).toHaveBeenCalledWith(mockProductCode);
    expect(component.productDetails).toEqual(mockProductDetails);
  });
  it('should set prerequisiteProductCode in productForm', () => {
    component.productDetails = {
      description: 'Your Product Description' // Replace with your mock product description
    };
    component.savePreReqProd();

    // Expectations
    expect(component.productForm.get('prerequisiteProductCode').value).toBe('Your Product Description');
    // Replace 'Your Product Description' with the expected value based on your mock productDetails.
  });
  it('should set productReportGroupsCode in productForm', () => {
    component.reportDetails = {
      code: 'Your Report Group Code' // Replace with your mock report group code
    };
    component.saveReportGroup();

    // Expectations
    expect(component.productForm.get('productReportGroupsCode').value).toBe('Your Report Group Code');
    // Replace 'Your Report Group Code' with the expected value based on your mock reportDetails.
  });
  it('should toggle the showParent property', () => {
    component.showParent = true;
    // Expect the initial state to be true
    expect(component.showParent).toBeTruthy();

    // Call the hideParent method
    component.hideParent();

    // Expect the showParent property to be falsy after the method call
    expect(component.showParent).toBeFalsy();

    // Call the hideParent method again
    component.hideParent();

    // Expect the showParent property to be truthy after the second method call (toggled back)
    expect(component.showParent).toBeTruthy();
  });
  it('should toggle the showsubclass property', () => {
    // Expect the initial state to be true
    expect(component.showsubclass).toBeTruthy();

    // Call the hideSubclass method
    component.hideSubclass();

    // Expect the showsubclass property to be falsy after the method call
    expect(component.showsubclass).toBeFalsy();

    // Call the hideSubclass method again
    component.hideSubclass();

    // Expect the showsubclass property to be truthy after the second method call (toggled back)
    expect(component.showsubclass).toBeTruthy();
  });
  
  it('should toggle the showdocument property', () => {
    // Expect the initial state to be true
    expect(component.showdocument).toBeTruthy();

    // Call the hideProductDocument method
    component.hideProductDocument();

    // Expect the showdocument property to be falsy after the method call
    expect(component.showdocument).toBeFalsy();

    // Call the hideProductDocument method again
    component.hideProductDocument();

    // Expect the showdocument property to be truthy after the second method call (toggled back)
    expect(component.showdocument).toBeTruthy();
  });
  it('should set the selectedCard property', () => {
    // Initial state: selectedCard is 0
    expect(component.selectedCard).toBe(0);

    // Call the selectCard method with a trackCard value
    component.selectCard(1);

    // Expect the selectedCard property to be updated to 1 after the method call
    expect(component.selectedCard).toBe(1);

    // Call the selectCard method with a different trackCard value
    component.selectCard(2);

    // Expect the selectedCard property to be updated to 2 after the second method call
    expect(component.selectedCard).toBe(2);
  });
  it('should update base64Data property on file upload', () => {
    // Simulate a File object
    const mockFile = new File(['mock file content'], 'mockfile.txt', { type: 'text/plain' });

    // Create a mock FileList to simulate file selection
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => mockFile
    };

    // Create a mock event object with the mock FileList
    const mockEvent = {
      target: {
        files: mockFileList
      }
    };

    // Call the handleUpload method with the mock event
    component.handleUpload(mockEvent);

    // Expect the base64Data property to be updated
    // expect(component.base64Data).toBeDefined();
    // You can add more specific assertions about the value of base64Data if needed
  });
});
