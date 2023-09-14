import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, ReplaySubject, of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';



export class MockAuthService {

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public authenticateUser = jest.fn();
  public sentVerificationOtp = jest.fn();
  public getAuthVerification = jest.fn().mockReturnValue(of({}));
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceStub: AuthService;
  let routeStub: Router;
  let mockExtras = {};
  let response;

  beforeAll(() => {
    const extras = {
      action: 'login',
      phone: '080',
      email: 'client@turnkey.com',
    };
    localStorage.setItem('extras', JSON.stringify(extras));

    response = {
      data:  {
        phoneNumber: '08060911',
        emailAddress: 'client@turnkeyafrica.com',
        accountStatus: false
      },
      msg: {
        severity: '',
        detail: ''
      }
    }
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.inject(AuthService);
    routeStub = TestBed.inject(Router)
    mockExtras = {}
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
    test('should have a login form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(typeof component.loginForm.controls).toBe('object');
    expect(Object.keys(component.loginForm.controls)).toContain('username');
    expect(Object.keys(component.loginForm.controls)).toContain('password');
  });

  test('should attemptAuth when login button is clicked', () => {
    const button = fixture.nativeElement.querySelector('#login-submit');
    component.loginForm.controls['username'].setValue('client@turnkey.com');
    component.loginForm.controls['password'].setValue('1234567');
    button.click();
    fixture.detectChanges();
    expect(component.errorOccurred).toEqual(false);
    expect(component.errorMessage).toEqual('');
    expect(authServiceStub.authenticateUser).toHaveBeenCalled();
  });

  test('should toggle password visibility', () => {
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
  });

  test('should store login details in local storage if "Remember Me" is checked', () => {
    // Arrange: Set up the form with valid data and "Remember Me" checked
    const button = fixture.nativeElement.querySelector('#login-submit');
    component.loginForm.controls['username'].setValue('client@turnkey.com');
    component.loginForm.controls['password'].setValue('1234567');
    component.loginForm.controls['rememberMe'].setValue(true);
    button.click();
    fixture.detectChanges();
    // Assert: Check that login details are stored in local storage
    const storedLoginDetails = JSON.parse(localStorage.getItem('loginDetails'));
    expect(storedLoginDetails).toEqual({
      username: 'client@turnkey.com',
      password: '1234567',
    });
    expect(authServiceStub.authenticateUser).toHaveBeenCalled();
    // Add more expectations as needed.
  });



  test('should reset password', () => {
    authServiceStub.sentVerificationOtp = jest.fn().mockReturnValue(of(true));
    const button = fixture.nativeElement.querySelector('#reset-password');
    button.click();
    fixture.detectChanges();
    console.log('Button clicked!');
    expect(authServiceStub.sentVerificationOtp).toHaveBeenCalled();
    expect(authServiceStub.sentVerificationOtp).toHaveBeenCalledWith('client@turnkey.com', 'email')
  });

  test('should log error on OTP failure', () => {
    authServiceStub.sentVerificationOtp = jest.fn().mockReturnValue(of(false));
    const button = fixture.nativeElement.querySelector('#reset-password');
    button.click();
    fixture.detectChanges();
    expect(authServiceStub.sentVerificationOtp.call).toBeTruthy();
    expect(authServiceStub.sentVerificationOtp).toHaveBeenCalledWith('client@turnkey.com', 'email')
  })

  afterAll( () => {
    localStorage.clear();
  });
});
