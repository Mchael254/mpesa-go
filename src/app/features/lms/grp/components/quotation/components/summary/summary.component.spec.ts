import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SummaryService } from '../../service/summary/summary.service';
import { CoverageService } from '../../service/coverage/coverage.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';

export class mockCoverageService {
  getCoverTypes = jest.fn().mockReturnValue(of([]));
  getCategoryDetails = jest.fn().mockReturnValue(of([]));
  getMembers = jest.fn().mockReturnValue(of([]));
}

export class mockSummaryService {
  getQuoteSummary = jest.fn().mockReturnValue(of([]));
  getMemberSummary = jest.fn().mockReturnValue(of([]));
  getDependantLimits = jest.fn().mockReturnValue(of([]));
  quotationSummaryDetails = jest.fn().mockReturnValue(of([]));
  membersSummaryDetails = jest.fn().mockReturnValue(of([]));
  memberCoverSummary = jest.fn().mockReturnValue(of([]));
}

describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let summaryServiceStub: SummaryService;
  let coverageServiceStub: CoverageService;
  let router: Router;
  let messageService: MessageService;
  let sessionStorageService: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: SummaryService, useClass: mockSummaryService },
        { provide: CoverageService, useClass: mockCoverageService },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: MessageService, useValue: { add: jest.fn() } },
        { provide: SessionStorageService, useValue: { get: jest.fn(), set: jest.fn(), setItem: jest.fn(), getItem: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    summaryServiceStub = TestBed.inject(SummaryService);
    coverageServiceStub = TestBed.inject(CoverageService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);
    sessionStorageService = TestBed.inject(SessionStorageService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize component on ngOnInit', fakeAsync(() => {
    jest.spyOn(sessionStorageService, 'get').mockReturnValue(JSON.stringify({
      formData: {
        products: { value: 1, label: 'Test Product', type: 'Test Type' },
        currency: { label: 'USD ($)' },
        quotationCalcType: 'Test Calc Type'
      }
    }));

    const mockSessionStorage = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({
        quotation_code: 123,
        quotation_number: 'TEST123'
      }))
    };
    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

    const spies = [
      jest.spyOn(component, 'retrievQuoteDets'),
      jest.spyOn(component, 'getQuotationDetailsSummary'),
      jest.spyOn(component, 'getMembersSummary'),
      jest.spyOn(component, 'getMembers'),
      jest.spyOn(component, 'getDependantLimits'),
      jest.spyOn(component, 'getMemberCoverTypes'),
      jest.spyOn(component, 'getCategoryDets'),
      jest.spyOn(component, 'dependantLimitsColumns'),
      jest.spyOn(component, 'coverDetailsColumns'),
      jest.spyOn(component, 'memberDetailsColumns')
    ];

    component.ngOnInit();
    tick();

    spies.forEach(spy => expect(spy).toHaveBeenCalled());
  }));

  test('should navigate back on onBack()', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/home/lms/grp/quotation/coverage']);
  });

  test('should show member summary modal', () => {
    document.body.innerHTML = '<div id="memberSummaryModal" class="modal"></div>';
    component.showMembersSummary();
    const modal = document.getElementById('memberSummaryModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should close member summary modal', () => {
    document.body.innerHTML = '<div id="memberSummaryModal" class="modal show" style="display: block;"></div>';
    component.closeMembersSummary();
    const modal = document.getElementById('memberSummaryModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
  });

  test('should get use CVR rate description', () => {
    expect(component.getUseCvrRateDescription('M')).toBe('Use Quote Mask');
    expect(component.getUseCvrRateDescription('S')).toBe('Select Specific Mask');
    expect(component.getUseCvrRateDescription('C')).toBe('Input Rate');
    expect(component.getUseCvrRateDescription('X')).toBe('Unknown');
  });

  test('should get pay frequency description', () => {
    expect(component.getPayFrequencyDescription('M')).toBe('MONTHLY');
    expect(component.getPayFrequencyDescription('Q')).toBe('QUARTERLY');
  });

  test('should get duration type description', () => {
    expect(component.getDurationTypeDescription('A')).toBe('ANNUAL');
    expect(component.getDurationTypeDescription('C')).toBe('Other');
    expect(component.getDurationTypeDescription('M')).toBe('Monthly');
  });

  test('should call getQuotationDetailsSummary on init', fakeAsync(() => {
    const spy = jest.spyOn(summaryServiceStub, 'quotationSummaryDetails');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should call getMembersSummary on init', fakeAsync(() => {
    const spy = jest.spyOn(summaryServiceStub, 'membersSummaryDetails');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalledWith(component.productCode, component.quotationCode);
  }));

  test('should call getMemberCoverTypes on init', fakeAsync(() => {
    const spy = jest.spyOn(coverageServiceStub, 'getCoverTypes');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should call getDependantLimits on init', fakeAsync(() => {
    const spy = jest.spyOn(summaryServiceStub, 'getDependantLimits');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should call getMembers on init', fakeAsync(() => {
    const spy = jest.spyOn(coverageServiceStub, 'getMembers');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should call getCategoryDets on init', fakeAsync(() => {
    const spy = jest.spyOn(coverageServiceStub, 'getCategoryDetails');
    component.ngOnInit();
    tick();
    expect(spy).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should call memberCoverSummary when onMemberTableRowClick is called', fakeAsync(() => {
    const spy = jest.spyOn(summaryServiceStub, 'memberCoverSummary');
    const mockMember = { member_code: 123 };
    component.onMemberTableRowClick(mockMember, 0);
    tick();
    expect(spy).toHaveBeenCalledWith(component.quotationCode, 123);
  }));

  test('should show cover summary modal', () => {
    document.body.innerHTML = '<div id="coverSummaryModal" class="modal"></div>';
    component.showCoverSummary();
    const modal = document.getElementById('coverSummaryModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should close cover summary modal', () => {
    document.body.innerHTML = '<div id="coverSummaryModal" class="modal show" style="display: block;"></div>';
    component.closeCoverSummary();
    const modal = document.getElementById('coverSummaryModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
  });

  test('should show category summary modal', () => {
    document.body.innerHTML = '<div id="categorySummaryModal" class="modal"></div>';
    component.showCategorySummary();
    const modal = document.getElementById('categorySummaryModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should close category summary modal', () => {
    document.body.innerHTML = '<div id="categorySummaryModal" class="modal show" style="display: block;"></div>';
    component.closeCategorySummary();
    const modal = document.getElementById('categorySummaryModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
  });

  test('should handle escape key press', () => {
    const closeCategorySpy = jest.spyOn(component, 'closeCategorySummary');
    const closeCoverSpy = jest.spyOn(component, 'closeCoverSummary');
    const closeMembersSpy = jest.spyOn(component, 'closeMembersSummary');

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);

    expect(closeCategorySpy).toHaveBeenCalled();
    expect(closeCoverSpy).toHaveBeenCalled();
    expect(closeMembersSpy).toHaveBeenCalled();
  });

  test('should handle backdrop click', () => {
    const closeCategorySpy = jest.spyOn(component, 'closeCategorySummary');
    const closeCoverSpy = jest.spyOn(component, 'closeCoverSummary');
    const closeMembersSpy = jest.spyOn(component, 'closeMembersSummary');

    const event = new MouseEvent('click');
    Object.defineProperty(event, 'target', { value: { classList: { contains: () => true } } });

    component.onBackdropClick(event);

    expect(closeCategorySpy).toHaveBeenCalled();
    expect(closeCoverSpy).toHaveBeenCalled();
    expect(closeMembersSpy).toHaveBeenCalled();
  });

  test('should navigate on proceed', () => {
    component.onProceed();
    expect(router.navigate).toHaveBeenCalledWith(['home/lms/quotation/list'], { queryParams: { tab: 'group-life' } });
  });

  test('should set selected row index and call memberCoverSummary', fakeAsync(() => {
    const mockMember = { member_code: 123 };
    const spy = jest.spyOn(summaryServiceStub, 'memberCoverSummary');

    component.onMemberTableRowClick(mockMember, 2);

    expect(component.selectedRowIndex).toBe(2);
    expect(component.memberCode).toBe(123);
    expect(spy).toHaveBeenCalledWith(component.quotationCode, 123);

    tick();
  }));

  test('should retrieve quote details from session storage', () => {
    const mockQuoteData = {
      formData: {
        products: { value: 1, label: 'Test Product', type: 'Test Type' },
        currency: { label: 'USD ($)' },
        quotationCalcType: 'Test Calc Type'
      }
    };
    const mockQuoteDetails = {
      quotation_code: 123,
      quotation_number: 'TEST123'
    };

    jest.spyOn(sessionStorageService, 'get').mockReturnValue(JSON.stringify(mockQuoteData));
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue(JSON.stringify(mockQuoteDetails));

    component.retrievQuoteDets();

    expect(component.productCode).toBe(1);
    expect(component.productSelected).toBe('Test Product');
    expect(component.productType).toBe('Test Type');
    expect(component.currency).toBe('USD ($)');
    expect(component.currency_symbol).toBe('$');
    expect(component.quatationCalType).toBe('Test Calc Type');
    expect(component.quotationCode).toBe(123);
    expect(component.quotationNumber).toBe('TEST123');
  });
});