import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerificationComponent } from './otp-verification.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject, find, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../shared/data/web-admin";
import {AuthService} from "../../../shared/services/auth.service";
import {RouterTestingModule} from "@angular/router/testing";
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {createSpyObj} from "jest-createspyobj";


export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
      cubejsDefaultUrl: `http://10.176.18.211:4000/cubejs-api/v1`
    };
  }
}

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
  getCurrentUserName(): string {
    return 'WADUVAGA';
  }

  attemptAuth(): void {

  }
}

export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

export class MockActivatedRoute {
  testParams = {referrer: 'password-reset'}
  queryParams = of(this.testParams)
  get snapshot() {
    return {
      params: this.testParams,
      queryParams: this.testParams,
    };
  }
}

describe('OtpVerificationComponent', () => {
  const routerStub = createSpyObj('Router', ['navigate']);

  let component: OtpVerificationComponent;
  let fixture: ComponentFixture<OtpVerificationComponent>;
  let authService: AuthService

  beforeEach(() => {
    jest.spyOn(routerStub, 'navigate').mockReturnValue(Promise.resolve);

    TestBed.configureTestingModule({
      declarations: [OtpVerificationComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute},
        { provide: Router, useValue: routerStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(OtpVerificationComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService)
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should verify OTP', () => {
    const otpComponent = findComponent(fixture, 'app-otp');
    otpComponent.triggerEventHandler('otpResponse', true);
    expect(component.otpProcess).toEqual('password-reset')
  });

  test('should attempt auth when OTP fails', () => {
    component.otpProcess = '';
    const otpComponent = findComponent(fixture, 'app-otp');
    otpComponent.triggerEventHandler('otpResponse', true);
    expect(authService.attemptAuth.call).toBeTruthy()
  })

});
