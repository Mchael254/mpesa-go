// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { QuickComponent } from './quick.component';

// describe('QuickComponent', () => {
//   let component: QuickComponent;
//   let fixture: ComponentFixture<QuickComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [QuickComponent]
//     });
//     fixture = TestBed.createComponent(QuickComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { ClientService } from '../../../../../../entities/services/client/client.service';
import { ProductService } from '../../../../../service/product/product.service';
import { IntermediaryService } from '../../../../../../entities/services/intermediary/intermediary.service';
import { PayFrequencyService } from '../../service/pay-frequency/pay-frequency.service';
import { QuickService } from '../../service/quick/quick.service';
import { QuickComponent } from './quick.component';
import { Currency } from '../../models/currency';
import { BranchService } from "../../../../../../../shared/services/setups/branch/branch.service";
import { CurrencyService } from "../../../../../../../shared/services/setups/currency/currency.service";
import { SessionStorageService } from "../../../../../../../shared/services/session-storage/session-storage.service";
import { TranslateModule } from '@ngx-translate/core';

// Mock services for testing
class MockQuickService {
  postQuoteDetails = jest.fn().mockReturnValue(of({ quotation_code: 123 }));
  updateQuoteDetails = jest.fn().mockReturnValue(of({ quotation_code: 123 }));
  getDurationTypes = jest.fn().mockReturnValue(of([]));
  getQuotationCovers = jest.fn().mockReturnValue(of([]));
  getUnitRate = jest.fn().mockReturnValue(of([]));
  getFacultativeTypes = jest.fn().mockReturnValue(of([]));
}
class MockPayFrequencyService {
  getPayFrequencies = jest.fn().mockReturnValue(of([
    { id: 1, desc: 'Weekly', sht_desc: 'Weekly' },
    { id: 2, desc: 'Monthly', sht_desc: 'Monthly' },
  ]));
}
class MockProductService {
  getListOfProduct = jest.fn().mockReturnValue(of([]));
}
class MockIntermediaryService {
  searchAgent = jest.fn().mockReturnValue(of({ content: [] }));
  getAgents = jest.fn().mockReturnValue(of({ content: [] }));
}
class MockBranchService {
  getBranches = jest.fn().mockReturnValue(of([]));
}
class MockCurrencyService {
  getAllCurrencies = jest.fn().mockReturnValue(of([]));
}

export class MockClientService {
  getClients = jest.fn().mockReturnValue(of([]));
  getClientTitles = jest.fn().mockReturnValue(of([]));
  searchClients = jest.fn((clients) => {return []});
}



class MockSessionStorageService {
  get = jest.fn((key: string) => {
    if (key === 'quotation_code') {
      return JSON.stringify({
        formData: {
          effectiveDate: new Date('2024-01-01'),
          products: { value: 1, type: 'G' },
          facultativeType: { name: 'FacultativeType 1' },
          quotationCovers: { name: 'QuotationCovers 1' },
          durationType: { name: 'DurationTypes 1' },
          frequencyOfPayment: 'Weekly',
          unitRateOption: { value: 'Value 1' },
          currency: { value: 1 },
          quotationCalcType: 'Type 1',
          intermediary: { id: 1 },
          branch: { id: 1 },
          commissionRate: 50
        }
      });
    }
    return null;
  });
  set = jest.fn();
}

