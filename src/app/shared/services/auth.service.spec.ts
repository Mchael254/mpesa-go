// import { APP_BASE_HREF } from '@angular/common';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
// import { UserCredential } from 'src/app/pages/shared';
// import {AppConfigService} from "../../config/app-config-service";
// import { AccountContact } from '../data/account-contact';
// import { ClientAccountContact } from '../data/client-account-contact';
// import { WebAdmin } from '../data/web-admin';

// import { AuthService } from './auth.service';
// import { JwtService } from './jwt.service';
// import { BrowserStorage } from './storage';
// import { UtilService } from './util.service';


// export class MockAppConfigService {
//   get config() {
//     return {
//       contextPath: {
//         "accounts_services": "crm",
//         "users_services": "user",
//         "auth_services": "oauth"
//       },
//     };
//   }
// }

// export class MockUtilService {
//   isUserClient = jest.fn();
//   isUserAgent = jest.fn();
//   isUserAdmin = jest.fn();
// }

// const MockBrowserStorage = {
//   getObj: jest.fn(),
//   storeObj: jest.fn()
// }

// const MockJwtService = {
//   getToken: jest.fn(),
//   destroyToken: jest.fn(),
//   destroyRefreshToken: jest.fn(),
//   getRefreshToken: jest.fn(),
// }


// describe('AuthService', () => {
//   let service: AuthService;
//   let httpTestingController: HttpTestingController;
//   let appConfigService: AppConfigService;
//   let utilServiceStub: UtilService;
//   let browserStorage: BrowserStorage;
//   let jwtServiceStub: JwtService;
//   let user: UserCredential = {
//     password: 'client@turnkey.com',
//     username: '1234567'
//   }
//   let routerStub: Router;

//   let agent: AccountContact = {
//     acccCode: 0,
//     acccName: '',
//     acccOtherNames: '',
//     acccEmailAddr: '',
//     acccUsername: '',
//     acccLoginAllowed: '',
//     acccPwdChanged: '',
//     acccPwdReset: '',
//     acccDtCreated: '',
//     acccStatus: '',
//     acccLoginAttempts: 0,
//     acccPersonelRank: '',
//     acccLastLoginDate: '',
//     acccCreatedBy: '',
//     acccAccType: '',
//     acccAccCode: 0,
//     acccAgnCode: 0,
//     authorities: []
//   };

//   let admin: WebAdmin = {
//     id: 0,
//     name: '',
//     username: '',
//     email: '',
//     status: '',
//     userType: '',
//     telNo: '',
//     phoneNumber: '',
//     otherPhone: '',
//     personelRank: '',
//     countryCode: 0,
//     townCode: 0,
//     physicalAddress: '',
//     postalCode: '',
//     departmentCode: 0,
//     activatedBy: '',
//     updateBy: '',
//     dateCreated: undefined,
//     granter: 0,
//     authorities: []
//   }

//   let client: ClientAccountContact = {
//     acwaCode: 123,
//     acwaUsername: '',
//     acwaLoginAllowed: '',
//     acwaPwdChanged: '',
//     acwaPwdReset: '',
//     acwaLoginAttempts: 123,
//     acwaPersonelRank: '',
//     acwaDtCreated: '',
//     acwaStatus: '',
//     acwaLastLoginDate: '',
//     acwaClntCode: 123,
//     acwaCreatedBy: '',
//     acwaName: '',
//     acwaEmailAddrs: '',
//     acwaType: '',
//     acwaCountry: '',
//     acwaIdRegNo: '',
//     acwaSmsCode: '',
//     acwaMobileNumber: '123',
//     acwaPassportNo: '',
//     acwaEmailVerified: '',
//     acwaSpecialClient: '',
//     portalClient: null,

//     // authorities
//     authorities: null,
//   };

//   // const defaultLocation = window.location;
//   // const locationReload = () => {window.location.reload()}

//   beforeEach(() => {

//     TestBed.configureTestingModule({
//       imports:[ HttpClientTestingModule ],
//       providers: [
//         AuthService,
//         { provide: BrowserStorage, useValue: MockBrowserStorage },
//         { provide: APP_BASE_HREF, useValue: '/' },
//         { provide: AppConfigService, useClass: MockAppConfigService },
//         { provide: UtilService, useClass: MockUtilService },
//         { provide: JwtService, useValue: MockJwtService },
//         { provide: Router, useValue: { url: '/' }}
//       ]
//     });
//     service = TestBed.inject(AuthService);
//     httpTestingController = TestBed.inject(HttpTestingController);
//     utilServiceStub = TestBed.inject(UtilService);
//     browserStorage = TestBed.inject(BrowserStorage);
//     jwtServiceStub = TestBed.inject(JwtService);
//     appConfigService = TestBed.inject(AppConfigService);
//     routerStub = TestBed.inject(Router);
//   });

