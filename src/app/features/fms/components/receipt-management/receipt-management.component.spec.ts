import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { ReceiptManagementComponent } from './receipt-management.component';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';

import { BranchDTO, GenericResponse } from '../../data/receipting-dto';
import { unPrintedReceiptContentDTO } from '../../data/receipt-management-dto';
import { Pagination } from 'src/app/shared/data/common/pagination';

// --- Mock Pipe for the template ---
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// --- Mocks for Services and Data ---
const mockBranch: BranchDTO = { id: 1, name: 'Main Branch' } as BranchDTO;
const mockUser = { code: 'U001', name: 'Test User' };

const mockReceiptContent: unPrintedReceiptContentDTO[] = [
  { no: 1, branchReceiptCode: 'R001', receiptDate: '2023-10-26', receivedFrom: 'Customer A', amount: 100, paymentMode: 'CASH' } as unPrintedReceiptContentDTO,
  { no: 2, branchReceiptCode: 'R002', receiptDate: '2023-10-27', receivedFrom: 'Customer B', amount: 250.50, paymentMode: 'CARD' } as unPrintedReceiptContentDTO,
];

const mockUnprintedReceiptsResponse: GenericResponse<Pagination<unPrintedReceiptContentDTO>> = {
  msg: 'Success',
  success: true,
  data: {
    content: mockReceiptContent,
    totalElements: 2,
  } as Pagination<unPrintedReceiptContentDTO>,
};

// Jest Mocks for services
const mockSessionStorageService = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockGlobalMessagingService = {
  displayErrorMessage: jest.fn(),
  displaySuccessMessage: jest.fn(),
};

