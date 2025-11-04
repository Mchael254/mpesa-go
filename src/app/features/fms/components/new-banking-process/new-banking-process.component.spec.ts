import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { NewBankingProcessComponent } from './new-banking-process.component';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { BankingProcessService } from '../../services/banking-process.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ReceiptDTO } from '../../data/banking-process-dto';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';
// --- Mock Data ---
const mockReceipts: ReceiptDTO[] = [
  { receiptNo: 101 } as ReceiptDTO,
];
const mockStaff: StaffDto[] = [
  { id: 1, username: 'user_one' } as StaffDto,
];

// --- Jest Mocks ---
jest.mock('../../data/fms-step.json', () => ({
  __esModule: true,
  default: { bankingSteps: [] },
}));

describe('NewBankingProcessComponent', () => {
  let component: NewBankingProcessComponent;
  let fixture: ComponentFixture<NewBankingProcessComponent>;
  let mockBankingService: any;
  let mockStaffService: any;
  let mockGlobalMessagingService: any;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: jest.fn((key) => key),
      get: jest.fn((key) => of(key)),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };
    mockBankingService = {
      getPaymentMethods: jest.fn().mockReturnValue(of({ data: [{ code: 'CASH' }] })),
      getReceipts: jest.fn().mockReturnValue(of(mockReceipts)), // Use simple mock here, will be overridden where needed
      assignUser: jest.fn().mockReturnValue(of({ msg: 'Assigned' })),
      deAssign: jest.fn().mockReturnValue(of({ msg: 'De-assigned' })),
    };
    mockStaffService = {
      getStaff: jest.fn().mockReturnValue(of({ content: mockStaff })),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [NewBankingProcessComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot(),
        TableModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  CalendarModule,
  RippleModule,
  FormsModule 
      ],
      providers: [
        FormBuilder,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: BankingProcessService, useValue: mockBankingService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: SessionStorageService, useValue: { getItem: jest.fn() } },
        { provide: AuthService, useValue: { getCurrentUser: jest.fn().mockReturnValue({ code: 999 }) } },
      ],
     
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    fixture = TestBed.createComponent(NewBankingProcessComponent);
    component = fixture.componentInstance;

    // IMPORTANT FIX: DO NOT call fixture.detectChanges() here.
    // We will call it inside each test ('it' block) after ngOnInit.
  });

  it('should create and initialize correctly', () => {
    // Act
    fixture.detectChanges(); // This calls ngOnInit and renders the template

    // Assert
    expect(component).toBeTruthy();
    expect(component.rctsRetrievalForm).toBeDefined();
    expect(component.usersForm).toBeDefined();
    expect(mockStaffService.getStaff).toHaveBeenCalledTimes(1);
  });

  describe('onAssignSubmit', () => {
    beforeEach(() => {
      // Manually trigger initialization before this test suite
      fixture.detectChanges();
      component.selectedReceipts = [mockReceipts[0]];
      component.usersForm.patchValue({ user: mockStaff[0].id });
    });

    it('should call bankingService.assignUser and refresh data on success', () => {
      // Arrange
      jest.spyOn(component, 'fetchReceipts'); // Spy on the refresh method

      // Act
      component.onAssignSubmit();
      
      // Assert
      expect(mockBankingService.assignUser).toHaveBeenCalled();
      expect(component.fetchReceipts).toHaveBeenCalled();
    });
  });

  describe('deAssign', () => {
    beforeEach(() => {
        // Manually trigger initialization before this test suite
        fixture.detectChanges();
        jest.spyOn(component, 'fetchReceipts'); // Spy on the refresh method
    });

    it('should call bankingService.deAssign and refresh data on success', () => {
        // Arrange
        const body = { receiptNumbers: [101] };

        // Act
        component.deAssignRct(body);

        // Assert
        expect(mockBankingService.deAssign).toHaveBeenCalledWith(body);
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalled();
        expect(component.fetchReceipts).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors during de-assignment', () => {
        // Arrange
        mockBankingService.deAssign.mockReturnValue(throwError(() => ({})));
        
        // Act
        component.deAssignRct({ receiptNumbers: [101] });

        // Assert
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalled();
        expect(component.fetchReceipts).not.toHaveBeenCalled();
    });
  });
  
  // You can add more specific tests as needed. This structure solves the core issue.
});