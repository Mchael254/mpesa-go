import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { NewBankingProcessComponent } from './new-banking-process.component';
import { GlobalMessagingService } from './../../../../shared/services/messaging/global-messaging.service';
import { BankingProcessService } from '../../services/banking-process.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';

describe('NewBankingProcessComponent', () => {
  let component: NewBankingProcessComponent;
  let fixture: ComponentFixture<NewBankingProcessComponent>;

  let mockTranslateService: any;
  let mockRouter: any;
  let mockGlobalMessagingService: any;
  let mockBankingService: any;
  let mockSessionStorage: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockTranslateService = {
      instant: jest.fn((key: string) => key)
    };
    mockRouter = {
      navigate: jest.fn()
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn()
    };
    mockBankingService = {
      getPaymentMethods: jest.fn().mockReturnValue(of({ data: [] })),
      getReceipts: jest.fn().mockReturnValue(of([])),
      getUsers: jest.fn().mockReturnValue(of([]))
    };
    mockSessionStorage = {
      getItem: jest.fn()
    };
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 123 })
    };

    await TestBed.configureTestingModule({
      declarations: [NewBankingProcessComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: BankingProcessService, useValue: mockBankingService },
        { provide: SessionStorageService, useValue: mockSessionStorage },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewBankingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms and call fetchPaymentsModes on ngOnInit', () => {
    jest.spyOn(component, 'fetchPaymentsModes');
    component.ngOnInit();
    expect(component.rctsRetrievalForm).toBeDefined();
    expect(component.usersForm).toBeDefined();
    expect(component.fetchPaymentsModes).toHaveBeenCalled();
  });

  it('should fetch payment modes successfully', () => {
    const mockModes = [{ code: 'PM01', desc: 'Cash' }];
    mockBankingService.getPaymentMethods.mockReturnValue(of({ data: mockModes }));
    component.fetchPaymentsModes();
    expect(component.paymentModes.length).toBe(1);
    expect(component.rctsRetrievalForm.get('paymentMethod')?.value).toBe('PM01');
  });

  it('should handle error when fetching payment modes fails', () => {
    const errorResponse = { error: { msg: 'Network Error' } };
    mockBankingService.getPaymentMethods.mockReturnValue(throwError(() => errorResponse));
    component.fetchPaymentsModes();
    expect(mockGlobalMessagingService.displayErrorMessage)
      .toHaveBeenCalledWith('fms.errorMessage', 'Network Error');
  });

  it('should display error if required fields missing on receipt retrieval', () => {
    component.onClickRetrieveRcts();
    expect(mockGlobalMessagingService.displayErrorMessage)
      .toHaveBeenCalledWith('', 'Please fill the required fields');
  });

  it('should fetch receipts successfully', () => {
    component.rctsRetrievalForm.setValue({
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      paymentMethod: 'PM01'
    });
    const mockReceipts = [{ receiptNo: 'R001' }];
    mockBankingService.getReceipts.mockReturnValue(of(mockReceipts));

    component.fetchReceipts();

    expect(component.displayTable).toBe(true);
    expect(component.filteredReceipts.length).toBe(1);
  });

  it('should open assign modal only if receipts selected', () => {
    component.selectedReceipts = [];
    component.openAssignModal();
    expect(mockGlobalMessagingService.displayErrorMessage)
      .toHaveBeenCalledWith('', 'Please select at least one receipt to assign.');
  });

  it('should open assign modal when receipts selected', () => {
    component.selectedReceipts = [{ receiptNo: 'R001' }] as any;
    component.openAssignModal();
    expect(component.assignDialogVisible).toBe(true);
  });

  it('should close assign modal and reset form', () => {
    component.assignDialogVisible = true;
    component.selectedUserForAssignment = { user_id: 5 } as any;
    component.usersForm = component['fb'].group({ user: ['test'], comment: ['note'] });
    component.closeAssignModal();
    expect(component.assignDialogVisible).toBe(false);
    expect(component.selectedUserForAssignment).toBeNull();
  });

  it('should fetch users successfully', () => {
    const mockUsers = [{ user_id: 1, username: 'john', name: 'John Doe' }];
    mockBankingService.getUsers.mockReturnValue(of(mockUsers));
    component.fetchUsers(123);
    expect(component.users.length).toBe(1);
  });

  it('should handle API error when fetching users fails', () => {
    const error = { error: { msg: 'Unauthorized' } };
    mockBankingService.getUsers.mockReturnValue(throwError(() => error));
    component.fetchUsers(123);
    expect(mockGlobalMessagingService.displayErrorMessage)
      .toHaveBeenCalledWith('fms.errorMessage', 'Unauthorized');
  });

  it('should navigate to batch page', () => {
    component.navigateToBatch();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/process-batch']);
  });
});
