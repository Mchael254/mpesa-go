import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationManagementComponent } from './quotation-management.component';
import { MenuService } from '../../../../../base/services/menu.service';
import { Router } from '@angular/router';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { SidebarMenu } from '../../../../../base/model/sidebar.menu';
import { MenuModule } from 'primeng/menu';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { QuotationList } from '../../data/quotationsDTO';

describe('QuotationManagementComponent', () => {
  let component: QuotationManagementComponent;
  let fixture: ComponentFixture<QuotationManagementComponent>;
  let menuService: jest.Mocked<MenuService>;
  let router: jest.Mocked<Router>;
  let quotationService: jest.Mocked<QuotationsService>;
  let globalMessagingService: jest.Mocked<GlobalMessagingService>;
  let cdr: ChangeDetectorRef;
  let translateService: TranslateService;

  const mockQuotationSubMenuList = [
    { name: 'menu1', link: '/link1', value: 'value1' },
    { name: 'menu2', link: '/link2', value: 'value2' },
    { name: 'menu3', link: '/link3', value: 'value3' },
    { name: 'menu4', link: '/link4', value: 'value4' },
    { name: 'menu5', link: '/link5', value: 'value5' },
    { name: 'menu6', link: '/link6', value: 'value6' },
    { name: 'menu7', link: '/link7', value: 'value7' }
  ];

  const mockQuotationList : QuotationList[] = [
    {
      quotationCode: 12345,
      quotationNumber: "Q12345",
      clientCode: 1,
      clientName: 'KING ',
      fromDate: '2023-01-02',
      toDate: '2024-01-02',
      expiryDate: "2023-10-02",
      status: 'Draft',
      quotDate: '2023-01-02',
    },
    {
      quotationCode: 54321,
      quotationNumber: "Q54321",
      clientCode: 2,
      clientName: 'LIAM ',
      fromDate: '2024-01-02',
      toDate: '2025-01-02',
      expiryDate: "2024-10-02",
      status: 'Confirmed',
      quotDate: '2024-01-02',
    },
  ];

  beforeEach(async () => {

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });
    // Create mock services
    menuService = {
      quotationSubMenuList: jest.fn().mockReturnValue(mockQuotationSubMenuList),
      updateSidebarMainMenu: jest.fn()
    } as any;

    router = {
      navigate: jest.fn()
    } as any;

    quotationService = {
      searchQuotations: jest.fn().mockReturnValue(of({ _embedded: mockQuotationList }))
    } as any;

    globalMessagingService = {
      displaySuccessMessage: jest.fn(),
      displayErrorMessage: jest.fn(),
      displayInfoMessage: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [QuotationManagementComponent],
      imports: [
        MenuModule,
        FormsModule,
        CalendarModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MenuService, useValue: menuService },
        { provide: Router, useValue: router },
        { provide: QuotationsService, useValue: quotationService },
        { provide: GlobalMessagingService, useValue: globalMessagingService },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationManagementComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
    translateService = TestBed.inject(TranslateService);

    // Mock translation service
    jest.spyOn(translateService, 'instant').mockImplementation((key: string) => key);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize component correctly', () => {
      component.ngOnInit();
      
      expect(menuService.quotationSubMenuList).toHaveBeenCalled();
      expect(component.quotationSubMenuList).toEqual(mockQuotationSubMenuList);
      expect(quotationService.searchQuotations).toHaveBeenCalled();
      expect(component.gisQuotationList).toEqual(mockQuotationList);
      expect(component.originalQuotationList).toEqual(mockQuotationList);
    });
  });

  describe('fetchGISQuotations', () => {
    it('should fetch quotations with default parameters', () => {
      // Clear previous calls
      quotationService.searchQuotations.mockClear();
      
      component.fetchGISQuotations();
      
      expect(quotationService.searchQuotations).toHaveBeenCalledWith(
        0,
        100,
        null,
        null,
        null,
        null,
        null,
        null,
        '',
        null,
        undefined,  // Change from null to undefined
        null
      );
    });
  
    it('should fetch quotations with filter parameters', () => {
      // Clear previous calls
      quotationService.searchQuotations.mockClear();
      
      component.clientCode = 1001;
      component.productCode = 1;
      component.agentId = 5001;
      component.quoteNumber = 'Q12345';
      component.selectedStatus = 'Pending';
      component.selectedDateFrom = '2023-01-01';
      component.selectedDateTo = '2023-01-31';
      
      component.fetchGISQuotations();
      
      expect(quotationService.searchQuotations).toHaveBeenCalledWith(
        0,
        100,
        null,
        1001,
        1,
        '2023-01-01',
        '2023-01-31',
        5001,
        'Q12345',
        'Pending',
        undefined,  // Change from null to undefined
        null
      );
    });

    it('should handle error when fetching quotations fails', () => {
      const error = new Error('Fetch failed');
      quotationService.searchQuotations = jest.fn().mockReturnValue(throwError(() => error));
      
      component.fetchGISQuotations();
      
      expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to fetch quotation list. Try again later'
      );
    });
  });

  describe('viewQuote', () => {
    it('should set session storage and navigate to quotation summary', () => {
      const mockQuotation = {
        quotationNumber: 'Q12345',
        productCode: 1,
        clientCode: 1001
      };

      // Clear previous mock calls
      (window.sessionStorage.setItem as jest.Mock).mockClear();
      
      component.viewQuote(mockQuotation);
      
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('quotationNum', 'Q12345');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('productCode', '1');
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith('clientCode', '1001');
      expect(router.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quotation-summary']);
    });
  });

  describe('editQuote', () => {
    it('should allow editing draft quotes', () => {
      const mockQuotation = {
        quotationNumber: 'Q12345',
        status: 'Draft'
      };

      // Clear previous mock calls
      (window.sessionStorage.setItem as jest.Mock).mockClear();
      
      component.editQuote(mockQuotation);
      
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'quoteToEditData',
        JSON.stringify(mockQuotation)
      );
      expect(router.navigate).toHaveBeenCalledWith(['/home/gis/quotation/quotations-client-details']);
    });
  });

  describe('dynamicSideBarMenu', () => {
    it('should navigate to the menu link and update sidebar', () => {
      const menuItem = mockQuotationSubMenuList[0];
      
      component.dynamicSideBarMenu(menuItem);
      
      expect(router.navigate).toHaveBeenCalledWith([menuItem.link]);
      expect(menuService.updateSidebarMainMenu).toHaveBeenCalledWith(menuItem.value);
    });
  });

  describe('filter functions', () => {
    beforeEach(() => {
      component.gisQuotationList = [...mockQuotationList];
      component.originalQuotationList = [...mockQuotationList];
    });

    it('should filter by client name', () => {
      component.clientName = 'Test Client';
      component.onClientSelected({ clientName: 'Test Client', clientCode: 1001 });
      
      expect(component.clientCode).toBe(1001);
      expect(quotationService.searchQuotations).toHaveBeenCalled();
    });

    it('should filter by agent', () => {
      component.agentName = 'Test Agent';
      component.onAgentSelected({ agentName: 'Test Agent', agentId: 5001 });
      
      expect(component.agentId).toBe(5001);
      expect(quotationService.searchQuotations).toHaveBeenCalled();
    });

    it('should filter by status', () => {
      component.onStatusSelected('Pending');
      
      expect(component.selectedStatus).toBe('Pending');
      expect(quotationService.searchQuotations).toHaveBeenCalled();
    });

    it('should filter by date range', () => {
      const fromDate = new Date('2023-01-01');
      const toDate = new Date('2023-01-31');
      
      component.onDateFromInputChange(fromDate);
      component.onDateToInputChange(toDate);
      
      expect(component.selectedDateFrom).toBe('2023-01-01');
      expect(component.selectedDateTo).toBe('2023-01-31');
      expect(quotationService.searchQuotations).toHaveBeenCalled();
    });

    it('should filter by quotation number', () => {
      component.inputQuotationNo({ target: { value: 'Q12345' } } as unknown as Event);
      
      expect(component.quoteNumber).toBe('Q12345');
      expect(quotationService.searchQuotations).toHaveBeenCalled();
    });
  });

  describe('clear functions', () => {
    beforeEach(() => {
      component.clientName = 'Test Client';
      component.clientCode = 1001;
      component.agentName = 'Test Agent';
      component.agentId = 5001;
      component.fromDate = new Date();
      component.toDate = new Date();
      component.quoteNumber = 'Q12345';
      component.selectedStatus = 'Pending';
    });

    it('should clear client filter', () => {
      component.clearClientName();
      
      expect(component.clientName).toBe('');
      expect(component.clientCode).toBeNull();
      expect(quotationService.searchQuotations).toHaveBeenCalled();
    });

    it('should clear agent filter', () => {
      component.clearAgentName();
      
      expect(component.agentName).toBe('');
      expect(component.agentId).toBeNull();
      expect(quotationService.searchQuotations).toHaveBeenCalled();
      
    });

    it('should clear date filters', () => {
      component.clearDateFilters();
      
      expect(component.fromDate).toBeNull();
      expect(component.toDate).toBeNull();
      expect(component.minToDate).toBeNull();
      expect(component.gisQuotationList).toEqual(component.originalQuotationList);
      
    });

    it('should clear from date', () => {
      component.clearFromDate();
      
      expect(component.fromDate).toBeNull();
      expect(quotationService.searchQuotations).toHaveBeenCalled();
      
    });

    it('should clear to date', () => {
      component.clearToDate();
      
      expect(component.toDate).toBeNull();
      expect(quotationService.searchQuotations).toHaveBeenCalled();
      
    });

    it('should clear quotation number', () => {
      component.clearQuotationNo();
      
      expect(component.quotationNumber).toBe('');
      expect(quotationService.searchQuotations).toHaveBeenCalled();
      
    });
  });

  describe('menu actions', () => {
    it('should toggle menu', () => {
      const mockEvent = { preventDefault: jest.fn() } as unknown as Event;
      const mockQuotation = mockQuotationList[0];
      
      component.menu = { toggle: jest.fn() } as any;
      component.toggleMenu(mockEvent, mockQuotation);
      
      expect(component.selectedQuotation).toBe(mockQuotation);
      expect(component.menu.toggle).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('display functions', () => {
    it('should truncate long agent names', () => {
      component.agentName = 'Very Long Agent Name That Exceeds Limit';
      
      const result = component.displayAgentName;
      
      expect(result).toBe('Very Long Agent...');
    });

    it('should return full agent name if short', () => {
      component.agentName = 'Short Name';
      
      const result = component.displayAgentName;
      
      expect(result).toBe('Short Name');
    });

    it('should truncate long client names', () => {
      component.clientName = 'Very Long Client Name That Exceeds Limit';
      
      const result = component.displayClientName;
      
      expect(result).toBe('Very Long Clien...');
    });

    it('should return full client name if short', () => {
      component.clientName = 'Short Name';
      
      const result = component.displayClientName;
      
      expect(result).toBe('Short Name');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-01');
      
      const result = component.formatDate(date);
      
      expect(result).toBe('2023-01-01');
    });
  });
});