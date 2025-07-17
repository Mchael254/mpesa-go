import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptManagementComponent } from './receipt-management.component';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { BranchDTO, GenericResponse } from '../../data/receipting-dto';
import {
  unPrintedReceiptContentDTO
  
} from '../../data/receipt-management-dto';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from 'src/app/shared/services/auth.service';
import {AuthService} from '../../../../shared/services/auth.service';
import * as bootstrap from 'bootstrap';

// --- Mock Pipe ---
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// --- Mocks for Services and Data ---

const mockBranch: BranchDTO = { id: 1, name: 'Main Branch' /* ... other properties */ } as BranchDTO;
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
    // Add other pagination properties if needed by the component
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
  getReceiptsToCancel: jest.fn().mockReturnValue(of({ data: { content: [] } })), // Return empty cancel list by default
  getGlAccount: jest.fn().mockReturnValue(of({ data: { content: [] } })), // Return empty GL list by default
  cancelReceipt: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockAuthService = {
  getCurrentUser: jest.fn().mockReturnValue(mockUser),
};

// Mock Bootstrap Modal
jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
  })),
}));

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
      imports: [ReactiveFormsModule], // Needed for FormBuilder
      providers: [
        FormBuilder, // Provide the real FormBuilder
        { provide: ReceiptManagementService, useValue: mockReceiptManagementService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        // We use a mock TranslateService but can also provide a real one if needed
        { provide: 'TranslateService', useValue: { instant: (key: string) => key } }
      ],
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
      // Arrange: Ensure getItem returns null for the flag
      mockSessionStorageService.getItem.mockReturnValue(null);
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');
      const isPrintingClickedSpy = jest.spyOn(component, 'isPrintingClicked');

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(sessionStorageService.getItem).toHaveBeenCalledWith('printTabStatus');
      expect(cancelClickedSpy).toHaveBeenCalledTimes(1);
      expect(isPrintingClickedSpy).not.toHaveBeenCalled();
      expect(component.isCancellation).toBe(true);
      expect(component.isPrinting).toBe(false);
    });

    it('should switch to the "Printing" tab when the session flag is present', () => {
      // Arrange: Ensure getItem returns a value for the flag
      mockSessionStorageService.getItem.mockImplementation((key: string) => {
        if (key === 'printTabStatus') return 'true'; // The value can be anything non-null
        return null;
      });
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');
      const isPrintingClickedSpy = jest.spyOn(component, 'isPrintingClicked');

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(sessionStorageService.getItem).toHaveBeenCalledWith('printTabStatus');
      expect(isPrintingClickedSpy).toHaveBeenCalledTimes(1);
      expect(cancelClickedSpy).not.toHaveBeenCalled();
      expect(component.isPrinting).toBe(true);
      expect(component.isCancellation).toBe(false);
    });

    it('should remove the "printTabStatus" flag from session storage after reading it', () => {
      // Arrange
      mockSessionStorageService.getItem.mockReturnValue('true');

      // Act
      fixture.detectChanges(); // Triggers ngOnInit

      // Assert
      expect(sessionStorageService.removeItem).toHaveBeenCalledWith('printTabStatus');
      expect(sessionStorageService.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should handle session storage errors gracefully and default to cancellation tab', () => {
      // Arrange: Simulate an error when calling getItem
      mockSessionStorageService.getItem.mockImplementation(() => {
        throw new Error('Session Storage is unavailable');
      });
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');

      // Act & Assert
      // We expect the component to not crash and to gracefully default to the cancellation tab
      expect(() => fixture.detectChanges()).not.toThrow();
      expect(cancelClickedSpy).toHaveBeenCalledTimes(1);
      expect(component.isCancellation).toBe(true);
    });

    it('should call to fetch initial data for the selected branch', () => {
        // Arrange
        mockSessionStorageService.getItem.mockImplementation((key: string) => {
            if (key === 'selectedBranch') return JSON.stringify(mockBranch);
            return null;
        });
        const fetchUnprintedSpy = jest.spyOn(component, 'fetchUnprintedReceipts');
        const fetchToCancelSpy = jest.spyOn(component, 'fetchReceiptsToCancel');

        // Act
        fixture.detectChanges();

        // Assert
        expect(fetchUnprintedSpy).toHaveBeenCalledWith(mockBranch.id);
        expect(fetchToCancelSpy).toHaveBeenCalledWith(mockBranch.id);
    });
  });

  describe('UI State Toggles', () => {
    it('isPrintingClicked should set printing flags correctly', () => {
      // Act
      component.isPrintingClicked();
      
      // Assert
      expect(component.printingEnabled).toBe(true);
      expect(component.isPrinting).toBe(true);
      expect(component.isCancellation).toBe(false);
      expect(component.cancellationDeactivated).toBe(false);
    });

    it('cancelClicked should set cancellation flags correctly', () => {
      // Arrange: set to printing first to see a change
      component.isPrintingClicked();
      
      // Act
      component.cancelClicked();
      
      // Assert
      expect(component.printingEnabled).toBe(false);
      expect(component.isPrinting).toBe(false);
      expect(component.isCancellation).toBe(true);
      expect(component.cancellationDeactivated).toBe(true);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
        // Set up the component with initial data
        component.unPrintedReceiptContent = [...mockReceiptContent];
        component.filteredtabledata = [...mockReceiptContent];
    });

    // Helper to create mock event
    const createMockEvent = (value: string): Partial<Event> => ({
        target: { value } as HTMLInputElement,
    });

    it('applyFilter should update filter property and call the correct filter method based on the active tab', () => {
        // Arrange
        const filterReceiptsSpy = jest.spyOn(component, 'filterReceipts');
        const filterAllReceiptsSpy = jest.spyOn(component, 'filterAllReceipts');
        const mockEvent = createMockEvent('R001');

        // Act (when printing tab is active)
        component.isPrintingClicked(); // Set active tab to printing
        component.applyFilter(mockEvent as Event, 'receiptNumber');

        // Assert
        expect(component.receiptNumberFilter).toBe('R001');
        expect(filterReceiptsSpy).toHaveBeenCalledTimes(1);
        expect(filterAllReceiptsSpy).not.toHaveBeenCalled();

        // Act (when cancellation tab is active)
        component.cancelClicked(); // Set active tab to cancellation
        component.applyFilter(mockEvent as Event, 'receiptNumber');

        // Assert
        expect(filterAllReceiptsSpy).toHaveBeenCalledTimes(1);
    });

    it('filterReceipts should filter data correctly', () => {
        // Arrange
        component.receiptNumberFilter = 'R002';

        // Act
        component.filterReceipts();

        // Assert
        expect(component.filteredtabledata.length).toBe(1);
        expect(component.filteredtabledata[0].branchReceiptCode).toBe('R002');
    });
  });


  describe('printReceipt', () => {
    it('should set receiptNumber in session storage and navigate to the preview page', () => {
      // Arrange
      const testReceiptNumber = 12345;
      const testIndex = 0; // Not used but part of method signature

      // Act
      component.printReceipt(testIndex, testReceiptNumber);

      // Assert
      expect(sessionStorageService.setItem).toHaveBeenCalledWith(
        'receiptNumber',
        JSON.stringify(testReceiptNumber)
      );
      expect(router.navigate).toHaveBeenCalledWith([
        '/home/fms/receipt-print-preview',
      ]);
    });
  });
});