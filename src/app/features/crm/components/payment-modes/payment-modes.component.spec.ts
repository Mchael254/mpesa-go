import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModesComponent } from './payment-modes.component';
import {MandatoryFieldsService} from "../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {GlobalMessagingService} from "../../../../shared/services/messaging/global-messaging.service";
import {PaymentModesService} from "../../../../shared/services/setups/payment-modes/payment-modes.service";
import {ReusableInputComponent} from "../../../../shared/components/reusable-input/reusable-input.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../../shared/shared.module";
import {TableModule} from "primeng/table";
import {of} from "rxjs";
import {MandatoryFieldsDTO} from "../../../../shared/data/common/mandatory-fields-dto";
import {ClaimsPaymentModesDto, PaymentModesDto} from "../../../../shared/data/common/payment-modes-dto";
import {AppConfigService} from "../../../../core/config/app-config-service";

const mockPaymentModesData: PaymentModesDto[] = [{
  description: "",
  id: 0,
  isDefault: "",
  narration: "",
  organizationId: 0,
  shortDescription: ""
}]

const mockClaimPaymentModesData: ClaimsPaymentModesDto[] = [
  {
    description: "",
  id: 0,
  isDefault: "",
  maximumAmount: 0,
  minimumAmount: 0,
  organizationId: 0,
  remarks: "",
  shortDescription: ""
  }]

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'country',
    screenName: '',
    groupId: '',
    module: '',
  },
];

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of(mockMandatoryData));
}

export class MockPaymentModesService {
  getPaymentModes = jest.fn().mockReturnValue(of(mockPaymentModesData));
  createPaymentMode = jest.fn().mockReturnValue(of());
  updatePaymentMode = jest.fn().mockReturnValue(of());
  deletePaymentMode = jest.fn().mockReturnValue(of());
  getClaimsPaymentModes = jest.fn().mockReturnValue(of(mockClaimPaymentModesData));
  createClaimsPaymentMode = jest.fn().mockReturnValue(of());
  updateClaimsPaymentMode = jest.fn().mockReturnValue(of());
  deleteClaimsPaymentMode = jest.fn().mockReturnValue(of());
}

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "setup_services":  "crm",
      }
    };
  }
}

