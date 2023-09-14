import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, ReplaySubject, of } from 'rxjs';

import { UserProfileComponent } from './user-profile.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { WebAdmin } from '../../../../shared/data/web-admin';
import { AccountContact } from '../../../../shared/data/account-contact';
import { ClientAccountContact } from '../../../../shared/data/client-account-contact';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';

const admin: WebAdmin = {
  id: 0,
  name: 'Admin',
  username: '',
  email: '',
  pinNumber: '',
  status: '',
  userType: '',
  telNo: '',
  phoneNumber: '',
  otherPhone: '',
  personelRank: '',
  countryCode: 0,
  townCode: 0,
  physicalAddress: '',
  postalCode: '',
  departmentCode: 0,
  activatedBy: '',
  updateBy: '',
  dateCreated: undefined,
  granter: 0,
  authorities: []
}

const agent: AccountContact = {
  acccCode: 0,
  acccName: '',
  acccOtherNames: '',
  acccEmailAddr: '',
  acccUsername: '',
  acccLoginAllowed: '',
  acccPwdChanged: '',
  acccPwdReset: '',
  acccDtCreated: '',
  acccStatus: '',
  acccLoginAttempts: 0,
  acccPersonelRank: '',
  acccLastLoginDate: '',
  acccCreatedBy: '',
  acccAccType: '',
  acccAccCode: 0,
  acccAgnCode: 0,
  authorities: []
}

const client: ClientAccountContact = {
  acwaCode: 0,
  acwaUsername: '',
  acwaLoginAllowed: '',
  acwaPwdChanged: '',
  acwaPwdReset: '',
  acwaLoginAttempts: 0,
  acwaPersonelRank: '',
  acwaDtCreated: '',
  acwaStatus: '',
  acwaLastLoginDate: '',
  acwaClntCode: 0,
  acwaCreatedBy: '',
  acwaName: '',
  acwaEmailAddrs: '',
  acwaType: '',
  acwaCountry: '',
  acwaIdRegNo: '',
  acwaSmsCode: '',
  acwaMobileNumber: '',
  acwaPassportNo: '',
  acwaEmailVerified: '',
  acwaSpecialClient: '',
  portalClient: null,
  authorities: [],
}


export class MockAuthService {
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public redirectUrl: '/home/dashboard';
  getCurrentUser = jest.fn()
  purgeAuth = jest.fn()
  changePassword = jest.fn().mockReturnValue(of(true));
  updateUserProfile = jest.fn().mockReturnValue(of(true));
}

export class MockUtilService {
  isUserAdmin = jest.fn();
  isUserAgent = jest.fn();
  isUserClient = jest.fn();
}

const extras = {
    action:'login',
    email: 'raph@turnkey.com',
    phone: '0711234567',
    username: 'raph@turnkey.com'
}

const loginDetails = {
  password: '1234567',
  username: 'raph@turnkey.com'
}

export class MockLocalStorageService {
  getItem = jest.fn().mockReturnValue(null);
}

