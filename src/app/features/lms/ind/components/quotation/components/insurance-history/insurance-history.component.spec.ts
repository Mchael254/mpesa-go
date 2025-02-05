import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsuranceHistoryComponent } from './insurance-history.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../../../../../../shared/services/toast/toast.service';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { ClientHistoryService } from '../../../../../service/client-history/client-history.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('InsuranceHistoryComponent', () => {
  let component: InsuranceHistoryComponent;
  let fixture: ComponentFixture<InsuranceHistoryComponent>;
  let mockSpinnerService: any;
  let mockToastService: any;
  let mockSessionStorageService: any;
  let mockClientHistoryService: any;

  beforeEach(async () => {
    // Mock dependencies
    mockSpinnerService = { show: jest.fn(), hide: jest.fn() };
    mockToastService = { success: jest.fn(), danger: jest.fn() };
    mockSessionStorageService = { get: jest.fn(() => 'mock-client-code') };
    mockClientHistoryService = {
      getLmsInsHistList: jest.fn(() => of({ data: [], message: 'Mock Message' })),
      getAllCoverStatusTypes: jest.fn(() => of([])),
      saveInsuranceHistory: jest.fn(() => of({ data: {}, message: 'Saved successfully' })),
      deleteInsuranceHistory: jest.fn(() => of({ message: 'Deleted successfully' })),
    };

    await TestBed.configureTestingModule({
      declarations: [InsuranceHistoryComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: NgxSpinnerService, useValue: mockSpinnerService },
        { provide: ToastService, useValue: mockToastService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: ClientHistoryService, useValue: mockClientHistoryService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(InsuranceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Initialization
  describe('Initialization', () => {
    test('should initialize form groups correctly', () => {
      expect(component.insuranceHistoryForm).toBeDefined();
      expect(component.insuranceHistoryFormOne).toBeDefined();
      expect(component.insuranceHistoryFormTwo).toBeDefined();
    });

    test('should load initial cover status types', () => {
      const spy = jest.spyOn(component, 'getAllCoverStatusTypes');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    test('should load insurance history data', () => {
      const spy = jest.spyOn(component, 'getLmsInsHistList');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    test('should initialize forms and default values in the constructor', () => {
      expect(component.insuranceHistoryForm).toBeDefined();
      expect(component.insuranceHistoryFormOne).toBeDefined();
      expect(component.insuranceHistoryFormTwo).toBeDefined();
      expect(component.insuranceHistoryForm.get('question1')?.value).toBe('N');
      expect(component.insuranceHistoryForm.get('question2')?.value).toBe('N');
    });
  });

  // Form Validation
  describe('Form Validation', () => {
    test('should mark "question1" as invalid when empty', () => {
      component.insuranceHistoryForm.get('question1')?.setValue('');
      expect(component.insuranceHistoryForm.get('question1')?.valid).toBeFalsy();
    });

    test('should mark "question2" as valid when set', () => {
      const question2Control = component.insuranceHistoryForm.get('question2');
      question2Control?.setValue('Y');
      question2Control?.markAsTouched();
      question2Control?.updateValueAndValidity();
      expect(question2Control?.valid).toBeTruthy();
    });

    test('should validate insurance history form group', () => {
      const form = component.insuranceHistoryFormOne;
      form.patchValue({
        policy_no: '',
        provider: '',
        premium: 1000,
        sum_assured: 500,
        cover_status: '',
      });
      expect(form.valid).toBeFalsy(); // Should fail validation

      form.patchValue({
        policy_no: '12345',
        provider: 'Test Provider',
        premium: 500,
        sum_assured: 1000,
        cover_status: 'A',
      });
      expect(form.valid).toBeTruthy(); //Should pass validation
    });

    test('should show error if cover_status is missing in addResponseOne', () => {
      const mockPolicy = {
        policy_no: '12345',
        provider: 'Test Provider',
        premium: 500,
        sum_assured: 1000,
        cover_status: '',
      };

      component.policyListOne.push({ ...mockPolicy, isEdit: true });
      component.insuranceHistoryFormOne.patchValue(mockPolicy);

      component.addResponseOne(0);

      expect(mockToastService.danger).toHaveBeenCalledWith(
        'Select cover status',
        'INSURANCE HISTORY'
      );
      expect(mockSpinnerService.hide).toHaveBeenCalledWith('ins_view');
    });

    test('should show error if premium exceeds sum_assured in addResponseTwo', () => {
      const mockPolicy = {
        policy_no: '67890',
        provider: 'Another Provider',
        premium: 1500, // Premium exceeds sum_assured
        sum_assured: 1000,
        cover_status: 'J',
      };

      component.policyListTwo.push({ ...mockPolicy, isEdit: true });
      component.insuranceHistoryFormTwo.patchValue(mockPolicy);

      component.addResponseTwo(0);

      expect(mockToastService.danger).toHaveBeenCalledWith(
        'The Premium amount exceeds the sum assured',
        'INSURANCE HISTORY'
      );
      expect(mockSpinnerService.hide).toHaveBeenCalledWith('ins_view');
    });

    test('should reset insuranceHistoryFormOne when addEmptyPolicyList is called', () => {
      component.insuranceHistoryFormOne.patchValue({
        policy_no: '12345',
        provider: 'Test Provider',
        premium: 500,
        sum_assured: 1000,
        cover_status: 'A',
      });

      component.addEmptyPolicyList();

      expect(component.insuranceHistoryFormOne.value).toEqual({
        policy_no: null,
        provider: null,
        premium: null,
        sum_assured: null,
        cover_status: null,
        code: null,
      });
    });

    test('should reset insuranceHistoryFormTwo when openAddPolicyTwoModal is called', () => {
      component.insuranceHistoryFormTwo.patchValue({
        policy_no: '67890',
        provider: 'Another Provider',
        premium: 300,
        sum_assured: 1000,
        cover_status: 'J',
      });

      component.openAddPolicyTwoModal();

      expect(component.insuranceHistoryFormTwo.value).toEqual({
        policy_no: null,
        provider: null,
        premium: null,
        sum_assured: null,
        cover_status: null,
        code: null,
       });
    });

    test('should filter cover status types correctly', () => {
      component.coverStatusTypeList = [
        { name: 'A', value: 'Active' },
        { name: 'J', value: 'Junior' },
      ];

      const result = component.filterCoverStatusType('A');
      expect(result).toEqual(['Active']);
    });

    test('should return empty array if no matching cover status is found', () => {
      component.coverStatusTypeList = [
        { name: 'A', value: 'Active' },
        { name: 'J', value: 'Junior' },
      ];

      const result = component.filterCoverStatusType('Z');
      expect(result).toEqual([]);
    });

    test('should delete a policy from policyListOne', () => {
      const mockPolicy = { code: '12345', isEdit: false };
      component.policyListOne.push(mockPolicy);

      component.deletePolicyListOne(0);

      expect(mockClientHistoryService.deleteInsuranceHistory).toHaveBeenCalledWith('12345');
      expect(component.policyListOne.length).toBe(0);
    });

    test('should show error toast if deletePolicyListOne fails', () => {
      const mockPolicy = { code: '12345', isEdit: false };
      component.policyListOne.push(mockPolicy);

      jest.spyOn(mockClientHistoryService, 'deleteInsuranceHistory').mockReturnValue(
        throwError(() => new Error('Deletion failed'))
      );

      component.deletePolicyListOne(0);

      expect(mockToastService.danger).toHaveBeenCalledWith(
        'Failed to Delete Data',
        'INSURANCE HISTORY'
      );
    });
  });

  // Business Logic
  describe('Business Logic', () => {
    test('should add a new editable policy row to policyListOne', () => {
      component.addEmptyPolicyList();
      expect(component.editingPolicy).toBeFalsy();
      expect(component.editingIndex).toBeNull();
      expect(component.showModal).toBeTruthy();
    });

    test('should save insurance history data for policyListOne', () => {
      const mockPolicy = {
        policy_no: '12345',
        provider: 'Test Provider',
        premium: 500,
        sum_assured: 1000,
        cover_status: 'A',
      };

      // Add mock policy to policyListOne
      component.policyListOne.push({ ...mockPolicy });

      // Patch form with mock policy data
      component.insuranceHistoryFormOne.patchValue(mockPolicy);

      // Mock getClientCode to return 'mock-client-code'
      jest.spyOn(component.util, 'getClientCode').mockReturnValue('mock-client-code');

      // Call the method
      component.addResponseOne(0);

      // Assert spinner was shown
      expect(mockSpinnerService.show).toHaveBeenCalledWith('ins_view');

      // Assert saveInsuranceHistory was called with correct payload
      expect(mockClientHistoryService.saveInsuranceHistory).toHaveBeenCalledWith({
        ...mockPolicy,
        clnt_code: 'mock-client-code',
        prp_code: null, // Ensure only relevant fields are included
      });

      // Assert success toast was shown
      expect(mockToastService.success).toHaveBeenCalledWith(
        'Save Data Successfully',
        'INSURANCE HISTORY'
      );
    });

    test('should save insurance history data for policyListTwo', () => {
      const mockPolicy = {
        policy_no: '67890',
        provider: 'Another Provider',
        premium: 300,
        sum_assured: 1000,
        cover_status: 'J',
      };

      // Add mock data to policyListTwo
      component.policyListTwo.push({ ...mockPolicy });

      // Patch the form with mock data
      component.insuranceHistoryFormTwo.patchValue(mockPolicy);

      // Mock getClientCode to return 'mock-client-code'
      jest.spyOn(component.util, 'getClientCode').mockReturnValue('mock-client-code');

      // Call the method
      component.addResponseTwo(0);

      // Assert spinner was shown
      expect(mockSpinnerService.show).toHaveBeenCalledWith('ins_view');

      // Assert saveInsuranceHistory was called with the correct payload
      expect(mockClientHistoryService.saveInsuranceHistory).toHaveBeenCalledWith({
        ...mockPolicy,
        clnt_code: 'mock-client-code',
        prp_code: null,
      });

      // Assert success toast was shown
      expect(mockToastService.success).toHaveBeenCalledWith(
        'Save Data Successfully',
        'INSURANCE HISTORY'
      );
    });

    test('should delete a policy from policyListOne', () => {
      const mockPolicy = { code: '12345', isEdit: false };
      component.policyListOne.push(mockPolicy);

      component.deletePolicyListOne(0);

      expect(mockSpinnerService.show).toHaveBeenCalledWith('ins_view');
      expect(mockClientHistoryService.deleteInsuranceHistory).toHaveBeenCalledWith('12345');
      expect(mockToastService.success).toHaveBeenCalledWith(
        'Delete Data Successfully',
        'INSURANCE HISTORY'
      );
      expect(component.policyListOne.length).toBe(0);
    });

    test('should delete a policy from policyListTwo', () => {
      const mockPolicy = { code: '67890', isEdit: false };
      component.policyListTwo.push(mockPolicy);

      component.deletepolicyListTwo(0);

      expect(mockSpinnerService.show).toHaveBeenCalledWith('ins_view');
      expect(mockClientHistoryService.deleteInsuranceHistory).toHaveBeenCalledWith('67890');
      expect(mockToastService.success).toHaveBeenCalledWith(
        'Delete Data Successfully',
        'INSURANCE HISTORY'
      );
      expect(component.policyListTwo.length).toBe(0);
    });

    test('should show error toast if deletePolicyListOne fails', () => {
      const mockPolicy = { code: '12345', isEdit: false };
      component.policyListOne.push(mockPolicy);

      jest.spyOn(mockClientHistoryService, 'deleteInsuranceHistory').mockReturnValue(
        throwError(() => new Error('Deletion failed'))
      );

      component.deletePolicyListOne(0);

      expect(mockToastService.danger).toHaveBeenCalledWith(
        'Failed to Delete Data',
        'INSURANCE HISTORY'
      );

      expect(mockSpinnerService.show).toHaveBeenCalledWith('ins_view');
    });

    test('should show error toast if deletepolicyListTwo fails', () => {
      const mockPolicy = { code: '67890', isEdit: false };
      component.policyListTwo.push(mockPolicy);

      jest.spyOn(mockClientHistoryService, 'deleteInsuranceHistory').mockReturnValue(
        throwError(() => new Error('Deletion failed'))
      );

      component.deletepolicyListTwo(0);

      expect(mockToastService.danger).toHaveBeenCalledWith(
        'Failed to Delete Data',
        'INSURANCE HISTORY'
      );

      expect(mockSpinnerService.show).toHaveBeenCalledWith('ins_view');
    });

    test('should open modal and reset form when addEmptyPolicyList is called', () => {
    component.addEmptyPolicyList();

    expect(component.editingPolicy).toBeFalsy(); // Should not be editing an existing policy
    expect(component.editingIndex).toBeNull(); // No index should be selected for editing

    expect(component.insuranceHistoryFormOne.pristine).toBeTruthy(); // Form should be pristine
    expect(component.insuranceHistoryFormOne.valid).toBeFalsy(); // Form should be invalid after reset

    expect(component.showModal).toBeTruthy();
  });

  });

  // UI Interaction
  describe('UI Interaction', () => {
    test('should toggle edit mode for a policy in policyListOne', () => {
      const mockPolicy = { policy_no: '12345', provider: 'Test Provider', isEdit: false };
      component.policyListOne.push(mockPolicy);

      component.editPolicyOne(0);
      expect(component.policyListOne[0].isEdit).toBeTruthy();
      expect(component.insuranceHistoryFormOne.value.policy_no).toBe('12345');
    });

    test('should cancel edit mode for a policy in policyListOne', () => {
      component.policyListOne = [
        { policy_no: '12345', provider: 'Test Provider', isEdit: true, code: 'mock-code' },
      ];

      component.cancelPolicyListOne(0);

      expect(component.policyListOne[0].isEdit).toBeFalsy();
    });

    test('should cancel edit mode for a policy in policyListTwo', () => {
      component.policyListTwo = [
        { policy_no: '67890', provider: 'Another Provider', isEdit: true, code: 'mock-code' },
      ];

      component.cancelPolicyListTwo(0);

      expect(component.policyListTwo[0].isEdit).toBeFalsy();
    });

    //Modal Interaction
    test('should show modal when addEmptyPolicyList is called', () => {
      component.addEmptyPolicyList();
      expect(component.showModal).toBeTruthy();
      expect(component.editingPolicy).toBeFalsy();
      expect(component.editingIndex).toBeNull();
      expect(component.insuranceHistoryFormOne.pristine).toBeTruthy();
    });

    test('should show modal when openAddPolicyTwoModal is called', () => {
      component.openAddPolicyTwoModal();
      expect(component.showPolicyTwoModal).toBeTruthy();
      expect(component.editingPolicyTwo).toBeFalsy();
      expect(component.editingIndexTwo).toBeNull();
      expect(component.insuranceHistoryFormTwo.pristine).toBeTruthy();
    });

    test('should close modals when closePolicyModal and closePolicyModalTwo are called', () => {
      component.showModal = true;
      component.showPolicyTwoModal = true;

      component.closePolicyModal();
      component.closePolicyModalTwo();

      expect(component.showModal).toBeFalsy();
      expect(component.showPolicyTwoModal).toBeFalsy();
    });
  });

  // Utility Methods
  describe('Utility Methods', () => {
    test('should return correct value for a form control in getValue', () => {
      component.insuranceHistoryForm.get('question1')?.setValue('Y');
      expect(component.getValue('question1')).toBe('Y');
    });

    test('should filter cover status types correctly', () => {
      component.coverStatusTypeList = [
        { name: 'A', value: 'Active' },
        { name: 'J', value: 'Junior' },
      ];

      const result = component.filterCoverStatusType('A');

      expect(result).toEqual(['Active']);
    });
  });

});