describe('PaymentModesComponent', () => {
  let component: PaymentModesComponent;
  let fixture: ComponentFixture<PaymentModesComponent>;
  let paymentModesServiceStub: PaymentModesService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;
  let appConfigServiceStub: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentModesComponent,
        ReusableInputComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule
      ],
      providers: [
        { provide: PaymentModesService, useClass: MockPaymentModesService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryService },
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    fixture = TestBed.createComponent(PaymentModesComponent);
    component = fixture.componentInstance;
    paymentModesServiceStub = TestBed.inject(PaymentModesService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    appConfigServiceStub = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch payment modes data', () => {
    jest.spyOn(paymentModesServiceStub, 'getPaymentModes');
    component.fetchPaymentModes();
    expect(paymentModesServiceStub.getPaymentModes).toHaveBeenCalled();
    expect(component.paymentModesData).toEqual(mockPaymentModesData);
  });

  test('should fetch claims payment modes banks data', () => {
    jest.spyOn(paymentModesServiceStub, 'getClaimsPaymentModes');
    component.fetchClaimsPaymentModes();
    expect(paymentModesServiceStub.getClaimsPaymentModes).toHaveBeenCalled();
    expect(component.claimPaymentModesData).toEqual(mockClaimPaymentModesData);
  });

  test('should open payment modes Modal', () => {
    component.openPaymentModesModal();

    const modal = document.getElementById('paymentModesModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close payment modes Modal', () => {
    const modal = document.getElementById('paymentModesModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closePaymentModesModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open claims payment modes Modal', () => {
    component.openClaimPaymentModesModal();

    const modal = document.getElementById('claimsPaymentModesModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close claims payment modes Modal', () => {
    const modal = document.getElementById('claimsPaymentModesModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeClaimPaymentModesModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should select a payment mode on onPaymentModeRowSelect', () => {
    const selectedPaymentMode = mockPaymentModesData[0];
    component.onPaymentModeRowSelect(selectedPaymentMode);
    expect(component.selectedPaymentMode).toEqual(selectedPaymentMode);
  });

  test('should select a claim payment mode on onClaimPaymentModeRowSelect', () => {
    const selectedClaimPaymentMode = mockClaimPaymentModesData[0];
    component.onClaimPaymentModeRowSelect(selectedClaimPaymentMode);
    expect(component.selectedClaimsPaymentMode).toEqual(selectedClaimPaymentMode);
  });

  test('should open the payment mode modal and set form values when a payment mode is selected', () => {
    const mockselectedPaymentMode = mockPaymentModesData[0];
    component.selectedPaymentMode = mockselectedPaymentMode;
    const spyOpenPaymentModeModal = jest.spyOn(component, 'openPaymentModesModal');
    const patchValueSpy = jest.spyOn(
      component.createPaymentModeForm,
      'patchValue'
    );

    component.editPaymentMode();

    expect(spyOpenPaymentModeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      description: mockselectedPaymentMode.description,
      id: mockselectedPaymentMode.id,
      defaultMode: mockselectedPaymentMode.isDefault,
      narration: mockselectedPaymentMode.narration,
      organizationId: 2,
      shortDescription: mockselectedPaymentMode.shortDescription
    });
  });

  test('should open the claims payment mode modal and set form values when a claims payment mode is selected', () => {
    const mockselectedClaimsPaymentMode = mockClaimPaymentModesData[0];
    component.selectedClaimsPaymentMode = mockselectedClaimsPaymentMode;
    const spyOpenClaimsPaymentModeModal = jest.spyOn(component, 'openClaimPaymentModesModal');
    const patchValueSpy = jest.spyOn(
      component.createClaimsPaymentModeForm,
      'patchValue'
    );

    component.editClaimPaymentMode();

    expect(spyOpenClaimsPaymentModeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      id: mockselectedClaimsPaymentMode.shortDescription,
      claimsDescription: mockselectedClaimsPaymentMode.description,
      minAmount: mockselectedClaimsPaymentMode.minimumAmount,
      maxAmount: mockselectedClaimsPaymentMode.maximumAmount,
      claimsDefaultMode: mockselectedClaimsPaymentMode.isDefault
    });
  });

  test('should display an error message when no payment mode is selected during edit', () => {
    component.selectedPaymentMode = null;

    component.editPaymentMode();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No payment mode is selected!'
    );
  });

  test('should display an error message when no claims payment mode is selected during edit', () => {
    component.selectedClaimsPaymentMode = null;

    component.editClaimPaymentMode();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No claims payment mode is selected!'
    );
  });

  test('should show the payment mode confirmation modal when deletePaymentMode is called', () => {
    const spydeletePaymentMode = jest.spyOn(component, 'deletePaymentMode');
    component.deletePaymentMode();

    expect(spydeletePaymentMode).toHaveBeenCalled();
    expect(component.paymentModeConfirmationModal.show).toBeTruthy;
  });

  test('should show the claims payment mode confirmation modal when deleteClaimPaymentMode is called', () => {
    const spydeleteClaimsPaymentMode = jest.spyOn(component, 'deleteClaimPaymentMode');
    component.deleteClaimPaymentMode();

    expect(spydeleteClaimsPaymentMode).toHaveBeenCalled();
    expect(component.claimsPaymentModeConfirmationModal.show).toBeTruthy;
  });

  test('should confirm payment mode deletion when a payment mode is selected', () => {
    component.selectedPaymentMode = mockPaymentModesData[0];
    const selectedPaymentModeId = mockPaymentModesData[0].id;

    const spydeletePaymentModeConfirmation = jest.spyOn(paymentModesServiceStub, 'deletePaymentMode');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeletePaymentMode = jest.spyOn(component, 'deletePaymentMode');
    component.deletePaymentMode();

    const button = fixture.debugElement.nativeElement.querySelector('#paymentModeConfirmationModal');
    button.click();

    component.confirmPaymentModeDelete();

    expect(spydeletePaymentMode).toHaveBeenCalled();
    expect(spydeletePaymentModeConfirmation).toHaveBeenCalledWith(selectedPaymentModeId);
  });

  test('should confirm claims payment mode deletion when a claims payment mode is selected', () => {
    component.selectedClaimsPaymentMode = mockClaimPaymentModesData[0];
    const selectedClaimsPaymentModeId = mockPaymentModesData[0].id;

    const spydeleteClaimsPaymentModeConfirmation = jest.spyOn(paymentModesServiceStub, 'deleteClaimsPaymentMode');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeleteClaimsPaymentMode = jest.spyOn(component, 'deleteClaimPaymentMode');
    component.deleteClaimPaymentMode();

    const button = fixture.debugElement.nativeElement.querySelector('#claimsPaymentModeConfirmationModal');
    button.click();

    component.confirmClaimsPaymentModeDelete();

    expect(spydeleteClaimsPaymentMode).toHaveBeenCalled();
    expect(spydeleteClaimsPaymentModeConfirmation).toHaveBeenCalledWith(selectedClaimsPaymentModeId);
  });

  test('should save payment mode', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#savePaymentModeBtn');
    button.click();
    fixture.detectChanges();
    expect(paymentModesServiceStub.createPaymentMode.call).toBeTruthy();
    expect(paymentModesServiceStub.createPaymentMode.call.length).toBe(1);
  });

  test('should save claims payment mode', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveClaimsPaymentModeBtn');
    button.click();
    fixture.detectChanges();
    expect(paymentModesServiceStub.createClaimsPaymentMode.call).toBeTruthy();
    expect(paymentModesServiceStub.createClaimsPaymentMode.call.length).toBe(1);
  });
});