const mockReceiptManagementService = {
  getUnprintedReceipts: jest.fn().mockReturnValue(of(mockUnprintedReceiptsResponse)),
  getReceiptsToCancel: jest.fn().mockReturnValue(of({ data: { content: [] } })),
  getGlAccount: jest.fn().mockReturnValue(of({ data: { content: [] } })),
  cancelReceipt: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockAuthService = {
  getCurrentUser: jest.fn().mockReturnValue(mockUser),
};

describe('ReceiptManagementComponent', () => {
  let component: ReceiptManagementComponent;
  let fixture: ComponentFixture<ReceiptManagementComponent>;
  let sessionStorageService: SessionStorageService;
  let router: Router;

  beforeEach(async () => {
    // Reset all mocks before each test to ensure isolation
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [ReceiptManagementComponent, MockTranslatePipe],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ReceiptManagementService, useValue: mockReceiptManagementService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => key,
          },
        },
      ],
      // Use NO_ERRORS_SCHEMA to ignore unknown elements like <p-table>
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptManagementComponent);
    component = fixture.componentInstance;
    sessionStorageService = TestBed.inject(SessionStorageService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges(); // This will run ngOnInit
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and Tab State Handling', () => {
    it('should default to the "Cancellation" tab when no session flag is present', () => {
      mockSessionStorageService.getItem.mockReturnValue(null);
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');
      const isPrintingClickedSpy = jest.spyOn(component, 'isPrintingClicked');

      fixture.detectChanges();

      expect(sessionStorageService.getItem).toHaveBeenCalledWith('printTabStatus');
      expect(cancelClickedSpy).toHaveBeenCalledTimes(1);
      expect(isPrintingClickedSpy).not.toHaveBeenCalled();
      expect(component.isCancellation).toBe(true);
      expect(component.isPrinting).toBe(false);
    });

    it('should switch to the "Printing" tab when the session flag is present', () => {
      mockSessionStorageService.getItem.mockImplementation((key: string) => {
        if (key === 'printTabStatus') return 'true';
        return null;
      });
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');
      const isPrintingClickedSpy = jest.spyOn(component, 'isPrintingClicked');

      fixture.detectChanges();

      expect(sessionStorageService.getItem).toHaveBeenCalledWith('printTabStatus');
      expect(isPrintingClickedSpy).toHaveBeenCalledTimes(1);
      expect(cancelClickedSpy).not.toHaveBeenCalled();
      expect(component.isPrinting).toBe(true);
      expect(component.isCancellation).toBe(false);
    });

    it('should remove the "printTabStatus" flag from session storage after reading it', () => {
      mockSessionStorageService.getItem.mockReturnValue('true');

      fixture.detectChanges();

      expect(sessionStorageService.removeItem).toHaveBeenCalledWith('printTabStatus');
      expect(sessionStorageService.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should handle session storage errors gracefully and default to cancellation tab', () => {
      mockSessionStorageService.getItem.mockImplementation(() => {
        throw new Error('Session Storage is unavailable');
      });
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');

      // Call detectChanges() inside the expect block to catch the error
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();

      // Verify the fallback logic was still called
      expect(cancelClickedSpy).toHaveBeenCalledTimes(1);
      expect(component.isCancellation).toBe(true);
    });

    it('should call to fetch initial data for the selected branch', () => {
      mockSessionStorageService.getItem.mockImplementation((key: string) => {
        if (key === 'selectedBranch') return JSON.stringify(mockBranch);
        return null;
      });
      const fetchUnprintedSpy = jest.spyOn(component, 'fetchUnprintedReceipts');
      const fetchToCancelSpy = jest.spyOn(component, 'fetchReceiptsToCancel');

      fixture.detectChanges();

      expect(fetchUnprintedSpy).toHaveBeenCalledWith(mockBranch.id);
      expect(fetchToCancelSpy).toHaveBeenCalledWith(mockBranch.id);
    });
  });

  describe('UI State Toggles', () => {
    it('isPrintingClicked should set printing flags correctly', () => {
      component.isPrintingClicked();
      expect(component.printingEnabled).toBe(true);
      expect(component.isPrinting).toBe(true);
      expect(component.isCancellation).toBe(false);
      expect(component.cancellationDeactivated).toBe(false);
    });

    it('cancelClicked should set cancellation flags correctly', () => {
      component.isPrintingClicked(); // Arrange
      component.cancelClicked(); // Act
      expect(component.printingEnabled).toBe(false);
      expect(component.isPrinting).toBe(false);
      expect(component.isCancellation).toBe(true);
      expect(component.cancellationDeactivated).toBe(true);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.unPrintedReceiptContent = [...mockReceiptContent];
      component.filteredtabledata = [...mockReceiptContent];
    });

    const createMockEvent = (value: string): Partial<Event> => ({
      target: { value } as HTMLInputElement,
    });

    it('applyFilter should call the correct filter method based on the active tab', () => {
      const filterReceiptsSpy = jest.spyOn(component, 'filterReceipts').mockImplementation();
      const filterAllReceiptsSpy = jest.spyOn(component, 'filterAllReceipts').mockImplementation();
      const mockEvent = createMockEvent('R001');

      // Test when printing tab is active
      component.isPrintingClicked();
      component.applyFilter(mockEvent as Event, 'receiptNumber');
      expect(component.receiptNumberFilter).toBe('R001');
      expect(filterReceiptsSpy).toHaveBeenCalledTimes(1);
      expect(filterAllReceiptsSpy).not.toHaveBeenCalled();

      // Test when cancellation tab is active
      component.cancelClicked();
      component.applyFilter(mockEvent as Event, 'receiptNumber');
      expect(filterAllReceiptsSpy).toHaveBeenCalledTimes(1);
      expect(filterReceiptsSpy).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('filterReceipts should filter data correctly', () => {
      component.receiptNumberFilter = 'R002';
      component.filterReceipts();
      expect(component.filteredtabledata.length).toBe(1);
      expect(component.filteredtabledata[0].branchReceiptCode).toBe('R002');
    });
  });

  describe('printReceipt', () => {
    it('should set receiptNumber in session storage and navigate to the preview page', () => {
      const testReceiptNumber = 12345;
      const testIndex = 0;

      component.printReceipt(testIndex, testReceiptNumber);

      expect(sessionStorageService.setItem).toHaveBeenCalledWith('receiptNumber', JSON.stringify(testReceiptNumber));
      expect(router.navigate).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });
  });
});