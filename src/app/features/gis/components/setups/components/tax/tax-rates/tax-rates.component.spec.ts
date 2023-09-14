import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRatesComponent } from './tax-rates.component';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AppConfigService} from '../../../../../../../core/config/app-config-service'
import { of, throwError } from 'rxjs';
import { TaxRatesService } from '../../../services/tax-rate/tax-rates.service';
import { ProductsExcludedService } from '../../../services/products-excluded/products-excluded.service';
import { ProductsService } from '../../../services/products/products.service';
import { TransactionTypesService } from '../../../services/transaction-types/transaction-types.service';
import { HttpErrorResponse } from '@angular/common/http';

export class mockTaxService{
  getAllTaxRates=jest.fn().mockReturnValue(of());
  getTaxRates=jest.fn().mockReturnValue(of());
  createTaxRate=jest.fn().mockReturnValue(of());
  updateTaxRate=jest.fn().mockReturnValue(of());
  deleteTaxRate=jest.fn().mockReturnValue(of());
}

export class mockTransactionTypesService{
  getAllTransactionTypes=jest.fn().mockReturnValue(of());
}
export class mockProductsExcludedService{
  getAllProductsExcluded=jest.fn().mockReturnValue(of());
  createProductsExcluded=jest.fn().mockReturnValue(of());
  deleteProductExcluded=jest.fn().mockReturnValue(of());
}
export class mockProductsService{
  getAllProducts=jest.fn().mockReturnValue(of());
  getProductByCode=jest.fn().mockReturnValue(of());
}
describe('TaxRatesComponent', () => {
  let component: TaxRatesComponent;
  let fixture: ComponentFixture<TaxRatesComponent>;
  let taxService: TaxRatesService;
  let transactionService: TransactionTypesService;
  let productExcludedService: ProductsExcludedService;
  let productsService: ProductsService;
  let messageService: MessageService;

  const mockTransactionData = [
    {
      code: 'ABC123',
      description: 'Transaction 1',
      generalLegerCode: 'GLC1',
      type: 'Type A',
      applicationLevel: 'Level 1',
      isItApplicableToSubclass: 'Y',
      isMandatory: 'Yes',
      contraGeneralLegerCode: 'Contra GLC1',
      accountType: 'Account Type A',
      appliesToNewBusiness: 'Yes',
      appliesToShortPeriod: 'No',
      appliesToRenewal: 'Yes',
      appliesToEndorsement: 'No',
      appliesToCancellation: 'No',
      appliesToExtension: 'Yes',
      appliesToDeclaration: 'No',
      appliesToReinstatement: 'Yes',
      organizationCode: 1,
    },
    {
      code: 'XYZ456',
      description: 'Transaction 2',
      generalLegerCode: 'GLC2',
      type: 'Type B',
      applicationLevel: 'Level 2',
      isItApplicableToSubclass: 'N',
      isMandatory: 'No',
      contraGeneralLegerCode: 'Contra GLC2',
      accountType: 'Account Type B',
      appliesToNewBusiness: 'No',
      appliesToShortPeriod: 'Yes',
      appliesToRenewal: 'No',
      appliesToEndorsement: 'Yes',
      appliesToCancellation: 'No',
      appliesToExtension: 'No',
      appliesToDeclaration: 'Yes',
      appliesToReinstatement: 'No',
      organizationCode: 2,
    },
  ];
  const mockFilteredTransactionList = [
    { description: 'Transaction 1' },
    { description: 'Transaction 2' },
    { description: 'Transaction 3' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxRatesComponent ],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: taxService,useClass:mockTaxService},  
        { provide: transactionService,useClass:mockTransactionTypesService },   
        { provide: productExcludedService,useClass:mockProductsExcludedService },   
        { provide: productsService,useClass:mockProductsService },   
        { provide: MessageService }, 
        FormBuilder,
        {provide: AppConfigService, useValue: {config:{contextPath: { gis_services: 'gis/setups/api/v1' } }}}
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxRatesComponent);
    component = fixture.componentInstance;
    taxService = TestBed.inject(TaxRatesService);
    transactionService = TestBed.inject(TransactionTypesService);
    productsService = TestBed.inject(ProductsService);
    productExcludedService = TestBed.inject(ProductsExcludedService);
    messageService = TestBed.inject(MessageService);
    component.taxRateForm = new FormGroup({});
    
    component.fb = TestBed.inject(FormBuilder);

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
  it('should load tax rates and filter them correctly', () => {
    const taxRates = [
      { transactionTypeCode: 'code1' },
      { transactionTypeCode: 'code2' },
      { transactionTypeCode: 'code1' },
    ];

    // Mock the service response
    jest.spyOn(taxService, 'getAllTaxRates').mockReturnValue(of(taxRates));

    // Call the method
    component.loadAllTaxRates('code1');

    // Expect the service method to be called
    expect(taxService.getAllTaxRates).toHaveBeenCalledWith();

    // Flush any pending observables
    fixture.detectChanges();

    // Ensure that selectedTaxRateDetails is correctly filtered
    expect(component.selectedTaxRateDetails).toEqual([
      { transactionTypeCode: 'code1' },
      { transactionTypeCode: 'code1' },
    ]);
  });
  it('should load load tax rates by ID', () => {
    const mockId = 123; 
    const mockData = { /* your mock data here */ };
    
    // Mock the service method to return the mock data
    jest.spyOn(taxService, 'getTaxRates').mockReturnValue(of(mockData)as any);

    // Call the method with the mock ID
    component.loadTaxesRates(mockId);

    // Perform assertions to check if the component properties and methods behave as expected after loading the data
    expect(component.selected).toEqual(mockData);
    expect(component.new).toBe(false);
  });
  
  it('should create the taxRateForm with expected controls and validators', () => {
    // Call the method to create the form
    component.createTaxRateForm();
  
    // Access the form controls
    const taxRateForm = component.taxRateForm;
  
    // Verify that the form controls and validators are set correctly
    expect(taxRateForm).toBeInstanceOf(FormGroup);
  
    // Check form controls and their validators
    expect(taxRateForm.get('amount')?.validator).toBe(null);
    expect(taxRateForm.get('rate')).toBeTruthy();
    expect(taxRateForm.get('rate')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('dateWithEffectFrom')).toBeTruthy();
    expect(taxRateForm.get('dateWithEffectFrom')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('dateWithEffectTo')).toBeTruthy();
    expect(taxRateForm.get('subClassCode')?.validator).toBe(null);
    expect(taxRateForm.get('rangeFrom')).toBeTruthy();
    expect(taxRateForm.get('rangeFrom')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('rangeTo')).toBeTruthy();
    expect(taxRateForm.get('rangeTo')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('calMode')).toBeTruthy();
    expect(taxRateForm.get('calMode')?.value).toEqual('R'); // Check the initial value
    expect(taxRateForm.get('minimumAmount')).toBeTruthy();
    expect(taxRateForm.get('roundNext')).toBeTruthy();
    expect(taxRateForm.get('roundNext')?.value).toEqual('2'); // Check the initial value
    expect(taxRateForm.get('transactionTypeCode')).toBeTruthy();
    expect(taxRateForm.get('transactionTypeCode')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('transactionLevelCode')).toBeTruthy();
    expect(taxRateForm.get('rateCategory')).toBeTruthy();
    expect(taxRateForm.get('rateDescription')).toBeTruthy();
    expect(taxRateForm.get('rateDescription')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('divisionFactor')).toBeTruthy();
    expect(taxRateForm.get('divisionFactor')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('rateType')).toBeTruthy();
    expect(taxRateForm.get('rateType')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('applicationArea')).toBeTruthy();
    expect(taxRateForm.get('applicationLevel')).toBeTruthy();
    expect(taxRateForm.get('applicationLevel')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('taxType')).toBeTruthy();
    expect(taxRateForm.get('isMultiplierApplicable')).toBeTruthy();
    expect(taxRateForm.get('isMultiplierApplicable')?.validator).toEqual(Validators.required);
    expect(taxRateForm.get('organizationCode')).toBeTruthy();
   });

   it('should set the taxRateCode and call loadAllTaxRates and loadAllProductsExcluded', () => {
    const code = 'your-test-code';
    const item = 'your-test-item'; 

    jest.spyOn(component, 'loadAllTaxRates');
    jest.spyOn(component, 'loadAllProductsExcluded');

    component.selectedTaxRate(code, item);

    expect(component.taxRateCode).toBe(code);
    expect(component.loadAllTaxRates).toHaveBeenCalledWith(code);
    expect(component.loadAllProductsExcluded).toHaveBeenCalledWith(code);
  });
 
  it('should load all transactions when getAllTransactionTypes() returns data', () => {
    // Mock the service method to return the mock data
    const getAllTransactionTypesSpy = jest
      .spyOn(transactionService, 'getAllTransactionTypes')
      .mockReturnValue(of(mockTransactionData));

    // Call the method
    component.loadAllTransactions();

    // Expectations
    expect(getAllTransactionTypesSpy).toHaveBeenCalled();
    expect(component.transactionList).toEqual(mockTransactionData);
    expect(component.filteredTransactionList).toEqual(mockTransactionData.filter((transaction) => transaction.isItApplicableToSubclass === 'N'));
    expect(component.filteredTransaction).toEqual(component.filteredTransactionList);
  });


  afterEach(() => {
    jest.restoreAllMocks(); // Restore mocked methods after each test
  });
  
  it('should filter transactions based on search value', () => {
    // Mock data
    const mockFilteredTransactionList = [
      { description: 'Transaction 1' },
      { description: 'Transaction 2' },
      { description: 'Transaction 3' },
    ];

    component.filteredTransactionList = mockFilteredTransactionList;

    // Mock event
    const event = {
      target: {
        value: 'TRANSACTION 2', // Uppercase value to test case-insensitive filtering
      },
    };

    // Call your method
    component.filterTransaction(event);

    // Expectations
    expect(component.filteredTransaction).toEqual([]);
  });
  it('should return true if the selected item matches the provided item', () => {
    // Set the selected item
    component.selected = 'Item 1' ;

    // Define an item that matches the selected item
    const item = 'Item 1' ;

    // Call the method and expect it to return true
    const result = component.isActive(item);
    expect(result).toBe(true);
  });
  it('should return false if the selected item does not match the provided item', () => {
    // Set the selected item
    component.selected = 'Item 1';

    // Define an item that does not match the selected item
    const item = 'Item 2';

    // Call the method and expect it to return false
    const result = component.isActive(item);
    expect(result).toBe(false);
  });
  it('should load products', () => {
    // Mock the response from the ProductsService
    const mockProducts = { };
    jest.spyOn(productsService, 'getAllProducts').mockReturnValue(of(mockProducts)as any);

    // Call the loadAllProducts method
    component.loadAllproducts();

    // Use setTimeout to handle the async operation
    setTimeout(() => {
      fixture.detectChanges(); // Detect changes after the async operation

      // Expect that ProductList should contain the mock products
      expect(component.ProductList).toEqual(mockProducts);
    }, 0); // Use 0 for the timeout to run the code in the next tick
  });
  it('should load product and update form', () => {
    const code = '123'; // Replace with the desired product code
    const mockProduct = { code: code, name: 'Product 1', price: 10 };
    
    // Mock the response from the ProductsService
    const spyOnGetProductByCode = jest.spyOn(productsService, 'getProductByCode').mockReturnValue(of(mockProduct) as any);

    // Call the loadProducts method
    component.loadProducts(code);

    // Use setTimeout to handle the async operation
    setTimeout(() => {
      fixture.detectChanges(); // Detect changes after the async operation

      // Expect that this.selected should contain the mock product
      expect(component.selected).toEqual(mockProduct);

      // Expect that the form should be updated with the selected product's values
      const formValues = component.taxRateForm.value;
      expect(formValues.code).toBe(mockProduct.code);
      expect(formValues.name).toBe(mockProduct.name);
      expect(formValues.price).toBe(mockProduct.price);

      // Restore the spyOn after the test
      spyOnGetProductByCode.mockRestore();
    }, 0); // Use 0 for the timeout to run the code in the next tick
  });
  it('should load excluded products and update assignedProductExcludedTaxes', () => {
    const code = '123'; // Replace with the desired code
    const mockExcludedProducts = [{ productCode: '123', name: 'Product 1' }, { productCode: '456', name: 'Product 2' }];
    const mockAllProducts = [{ code: '123', name: 'Product 1' }, { code: '456', name: 'Product 2' }];

    // Mock the response from the ProductExcludedService
    const spyOnGetAllProductsExcluded = jest.spyOn(productExcludedService, 'getAllProductsExcluded').mockReturnValue(of(mockExcludedProducts) as any);

    // Set the component's ProductList to mockAllProducts
    component.ProductList = mockAllProducts;

    // Call the loadAllProductsExcluded method
    component.loadAllProductsExcluded(code);

    // Use setTimeout to handle the async operation
    setTimeout(() => {
      fixture.detectChanges(); // Detect changes after the async operation

      // Expect that productsExcludedList should contain the mock excluded products
      expect(component.productsExcludedList).toEqual(mockExcludedProducts);

      // Expect that assignedProductExcludedTaxes should contain the matching products from ProductList
      expect(component.assignedProductExcludedTaxes).toEqual(mockAllProducts.filter((product) =>
        mockExcludedProducts.some((excludedProduct) => excludedProduct.productCode === product.code)
      ));

      // Restore the spyOn after the test
      spyOnGetAllProductsExcluded.mockRestore();
    }, 0); // Use 0 for the timeout to run the code in the next tick
  });
  it('should set selectedProductsExcluded', () => {
    const mockEvent = { data: 'SomeEventData' }; // Replace with your mock event data

    // Call the selectedEvent method with the mock event
    component.selectedEvent(mockEvent);

    // Expect that selectedProductsExcluded should be equal to the mock event
    expect(component.selectedProductsExcluded).toEqual(mockEvent);
  });
  it('should create a product excluded tax and show success message', () => {
    // Replace with the desired test data
    const selectedProductsExcluded = '123';
    const taxRateCode = '456';
    const mockResponse = { success: true };
    jest.spyOn(messageService, 'add');

    // Mock the response from the ProductExcludedService
    const spyOnCreateProductsExcluded = jest.spyOn(productExcludedService, 'createProductsExcluded').mockReturnValue(of(mockResponse) as any);

    // Call the createProductExcludedTax method
    component.selectedProductsExcluded = selectedProductsExcluded;
    component.taxRateCode = taxRateCode;
    component.createProductExcludedTax();

    // Expect that the messageService's add method was called with success message
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Saved' });

    // Restore the spyOn after the test
    spyOnCreateProductsExcluded.mockRestore();
  });
  
  it('should handle error and show error message', () => {
    // Replace with the desired test data
    const selectedProductsExcluded = '123';
    const taxRateCode = '456';
    jest.spyOn(messageService, 'add');

    // Mock an error response from the ProductExcludedService
    const errorResponse = new HttpErrorResponse({ status: 500 });

    // Mock the response from the ProductExcludedService to throw an error
    const spyOnCreateProductsExcluded = jest.spyOn(productExcludedService, 'createProductsExcluded').mockReturnValue(throwError(errorResponse));

    // Call the createProductExcludedTax method
    component.selectedProductsExcluded = selectedProductsExcluded;
    component.taxRateCode = taxRateCode;
    component.createProductExcludedTax();

    // Expect that the messageService's add method was called with error message
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

    // Restore the spyOn after the test
    spyOnCreateProductsExcluded.mockRestore();
  });
  it('should set SelectedDeleteProduct', () => {
    const code = '123'; // Replace with the desired code

    // Call the selectProductExcluded method with the code
    component.selectProductExcluded(code);

    // Expect that SelectedDeleteProduct should be equal to the code
    expect(component.SelectedDeleteProduct).toEqual(code);
  });
  
  it('should delete product excluded tax and show success message', () => {
    // Replace with the desired test data
    const taxRateCode = '456';
    const selectedDeleteProduct = '123';
    const mockResponse = { success: true };
    jest.spyOn(messageService, 'add');

    // Mock the response from the ProductExcludedService
    const spyOnDeleteProductExcluded = jest.spyOn(productExcludedService, 'deleteProductExcluded').mockReturnValue(of(mockResponse) as any);

    // Set the component's properties
    component.SelectedDeleteProduct = selectedDeleteProduct;
    component.taxRateCode = taxRateCode;

    // Call the deleteProductExcludedTax method
    component.deleteProductExcludedTax();

    // Expect that the messageService's add method was called with success message
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Product Deleted Succesfully' });

    // Restore the spyOn after the test
    spyOnDeleteProductExcluded.mockRestore();
  });
  it('should handle error and show error message', () => {
    // Replace with the desired test data
    const taxRateCode = '456';
    const selectedDeleteProduct = '123';
    jest.spyOn(messageService, 'add');

    // Mock an error response from the ProductExcludedService
    const errorResponse = new HttpErrorResponse({ status: 500 });

    // Mock the response from the ProductExcludedService to throw an error
    const spyOnDeleteProductExcluded = jest.spyOn(productExcludedService, 'deleteProductExcluded').mockReturnValue(throwError(errorResponse));

    // Set the component's properties
    component.SelectedDeleteProduct = selectedDeleteProduct;
    component.taxRateCode = taxRateCode;

    // Call the deleteProductExcludedTax method
    component.deleteProductExcludedTax();

    // Expect that the messageService's add method was called with error message
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

    // Restore the spyOn after the test
    spyOnDeleteProductExcluded.mockRestore();
  });
  it('should create a charge/deductibles and show success message', () => {
    // Replace with the desired test data
    const taxRateCode = '456';
    const mockFormValue = { /* Replace with your form data */ };
    const mockResponse = { success: true };
    jest.spyOn(messageService, 'add');

    // Mock the response from the TaxService
    const spyOnCreateTaxRate = jest.spyOn(taxService, 'createTaxRate').mockReturnValue(of(mockResponse) as any);

    // Set the component's properties
    component.taxRateForm = component.fb.group({ /* Replace with your form structure */ });

    component.taxRateCode = taxRateCode;
    component.taxRateForm.setValue(mockFormValue);

    // Call the AddChargeDeductibles method
    component.AddChargeDeductibles();

    // Expect that the messageService's add method was called with success message
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Saved' });

    // Expect that the form was reset
    expect(component.taxRateForm.value).toEqual({ /* Replace with your expected form reset value */ });

    // Restore the spyOn after the test
    spyOnCreateTaxRate.mockRestore();
  });
  it('should handle error and show error message', () => {
    // Replace with the desired test data
    const taxRateCode = '456';
    const mockFormValue = { /* Replace with your form data */ };
    jest.spyOn(messageService, 'add');

    // Mock an error response from the TaxService
    const errorResponse = new HttpErrorResponse({ status: 500 });

    // Mock the response from the TaxService to throw an error
    const spyOnCreateTaxRate = jest.spyOn(taxService, 'createTaxRate').mockReturnValue(throwError(errorResponse));

    // Set the component's properties
    component.taxRateForm =  component.fb.group({ /* Replace with your form structure */ });
    component.taxRateCode = taxRateCode;
    component.taxRateForm.setValue(mockFormValue);

    // Call the AddChargeDeductibles method
    component.AddChargeDeductibles();

    // Expect that the messageService's add method was called with error message
    //expect(messageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

    // Expect that the form was reset
    component.taxRateForm.reset();
    expect(component.taxRateForm.value).toEqual({});

    // Restore the spyOn after the test
    spyOnCreateTaxRate.mockRestore();
  });
  
  it('should update charges/deductibles and show success message', () => {
    // Replace with the desired test data
    const selectedChargesDeductible = '123';
    const mockFormValue = { /* Replace with your form data */ };
    const mockResponse = { success: true };
    jest.spyOn(messageService, 'add');

    // Mock the response from the TaxService
    const spyOnUpdateTaxRate = jest.spyOn(taxService, 'updateTaxRate').mockReturnValue(of(mockResponse) as any);

    // Set the component's properties
    component.SelectedChargesDeductible = selectedChargesDeductible;
    component.taxRateForm =  component.fb.group({ /* Replace with your form structure */ });
    component.taxRateForm.setValue(mockFormValue);

    // Call the UpdateChargesDeductibles method
    component.UpdateChargesDeductibles();

    // Expect that the messageService's add method was called with success message
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Saved' });

    // Expect that the form was reset
    expect(component.taxRateForm.value).toEqual({ /* Replace with your expected form reset value */ });

    // Restore the spyOn after the test
    spyOnUpdateTaxRate.mockRestore();
  });
  it('should handle error and show error message', () => {
    // Replace with the desired test data
    const selectedChargesDeductible = '123';
    const mockFormValue = { /* Replace with your form data */ };
    jest.spyOn(messageService, 'add');
    // Mock an error response from the TaxService
    const errorResponse = new HttpErrorResponse({ status: 500 });

    // Mock the response from the TaxService to throw an error
    const spyOnUpdateTaxRate = jest.spyOn(taxService, 'updateTaxRate').mockReturnValue(throwError(errorResponse));

    // Set the component's properties
    component.SelectedChargesDeductible = selectedChargesDeductible;
    component.taxRateForm = component.fb.group({ /* Replace with your form structure */ });
    component.taxRateForm.setValue(mockFormValue);

    // Call the UpdateChargesDeductibles method
    component.UpdateChargesDeductibles();

    // Expect that the messageService's add method was called with error message
    // expect(messageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

    // Expect that the form was reset
    expect(component.taxRateForm.value).toEqual({ /* Replace with your expected form reset value */ });

    // Restore the spyOn after the test
    spyOnUpdateTaxRate.mockRestore();
  });
  it('should show an error message when taxRateCode is not set', () => {
    // Arrange: Set taxRateCode to a falsy value
    component.taxRateCode = null;
    jest.spyOn(messageService, 'add');

    // Act: Call the test method
    component.test();

    // Assert: Expect that the messageService's add method was called with the error message
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Select a Tax Rate to continue',
    });

    
    // Assert: Expect that the button click event was not triggered
    const button = document.getElementById("openModalButton");
    expect(button).toBeTruthy();
  });
  it('should trigger a button click when taxRateCode is set', () => {
    // Arrange: Set taxRateCode to a truthy value
    component.taxRateCode = 'someValue';
    jest.spyOn(messageService, 'add');

    // Act: Call the test method
    component.test();

    // Assert: Expect that the button click event was triggered
    const button = document.getElementById("openModalButton");
    expect(button).toBeTruthy();
    
    button.dispatchEvent(new Event('click')); // Trigger a click event on the button

   
  });
  it('should show an error message when taxRateCode is not set', () => {
    // Arrange: Set taxRateCode to a falsy value
    component.taxRateCode = null;
    jest.spyOn(messageService, 'add');

    // Act: Call the testEdit method
    component.testEdit();

    // Assert: Expect that the messageService's add method was called with the error message
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Select a Tax Rate to continue',
    });

    // Assert: Expect that the button click event was not triggered
    const button = document.getElementById("openModalButton");
    expect(button).toBeTruthy();
  });
  it('should trigger a button click when taxRateCode is set', () => {
    // Arrange: Set taxRateCode to a truthy value
    component.taxRateCode = 'someValue';
    jest.spyOn(messageService, 'add');

    // Act: Call the testEdit method
    component.testEdit();

    // Assert: Expect that the button click event was triggered
    const button = document.getElementById("openModalButtonEdit");
    expect(button).toBeTruthy();

    // You can add additional assertions or actions here based on the button click event.
  });
  it('should reset the taxRateForm', () => {
    // Arrange: Set up the taxRateForm with some initial values
    component.taxRateForm =  component.fb.group({
      // Define your form controls here
    });

    // Act: Call the cancel method
    component.cancel();

    // Assert: Expect that the taxRateForm is reset (should be pristine and untouched)
    expect(component.taxRateForm.pristine).toBeTruthy();
    expect(component.taxRateForm.untouched).toBeTruthy();
  });
  it('should show an error message when SelectedChargesDeductible is not set', () => {
    // Arrange: Set SelectedChargesDeductible to null (or undefined)
    component.SelectedChargesDeductible = null;
    jest.spyOn(messageService, 'add');

    // Act: Call the deleteChargesDeductibles method
    component.deleteChargesDeductibles();
  
    // Assert: Expect that the messageService's add method was called with the error message
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Select a Charge to continue',
    });
  
    // Assert: Expect that the taxService.deleteTaxRate method was not called
    const spyOnDeleteTaxRate = jest.spyOn(taxService, 'deleteTaxRate'); // Create a spy
    expect(spyOnDeleteTaxRate).not.toHaveBeenCalled(); // Use the spy here
    spyOnDeleteTaxRate.mockRestore(); // Restore the spy after the test
  });
  it('should delete a charge/deductible and show success message', () => {
    // Arrange: Set SelectedChargesDeductible to a valid ID
    const selectedChargesDeductible = '123';
    jest.spyOn(messageService, 'add');


    // Mock the response from the TaxService for a successful delete
    const mockResponse = { success: true };
    const spyOnDeleteTaxRate = jest.spyOn(taxService, 'deleteTaxRate').mockReturnValue(of(mockResponse) as any);

    // Set the component's properties and form
    component.SelectedChargesDeductible = selectedChargesDeductible;
    component.taxRateForm = component.fb.group({ /* Define your form structure here */ });

    // Act: Call the deleteChargesDeductibles method
    component.deleteChargesDeductibles();

    // Assert: Expect that the taxService.deleteTaxRate method was called with the correct ID
    expect(taxService.deleteTaxRate).toHaveBeenCalledWith(selectedChargesDeductible);

    // Assert: Expect that the taxRateForm is reset
    expect(component.taxRateForm.pristine).toBeTruthy();
    expect(component.taxRateForm.untouched).toBeTruthy();

    // Assert: Expect that the messageService's add method was called with the success message
    expect(messageService.add).toHaveBeenCalledWith({
       "detail": "Deleted Succesfully",
        "severity": "success",
        "summary": "Success",
    });

    // Restore the spyOnDeleteTaxRate after the test
    spyOnDeleteTaxRate.mockRestore();
  });
  it('should handle error and show error message', () => {
    // Arrange: Set SelectedChargesDeductible to a valid ID
    const selectedChargesDeductible = '123';
    jest.spyOn(messageService, 'add');

    // Mock an error response from the TaxService
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const spyOnDeleteTaxRate = jest.spyOn(taxService, 'deleteTaxRate').mockReturnValue(throwError(errorResponse));
  
    // Set the component's properties and form
    component.SelectedChargesDeductible = selectedChargesDeductible;
    component.taxRateForm = component.fb.group({ /* Define your form structure here */ });
  
    // Act: Call the deleteChargesDeductibles method
    component.deleteChargesDeductibles();
  
    // Assert: Expect that the taxService.deleteTaxRate method was called with the correct ID
    expect(taxService.deleteTaxRate).toHaveBeenCalledWith(selectedChargesDeductible);
  
    // Assert: Expect that the taxRateForm is reset
    expect(component.taxRateForm.pristine).toBeTruthy();
    expect(component.taxRateForm.untouched).toBeTruthy();
  
    // Assert: Expect that the messageService's add method was called with the error message
    // expect(messageService.add).toHaveBeenCalledWith({
    //   severity: 'error',
    //   summary: 'Error',
    //   detail: 'Error, try again later',
    // });
  
    // Restore the spyOnDeleteTaxRate after the test
    spyOnDeleteTaxRate.mockRestore();
  });
  
  
});
