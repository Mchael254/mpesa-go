import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmedValidator } from '../../../../core/validators/confirmed.validator';
import { AccountContact } from '../../../../shared/data/account-contact';
import { ClientAccountContact } from '../../../../shared/data/client-account-contact';
import { WebAdmin } from '../../../../shared/data/web-admin';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserDetailsDTO } from '../../data/user-details';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import {SetupsParametersService} from "../../../../shared/services/setups-parameters.service";
import {CountryService} from "../../../../shared/services/setups/country/country.service";
import {CountryDto} from "../../../../shared/data/common/countryDto";



const log = new Logger("UserDetailsComponent")

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  public userDetailsForm: FormGroup

  public user: AccountContact | ClientAccountContact | WebAdmin;

  changePassForm: FormGroup;
  submitted = false;
  changeSuccess = false;
  formDisabled: boolean = true;
  // showTabs: boolean;
  showTabs = true;
  storedOldPass: string;
  phoneNumberRegex:string;
  public countriesCode : CountryDto[];

    constructor(
      private fb: FormBuilder,
      private utilService: UtilService,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private localStorageService: LocalStorageService,
      private messageService: GlobalMessagingService,
      private setupsParameterService: SetupsParametersService,
      private countryService: CountryService,
    ) {
      this.route.queryParams.subscribe((params) => {
        if (params['showTabs'] === 'false') {
          this.showTabs = false;
        }
      });
    }

 /**
  * The ngOnInit function initializes the component by creating a user details form, getting user
  * details, and creating a change password form with validation.
  */
  ngOnInit(): void {
   this.fetchCountries();
    this.createUserDetailsForm();
    this.getUserDetails();
    this.storedOldPass = this.localStorageService.getItem("detailsM");


    this.changePassForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required],
    }, {
      validator: ConfirmedValidator('newPassword', 'confirmNewPassword')
    });

    // this.route.queryParams.subscribe(params => {
    //   this.showTabs = params['showTabs'] !== 'false';
    // });
  }

  /**
   * The function `createUserDetailsForm()` creates a form with fields for first name, last name, phone
   * number, ID, pin number, email, and status, with some fields disabled and all fields required.
   */
  createUserDetailsForm() {
    this.userDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      countryCode: ['', Validators.required],
      // id: ['', Validators.required],
      id: [{ value: '', disabled: true }, Validators.required],
      // pinNumber: ['', Validators.required],
      pinNumber: [{ value: '', disabled: true }, Validators.required],
      // email: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      // status: ['', Validators.required]
      status: [{ value: '', disabled: true }, Validators.required],
    });

    let name = 'SMS_NO_FORMAT';
    this.setupsParameterService.getParameters(name)
      .subscribe((data) => {
        data.forEach((field) => {
          if (field.name === 'SMS_NO_FORMAT') {
            this.phoneNumberRegex = field.value;
            this.userDetailsForm.get('phoneNumber')?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
            this.userDetailsForm.get('phoneNumber')?.updateValueAndValidity();

          }
          log.info('parameters>>>', this.phoneNumberRegex)
        });
      });
  }

 /**
  * The function `getUserDetails()` retrieves and populates user details based on their role (admin,
  * agent, or client).
  */
  getUserDetails() {
    this.user = this.authService.getCurrentUser();
    // this.user = this.localStorageService.getItem("loginUserProfile")
   log.info('user>>', this.user)

    if(this.utilService.isUserAdmin(this.user)) {
      const names = this.user.name.split(' ');
      const firstName = names[0];
      const otherNames = names.slice(1).join(' ');
      this.userDetailsForm.patchValue({
        id: this.user.id,
        firstName: firstName,
        lastName: otherNames,
        // phoneNumber: this.user.phoneNumber,
        pinNumber: this.user.pinNumber,
        email: this.user.emailAddress,
        status: this.user.status
      })
      this.patchPhoneNumber(this.user.phoneNumber, 'countryCode', 'phoneNumber');
    } else if (this.utilService.isUserAgent(this.user)) {

    } else if(this.utilService.isUserClient(this.user)) {
      log.debug(`user type is client`);
    }
  }