//   beforeEach(() => {
//     jest.spyOn(jwtServiceStub, 'getToken').mockReturnValue('token');
//     jest.spyOn(jwtServiceStub, 'destroyToken').mockReturnValue();
//     jest.spyOn(jwtServiceStub, 'destroyRefreshToken').mockReturnValue();
//     jest.spyOn(browserStorage, 'storeObj').mockReturnValue();
//     jest.spyOn(browserStorage, 'getObj').mockReturnValue({});
//     service.redirectUrl = 'www.turnkey.com';
//     // service.isLoadingUserSubject = new BehaviorSubject<boolean>(false);
//   })

//   beforeAll(() => {
//     Object.defineProperty(window, 'location', {
//       configurable: true,
//       value: { reload: jest.fn() }
//     })
//   })

//   afterAll(() => {
//     // httpTestingController.verify();
//     // Object.defineProperty(window, 'location', { configurable: true, value: defaultLocation })
//   });

//   test('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   test('should populate', () => {
//     const baseUrl = appConfigService.config.contextPath.users_services;
//     service.populate();
//     const req = httpTestingController.expectOne(`/${baseUrl}/administration/users/profile`);
//     expect(req.request.method).toBe('GET');

//     req.flush({});
//   });

//   test('should not populate (call purgeAuth())', () => {
//     jest.spyOn(jwtServiceStub, 'getToken').mockReturnValue(null);
//     service.populate();
//     expect(service.purgeAuth.call).toBeTruthy();
//   })


//   test('should set auth >> ADMIN', () => {
//     jest.spyOn(utilServiceStub, 'isUserAdmin').mockReturnValue(true);
//     jest.spyOn(browserStorage, 'storeObj').mockReturnValue();
//     service.setAuth(admin);
//     expect(browserStorage.storeObj).toBeTruthy();
//     expect(browserStorage.storeObj).toBeCalledWith('activeUser', 'ADMIN');
//   });

//   test('should set auth AGENT', () => {
//     jest.spyOn(utilServiceStub, 'isUserAdmin').mockReturnValue(false);
//     jest.spyOn(utilServiceStub, 'isUserAgent').mockReturnValue(true);
//     service.setAuth(agent);
//     expect(browserStorage.storeObj).toBeTruthy();
//     expect(browserStorage.storeObj).toBeCalledWith('activeUser', 'AGENT');
//   })

//   test('should set auth CLIENT', () => {
//     jest.spyOn(utilServiceStub, 'isUserAdmin').mockReturnValue(false);
//     jest.spyOn(utilServiceStub, 'isUserAgent').mockReturnValue(false);
//     jest.spyOn(utilServiceStub, 'isUserClient').mockReturnValue(true);
//     service.setAuth(client);
//     expect(browserStorage.storeObj).toBeTruthy();
//     expect(browserStorage.storeObj).toBeCalledWith('activeUser', 'CLIENT');
//   })

//   test('should purge auth', () => {
//     const baseUrl = appConfigService.config.contextPath.auth_services;
//     service.isLoadingUserSubject.next(true);
//     service.purgeAuth();
//     const req = httpTestingController.expectOne(`/${baseUrl}/revoke-token`);
//     expect(req.request.method).toBe('GET');

//     req.flush({});
//     // todo: write assertions
//   })

//   test('should attemp refresh token', () => {
//     service.attemptRefreshToken();
//     expect(service.attemptRefreshToken.call).toBeTruthy();
//   })

//   test('should authenticate user', () => {
//     // service.authenticateUser(user);
//     // expect(service.authenticateUser.call).toBeTruthy();
//   })

//   test('should sentVerificationOtp', () => {
//     service.sentVerificationOtp('client@turnkey.com', 'email');
//     expect(service.sentVerificationOtp.call).toBeTruthy();
//   })

//   test('should verifyResetOtp', () => {
//     service.verifyResetOtp('client@turnkey.com', 1234);
//     expect(service.verifyResetOtp.call).toBeTruthy();
//   })

//   test('should getCurrentUser', () => {
//     service.getCurrentUser();
//     expect(service.getCurrentUser.call).toBeTruthy();
//   })

//   test('should getCurrentUserName', () => {
//     service.getCurrentUserName();
//     expect(service.getCurrentUserName.call).toBeTruthy();
//   })

//   test('should update user', () => {
//     // this service is not implemented
//   })

//   test('should getUserDetails', () => {
//     const baseUrl = appConfigService.config.contextPath.accounts_services;
//     service.getUserDetails();
//     const req = httpTestingController.expectOne(`/${baseUrl}/api/me`);
//     expect(req.request.method).toBe('GET');

//     req.flush({});
//     // todo: write assertions
//   })

//   test('should resetPassword', () => {
//     service.resetPassword('client@turnkey.com', '1234', '1234567', 'Y');
//     // todo: write assertions
//   })

//   test('should changePassword', () => {
//     // const baseUrl = appConfigService.config.contextPath.auth_services;
//     service.changePassword('client@turnkey.com', '1234', '1234567', 'Y');
//     // const req = httpTestingController.expectOne(`/${baseUrl}/new-password`);
//     // expect(req.request.method).toBe('POST');

//     // req.flush('success');
//     // todo: write assertions
//   })


// });
