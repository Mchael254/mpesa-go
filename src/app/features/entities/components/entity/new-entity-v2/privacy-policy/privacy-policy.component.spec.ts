import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyComponent } from './privacy-policy.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from "rxjs";
import {ClientService} from "../../../../services/client/client.service";
import {UtilService} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {FormBuilder} from "@angular/forms";
import {FieldModel} from "../../../../data/form-config.model";


describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  const mockUtilService = {
    currentLanguage: of('en')
  }

  const mockClientService = {
    requestOtp: jest.fn(),
    verifyOtp: jest.fn(),
  }

  const mockGlobalMessagingService = {
    displayErrorMessage: jest.fn(),
    displaySuccessMessage: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrivacyPolicyComponent],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: ClientService, useValue: mockClientService },
        { provide: UtilService, useValue: mockUtilService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
      ]
    });
    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;

    component.otpFormFields = [];
    component.countdownTime = 0;

    mockClientService.requestOtp.mockReturnValue(of({}));
    mockClientService.verifyOtp.mockReturnValue(of({}));

    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show selected tab', () => {
    component.showSelectedTab('sms');
    expect(component.shouldShowFields).toBe(true);
  });

  test('should process input otp_sms | otp_email & request otp', () => {
    component.otpForm = component['fb'].group({
      otp_sms: ['08060911051'],
      enter_otp: '123456',
    })
    component.processInput('otp_sms');
    expect(component.requestOtp.call).toBeTruthy();
    expect(component.otpCountdownTimer.call).toBeTruthy();
  });

  test('should verify otp', () => {
    const otpRequestPayload = {
      channel: "sms",
      otpCode: "123456",
      purpose: "CPV",
      recipient: "08060911051",

  }
    component.otpForm = component['fb'].group({
      otp_sms: ['08060911051'],
      enter_otp: '123456',
    })
    component.processInput('enter_otp');
    expect(component.verifyOtp.call).toBeTruthy();
    expect(mockClientService.verifyOtp).toHaveBeenCalled();
    expect(mockClientService.verifyOtp).toHaveBeenCalledWith(otpRequestPayload);
  });

  test('should count down from 30 to 0', () => {
    jest.useFakeTimers();

    component.otpCountdownTimer();
    expect(component.countdownTime).toBe(30); // initial value

    for (let i = 1; i <= 30; i++) {
      jest.advanceTimersByTime(1000);
      expect(component.countdownTime).toBe(30 - i);
    }

    // After 30 seconds, it should be 0
    expect(component.countdownTime).toBe(0);

    jest.useRealTimers();
  });

  it('should create form controls with validators for mandatory fields', () => {
    // Arrange
    component['otpFormFields'] = [

      { fieldId: 'otp_email', isMandatory: true } as FieldModel,
      { fieldId: 'otp_sms', isMandatory: false } as FieldModel,
      { fieldId: 'enter_otp', isMandatory: false } as FieldModel
    ];

    (component as any).setFields();

    expect(component.otpForm.contains('otp_email')).toBe(true);
    expect(component.otpForm.contains('otp_sms')).toBe(true);

    // Check validators
    const emailControl = component.otpForm.get('otp_email');
    const smsControl = component.otpForm.get('otp_sms');
    const otpControl = component.otpForm.get('enter_otp');

    expect(emailControl?.validator?.({} as any)).toEqual({ required: true });
    expect(smsControl?.validator?.({} as any)).toBeUndefined()
    expect(otpControl?.validator?.({} as any)).toBeUndefined()
  });

});