/**
 * The function `updateUserDetails` updates the user details by getting the form values, preparing a
 * user details DTO, and calling the `updateUserProfile` method of the `authService`.
 */
  updateUserDetails() {
  this.submitted = true;
  this.userDetailsForm.get('phoneNumber').markAsTouched();
  if (this.userDetailsForm.invalid) {
    // this.messageService.displayInfoMessage('Failed', 'phone number format: 0712345678');
    log.info('update user form invalid')
    return;
  }

    const userDetailsFormValues = this.userDetailsForm.getRawValue();

    const primaryCountryCode = userDetailsFormValues.countryCode;
    const primaryPhoneNumber = userDetailsFormValues.phoneNumber;


    const primaryCombinedPhoneNumber = this.extractPhoneNumber(primaryCountryCode, primaryPhoneNumber);
    log.debug("User details->", userDetailsFormValues, userDetailsFormValues.countryCode)
    //preparing user details dto
    const userDetails: UserDetailsDTO = {
      firstName: userDetailsFormValues.firstName,
      idNumber: userDetailsFormValues.idNumber,
      lastName: userDetailsFormValues.lastName,
      phoneNo: primaryCombinedPhoneNumber,
      pinNumber: userDetailsFormValues.pinNumber,
      status: userDetailsFormValues.accountStatus
    }
    this.authService.updateUserProfile(userDetails)
      .subscribe({
        next:() => {
          this.changeSuccess = true;
          this.messageService.clearMessages();
          this.messageService.displaySuccessMessage('Success', 'Successfully Updated User Details!');
          this.localStorageService.setItem('loginUserProfile', userDetails);
          setTimeout(() => {
            // this.router.navigate(['/home/dashboard']);
            this.getUserDetails();
          }, 3000);
        },
      })
  }

 /**
  * The function returns the controls of the changePassForm.
  * @returns The function `f()` is returning the `controls` property of the `changePassForm` object.
  */
  get f() { return this.changePassForm.controls; }

  get u() { return this.userDetailsForm.controls; }

 /**
  * The function `onNewPassSave()` is used to change the password for a user and performs validation
  * checks to ensure the entered old password matches the stored old password and that the new password
  * is not the same as the old password.
  */
  onNewPassSave() {
    const extras = this.localStorageService.getItem("extras");
    // const loginDetails = this.localStorageService.getItem("detailsM");
    const username = this.user.emailAddress;
    this.submitted = true;

    if (!this.changePassForm.invalid) {
      this.formDisabled = false;
      let enteredOldPass = this.changePassForm.controls['oldPassword'].value;
      let newPass = this.changePassForm.controls['newPassword'].value;
      // let storedOldPass = loginDetails.password;

      if (enteredOldPass === this.storedOldPass) {
        // The entered old password matches the stored old password
        if (enteredOldPass !== newPass) {
          // The new password is not the same as the old password, proceed with changing the password
          this.authService.changePassword(username, "Y", newPass, enteredOldPass).subscribe({
            next: () => {
              this.messageService.clearMessages();
              this.messageService.displaySuccessMessage('Success', 'Successfully Updated your Password!');
              setTimeout(() => {
                this.authService.purgeAuth(true);
                // this.router.navigate(['/home/Account/Details']);
              }, 3000);
            },
            error: err => console.log(err)
          });
        } else {
          // The new password is the same as the old password, display an error message
          this.messageService.displayErrorMessage('Error', 'New password cannot be the same as the old password!');
        }
      } else {
        // The entered old password does not match the stored old password, display an error message
        this.messageService.displayErrorMessage('Error', 'Invalid old password!');
      }
    }
  }

  fetchCountries(){
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countriesCode = data;
      });
  }

  private patchPhoneNumber(phoneNumber: string, countryCodeControlName: string, phoneControlName: string) {
    if (phoneNumber) {
      // Check if the phone number starts with '+'
      const isInternational = phoneNumber.startsWith('+');

      let countryCode, number;

      if (isInternational) {
        // International format: +254 20 278 2000
        countryCode = phoneNumber.substring(0, 4);
        number = phoneNumber.substring(4).replace(/\D/g, ''); // Remove non-numeric characters
      } else {
        // Local format: 020 278 2000
        countryCode = ''; // Set an empty string for local format
        number = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
      }

      this.userDetailsForm.get(countryCodeControlName).setValue(countryCode);
      this.userDetailsForm.get(phoneControlName).setValue(number);
    } else {
      this.userDetailsForm.get(countryCodeControlName).setValue('');
      this.userDetailsForm.get(phoneControlName).setValue('');
    }
  }
  private extractPhoneNumber(countryCode: string, phoneNumber: string): string {
    if (!countryCode.startsWith('+')) {
      countryCode = '+' + countryCode;
    }

    // Add logic to check if the phone number is in international or local format
    const isInternational = phoneNumber.startsWith('+');

    if (isInternational) {
      // If it's already in international format, just return it
      return countryCode + phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    } else {
      // If it's in local format, assume a default country code or handle it as needed
      const defaultCountryCode = '+254'; // You may adjust this based on your requirements
      return defaultCountryCode + phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    }
  }
}
