import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationLandingScreenComponent } from './quotation-landing-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SessionStorageService } from '../../services/session-storage/session-storage.service';
import { MessageService } from 'primeng/api';
import { GroupQuotationsListDTO } from 'src/app/features/lms/models';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('QuotationLandingScreenComponent', () => {
  let component: QuotationLandingScreenComponent;
  let fixture: ComponentFixture<QuotationLandingScreenComponent>;
  let sessionStorageServiceMock: Partial<SessionStorageService>;
  let messageServiceMock: Partial<MessageService>;
  let router: Router;

  const mockGroupQuotation: GroupQuotationsListDTO = {
    quotation_number: 'Q123',
    quotation_status: 'Active',
    sum_assured: 10000,
    total_premium: 1000,
    quotation_date: '2023-01-01',
    cover_from_date: '2023-01-01',
    cover_to_date: '2024-01-01',
    client_name: 'Test Client',
    agency_name: 'Test Agency',
    product: 'Test Product',
    branch_name: 'Test Branch'
  };

  beforeEach(async () => {
    sessionStorageServiceMock = {
      clear_store: jest.fn(),
      set: jest.fn(),
    };

    messageServiceMock = {
      add: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [QuotationLandingScreenComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        TabViewModule,
        TableModule
      ],
      providers: [
        { provide: SessionStorageService, useValue: sessionStorageServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationLandingScreenComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component and clear session storage', () => {
    component.ngOnInit();
    expect(sessionStorageServiceMock.clear_store).toHaveBeenCalled();
  });

  it('should filter LMS_GRP on ngOnChanges', () => {
    const mockLMS_GRP: GroupQuotationsListDTO[] = [mockGroupQuotation];
    component.LMS_GRP = mockLMS_GRP;
    component.ngOnChanges({ LMS_GRP: {} as any });
    expect(component.filteredLMS_GRP).toEqual(mockLMS_GRP);
  });

  it('should select LMS individual row and set session storage', () => {
    const mockRow = { client_code: '123', account_code: 'ACC123', code: 'CODE123', proposal_no: 'PROP123', quote_no: 'QUOTE123' };
    component.selectLmsIndRow(mockRow);
    expect(sessionStorageServiceMock.set).toHaveBeenCalledTimes(2);
  });

  it('should filter quotes based on search term', () => {
    component.LMS_GRP = [
      { ...mockGroupQuotation, client_name: 'Test Client' },
      { ...mockGroupQuotation, client_name: 'Another Client', quotation_number: 'Q456' },
    ];
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'Test' } });

    component.onSearch(event);

    expect(component.filteredLMS_GRP.length).toBe(2);
    expect(component.filteredLMS_GRP[0].client_name).toBe('Test Client');
  });

  it('should apply numeric filter correctly', () => {
    component.LMS_GRP = [
      { ...mockGroupQuotation, sum_assured: 1000 },
      { ...mockGroupQuotation, sum_assured: 2000 },
      { ...mockGroupQuotation, sum_assured: 3000 },
    ];
    component.selectedColumn = 'sum_assured';
    component.selectedCondition = 'greater';
    component.filterValue = '1500';
    component.applyFilter();
    expect(component.filteredLMS_GRP.length).toBe(2);
  });

  it('should handle date range filtering', () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    component.LMS_GRP = [
      { ...mockGroupQuotation, quotation_date: today.toISOString().split('T')[0] },
      { ...mockGroupQuotation, quotation_date: tomorrow.toISOString().split('T')[0] },
    ];
    component.selectedColumn = 'quotation_date';
    component.fromDate = today;
    component.toDate = today;
    component.applyFilter();
    expect(component.filteredLMS_GRP.length).toBe(1);
  });

  it('should clear filters', () => {
    component.LMS_GRP = [mockGroupQuotation, { ...mockGroupQuotation, quotation_number: 'Q456' }];
    component.selectedColumn = 'quotation_number';
    component.selectedCondition = 'equals';
    component.filterValue = 'Q123';
    component.filteredLMS_GRP = [mockGroupQuotation];

    component.clearFilters();

    expect(component.selectedColumn).toBeNull();
    expect(component.selectedCondition).toBeNull();
    expect(component.filterValue).toBe('');
    expect(component.filteredLMS_GRP).toEqual(component.LMS_GRP);
  });

  it('should validate filter and show message if column is not selected', () => {
    component.selectedColumn = '';
    component.filterValue = 'test';
    component.validateFilter();
    expect(messageServiceMock.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Information',
      detail: 'Please select a option first.'
    });
    expect(component.filterValue).toBe('');
  });

  it('should handle invalid filter input gracefully', () => {
    component.selectedColumn = 'sum_assured';
    component.selectedCondition = 'greater';
    component.filterValue = 'invalid_number';
    expect(() => component.applyFilter()).not.toThrow();
    expect(component.filteredLMS_GRP).toEqual([]);
  });

  it('should handle empty LMS_GRP gracefully', () => {
    component.LMS_GRP = [];
    component.applyFilter();
    expect(component.filteredLMS_GRP).toEqual([]);
  });

  it('should handle missing fromDate or toDate in date range filter', () => {
    component.LMS_GRP = [
      { ...mockGroupQuotation, quotation_date: '2023-01-01' },
    ];
    component.selectedColumn = 'quotation_date';
    component.fromDate = null;
    component.toDate = new Date('2023-01-01');
    component.applyFilter();
    expect(component.filteredLMS_GRP.length).toBe(1);
  });

  it('should handle null or incomplete data in selectLmsIndRow', () => {
    component.selectLmsIndRow(null);
    expect(sessionStorageServiceMock.set).not.toHaveBeenCalled();

    const incompleteRow = { client_code: null, account_code: null };
    component.selectLmsIndRow(incompleteRow);
    expect(sessionStorageServiceMock.set).toHaveBeenCalledTimes(0);
  });

  //additional
  

  it('should handle quotation table row click', () => {
    const mockRow = { ...mockGroupQuotation };
    component.onQuotationTableRowClick(mockRow, 1);
    expect(component.selectedRowIndex).toBe(1);
  });

  it('should handle empty methods for future implementation', () => {
    expect(() => component.onProcess()).not.toThrow();
    expect(() => component.onReassign()).not.toThrow();
    expect(() => component.onRevise()).not.toThrow();
  });

  it('should handle date filtering with only toDate', () => {
    const testData = [
      { ...mockGroupQuotation, quotation_date: '2023-01-01' },
      { ...mockGroupQuotation, quotation_date: '2023-02-01' }
    ];
    component.LMS_GRP = testData;
    component.selectedColumn = 'quotation_date';
    component.toDate = new Date('2023-01-15');
    component.applyFilter();
    expect(component.filteredLMS_GRP.length).toBe(1);
  });

  it('should handle matchesQuote with various data types', () => {
    const quote = {
      ...mockGroupQuotation,
      sum_assured: '1,000,000',
      total_premium: '1,500'
    };
    expect(component.matchesQuote(quote, '1000000')).toBe(true);
    expect(component.matchesQuote(quote, '1500')).toBe(true);
    expect(component.matchesQuote(quote, 'nonexistent')).toBe(false);
  });

  it('should handle getGroupQuotationsList with undefined LMS_GRP', () => {
    component.LMS_GRP = undefined;
    component.getGroupQuotationsList();
    expect(component.filteredLMS_GRP).toEqual([]);
  });

  it('should handle quotation table row click', () => {
    const mockRow = { ...mockGroupQuotation };
    component.onQuotationTableRowClick(mockRow, 1);
    expect(component.selectedRowIndex).toBe(1);
  });

  it('should handle empty methods for future implementation', () => {
    expect(() => component.onProcess()).not.toThrow();
    expect(() => component.onReassign()).not.toThrow();
    expect(() => component.onRevise()).not.toThrow();
  });

  it('should handle date filtering with only toDate', () => {
    const testData = [
      { ...mockGroupQuotation, quotation_date: '2023-01-01' },
      { ...mockGroupQuotation, quotation_date: '2023-02-01' }
    ];
    component.LMS_GRP = testData;
    component.selectedColumn = 'quotation_date';
    component.toDate = new Date('2023-01-15');
    component.applyFilter();
    expect(component.filteredLMS_GRP.length).toBe(1);
  });

  it('should handle matchesQuote with various data types', () => {
    const quote = {
      ...mockGroupQuotation,
      sum_assured: '1,000,000',
      total_premium: '1,500'
    };
    expect(component.matchesQuote(quote, '1000000')).toBe(true);
    expect(component.matchesQuote(quote, '1500')).toBe(true);
    expect(component.matchesQuote(quote, 'nonexistent')).toBe(false);
  });

  it('should handle getGroupQuotationsList with undefined LMS_GRP', () => {
    component.LMS_GRP = undefined;
    component.getGroupQuotationsList();
    expect(component.filteredLMS_GRP).toEqual([]);
  });
  
  it('should handle onColumnChange with normal selection', () => {
    const event = { target: { value: 'sum_assured' } } as unknown as Event;
    jest.spyOn(component, 'applyFilter');
  
    component.onColumnChange(event);
  
    expect(component.selectedColumn).toBe('sum_assured');
    expect(component.applyFilter).toHaveBeenCalled();
  }); 
  
  it('should handle onConditionChange', () => {
    const event = { target: { value: 'greater' } } as unknown as Event;
    jest.spyOn(component, 'applyFilter');
  
    component.onConditionChange(event);
  
    expect(component.selectedCondition).toBe('greater');
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should handle date selection for from date', () => {
    const testDate = new Date('2023-01-01');
    jest.spyOn(component, 'applyFilter');
  
    component.handleDateSelection(testDate, 'from');
  
    expect(component.fromDate).toEqual(testDate);
    expect(component.minToDate).toEqual(testDate);
    expect(component.applyFilter).toHaveBeenCalled();
  });

  it('should handle date selection for to date', () => {
    const testDate = new Date('2023-01-01');
    jest.spyOn(component, 'applyFilter');
  
    component.handleDateSelection(testDate, 'to');
  
    expect(component.toDate).toEqual(testDate);
    expect(component.applyFilter).toHaveBeenCalled();
  });  

});
