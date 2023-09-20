import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpComponent } from './otp.component';
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AccountContact} from "../../data/account-contact";
import {ClientAccountContact} from "../../data/client-account-contact";
import {WebAdmin} from "../../data/web-admin";
import {AuthService} from "../../services/auth.service";
import {MessageService} from "primeng/api";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {createSpyObj} from "jest-createspyobj";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";

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

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
  getCurrentUserName(): string {
    return 'WADUVAGA';
  }
  sentVerificationOtp(): Observable<boolean> {
    return new Observable<true>()
  }
}

describe('OtpComponent', () => {
  const localStorageServiceStub = createSpyObj('LocalStorageService',[
    'getItem', 'setItem']);

  let component: OtpComponent;
  let fixture: ComponentFixture<OtpComponent>;

  beforeEach(() => {
    const otpChannel = {
      value: '',
      channel: 'email',
      email: 'johndoe@example.com'
    }
    jest.spyOn(localStorageServiceStub, 'setItem' ).mockReturnValue(null)
    jest.spyOn(localStorageServiceStub, 'getItem' ).mockReturnValue(otpChannel)

    TestBed.configureTestingModule({
      declarations: [OtpComponent],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute},
        { provide: AuthService, useClass: MockAuthService },
        { provide: LocalStorageService, useValue: localStorageServiceStub },
        MessageService
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(OtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  test('should create', () => {
    expect(component).toBeTruthy();
  });

  /*test('should simulate keyUp event', () => {
    const input = fixture.debugElement.nativeElement.querySelector('#keyUpEvent');
    input.triggerEventHandler('keyup', null);
    fixture.detectChanges();
  });*/

  test('should verify OTP', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#onVerify');
    button.click()
  });

  test('should resend OTP', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#resendOTP');
    button.click()
  });

});
