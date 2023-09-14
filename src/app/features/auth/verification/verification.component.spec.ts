import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationComponent } from './verification.component';
import { AuthenticationResponse } from '../../base/util';
import { Observable, ReplaySubject, of } from 'rxjs';
import { AuthVerification } from 'src/app/core/auth/auth-verification';
import { AuthService } from '../../../shared/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { UtilService } from '../../../shared/services/util/util.service';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';

export class MockAuthService {
  authenticationResponse: AuthenticationResponse = {
    phoneNumber: '08060911',
    emailAddress: 'client@turnkeyafrica.com',
    accountStatus: false
  };
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public authenticateUser = jest.fn().mockReturnValue(of(this.authenticationResponse));
  public sentVerificationOtp = jest.fn().mockReturnValue(of({}));
  public getAuthVerification = jest.fn().mockReturnValue(of({}));
}

const accountType:  AuthVerification[] = [
    {
    name: "7*******89",
    type: "SMS",
    icon: "smartphone-outline",
    selected: true
    },
    {
    name: "ra*******@gmail.com",
    type: "Email",
    icon: "email-outline",
    },
  ]
const extras = {
    action:'login',
    email: 'raph@turnkey.com',
    phone: '0711234567',
    username: 'raph@turnkey.com'
}

export class MockLocalStorageService {
  getItem = jest.fn().mockReturnValue(extras);
}

describe('VerificationComponent', () => {
  let component: VerificationComponent;
  let fixture: ComponentFixture<VerificationComponent>;
  let authServiceStub: AuthService;
  let utilServiceStub: UtilService;
  let localStorageServiceStub: LocalStorageService

  beforeAll(() => {
    const extras = {
    action:'login',
    email: 'raph@turnkey.com',
    phone: '0711234567',
    username: 'raph@turnkey.com'
  }
    localStorage.setItem('extras', JSON.stringify(extras))
  })

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerificationComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
      ]
    });
    fixture = TestBed.createComponent(VerificationComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.inject(AuthService);
    localStorageServiceStub = TestBed.inject(LocalStorageService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('On Channel Select', () => {
    const account: AuthVerification = {
      icon: "fa-mobile-retro",
      name: "0711********67",
      selected: true,
      type: "SMS",
    };

    const extra = { username: 'raph@turnkey.com' };

    jest.spyOn(localStorageServiceStub, 'getItem').mockReturnValueOnce(JSON.stringify(extra));
    jest.spyOn(authServiceStub, 'sentVerificationOtp').mockReturnValue(of(true));
    
    // component.onSelectAccount(account);
    // const button = fixture.debugElement.nativeElement.querySelector('.verify-button');
    // button.click();
    // fixture.detectChanges();
    component.onSelectAccount(account);

    expect(component.selectedAccount).toEqual(account);
    expect(authServiceStub.sentVerificationOtp.call).toBeTruthy();
    // expect(component.isLoading).toBe(true);
    // expect(authServiceStub.sentVerificationOtp).toHaveBeenCalledWith('raph@turnkey.com', 'sms');

    
  });
});