describe('QuickComponent', () => {
  let component: QuickComponent;
  let fixture: ComponentFixture<QuickComponent>;
  let quickService: QuickService;
  let payFrequenciesService: PayFrequencyService;
  let clientService: ClientService;
  let productService: ProductService;
  let intermediaryService: IntermediaryService;
  let branchService: BranchService;
  let currencyService: CurrencyService;
  let sessionStorageService: SessionStorageService;
  let spinnerService: NgxSpinnerService;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule],
      providers: [
        { provide: QuickService, useClass: MockQuickService },
        { provide: PayFrequencyService, useClass: MockPayFrequencyService },
        { provide: ClientService, useClass: MockClientService },
        { provide: ProductService, useClass: MockProductService },
        { provide: IntermediaryService, useClass: MockIntermediaryService },
        { provide: BranchService, useClass: MockBranchService },
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: SessionStorageService, useClass: MockSessionStorageService },
        { provide: NgxSpinnerService, useValue: { show: jest.fn(), hide: jest.fn() } },
        { provide: MessageService, useValue: { add: jest.fn() } },
      ], declarations: [
        QuickComponent,
      ],
    });
    fixture = TestBed.createComponent(QuickComponent);
    component = fixture.componentInstance;
    quickService = TestBed.inject(QuickService);
    payFrequenciesService = TestBed.inject(PayFrequencyService);
    clientService = TestBed.inject(ClientService);
    productService = TestBed.inject(ProductService);
    intermediaryService = TestBed.inject(IntermediaryService);
    branchService = TestBed.inject(BranchService);
    currencyService = TestBed.inject(CurrencyService);
    sessionStorageService = TestBed.inject(SessionStorageService);
    spinnerService = TestBed.inject(NgxSpinnerService);
    messageService = TestBed.inject(MessageService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and fetch data on ngOnInit', () => {
    expect(component.quickForm).toBeDefined();

    expect(payFrequenciesService.getPayFrequencies).toHaveBeenCalled();
    expect(productService.getListOfProduct).toHaveBeenCalledWith('G');
    expect(currencyService.getAllCurrencies).toHaveBeenCalled();
    expect(quickService.getDurationTypes).toHaveBeenCalled();
    expect(quickService.getQuotationCovers).toHaveBeenCalled();
    expect(quickService.getUnitRate).toHaveBeenCalled();
    expect(quickService.getFacultativeTypes).toHaveBeenCalled();
    expect(intermediaryService.getAgents).toHaveBeenCalled();
    expect(branchService.getBranches).toHaveBeenCalledWith(1);

    // check if retrieval from sessionStorage is done
    expect(sessionStorageService.get).toHaveBeenCalledWith('quotation_code');
    expect(component.quickForm.get('effectiveDate').value).toEqual(new Date('2024-01-01'));
    expect(component.quickForm.get('products').value).toEqual({ value: 1, type: 'G' });
    expect(component.quickForm.get('facultativeType').value).toEqual({ name: 'FacultativeType 1' });
    expect(component.quickForm.get('quotationCovers').value).toEqual({ name: 'QuotationCovers 1' });
    expect(component.quickForm.get('durationType').value).toEqual({ name: 'DurationTypes 1' });
    expect(component.quickForm.get('frequencyOfPayment').value).toEqual('Weekly');
    expect(component.quickForm.get('unitRateOption').value).toEqual({ value: 'Value 1' });
    expect(component.quickForm.get('currency').value).toEqual({ value: 1 });
    expect(component.quickForm.get('quotationCalcType').value).toEqual('Type 1');
    expect(component.quickForm.get('intermediary').value).toEqual({ id: 1 });
    expect(component.quickForm.get('branch').value).toEqual({ id: 1 });
    expect(component.quickForm.get('commissionRate').value).toEqual(50);
  });

  it('should handle form submission correctly', () => {
    const apiRequest = {
      effective_date: '2024-01-01',
      product_code: 1,
      client_code: null,
      facultative_type: 'FacultativeType 1',
      cover_type_dependant: 'QuotationCovers 1',
      calculation_type: 'Type 1',
      duration_type: 'DurationTypes 1',
      frequency_of_payment: 'Weekly',
      unit_rate: 'Value 1',
      agent_code: 1,
      branch_code: 1,
      currency_code: 1,
      commission_rate: 50,
      product_type: 'G'
    };
    component.quickForm.patchValue({
      effectiveDate: new Date('2024-01-01'),
      products: { value: 1, type: 'G' },
      facultativeType: { name: 'FacultativeType 1' },
      quotationCovers: { name: 'QuotationCovers 1' },
      durationType: { name: 'DurationTypes 1' },
      frequencyOfPayment: 'Weekly',
      unitRateOption: { value: 'Value 1' },
      currency: { value: 1 },
      quotationCalcType: 'Type 1',
      intermediary: { id: 1 },
      branch: { id: 1 },
      commissionRate: 50
    });
    const quickFormQuotationCalcType = 'Type 1';
    component.quotationCode = null;

    // Mock the quickService method
    jest.spyOn(quickService, 'postQuoteDetails').mockReturnValueOnce(of({ quotation_code: 123 }));

    // Call the onContinue method
    component.onContinue();

    // Verify method calls
    expect(quickService.postQuoteDetails).toHaveBeenCalledWith(apiRequest);
    expect(sessionStorageService.set).toHaveBeenCalledWith('quotationResponse', JSON.stringify({ quotation_code: 123 }));
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({severity: 'success', summary: 'Success', detail: 'Quotation generated successfully'});
  });

  it('should handle form submission with existing quotation code', () => {
    const apiRequest = {
      effective_date: '2024-01-01',
      product_code: 1,
      client_code: null,
      facultative_type: 'FacultativeType 1',
      cover_type_dependant: 'QuotationCovers 1',
      calculation_type: 'Type 1',
      duration_type: 'DurationTypes 1',
      frequency_of_payment: 'Weekly',
      unit_rate: 'Value 1',
      agent_code: 1,
      branch_code: 1,
      currency_code: 1,
      commission_rate: 50,
      product_type: 'G'
    };
    component.quickForm.patchValue({
      effectiveDate: new Date('2024-01-01'),
      products: { value: 1, type: 'G' },
      facultativeType: { name: 'FacultativeType 1' },
      quotationCovers: { name: 'QuotationCovers 1' },
      durationType: { name: 'DurationTypes 1' },
      frequencyOfPayment: 'Weekly',
      unitRateOption: { value: 'Value 1' },
      currency: { value: 1 },
      quotationCalcType: 'Type 1',
      intermediary: { id: 1 },
      branch: { id: 1 },
      commissionRate: 50
    });
    const quickFormQuotationCalcType = 'Type 1';
    component.quotationCode = 123;

    // Mock the quickService method
    jest.spyOn(quickService, 'updateQuoteDetails').mockReturnValueOnce(of({ quotation_code: 123 }));

    // Call the onContinue method
    component.onContinue();

    // Verify method calls
    expect(quickService.updateQuoteDetails).toHaveBeenCalledWith(123, apiRequest);
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({severity: 'success', summary: 'Success', detail: 'Quotation updated successfully'});
    // expect(router.navigate).toHaveBeenCalledWith(['/home/lms/grp/quotation/coverage'], {
    //   queryParams: {
    //     quotationCalcType: quickFormQuotationCalcType,
    //     quotationCode: 123
    //   },
    // });
  });

  it('should handle invalid form submission', () => {
    component.quickForm.patchValue({
      products: null, // make products invalid
    });

    // Call the onContinue method
    component.onContinue();

    expect(quickService.postQuoteDetails).not.toHaveBeenCalled();
    expect(spinnerService.show).not.toHaveBeenCalled();
    expect(spinnerService.hide).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({severity: 'warn', summary: 'summary', detail: 'Fill all the fields correctly!'});
  });

  it('should handle invalid commission rate', () => {
    component.quickForm.patchValue({
      commissionRate: 150, // Invalid commission rate
    });

    component.onContinue();

    expect(quickService.postQuoteDetails).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Enter a valid commission rate value!'});
  });

  it('should handle invalid commission rate format', () => {
    component.quickForm.patchValue({
      commissionRate: 'abc', // Invalid commission rate format
    });

    component.onContinue();

    expect(quickService.postQuoteDetails).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Enter a valid commission rate value!'});
  });

  it('should format currency label correctly', () => {
    const currency: Currency = {
      id: 1, name: 'US Dollar', symbol: '$',
      decimalWord: '',
      numberWord: '',
      roundingOff: 0
    };
    const formattedLabel = component.formatCurrencyLabel(currency.name, currency.symbol);
    expect(formattedLabel).toEqual('Us Dollar ($)');
  });

  it('should capitalize first letter of each word correctly', () => {
    const str = 'hello world';
    const capitalizedStr = component.capitalizeFirstLetterOfEachWord(str);
    expect(capitalizedStr).toEqual('Hello World');
  });

  it('should highlight invalid fields', () => {
    component.quickForm.get('products').setValue(null);
    component.quickForm.get('products').markAsTouched();

    expect(component.highlightInvalid('products')).toBe(true);
  });

  it('should fetch and format pay frequencies', () => {
    // Mock the payFrequenciesService.getPayFrequencies method
    jest.spyOn(payFrequenciesService, 'getPayFrequencies').mockReturnValueOnce(of([
      { id: 1, desc: 'Weekly', sht_desc: 'Weekly' },
      { id: 2, desc: 'Monthly', sht_desc: 'Monthly' },
    ]));

    // Call the getPayFrequencies method
    component.getPayFrequencies();

    // Verify the frequencyOfPayment array is populated with formatted data
    expect(component.frequencyOfPayment).toEqual([
      { label: 'Weekly', value: 'Weekly' },
      { label: 'Monthly', value: 'Monthly' },
    ]);
  });
});