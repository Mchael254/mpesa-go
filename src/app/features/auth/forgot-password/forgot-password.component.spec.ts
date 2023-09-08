import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { ForgotPasswordComponent } from './forgot-password.component';
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {UtilService} from "../../../shared/services";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {RouterTestingModule} from "@angular/router/testing";
import {NgxSpinnerModule} from "ngx-spinner";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {CopyrightFooterComponent} from "../../../shared/components/copyright-footer/copyright-footer.component";

import {StaffService} from "../../entities/services/staff/staff.service";
import {MockStaffService} from "../../entities/components/staff/list-staff/list-staff.component.spec";
import {BrowserStorage} from "../../../shared/services/storage";
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";
import {AppConfigService} from "../../../core/config/app-config-service";
import {
  MockAppConfigService,
  MockAuthService,
  MockBrowserStorage,
  MockGlobalMessagingService,
  MockLocalStorageService, MockSessionStorageService
} from "../authTestData/authTestData";
import {of} from "rxjs";

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let router: Router;
  let fb: FormBuilder;
  let authService: Partial<AuthService>;
  let globalMessagingService: Partial<GlobalMessagingService>;
  let sessionStorageService: Partial<SessionStorageService>;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxSpinnerModule.forRoot(), HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      declarations: [ForgotPasswordComponent, CopyrightFooterComponent],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessagingService },
        {provide: AuthService, useClass: MockAuthService},
        {provide: BrowserStorage, useClass: MockBrowserStorage},
        {provide: LocalStorageService, useClass: MockLocalStorageService},
        {provide: AppConfigService, useClass: MockAppConfigService},
        { provide: SessionStorageService, useClass: MockSessionStorageService},
        { provide: ComponentFixtureAutoDetect, useValue: true },
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    sessionStorageService = TestBed.inject(SessionStorageService);
    globalMessagingService = TestBed.inject(GlobalMessagingService);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with required fields', () => {
    component.createForm();

    expect(component.form).toBeInstanceOf(FormGroup);

    const emailControl = component.form.controls['email'];
    const phoneNumberControl = component.form.controls['phoneNumber'];

    emailControl.setValue(null);

    expect(emailControl.valid).toBeFalsy();
    expect(emailControl.hasError('required')).toBeTruthy();

    emailControl.setValue('test@test.com')

    expect(emailControl.valid).toBeTruthy();
    expect(emailControl.hasError('required')).toBeFalsy();

    emailControl.setValue('test');
    expect(emailControl.hasError('email')).toBeTruthy();

    phoneNumberControl.setValue(null);

    expect(phoneNumberControl.valid).toBeFalsy();
    expect(phoneNumberControl.hasError('required')).toBeTruthy();
  });

  it('should return the form controls using the getter', () => {
    component.createForm();

    expect(component.f['email']).toBe(component.form.controls['email']);
    expect(component.f['phoneNumber']).toBe(component.form.controls['phoneNumber']);
  });

  it('should submit the form and navigate to OTP page on success', (done) => {
    const mockEmail = 'test@example.com';
    const mockPhoneNo = '1234567890';
    const mockResponse = {message: 'Verification successful'};

    const emailControl = component.form.controls['email'];
    const phoneNumberControl = component.form.controls['phoneNumber'];

    emailControl.setValue(mockEmail);
    phoneNumberControl.setValue(mockPhoneNo);

    jest.spyOn(component.form, 'valid', 'get').mockReturnValue(true);

    jest.spyOn(sessionStorageService, 'setItem');
    jest.spyOn(authService, 'verifyAccount').mockReturnValue(of(mockResponse));
    jest.spyOn(globalMessagingService, 'displaySuccessMessage');
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.onSubmit();

    expect(component.submitted).toBeTruthy();
    expect(sessionStorageService.setItem).toHaveBeenCalledWith(
        'extras',
        JSON.stringify({
          action: 'reset-password',
          email: mockEmail,
          username: null,
          accountToUse: mockEmail,
        })
    );
    expect(authService.verifyAccount).toHaveBeenCalledWith(mockEmail, mockPhoneNo);
    expect(globalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', mockResponse.message);
    expect(component.saveSuccess).toBeTruthy();

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/auth/otp'], {
        queryParams: { referrer: 'password-reset' },
      });
      done();
    }, 3000);


  });

});