export class MockMessageService {
  displayErrorMessage = jest.fn((summary,detail ) => {return});
  displaySuccessMessage = jest.fn((summary, detail) => { return });
  clearMessages = jest.fn();
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authServiceStub: AuthService;
  let utilServiceStub: UtilService;
  let localStorageServiceStub: LocalStorageService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UtilService, useClass: MockUtilService },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
        { provide: GlobalMessagingService, useClass: MockMessageService }
      ]
    });
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    authServiceStub = TestBed.inject(AuthService);
    utilServiceStub = TestBed.inject(UtilService);
    localStorageServiceStub = TestBed.inject(LocalStorageService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('component initial state', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.changePassForm).toBeDefined();
    expect(component.changePassForm.invalid).toBeTruthy();
    expect(component.userDetailsForm).toBeDefined();
    expect(component.userDetailsForm.invalid).toBeTruthy();
  });

  test('should have a userDetails form', () => {
    expect(component.userDetailsForm).toBeTruthy();
    expect(typeof component.userDetailsForm.controls).toBe('object');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('firstName');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('lastName');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('phoneNumber');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('id');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('pinNumber');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('email');
    expect(Object.keys(component.userDetailsForm.controls)).toContain('status');
  });

  test('should have a changePassword form', () => {
    expect(component.changePassForm).toBeTruthy();
    expect(typeof component.changePassForm.controls).toBe('object');
    expect(Object.keys(component.changePassForm.controls)).toContain('oldPassword');
    expect(Object.keys(component.changePassForm.controls)).toContain('newPassword');
    expect(Object.keys(component.changePassForm.controls)).toContain('confirmNewPassword');
  });

  test('password field validity', () => {
    let errors = {};
    let password = component.changePassForm.controls['oldPassword'];
    expect(password.valid).toBeFalsy();

    // password field is required
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    //set Password to something correct
    password.setValue("12345");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    //set Password to something correct
    password.setValue("1234567");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  test('newpassword field validity', () => {
    let errors = {};
    let newPassword = component.changePassForm.controls['newPassword'];
    expect(newPassword.valid).toBeFalsy();

    //newPassword field is required
    errors = newPassword.errors || {};
    expect(errors['required']).toBeTruthy();


    //set newPassword to something incorrect
    newPassword.setValue("1234");
    errors = newPassword.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeTruthy();

    //set newPassword to something correct
    newPassword.setValue("123456789");
    errors = newPassword.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['minlength']).toBeFalsy();
  });

  test('confirmpassword field validity', () => {
    let errors = {};
    let confirmPassword = component.changePassForm.controls['confirmNewPassword'];
    expect(confirmPassword.valid).toBeFalsy();

    //newPassword field is required
    errors = confirmPassword.errors || {};
    expect(errors['required']).toBeTruthy();

    //set confirmPassword to something correct
    confirmPassword.setValue("123456789");
    errors = confirmPassword.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  test('should get user details for admin', () => {
    jest.spyOn(utilServiceStub, 'isUserAdmin').mockReturnValue(true);
    jest.spyOn(authServiceStub, 'getCurrentUser').mockReturnValue(admin)
    component.ngOnInit();
    fixture.detectChanges();
    expect(authServiceStub.getCurrentUser.call).toBeTruthy();
    expect(utilServiceStub.isUserAdmin.call).toBeTruthy();
  });

  test('should get user details for agent', () => {
    jest.spyOn(utilServiceStub, 'isUserAgent').mockReturnValue(true);
    jest.spyOn(authServiceStub, 'getCurrentUser').mockReturnValue(agent)
    component.ngOnInit();
    fixture.detectChanges();
    expect(authServiceStub.getCurrentUser.call).toBeTruthy();
    expect(utilServiceStub.isUserAgent.call).toBeTruthy();
  });

  test('should get user details client', () => {
    jest.spyOn(utilServiceStub, 'isUserClient').mockReturnValue(true);
    jest.spyOn(authServiceStub, 'getCurrentUser').mockReturnValue(client)
    component.ngOnInit();
    fixture.detectChanges();
    expect(authServiceStub.getCurrentUser.call).toBeTruthy();
    expect(utilServiceStub.isUserAdmin.call).toBeTruthy();
  });

  test('updateUserDetails a form should update user details', () =>{
    expect(component.userDetailsForm.valid).toBeFalsy();
    const button = fixture.debugElement.nativeElement.querySelector('#updateUserButton');
    button.click();
    fixture.detectChanges();
    expect(authServiceStub.updateUserProfile).toHaveBeenCalled();
  });

  test('should open the change password modal when button is clicked', () => {
    // Find the button element that triggers the modal
    const button = fixture.debugElement.nativeElement.querySelector('#passChange');

    // Simulate a click event on the button
    button.click();

    // Assert that the modal content is present in the DOM
    const modal = fixture.debugElement.nativeElement.querySelector('#changePasswordModal');
    expect(modal).toBeTruthy();

    // Optionally, you can check the presence of form elements, etc.

    // You can also test form submissions here by filling out the form fields
    // and simulating a click on the submit button.

    // For form submission testing, you can spy on the component's method
    // and check whether it's called with the expected data.
  });

  test('onNewPass a form should change password', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#passChange');
    button.click();
    const modal = fixture.debugElement.nativeElement.querySelector('#changePasswordModal');
    const newPassword = '123456789';
    // jest.spyOn(localStorageServiceStub, 'getItem').mockImplementation((key: string) => {
    //   if (key === 'extras') {
    //     return JSON.stringify(extras);
    //   } else if (key === 'loginDetails') {
    //     return JSON.stringify(loginDetails);
    //   }
    //   return null;
    // });
    jest.spyOn(localStorageServiceStub, 'getItem').mockReturnValueOnce(JSON.stringify(extras));
    jest.spyOn(localStorageServiceStub, 'getItem').mockReturnValueOnce(JSON.stringify(loginDetails));
    component.changePassForm.controls['newPassword'].setValue('123456789');
    component.changePassForm.controls['oldPassword'].setValue('1234567');
    
    // jest.spyOn(authServiceStub, 'changePassword').mockReturnValue(of('Success'));
    // jest.spyOn(messageServiceStub, 'clearMessages');
    // jest.spyOn(messageServiceStub, 'displaySuccessMessage');
    // jest.spyOn(authServiceStub, 'purgeAuth');

    const saveButton = fixture.debugElement.nativeElement.querySelector('#saveNewPassButton');
    saveButton.click();
    fixture.detectChanges();

    // component.onNewPassSave();

    expect(modal).toBeTruthy();
    expect(component.submitted).toBe(true);
    expect(localStorageServiceStub.getItem).toHaveBeenCalledTimes(2);
    expect(localStorageServiceStub.getItem).toHaveBeenCalledWith('extras');
    expect(localStorageServiceStub.getItem).toHaveBeenCalledWith('details');
    expect(authServiceStub.changePassword).toHaveBeenCalledWith(extras.email, 'Y', '123456789', '1234567');
    expect(messageServiceStub.clearMessages).toHaveBeenCalled();
    expect(messageServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Successfully Updated your Password!');
    expect(authServiceStub.purgeAuth).toHaveBeenCalledWith(true);
  });
});
