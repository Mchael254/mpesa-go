import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';

import { QuickComponent } from './quick.component';
import { QuickService } from '../../service/quick/quick.service';
import { PayFrequencyService } from '../../service/pay-frequency/pay-frequency.service';
import { ProductService } from '../../../../../service/product/product.service';
import { CurrencyService } from '../../../../../../../shared/services/setups/currency/currency.service';
import { IntermediaryService } from '../../../../../../entities/services/intermediary/intermediary.service';
import { BranchService } from '../../../../../../../shared/services/setups/branch/branch.service';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('QuickComponent', () => {
  let component: QuickComponent;
  let fixture: ComponentFixture<QuickComponent>;
  let quickServiceSpy: jest.Mocked<QuickService>;
  let payFrequencyServiceSpy: jest.Mocked<PayFrequencyService>;
  let productServiceSpy: jest.Mocked<ProductService>;
  let currencyServiceSpy: jest.Mocked<CurrencyService>;
  let intermediaryServiceSpy: jest.Mocked<IntermediaryService>;
  let branchServiceSpy: jest.Mocked<BranchService>;
  let sessionStorageServiceSpy: jest.Mocked<SessionStorageService>;
  let messageServiceSpy: jest.Mocked<MessageService>;
  let spinnerServiceSpy: jest.Mocked<NgxSpinnerService>;

  beforeEach(async () => {
    const mockQuickService = {
      getDurationTypes: jest.fn(() => of([])),
      getQuotationCovers: jest.fn(() => of([])),
      getUnitRate: jest.fn(() => of([])),
      getFacultativeTypes: jest.fn(() => of([])),
      postQuoteDetails: jest.fn(() => of([])),
      updateQuoteDetails: jest.fn(() => of([])),
    };
    const mockPayFrequencyService = {
      getPayFrequencies: jest.fn(() => of([])) // Always return an observable
    };
    const mockProductService = { getListOfProduct: jest.fn(() => of([])) };
    const mockCurrencyService = { getAllCurrencies: jest.fn(() => of([])) };
    const mockIntermediaryService = { searchAgent: jest.fn(() => of([])), getAgents: jest.fn(() => of([])) };
    const mockBranchService = { getBranches: jest.fn(() => of([])) };
    const mockSessionStorageService = { get: jest.fn(), set: jest.fn() };
    const mockMessageService = { add: jest.fn() };
    const mockSpinnerService = { show: jest.fn(), hide: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [ QuickComponent ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        FormBuilder,
        { provide: QuickService, useValue: mockQuickService },
        { provide: PayFrequencyService, useValue: mockPayFrequencyService },
        { provide: ProductService, useValue: mockProductService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: IntermediaryService, useValue: mockIntermediaryService },
        { provide: BranchService, useValue: mockBranchService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: NgxSpinnerService, useValue: mockSpinnerService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickComponent);
    component = fixture.componentInstance;
    component.quickQuoteForm();
    quickServiceSpy = TestBed.inject(QuickService) as jest.Mocked<QuickService>;
    payFrequencyServiceSpy = TestBed.inject(PayFrequencyService) as jest.Mocked<PayFrequencyService>;
    productServiceSpy = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    currencyServiceSpy = TestBed.inject(CurrencyService) as jest.Mocked<CurrencyService>;
    intermediaryServiceSpy = TestBed.inject(IntermediaryService) as jest.Mocked<IntermediaryService>;
    branchServiceSpy = TestBed.inject(BranchService) as jest.Mocked<BranchService>;
    sessionStorageServiceSpy = TestBed.inject(SessionStorageService) as jest.Mocked<SessionStorageService>;
    messageServiceSpy = TestBed.inject(MessageService) as jest.Mocked<MessageService>;
    spinnerServiceSpy = TestBed.inject(NgxSpinnerService) as jest.Mocked<NgxSpinnerService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.quickForm).toBeDefined();
    expect(component.quickForm.get('products')).toBeDefined();
    expect(component.quickForm.get('durationType')).toBeDefined();
    expect(component.quickForm.get('facultativeType')).toBeDefined();
    expect(component.quickForm.get('quotationCovers')).toBeDefined();
    expect(component.quickForm.get('frequencyOfPayment')).toBeDefined();
    expect(component.quickForm.get('unitRateOption')).toBeDefined();
    expect(component.quickForm.get('currency')).toBeDefined();
    expect(component.quickForm.get('effectiveDate')).toBeDefined();
    expect(component.quickForm.get('quotationCalcType')).toBeDefined();
    expect(component.quickForm.get('intermediary')).toBeDefined();
    expect(component.quickForm.get('commissionRate')).toBeDefined();
  });

  it('should call all necessary services on ngOnInit', () => {
    payFrequencyServiceSpy.getPayFrequencies.mockReturnValue(of([]));
    productServiceSpy.getListOfProduct.mockReturnValue(of([]));
    currencyServiceSpy.getAllCurrencies.mockReturnValue(of([]));
    quickServiceSpy.getDurationTypes.mockReturnValue(of([]));
    quickServiceSpy.getQuotationCovers.mockReturnValue(of([]));
    quickServiceSpy.getUnitRate.mockReturnValue(of([]));
    quickServiceSpy.getFacultativeTypes.mockReturnValue(of([]));
    intermediaryServiceSpy.getAgents.mockReturnValue(of({
      content: [],
      last: true,
      totalPages: 1,
      totalElements: 0,
      size: 10,
      number: 0,
      first: true,
      numberOfElements: 0,
      empty: true
    }));
    branchServiceSpy.getBranches.mockReturnValue(of([]));

    component.ngOnInit();

    expect(payFrequencyServiceSpy.getPayFrequencies).toHaveBeenCalled();
    expect(productServiceSpy.getListOfProduct).toHaveBeenCalledWith('G');
    expect(currencyServiceSpy.getAllCurrencies).toHaveBeenCalled();
    expect(quickServiceSpy.getDurationTypes).toHaveBeenCalled();
    expect(quickServiceSpy.getQuotationCovers).toHaveBeenCalled();
    expect(quickServiceSpy.getUnitRate).toHaveBeenCalled();
    expect(quickServiceSpy.getFacultativeTypes).toHaveBeenCalled();
    expect(intermediaryServiceSpy.getAgents).toHaveBeenCalled();
    expect(branchServiceSpy.getBranches).toHaveBeenCalledWith(1);
  });

  it('should format currency label correctly', () => {
    const result = component.formatCurrencyLabel('us dollar', '$');
    expect(result).toBe('Us Dollar ($)');
  });

  it('should highlight invalid fields', () => {
    component.quickForm.get('products').setErrors({ required: true });
    component.quickForm.get('products').markAsTouched();
    expect(component.highlightInvalid('products')).toBe(true);
  });

  it('should not highlight valid fields', () => {
    component.quickForm.get('products').setErrors(null);
    expect(component.highlightInvalid('products')).toBe(false);
  });

  it('should capitalize first letter of each word', () => {
    const result = component.capitalizeFirstLetterOfEachWord('hello world');
    expect(result).toBe('Hello World');
  });

  it('should post quote details when form is valid and quotationCode is null', () => {
    component.quickForm.patchValue({
      products: { value: 'P001', type: 'Type1' },
      durationType: { name: 'Duration1' },
      facultativeType: { name: 'Facultative1' },
      quotationCovers: { name: 'Cover1' },
      frequencyOfPayment: { value: 'Freq1' },
      unitRateOption: { value: 'Unit1' },
      currency: { value: 'Currency1' },
      effectiveDate: new Date('2023-01-01'),
      quotationCalcType: 'Calc1',
      intermediary: { id: 'I001' },
      branch: { id: 'B001' },
      commissionRate: 10
    });

    quickServiceSpy.postQuoteDetails.mockReturnValue(of({ quotation_code: 'Q001' }));
    sessionStorageServiceSpy.set.mockReturnValue(undefined);

    component.onContinue();

    expect(quickServiceSpy.postQuoteDetails).toHaveBeenCalled();
    // expect(sessionStorageServiceSpy.set).toHaveBeenCalledWith('quotationResponse', expect.any(String));
    expect(messageServiceSpy.add).toHaveBeenCalledWith({severity: 'success', summary: 'Success', detail: 'Quotation generated successfully'});
  });

  it('should update quote details when form is valid and quotationCode is not null', () => {
    component.quotationCode = 1;
    component.quickForm.patchValue({
      products: { value: 'P001', type: 'Type1' },
      durationType: { name: 'Duration1' },
      facultativeType: { name: 'Facultative1' },
      quotationCovers: { name: 'Cover1' },
      frequencyOfPayment: { value: 'Freq1' },
      unitRateOption: { value: 'Unit1' },
      currency: { value: 'Currency1' },
      effectiveDate: new Date('2023-01-01'),
      quotationCalcType: 'Calc1',
      intermediary: { id: 'I001' },
      branch: { id: 'B001' },
      commissionRate: 10
    });

    quickServiceSpy.updateQuoteDetails.mockReturnValue(of({ quotation_code: 'Q001' }));
    sessionStorageServiceSpy.set.mockReturnValue(undefined);

    component.onContinue();

    // expect(quickServiceSpy.updateQuoteDetails).toHaveBeenCalledWith('Q001', expect.any(Object));
    // expect(sessionStorageServiceSpy.set).toHaveBeenCalledWith('quotation_code', expect.any(String));
    expect(messageServiceSpy.add).toHaveBeenCalledWith({severity: 'success', summary: 'Success', detail: 'Quotation updated successfully'});
  });

  it('should show error message when form is invalid', () => {
    component.quickForm.setErrors({ invalid: true });
    component.onContinue();
    expect(messageServiceSpy.add).toHaveBeenCalledWith({severity: 'warn', summary: 'summary', detail: 'Fill all the fields correctly!'});
  });

  // it('should retrieve quote details from session storage', () => {
  //   const mockQuoteData = JSON.stringify({
  //     formData: {
  //       clients: { label: 'Client1' },
  //       intermediary: { name: 'Intermediary1' },
  //     }
  //   });
  //   const mockQuoteDetails = JSON.stringify({ quotation_code: 124 });
  //   sessionStorageServiceSpy.get.mockReturnValueOnce(mockQuoteData);
  //   sessionStorageServiceSpy.get.mockReturnValueOnce(123);
  //   Object.defineProperty(window, 'sessionStorage', {
  //     value: {
  //       getItem: jest.fn(() => mockQuoteDetails),
  //     },
  //     writable: true
  //   });

  //   component.ngOnInit(); // Call ngOnInit to initialize the form

  //   component.retrievQuoteDets();

  //   expect(component.quotationCode).toBe(124);
  //   expect(component.clientCode).toBe(123);
  //   expect(component.quickForm.get('clients')?.value).toBe('Client1');
  //   expect(component.quickForm.get('intermediary')?.value).toBe('Intermediary1');
  // });
  it('should retrieve quote details from session storage', () => {
    const mockQuoteData = JSON.stringify({
      formData: {
        clients: { label: 'Client1' },
        intermediary: { name: 'Intermediary1' },
      },
    });
    const mockQuoteDetails = JSON.stringify({ quotation_code: 124 });
  
    sessionStorageServiceSpy.get.mockReturnValueOnce(mockQuoteData);
    sessionStorageServiceSpy.get.mockReturnValueOnce(123);
  
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => mockQuoteDetails),
      },
      writable: true,
    });
  
    component.ngOnInit(); // Initializes form
    component.retrievQuoteDets(); // Assigns session data to form
  
    // Assertions
    expect(component.quotationCode).toBe(124);
    expect(component.clientCode).toBe(123);
    expect(component.quickForm.get('clients')?.value).toEqual({ label: 'Client1' });
    expect(component.quickForm.get('intermediary')?.value).toEqual({ name: 'Intermediary1' });
  });
  
});
