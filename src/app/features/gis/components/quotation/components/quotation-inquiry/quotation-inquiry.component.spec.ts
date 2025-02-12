import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationInquiryComponent } from './quotation-inquiry.component';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { QuotationsService } from '../../../../../../features/gis/services/quotations/quotations.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { MenuService } from '../../../../../../features/base/services/menu.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { SentenceCasePipe } from '../../../../../../shared/pipes/sentence-case/sentence-case.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StatusEnum } from '../../data/quotationsDTO';

describe('QuotationInquiryComponent', () => {
  let component: QuotationInquiryComponent;
  let fixture: ComponentFixture<QuotationInquiryComponent>;
  let translateService: TranslateService;

  // Mock services
  const mockAuthService = {
    getCurrentUserName: jest.fn(),
    getCurrentUser: jest.fn()
  };

  const mockQuotationService = {
    getAllQuotationSources: jest.fn(),
    searchQuotations: jest.fn()
  };

  const mockProductService = {
    getAllProducts: jest.fn()
  };

  const mockMenuService = {
    quotationSubMenuList: jest.fn(),
    updateSidebarMainMenu: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockSpinnerService = {
    show: jest.fn(),
    hide: jest.fn()
  };

  const mockGlobalMessagingService = {
    displayErrorMessage: jest.fn()
  };

  const mockChangeDetectorRef = {
    detectChanges: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        QuotationInquiryComponent,
        SentenceCasePipe
      ],
      imports: [ TranslateModule.forRoot() ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: SharedQuotationsService, useValue: {} },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: QuotationsService, useValue: mockQuotationService },
        { provide: ProductsService, useValue: mockProductService },
        { provide: MenuService, useValue: mockMenuService },
        { provide: Router, useValue: mockRouter },
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationInquiryComponent);

    translateService = TestBed.inject(TranslateService);

    // Setup default language and translations
    translateService.setDefaultLang('en');
    translateService.use('en');

    // Mock translation service methods if needed
    jest.spyOn(translateService, 'instant').mockImplementation((key: string) => key);

    component = fixture.componentInstance;
  });

  // Date Handling Tests
  describe('Date Handling', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2023-05-15');
      const formattedDate = component.formatDate(testDate);

      expect(formattedDate).toBe('2023-05-15');
    });

    it('should handle date from input change', () => {
      const testDate = new Date('2023-05-15');
      component.onDateFromInputChange(testDate);

      expect(component.fromDate).toEqual(testDate);
      expect(component.selectedDateFrom).toBe('2023-05-15');
    });
  });

  describe('Initial Component State', () => {
    it('should initialize with default values', () => {
      expect(component.clientName).toBe('');
      expect(component.clientCode).toBeUndefined();
      expect(component.agentName).toBe('');
      expect(component.agentId).toBeUndefined();
      expect(component.productName).toBe('');
      expect(component.productCode).toBeUndefined();
      expect(component.selectedSource).toBeUndefined();
      expect(component.selectedDateFrom).toBeUndefined();
      expect(component.selectedDateTo).toBeUndefined();
      expect(component.quotationNumber).toBeUndefined();
      expect(component.selectedStatus).toBeNull();
      expect(component.gisQuotationList).toEqual([]);
    });
  });


  // Quotation Fetching Tests
  describe('Quotation Fetching', () => {
    it('should fetch GIS quotations successfully', () => {
      const mockQuotations = {
        _embedded: [
          {
            quotationCode: 2537221,
            quotationNumber: 'Q001',
            clientCode: 57382582,
            clientName: 'Client A',
            fromDate: '2022-03-22',
            toDate: '2023-03-22',
            expiryDate: '2024-03-22',
            status: StatusEnum.Pending,
            quotDate: '2022-03-22'
          },
          {
            quotationCode: 5382567,
            quotationNumber: 'Q002',
            clientName: 'Client B',
            clientCode: 57382582,
            fromDate: '2022-10-22',
            toDate: '2023-10-22',
            expiryDate: '2024-10-22',
            status: StatusEnum.Accepted,
            quotDate: '2022-10-22'
          }
        ]
      };

      mockQuotationService.searchQuotations.mockReturnValue(of(mockQuotations));

      component.fetchGISQuotations();

      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(component.gisQuotationList).toEqual(mockQuotations._embedded);
      expect(mockSpinnerService.hide).toHaveBeenCalled();
    });

    it('should fetch quotations with parameters', () => {
      const mockQuotations = {
        _embedded: [
          {
            quotationCode: 2537221,
            quotationNumber: 'Q001',
            clientCode: 57382582,
            clientName: 'Client A',
            fromDate: '2022-03-22',
            toDate: '2023-03-22',
            expiryDate: '2024-03-22',
            status: StatusEnum.Pending,
            quotDate: '2022-03-22'
          }
        ]
      };

      mockQuotationService.searchQuotations.mockReturnValue(of(mockQuotations));

      // Providing parameters for the search
      component.clientName = 'Client A';
      component.selectedStatus = StatusEnum.Pending;

      component.fetchGISQuotations();

      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(component.gisQuotationList).toEqual(mockQuotations._embedded);
      expect(mockSpinnerService.hide).toHaveBeenCalled();
    });

    it('should handle error when fetching quotations', () => {
      const mockError = { error: { message: 'Fetch Error' } };
      mockQuotationService.searchQuotations.mockReturnValue(throwError(() => mockError));

      component.fetchGISQuotations();

      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(mockSpinnerService.hide).toHaveBeenCalled();
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Fetch Error');
    });
  });

  describe('Spinner Visibility during Quotation Fetching', () => {
    it('should show and hide spinner during quotation fetching', () => {
      const mockQuotations = { _embedded: [] };
      mockQuotationService.searchQuotations.mockReturnValue(of(mockQuotations));

      component.fetchGISQuotations();

      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(mockSpinnerService.hide).toHaveBeenCalled();
    });
  });

  // Filter Clearing Tests
  describe('Filter Clearing', () => {
    it('should clear all filters', () => {
      // Set some initial values
      component.clientName = 'Test Client';
      component.clientCode = 123;
      component.agentName = 'Test Agent';
      component.agentId = 456;
      component.productName = 'Test Product';
      component.productCode = 789;
      component.selectedSource = 'Test Source';
      component.selectedDateFrom = '2023-01-01';
      component.selectedDateTo = '2023-12-31';
      component.quotationNumber = 'Q123';
      component.selectedStatus = 'Pending';

      // Mock fetchGISQuotations method
      const fetchSpy = jest.spyOn(component, 'fetchGISQuotations');

      // Clear filters
      component.clearFilters();

      // Check if all filters are reset
      expect(component.clientName).toBe('');
      expect(component.clientCode).toBeNull();
      expect(component.agentName).toBe('');
      expect(component.agentId).toBeNull();
      expect(component.productName).toBe('');
      expect(component.productCode).toBeNull();
      expect(component.selectedSource).toBeNull();
      expect(component.selectedDateFrom).toBeNull();
      expect(component.selectedDateTo).toBeNull();
      expect(component.quotationNumber).toBe('');
      expect(component.selectedStatus).toBeNull();

      // Verify that fetchGISQuotations was called
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  describe('Invalid Date Input Handling', () => {
    it('should handle invalid from date input gracefully', () => {
      const invalidDate = undefined;
      component.onDateFromInputChange(invalidDate);

      // Check for undefined instead of null
      expect(component.selectedDateFrom).toBeUndefined();
    });

    it('should handle invalid to date input gracefully', () => {
      const invalidDate = undefined;
      component.onDateToInputChange(invalidDate);

      // Check for undefined instead of null
      expect(component.selectedDateTo).toBeUndefined();
    });
  });


  describe('Product Selection Handling with Invalid Values', () => {
    it('should handle undefined product selection gracefully', () => {
      const productEvent = { productName: undefined, productCode: undefined };
      const fetchSpy = jest.spyOn(component, 'fetchGISQuotations');

      component.onProductSelected(productEvent);

      expect(component.productName).toBeUndefined();
      expect(component.productCode).toBeUndefined();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('should handle null product selection gracefully', () => {
      const productEvent = { productName: null, productCode: null };
      const fetchSpy = jest.spyOn(component, 'fetchGISQuotations');

      component.onProductSelected(productEvent);

      expect(component.productName).toBeNull();
      expect(component.productCode).toBeNull();
      expect(fetchSpy).toHaveBeenCalled();
    });
  });

  // Event Handling Tests
  describe('Event Handlers', () => {
    it('should handle product selection', () => {
      const productEvent = { productName: 'Test Product', productCode: 123 };
      const fetchSpy = jest.spyOn(component, 'fetchGISQuotations');

      component.onProductSelected(productEvent);

      expect(component.productName).toBe('Test Product');
      expect(component.productCode).toBe(123);
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('should handle status selection', () => {
      const statusValue = 'Pending';

      component.onStatusSelected(statusValue);

      expect(component.selectedStatus).toBe('Pending');
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    it('should set quotation number and navigate', () => {
      // Spy on sessionStorage.setItem
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      component.setQuotationNumber('Q123', 456, 789);

      // Verify sessionStorage.setItem calls
      expect(setItemSpy).toHaveBeenCalledWith('quotationNum', 'Q123');
      expect(setItemSpy).toHaveBeenCalledWith('productCode', '456');
      expect(setItemSpy).toHaveBeenCalledWith('clientCode', '789');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quotation-summary']);

      // Clean up the spy
      setItemSpy.mockRestore();
    });
  });

  describe('translations', () => {
    it('should translate text using translate pipe', () => {
      const translatedText = translateService.instant('some.translation.key');
      expect(translatedText).toBeDefined();
    });
  });
});
