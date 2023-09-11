import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

import { ChangePasswordComponent } from './change-password.component';
import {CopyrightFooterComponent} from "../../../shared/components/copyright-footer/copyright-footer.component";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";

import {BrowserStorage} from "../../../shared/services/storage";
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";
import {AppConfigService} from "../../../core/config/app-config-service";
import {RouterTestingModule} from "@angular/router/testing";
import {NgxSpinnerModule} from "ngx-spinner";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {of} from "rxjs";
import {
  MockAppConfigService,
  MockAuthService,
  MockBrowserStorage,
  MockGlobalMessagingService,
  MockLocalStorageService, MockSessionStorageService
} from "../authTestData/authTestData";

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let routerStub: Partial<Router>;
  let formBuilderStub: Partial<FormBuilder>;
  let authServiceStub: Partial<AuthService>;
  let globalMessagingServiceStub: Partial<GlobalMessagingService>;
  let sessionStorageServiceStub: Partial<SessionStorageService>;

  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxSpinnerModule.forRoot(), HttpClientTestingModule,
        FormsModule, ReactiveFormsModule],
      declarations: [ChangePasswordComponent, CopyrightFooterComponent],
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
    fixture = TestBed.createComponent(ChangePasswordComponent);
    authServiceStub = TestBed.inject(AuthService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    sessionStorageServiceStub = TestBed.inject(SessionStorageService);
    routerStub = TestBed.inject(Router);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the component with the form and validators', () => {
    const newPasswordControl = component.form.controls['newPassword'];
    const confirmPasswordControl = component.form.controls['confirmPassword'];

    component.ngOnInit();

    expect(component.form).toBeInstanceOf(FormGroup);
    expect(newPasswordControl).toBeTruthy();
    expect(confirmPasswordControl).toBeTruthy();

    newPasswordControl.setValue(null);

    expect(newPasswordControl.errors).toBeTruthy();
    expect(newPasswordControl.hasError('required')).toBeTruthy();

    newPasswordControl.setValue('12345');

    expect(newPasswordControl.hasError('minlength')).toBeTruthy();

    newPasswordControl.setValue('1234567890');
    expect(newPasswordControl.hasError('minlength')).toBeFalsy();

    confirmPasswordControl.setValue(null);
    expect(confirmPasswordControl.errors).toBeTruthy();
    expect(confirmPasswordControl.hasError('required')).toBeTruthy();

    confirmPasswordControl.setValue('123456789');
    expect(confirmPasswordControl.hasError('confirmedValidator')).toBeTruthy();

    confirmPasswordControl.setValue('1234567890');
    expect(confirmPasswordControl.hasError('confirmedValidator')).toBeFalsy();

  });

  it('should return the form controls using the getter', () => {

    expect(component.f['newPassword']).toBe(component.form.controls['newPassword']);
    expect(component.f['confirmPassword']).toBe(component.form.controls['confirmPassword']);
  });

  it('should save the password details and navigate to login page if form is valid', (done) => {
    const mockExtras = {username: 'testuser', email: 'test@example.com'};
    const mockFormValues = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const newPasswordControl = component.form.controls['newPassword'];
    const confirmPasswordControl = component.form.controls['confirmPassword'];

    newPasswordControl.setValue(mockFormValues.newPassword);
    confirmPasswordControl.setValue(mockFormValues.confirmPassword);

    jest.spyOn(component.form, 'valid', 'get').mockReturnValue(true);

    jest.spyOn(sessionStorageServiceStub, 'getItem').mockReturnValue(JSON.stringify(mockExtras));
    jest.spyOn(authServiceStub, 'resetPassword').mockReturnValue(of(true));
    jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    jest.spyOn(routerStub, 'navigate').mockResolvedValue(true);

    component.onSave();

    expect(component.submitted).toBeTruthy();
    expect(authServiceStub.resetPassword).toHaveBeenCalledWith(
        mockExtras.username,
        mockFormValues.newPassword,
        'N',
        mockExtras.email
    );

    expect(globalMessagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith(
        'Success',
        'Successfully updated your password'
    );

    setTimeout(() => {
      expect(routerStub.navigate).toHaveBeenCalledWith(['/auth/']);
      done();
    }, 3000);
  });

  it('should set errorOccurred to true and display error message if resetPassword returns false', () => {
    const mockExtras = {username: 'testuser', email: 'test@example.com'};
    const mockFormValues = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const newPasswordControl = component.form.controls['newPassword'];
    const confirmPasswordControl = component.form.controls['confirmPassword'];

    newPasswordControl.setValue(mockFormValues.newPassword);
    confirmPasswordControl.setValue(mockFormValues.confirmPassword);

    jest.spyOn(component.form, 'valid', 'get').mockReturnValue(true);

    jest.spyOn(sessionStorageServiceStub, 'getItem').mockReturnValue(JSON.stringify(mockExtras));
    jest.spyOn(authServiceStub, 'resetPassword').mockReturnValue(of(false));
    jest.spyOn(globalMessagingServiceStub, 'displayErrorMessage');

    component.onSave();

    expect(component.errorOccurred).toBe(true);
    expect(component.errorMessage).toBe('Something went wrong.Please try Again');
    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Something went wrong.Please try Again'
    );
  });

  });
