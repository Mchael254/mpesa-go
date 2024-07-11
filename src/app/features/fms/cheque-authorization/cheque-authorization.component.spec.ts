import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeAuthorizationComponent } from './cheque-authorization.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FmsService } from '../services/fms.service';
import { of, throwError } from 'rxjs';
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../shared/services/auth.service";
import {DmsService} from "../../../shared/services/dms/dms.service";
import {SharedModule} from "../../../shared/shared.module";
import {AppConfigService} from "../../../core/config/app-config-service";
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeDetectorRef } from '@angular/core';

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "fms_services":  "fms",
      }
    };
  }
}

export class MockFmsService {
  validateOtp = jest.fn().mockReturnValue(of({}));
  generateOtp = jest.fn().mockReturnValue(of({}));
  signChequeMandate = jest.fn().mockReturnValue(of());
  getBankAccounts = jest.fn().mockReturnValue(of());
  getEftPaymentTypes = jest.fn().mockReturnValue(of());
  getEligibleAuthorizers = jest.fn().mockReturnValue(of());
  getSignedBy = jest.fn().mockReturnValue(of());
  getTransactionDetails = jest.fn().mockReturnValue(of());
  getEftMandateRequisitions = jest.fn().mockReturnValue(of());
  getChequeMandateRequisitions = jest.fn().mockReturnValue(of());

}

export class MockAuthService {
  getCurrentUser = jest.fn().mockReturnValue('testUser')
}

export class MockDmsService {

}

describe('ChequeAuthorizationComponent', () => {
  let component: ChequeAuthorizationComponent;
  let fixture: ComponentFixture<ChequeAuthorizationComponent>;
  let fmsServiceStub: FmsService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let authServiceStub: AuthService;
  let dmsServiceStub: DmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChequeAuthorizationComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        TableModule
      ],
      providers: [
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: FmsService, useClass: MockFmsService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: DmsService, useClass: MockDmsService }
      ]
    });
    fixture = TestBed.createComponent(ChequeAuthorizationComponent);
    component = fixture.componentInstance;
    fmsServiceStub = TestBed.inject(FmsService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    authServiceStub = TestBed.inject(AuthService);
    dmsServiceStub = TestBed.inject(DmsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
      // should initialize component with default values and forms
      it('should initialize component with default values and forms', () => {
        const formBuilder = new FormBuilder();
        const changeDetectorRef = { detectChanges: jest.fn() } as unknown as ChangeDetectorRef;
        const fmsService = {
          getBankAccounts: jest.fn().mockReturnValue(of({ data: [] })),
          getEftPaymentTypes: jest.fn().mockReturnValue(of({ data: [] }))
        } as unknown as FmsService;
        const spinnerService = { show: jest.fn(), hide: jest.fn() } as unknown as NgxSpinnerService;
        const globalMessagingService = { displayErrorMessage: jest.fn(), displaySuccessMessage: jest.fn() } as unknown as GlobalMessagingService;
        const authService = {
          getCurrentUser: jest.fn().mockReturnValue({ code: 1 })
        } as unknown as AuthService;
        const dmsService = {} as unknown as DmsService;

        const component = new ChequeAuthorizationComponent(
          formBuilder,
          changeDetectorRef,
          fmsService,
          spinnerService,
          globalMessagingService,
          authService,
          dmsService
        );

        component.ngOnInit();

        // expect(component.loggedInUser).toEqual({ code: 1 });
        expect(component.sortingForm).toBeDefined();
        expect(component.otpForm).toBeDefined();
        expect(component.tableEligibleAuthorizers).toBeDefined();
        expect(component.tableSignedBy).toBeDefined();
      });
          // should handle error when fetching bank accounts fails
    it('should handle error when fetching bank accounts fails', () => {
      const formBuilder = new FormBuilder();
      const changeDetectorRef = { detectChanges: jest.fn() } as unknown as ChangeDetectorRef;
      const fmsService = {
        getBankAccounts: jest.fn().mockReturnValue(throwError({ error: { msg: 'Error fetching bank accounts' } })),
        getEftPaymentTypes: jest.fn().mockReturnValue(of({ data: [] }))
      } as unknown as FmsService;
      const spinnerService = { show: jest.fn(), hide: jest.fn() } as unknown as NgxSpinnerService;
      const globalMessagingService = { displayErrorMessage: jest.fn(), displaySuccessMessage: jest.fn() } as unknown as GlobalMessagingService;
      const authService = {
        getCurrentUser: jest.fn().mockReturnValue({ code: 1 })
      } as unknown as AuthService;
      const dmsService = {} as unknown as DmsService;

      const component = new ChequeAuthorizationComponent(
        formBuilder,
        changeDetectorRef,
        fmsService,
        spinnerService,
        globalMessagingService,
        authService,
        dmsService
      );

      component.ngOnInit();

      expect(globalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Error fetching bank accounts');
    });
        // should fetch bank accounts on initialization
        it('should fetch bank accounts on initialization', () => {
          const fmsService = {
            getBankAccounts: jest.fn().mockReturnValue(of({ data: [] }))
          } as unknown as FmsService;
          const authService = {
            getCurrentUser: jest.fn().mockReturnValue({ code: 1 })
          } as unknown as AuthService;

          const component = new ChequeAuthorizationComponent(
            {} as FormBuilder,
            {} as ChangeDetectorRef,
            fmsService,
            {} as NgxSpinnerService,
            {} as GlobalMessagingService,
            authService,
            {} as DmsService
          );

          component.ngOnInit();

          expect(fmsService.getBankAccounts).toHaveBeenCalled();
        });
});
