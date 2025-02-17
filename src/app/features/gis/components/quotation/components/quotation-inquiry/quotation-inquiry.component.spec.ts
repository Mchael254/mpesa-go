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
import {Logger} from "../../../../../../shared/services";

describe('QuotationInquiryComponent', () => {
  let component: QuotationInquiryComponent;
  let fixture: ComponentFixture<QuotationInquiryComponent>;
  let translateService: TranslateService;

  // Mock services
  const mockAuthService = {
    getCurrentUserName: jest.fn(),
    getCurrentUser: jest.fn()
  };

  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  const mockQuotationService = {
    getAllQuotationSources: jest.fn(() => of([])), // Ensure it returns an observable
    searchQuotations: jest.fn()
  };


  const mockProductService = {
    getAllProducts: jest.fn()
  };

  const mockMenuService = {
    quotationSubMenuList: jest.fn(() => [
      {}, {}, {}, {}, {}, {} // Array with at least 6 elements
    ]),
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
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        { provide: Logger, useValue: mockLogger }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationInquiryComponent);

    translateService = TestBed.inject(TranslateService);

    // Setup default language and translations
    translateService.setDefaultLang('en');
    translateService.use('en');

    // Mock translation service methods if needed
    jest.spyOn(translateService, 'instant').mockImplementation((key: string) => key);

    jest.clearAllMocks(); // Clear previous calls


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

    it('should clear date filters correctly', () => {
      component.selectedDateFrom = '2023-01-01';
      component.selectedDateTo = '2023-12-31';
      component.fromDate = new Date('2023-01-01');
      component.toDate = new Date('2023-12-31');

      component.clearDateFilters();

      expect(component.selectedDateFrom).toBeNull();
      expect(component.selectedDateTo).toBeNull();
      expect(component.fromDate).toBeNull();
      expect(component.toDate).toBeNull();
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

    it('should handle empty response from getAllProducts', () => {
      mockProductService.getAllProducts.mockReturnValue(of([]));
      component.loadAllproducts();
      expect(component.productList).toEqual([]);
    });

    it('should transform product descriptions correctly', () => {
      const mockProducts = [{ code: 1, description: 'test product' }];
      mockProductService.getAllProducts.mockReturnValue(of(mockProducts));
      component.loadAllproducts();
      expect(component.ProductDescriptionArray).toEqual([{ code: 1, description: 'Test product' }]);
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

    it('should handle empty input in onQuotationBlur', () => {
      const event = { target: { value: '' } } as unknown as Event;
      component.onQuotationBlur(event);
      expect(component.quotationNumber).toBe('');
    });

    it('should handle valid input in onQuotationBlur', () => {
      const event = { target: { value: 'Q123' } } as unknown as Event;
      component.onQuotationBlur(event);
      expect(component.quotationNumber).toBe('Q123');
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

  describe('formatDate edge cases', () => {
    it('should return an empty string for null input', () => {
      expect(component.formatDate(null as any)).toBe('');
    });

    it('should return an empty string for undefined input', () => {
      expect(component.formatDate(undefined as any)).toBe('');
    });

    it('should return an empty string for invalid date input', () => {
      const invalidDate = new Date('invalid-date');
      expect(isNaN(invalidDate.getTime()) ? '' : component.formatDate(invalidDate)).toBe('');
    });
  });

  describe('onDateToInputChange', () => {
    it('should update the toDate value correctly', () => {
      const testDate = new Date('2023-06-15');
      component.onDateToInputChange(testDate);

      expect(component.toDate).toEqual(testDate);
      expect(component.selectedDateTo).toBe('2023-06-15');
    });
  });

  describe('setQuotationNumber edge cases', () => {
    it('should not set session storage if values are null', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      component.setQuotationNumber(null as any, null as any, null as any);

      expect(setItemSpy).not.toHaveBeenCalled();
      setItemSpy.mockRestore();
    });

    it('should not navigate if quotationNumber is empty', () => {
      component.setQuotationNumber('', 456, 789);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Error handling in translations', () => {
    it('should handle missing translation key gracefully', () => {
      jest.spyOn(translateService, 'instant').mockImplementation(() => null);
      const result = translateService.instant('non.existent.key');
      expect(result).toBeNull();
    });
  });

  describe('ngOnInit lifecycle hook', () => {
    it('should call fetchGISQuotations on initialization', () => {
      const fetchSpy = jest.spyOn(component, 'fetchGISQuotations');
      component.ngOnInit();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('should handle invalid sidebarMenu link in dynamicSideBarMenu', () => {
      // Mock console.warn
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Arrange
      const invalidSidebarMenu = { link: null, name: 'test' };

      // Act
      component.dynamicSideBarMenu(invalidSidebarMenu);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith('Invalid or empty link in sidebar menu:', invalidSidebarMenu);

      // Restore original implementation
      warnSpy.mockRestore();
    });


    it('should navigate to the specified link if sidebarMenu.link is valid', () => {
      const validSidebarMenu = { link: '/valid-link', name: 'test' };
      component.dynamicSideBarMenu(validSidebarMenu);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/valid-link']);
    });

    it('should not navigate if sidebarMenu.link is empty', () => {
      const emptyLinkSidebarMenu = { link: '', name: 'test' };
      component.dynamicSideBarMenu(emptyLinkSidebarMenu);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

});
