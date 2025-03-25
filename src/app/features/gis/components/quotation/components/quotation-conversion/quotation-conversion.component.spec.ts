import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { QuotationConversionComponent } from './quotation-conversion.component';
import { MenuService } from '../../../../../base/services/menu.service';
import { QuotationsService } from '../../../../../gis/services/quotations/quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { of, throwError } from 'rxjs';
import { StatusEnum } from '../../data/quotationsDTO';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('QuotationConversionComponent', () => {
  let component: QuotationConversionComponent;
  let fixture: ComponentFixture<QuotationConversionComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockMenuService: jest.Mocked<MenuService>;
  let mockQuotationsService: jest.Mocked<QuotationsService>;
  let mockGlobalMessagingService: jest.Mocked<GlobalMessagingService>;
  let mockProductsService: jest.Mocked<ProductsService>;
  let translateService: TranslateService;

  const mockQuotationList = [
    {
      quotationCode: 1,
      quotationNumber: "QT001",
      clientCode: 123,
      clientName: "Test Client",
      fromDate: "2024-02-01",
      toDate: "2024-02-28",
      expiryDate: "2024-03-01",
      status: "Pending",
      quotDate: "2024-02-01"
    }
  ];

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockMenuService = {
      quotationSubMenuList: jest.fn().mockReturnValue([
        { name: 'test', link: '/test' },
        { name: 'test2', link: '/test2' },
        { name: 'test3', link: '/test3' },
        { name: 'test4', link: '/test4' }
      ]),
      updateSidebarMainMenu: jest.fn()
    } as any;

    mockQuotationsService = {
      searchQuotations: jest.fn().mockReturnValue(of({ _embedded: mockQuotationList })),
      getClientQuotations: jest.fn().mockReturnValue(of({})),
      convertQuoteToPolicy: jest.fn().mockReturnValue(of({}))
    } as any;

    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displayInfoMessage: jest.fn()
    } as any;

    mockProductsService = {
      getAllProducts: jest.fn().mockReturnValue(of([]))
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ QuotationConversionComponent ],
      imports: [
        HttpClientTestingModule, // Add HttpClientTestingModule here
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MenuService, useValue: mockMenuService },
        { provide: QuotationsService, useValue: mockQuotationsService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationConversionComponent);
    component = fixture.componentInstance;

    translateService = TestBed.inject(TranslateService);

    // Setup default language and translations
    translateService.setDefaultLang('en');
    translateService.use('en');

    // Mock translation service methods if needed
    jest.spyOn(translateService, 'instant').mockImplementation((key: string) => key);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component and fetch quotations', () => {
      component.ngOnInit();
      expect(mockMenuService.quotationSubMenuList).toHaveBeenCalled();
      expect(mockQuotationsService.searchQuotations).toHaveBeenCalled();
    });

    it('should update sidebar menu', () => {
      component.ngOnInit();
      expect(mockMenuService.updateSidebarMainMenu).toHaveBeenCalled();
    });
  });

  describe('onClientSelected', () => {
    it('should update client information', () => {
      const mockEvent = { clientName: 'Test Client', clientCode: 123 };
      component.onClientSelected(mockEvent);
      expect(component.clientName).toBe(mockEvent.clientName);
      expect(component.clientCode).toBe(mockEvent.clientCode);
    });
  });

  it('should handle product selection', () => {
    const event = { productName: 'Test Product', productCode: 789 };
    component.onProductSelected(event);
    expect(component.productName).toBe('Test Product');
    expect(component.productCode).toBe(789);
  });

  describe('onAgentSelected', () => {
    it('should update agent information', () => {
      const mockEvent = { agentName: 'Test Agent', agentId: 456 };
      component.onAgentSelected(mockEvent);
      expect(component.agentName).toBe(mockEvent.agentName);
      expect(component.agentId).toBe(mockEvent.agentId);
    });
  });

  describe('fetchGISQuotations', () => {
    it('should fetch quotations successfully', () => {
      component.fetchGISQuotations();
      expect(mockQuotationsService.searchQuotations).toHaveBeenCalled();
      expect(component.gisQuotationList).toEqual(mockQuotationList);
    });

    it('should handle error when fetching quotations fails', () => {
      mockQuotationsService.searchQuotations.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      component.fetchGISQuotations();
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to fetch quotation list. Try again later'
      );
    });

    it('should set originalQuotationList after fetching quotations', () => {
      component.fetchGISQuotations();
      expect(component.originalQuotationList).toEqual(mockQuotationList);
    });
  });

  describe('clearFilters', () => {
    it('should reset all filters to default values', () => {
      // Set some initial values
      component.clientName = 'Test Client';
      component.clientCode = 123;
      component.agentName = 'Test Agent';
      component.agentId = 456;
      component.selectedStatus = 'Pending'

      // Clear filters
      component.clearFilters();

      // Verify all values are reset
      expect(component.clientName).toBe('');
      expect(component.clientCode).toBeNull();
      expect(component.agentName).toBe('');
      expect(component.agentId).toBeNull();
      expect(component.selectedStatus).toBeNull();
    });
  });

  describe('convertToPolicy', () => {
    it('should show error message when no quotation product is selected', () => {
      component.selectedQuotationProduct = null;
      component.convertToPolicy();
      expect(mockGlobalMessagingService.displayInfoMessage).toHaveBeenCalledWith(
        'Error',
        'Select a quotation product to continue'
      );
    });

    // it('should call convertQuoteToPolicy when quotation product is selected', () => {
    //   component.selectedQuotationProduct = {
    //     quotCode: 123,
    //     // WEF: "",
    //     // WET: "",
    //     agentShortDescription: "",
    //     binder: "",
    //     code: 0,
    //     commission: 0,
    //     premium: 0,
    //     proCode: 0,
    //     productShortDescription: "",
    //     quotationNo: "",
    //     revisionNo: 0,
    //     totalSumInsured: 0,
    //     wef: "",
    //     wet: ""
    //   };
    //   component.convertToPolicy();
    //   expect(mockQuotationsService.convertQuoteToPolicy).toHaveBeenCalledWith(123);
    // });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2024-02-10');
      const formattedDate = component.formatDate(testDate);
      expect(formattedDate).toBe('2024-02-10');
    });
  });

  describe('setQuotationNumber', () => {
    it('should save quotation details to session storage and navigate', () => {
      const quotationNumber = 'QT001';
      const productCode = 123;
      const clientCode = 456;

      component.setQuotationNumber(quotationNumber, productCode, clientCode);

      expect(sessionStorage.getItem('quotationNum')).toBe(quotationNumber);
      expect(sessionStorage.getItem('productCode')).toBe(JSON.stringify(productCode));
      expect(sessionStorage.getItem('clientCode')).toBe(JSON.stringify(clientCode));
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quotation-summary']);
    });
  });

  describe('translations', () => {
    it('should translate text using translate pipe', () => {
      const translatedText = translateService.instant('some.translation.key');
      expect(translatedText).toBeDefined();
    });
  });

  describe('clearFilters', () => {
    it('should clear filters', () => {
      component.clearFilters();
      expect(component.clientName).toBe('');
      expect(component.clientCode).toBeNull();
      expect(component.agentName).toBe('');
      expect(component.agentId).toBeNull();
      expect(component.productName).toBe('');
      expect(component.productCode).toBeNull();
      expect(component.selectedSource).toBeNull();
      expect(component.quotationNumber).toBe('');
      expect(component.quoteNumber).toBe('');
      expect(component.selectedStatus).toBeNull();
      expect(component.gisQuotationList).toEqual(component.originalQuotationList);
    });
  })

});
