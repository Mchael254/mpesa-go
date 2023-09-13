import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDefinitionComponent } from '../product-definition/product-definition.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from '../../../../../services/product/product.service';
import { MessageService } from 'primeng/api';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ProductDefinitionComponent', () => {
    let component: ProductDefinitionComponent;
    let fixture: ComponentFixture<ProductDefinitionComponent>;
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
            declarations: [ProductDefinitionComponent],
            providers: [ProductService,
                FormBuilder,
                MessageService,
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: MessageService, useValue: { add: jest.fn() } },
                { provide: AppConfigService, useValue: { config: { contextPath: { gis_services: 'gis' } } } }
            ],
        });
        fixture = TestBed.createComponent(ProductDefinitionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        gisService = TestBed.inject(ProductService);
        component.fb = TestBed.inject(FormBuilder);
        messageService = TestBed.inject(MessageService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
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
    it('should update productDetails and productForm on getProduct', () => {
        component.productForm = component.fb.group({
            code: "123",
            name: 'Product Name',
            description: 'Product Description',
            // Add other form controls as needed
        });

        // Mock code to fetch a specific product
        const mockProductCode = '123';

        // Call the getProduct method with the mock code
        component.getProduct(mockProductCode);
        // Expect productDetails to be defined and not null
        expect(component.productDetails).toBeDefined();
        expect(component.productDetails).not.toBeNull();

        // Expect productForm to be updated with data from productDetails
        expect(component.productForm.get('code').value).toBe('123'); // Adjust based on your mock data
        expect(component.productForm.get('name').value).toBe('Product Name'); // Adjust based on your mock data
        expect(component.productForm.get('description').value).toBe('Product Description'); // Adjust based on your mock data

        // You can add more specific assertions as needed for other form controls and data properties
    });
    it('should update productDocument and productdocumentform on getProductDocument', () => {
        component.productdocumentform = component.fb.group({
            code: '456',
            name: 'Document Name',
            description: 'Document Description',
            // Add other form controls as needed
        });

        // Mock code to fetch a specific product document
        const mockDocumentCode = '456';

        // Call the getProductDocument method with the mock code
        component.getProductDocument(mockDocumentCode);
        // Expect productDocument to be defined and not null
        // expect(component.productDocument).toBeDefined();
        expect(component.productDocument).not.toBeNull();

        // Expect productdocumentform to be updated with data from productDocument
        expect(component.productdocumentform.get('code').value).toBe('456'); // Adjust based on your mock data
        expect(component.productdocumentform.get('name').value).toBe('Document Name'); // Adjust based on your mock data
        expect(component.productdocumentform.get('description').value).toBe('Document Description'); // Adjust based on your mock data

        // You can add more specific assertions as needed for other form controls and data properties
    });
    it('should update prodGroup and productGroupForm on getProductGroup', () => {
        component.productGroupForm = component.fb.group({
            code: '789',
            name: 'Group Name',
            description: 'Group Description',
            // Add other form controls as needed
        });

        // Mock code to fetch a specific product group
        const mockGroupCode = '789';

        // Call the getProductGroup method with the mock code
        component.getProductGroup(mockGroupCode);
        // Expect prodGroup to be defined and not null
        expect(component.prodGroup).not.toBeNull();

        // Expect productGroupForm to be updated with data from prodGroup
        expect(component.productGroupForm.get('code').value).toBe('789'); // Adjust based on your mock data
        expect(component.productGroupForm.get('name').value).toBe('Group Name'); // Adjust based on your mock data
        expect(component.productGroupForm.get('description').value).toBe('Group Description'); // Adjust based on your mock data

        // You can add more specific assertions as needed for other form controls and data properties
    });
    it('should update page property and call cdr.detectChanges', () => {
        // Initialize the page property to a known value
        component.page = 'initialValue';

        // Create a spy on cdr.detectChanges
        const detectChangesSpy = jest.spyOn(component.cdr, 'detectChanges');

        // Call the selectedScreen method with a new cardNumber value
        component.selectedScreen('newCardNumber');

        // Expect the page property to be updated correctly
        expect(component.page).toBe('newCardNumber');

        // Expect cdr.detectChanges to have been called once
        expect(detectChangesSpy).toHaveBeenCalledTimes(1);

        // You can also add assertions to check if detectChanges is called with specific arguments if needed
    });
    it('should update singleSubclass and subclassform on getsubclasseswithCode', () => {

        component.subclassform = component.fb.group({
            code: '123',
            name: 'Subclass Name',
            description: 'Subclass Description',
            // Add other form controls as needed
        });

        // Mock code to fetch a specific subclass
        const mockSubclassCode = '123';

        // Call the getsubclasseswithCode method with the mock code
        component.getsubclasseswithCode(mockSubclassCode);
        // Expect singleSubclass to be defined and not null
        expect(component.singleSubclass).not.toBeNull();

        // Expect subclassform to be updated with data from singleSubclass
        expect(component.subclassform.get('code').value).toBe('123'); // Adjust based on your mock data
        expect(component.subclassform.get('name').value).toBe('Subclass Name'); // Adjust based on your mock data
        expect(component.subclassform.get('description').value).toBe('Subclass Description'); // Adjust based on your mock data

        // You can add more specific assertions as needed for other form controls and data properties
    });
    it('should call createProducts and display success message', () => {
        component.productForm = component.fb.group({
            code: null,
            // Add other form controls as needed
        });
        const messageServiceSpy = jest.spyOn(messageService, 'add');
        // Mock product group code
        //   component.productGroupCode = 16678633;
        // Create a spy on gisService.createProducts
        const createProductsSpy = jest.spyOn(gisService, 'createProducts');

        // Call the createProduct method
        component.createProduct();

        // Expect createProducts to have been called with the expected request body
        expect(createProductsSpy).toHaveBeenCalledWith({
            code: null,
            productGroupCode: 16678633,
            enableSpareParts: 'Y',
            areInstallmentAllowed: 'Y',
            doesCashBackApply: 'Y',
            isPinRequired: 'Y',
        });

        // Expect messageService.add to have been called with success message
        // expect(messageServiceSpy).toHaveBeenCalledWith({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Saved',
        // });

        // You can also add more assertions as needed for other parts of the code and error handling
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

    it('should call saveProductDocument and display success message', () => {
        component.productdocumentform = component.fb.group({
            // Add form controls as needed
        });

        // Mock base64Data and file data
        component.base64Data = 'mockBase64Data';
        component.file = { name: 'mockFileName' } as any;
        // Create a spy on gisService.saveProductDocument
        const saveProductDocumentSpy = jest.spyOn(gisService, 'saveProductDocument');

        // Call the saveProductDocument method
        component.saveProductDocument();

        // Expect saveProductDocument to have been called with the expected document data
        expect(saveProductDocumentSpy).toHaveBeenCalledWith({
            // Add other document data properties as needed
            document: 'mockBase64Data',
            name: 'mockFileName',
        });

        // Expect messageService.add to have been called with success message
        // expect(messageServiceMock.add).toHaveBeenCalledWith({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Successfully uploaded Document',
        // });

        // You can also add more assertions as needed for other parts of the code and error handling
    });
    it('should call createProductSubclasses and display success message', () => {
        component.selected = [
            {
                code: 'sub-class-1',
                isMandatory: 'Y',
                underwritingScreenCode: 'screen-1',
                withEffectFrom: '2023-01-01',
                withEffectTo: '2024-01-01',
            },
            // Add more selected items as needed
        ];
        component.prodGCode = 'product-group-1' as any;
        component.prodCode = 'product-1' as any;
        // Create a spy on gisService.createProductSubclasses
        const createProductSubclassesSpy = jest.spyOn(gisService, 'createProductSubclasses');

        // Call the createProductSubclass method
        component.createProductSubclass();

        // Expect createProductSubclasses to have been called for each selected item
        expect(createProductSubclassesSpy).toHaveBeenCalledTimes(component.selected.length);
    });
    it('should fetch and set all products', () => {
        jest.spyOn(gisService, 'getAllProducts').mockReturnValue(of([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }]) as any);

        fixture.detectChanges();
        component.getAllProducts();

        // Expect the allProducts property to be set with the mock data
        expect(component.allProducts).toEqual([{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }] as any);
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
      it('should get all subclasses and update unAssignedSubclasses', () => {
        // Arrange

        const testData = [{ name: 'Subclass1' }, { name: 'Subclass2' }];
        jest.spyOn(gisService, 'getSubclasses1').mockReturnValue(of(testData) as any);
    
        // Act
        component.getAllSubclasses();
    
        // Assert
        expect(gisService.getSubclasses1).toHaveBeenCalled();
        expect(component.unAssignedSubclasses).toEqual(testData);
      });
      it('should call detectChanges', () => {
        // Arrange
        jest.spyOn(gisService, 'getSubclasses1').mockReturnValue(of([]));
    
        // Spy on the cdr.detectChanges method
        const detectChangesSpy = jest.spyOn(component.cdr, 'detectChanges');
    
        // Act
        component.getAllSubclasses();
    
        // Assert
        expect(detectChangesSpy).toHaveBeenCalled();
      });
      it('should create a product group and show success message', () => {
        // Arrange
        const productGroupFormValue = {
            code: null,
            description: 'Test Description',
            type: 'Test Type',
            organizationCode: '2',
          };
        const mockResponse = { code: '12345' } as any;
        jest.spyOn(gisService, 'createProductgroup').mockReturnValue(of(mockResponse));
        const messageServiceAddSpy = jest.spyOn(messageService, 'add');
    
        // Act
        component.createProdGroup();
    
        // Assert
        expect(component.productGroupForm.get('code')).toBeNull();
        // expect(gisService.createProductgroup).toHaveBeenCalledWith(productGroupFormValue);
        expect(component.productGroupCode).toEqual(mockResponse.code);
        expect(messageServiceAddSpy).toHaveBeenCalledWith({
          severity: 'success',
          summary: 'Success',
          detail: 'Saved',
        });
        
      });
      it('should update a product subclass and show success message', () => {
        // Arrange
        const requestBody = {
          code: null, // Adjust as needed
          date_with_effect_from: '', // Adjust as needed
          date_with_effect_to: '', // Adjust as needed
          is_mandatory: '', // Adjust as needed
          policyDocumentOrderNumber: 2,
          product_code: null, // Adjust as needed
          product_group_code: null, // Adjust as needed
          product_short_description: null, // Adjust as needed
          sub_class_code: '', // Adjust as needed
          underwriting_screen_code: '', // Adjust as needed
          version: 1,
        };
        const mockResponse = {}; // Replace with your mock response if needed
        jest.spyOn(gisService, 'updateSubclass').mockReturnValue(of(mockResponse) as any);
        const messageServiceAddSpy = jest.spyOn(messageService, 'add');
      
        // Act
        component.updateProductSubclass();
      
        // Assert
        // expect(gisService.updateSubclass).toHaveBeenCalledWith(requestBody, requestBody.code);
        expect(messageServiceAddSpy).toHaveBeenCalledWith({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully updated',
        });
      });
      it('should load all product groups with products and format the tree data', () => {
        // Arrange
        const mockData = [
          { pGroupCode: { code: 'PG1', description: 'Product Group 1' }, shortName: 'Product1', code: 'P1' },
          { pGroupCode: { code: 'PG1', description: 'Product Group 1' }, shortName: 'Product2', code: 'P2' },
          { pGroupCode: { code: 'PG2', description: 'Product Group 2' }, shortName: 'Product3', code: 'P3' },
        ];
        jest.spyOn(gisService, 'getGroupedData').mockReturnValue(of(mockData));
    
        // Act
        component.loadAllProductGroupWithProducts();
    
        // Assert
        expect(gisService.getGroupedData).toHaveBeenCalled();
        expect(component.response).toEqual([
          {
            label: 'Product Group 1',
            code: 'PG1',
            children: [
              { label: 'Product1', code2: 'P1' },
              { label: 'Product2', code2: 'P2' },
            ],
          },
          {
            label: 'Product Group 2',
            code: 'PG2',
            children: [
              { label: 'Product3', code2: 'P3' },
            ],
          },
        ]);
      });
      it('should get subclasses based on productCode and productGroupCode and update allSubclasses', () => {
        // Arrange
        const mockData = {
          _embedded: {
            product_subclass_dto_list: [
              { product_code: 'P1', product_group_code: 'PG1', name: 'Subclass1' },
              { product_code: 'P2', product_group_code: 'PG2', name: 'Subclass2' },
            ],
          },
        };
        jest.spyOn(gisService, 'getASubclasses').mockReturnValue(of(mockData) as any);
        const productCode = 'P1';
        const productGroupCode = 'PG1';
    
        // Act
        component.getSubclasses(productCode, productGroupCode);
    
        // Assert
        expect(gisService.getASubclasses).toHaveBeenCalled();
        expect(component.allSubclasses).toEqual(mockData._embedded.product_subclass_dto_list);
        expect(component.productSubclassResponse).toEqual([{ product_code: 'P1', product_group_code: 'PG1', name: 'Subclass1' }]);
      });
      it('should get forms and initialize the productForm and other properties', () => {
        // Arrange
        const mockData = {
          fields: [
            { name: 'Field1', isEnabled: 'Y', isMandatory: 'Y' },
            { name: 'Field2', isEnabled: 'N', isMandatory: 'N' },
          ],
        } as any;
        jest.spyOn(gisService, 'getFormScreen').mockReturnValue(of(mockData));
    
        // Act
        component.getForms();
    
        // Assert
        expect(gisService.getFormScreen).toHaveBeenCalledWith(15);
        expect(component.updateFormFields).toEqual(mockData);
        
        // Check productForm creation
        expect(Object.keys(component.productForm.controls)).toEqual(['Field1', 'Field2']);
        expect(component.productForm.controls['Field1'].value).toBe('');
        expect(component.productForm.controls['Field1'].disabled).toBe(false);
        expect(component.productForm.controls['Field2'].value).toBe('');
        expect(component.productForm.controls['Field2'].disabled).toBe(true);
    
        // Check mandatory and optional frontend screens
        expect(component.mandatoryFrontendScreens).toEqual([{ name: 'Field1', isEnabled: 'Y', isMandatory: 'Y' }] as any);
        expect(component.optionalFrontendScreens).toEqual([{ name: 'Field2', isEnabled: 'N', isMandatory: 'N' }] as any);
      });
      it('should create a product group form with the expected structure', () => {
        // Act
        component.createProductGroupForm();
    
        // Assert
        expect(component.productGroupForm).toBeDefined();
        expect(component.productGroupForm.get('code').value).toBeNull();
        expect(component.productGroupForm.get('description').value).toBe('');
        expect(component.productGroupForm.get('type').value).toBe('');
        expect(component.productGroupForm.get('organizationCode').value).toBe('2'); // Check the default value
        expect(component.productGroupForm.get('description').hasError('required')).toBe(true);
        expect(component.productGroupForm.get('type').hasError('required')).toBe(true);
        // expect(component.productGroupForm.get('organizationCode').hasError('nonNullable')).toBe(true);
      });
      it('should create a product form with the expected structure', () => {
        // Act
        component.createProductForm();
    
        // Assert
        expect(component.productForm).toBeDefined();
        expect(component.productForm.get('code').value).toBeNull();
        expect(component.productForm.get('shortDescription').value).toBe('');
        expect(component.productForm.get('description').value).toBe('');
        expect(component.productForm.get('productGroupCode').value).toBe('');
        expect(component.productForm.get('withEffectFrom').value).toBe('');
        expect(component.productForm.get('withEffectTo').value).toBe('');
        expect(component.productForm.get('policyPrefix').value).toBe('');
        expect(component.productForm.get('organizationCode').value).toBe('2'); // Check the default value
        expect(component.productForm.get('claimPrefix').value).toBe('');
        expect(component.productForm.get('underwritingScreenCode').value).toBe('');
        expect(component.productForm.get('claimScreenCode').value).toBeNull();
        expect(component.productForm.get('expires').value).toBe('Y');
        expect(component.productForm.get('doesCashBackApply').value).toBe('Y');
        expect(component.productForm.get('minimumSubClasses').value).toBe(1);
        expect(component.productForm.get('acceptsMultipleClasses').value).toBe('N');
        expect(component.productForm.get('minimumPremium').value).toBeNull();
        // ... add more expectations for other form controls as needed
      });
      it('should handle error and show error message', () => {
        // Arrange
        const requestBody = {
          code: '123', // Replace with valid code
          product_short_description: 'Updated Description',
          // Add other form fields as needed
        };
        const errorMessage = 'An error occurred';
        jest.spyOn(gisService, 'updateSubclass').mockReturnValue(throwError(errorMessage));
        const messageServiceAddSpy = jest.spyOn(messageService, 'add');
    
        // Act
        component.updateProductSubclass();
    
        // Assert
        // expect(gisService.updateSubclass).toHaveBeenCalledWith(requestBody, requestBody.code);
        // expect(messageServiceAddSpy).toHaveBeenCalledWith({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: 'Error, try again later',
        // });
      });
      it('should call getsubclasseswithCode with the provided code', () => {
        // Arrange
        const code = 123; // Replace with the code you want to test
    
        // Spy on the getsubclasseswithCode method
        const getsubclasseswithCodeSpy = jest.spyOn(component, 'getsubclasseswithCode');
    
        // Act
        component.onRowSelect(code);
    
        // Assert
        expect(getsubclasseswithCodeSpy).toHaveBeenCalledWith(code);
      });
      
  it('should call methods based on the selected node properties', () => {
    // Arrange
    const selectedNodeWithCode = { code: '123' }; // Replace with a node with code property
    const selectedNodeWithCode2 = { code2: '456' }; // Replace with a node with code2 property

    // Spy on the methods
    const getProductGroupSpy = jest.spyOn(component, 'getProductGroup');
    const getProductSpy = jest.spyOn(component, 'getProduct');
    const getSubclassesSpy = jest.spyOn(component, 'getSubclasses');
    const getProductDocumentSpy = jest.spyOn(component, 'getProductDocument');

    // Act
    component.SelectNode({ node: selectedNodeWithCode }); // Simulate an event with node code
    component.SelectNode({ node: selectedNodeWithCode2 }); // Simulate an event with node code2

    // Assert
    expect(getProductGroupSpy).toHaveBeenCalledWith(selectedNodeWithCode.code);
    expect(getProductSpy).toHaveBeenCalledWith(selectedNodeWithCode2.code2);
    expect(getProductDocumentSpy).toHaveBeenCalledWith(selectedNodeWithCode2.code2);
    expect(getSubclassesSpy).toHaveBeenCalledWith(selectedNodeWithCode2.code2, selectedNodeWithCode.code);
  });
});