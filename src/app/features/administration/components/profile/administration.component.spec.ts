import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmedValidator } from 'src/app/core/validators/confirmed.validator';
import { AccountContact } from 'src/app/shared/data/account-contact';
import { ClientAccountContact } from 'src/app/shared/data/client-account-contact';
import { WebAdmin } from 'src/app/shared/data/web-admin';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { UserDetailsDTO } from '../../data/user-details';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';



const log = new Logger("UserDetailsComponent")

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent {
  public userDetailsForm: FormGroup

  public user: AccountContact | ClientAccountContact | WebAdmin;

  changePassForm: FormGroup;
  submitted = false;
  changeSuccess = false;
  formDisabled: boolean = true;
  // showTabs: boolean;
  showTabs = true;

    constructor(
      private fb: FormBuilder,
      private utilService: UtilService,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute,
      private localStorageService: LocalStorageService,
      private messageService: MessageService
    ) {
      this.route.queryParams.subscribe((params) => {
        if (params['showTabs'] === 'false') {
          this.showTabs = false;
        }
      });
    }

  ngOnInit(): void {
    this.createUserDetailsForm();
    this.getUserDetails();

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

  createUserDetailsForm() {
    this.userDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      // id: ['', Validators.required],
      id: [{ value: '', disabled: true }, Validators.required],
      // pinNumber: ['', Validators.required],
      pinNumber: [{ value: '', disabled: true }, Validators.required],
      // email: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      // status: ['', Validators.required]
      status: [{ value: '', disabled: true }, Validators.required],
    });
  }

  getUserDetails() {
    // this.user = this.authService.getCurrentUser();
    this.user = this.localStorageService.getItem("loginUserProfile")


    if(this.utilService.isUserAdmin(this.user)) {
      const names = this.user.name.split(' ');
      const firstName = names[0];
      const otherNames = names.slice(1).join(' ');
      this.userDetailsForm.patchValue({
        id: this.user.id,
        firstName: firstName,
        lastName: otherNames,
        phoneNumber: this.user.phoneNumber,
        pinNumber: this.user.pinNumber,
        email: this.user.emailAddress,
        status: this.user.status
      })
    } else if (this.utilService.isUserAgent(this.user)) {

    } else if(this.utilService.isUserClient(this.user)) {
      log.debug(`user type is client`);
    }
  }

  updateUserDetails() {
    const userDetailsFormValues = this.userDetailsForm.getRawValue();
    log.debug("User details->", userDetailsFormValues)
    //preparing user details dto
    const userDetails: UserDetailsDTO = {
      firstName: userDetailsFormValues.firstName,
      idNumber: userDetailsFormValues.idNumber,
      lastName: userDetailsFormValues.lastName,
      phoneNo: userDetailsFormValues.phoneNumber,
      pinNumber: userDetailsFormValues.pinNumber,
      status: userDetailsFormValues.accountStatus
    }
    this.authService.updateUserProfile(userDetails)
      .subscribe({
        next:() => {
          this.changeSuccess = true;
          this.messageService.clear();
          this.messageService.add({severity: 'success', summary:'Success', detail:'Successfully updated User Details'});
          setTimeout(() => {
            // this.router.navigate(['/home/dashboard']);
          }, 3000);
        },
      })
  }

  get f() { return this.changePassForm.controls; }

  onNewPassSave() {
    const extras = JSON.parse(this.localStorageService.getItem("extras"));
    const loginDetails = JSON.parse(this.localStorageService.getItem("details"));
    const username = extras.email;
    this.submitted = true;

    if (!this.changePassForm.invalid) {
      this.formDisabled = false;
      let enteredOldPass = this.changePassForm.controls['oldPassword'].value;
      let newPass = this.changePassForm.controls['newPassword'].value;
      let storedOldPass = loginDetails.password;

      if (enteredOldPass === storedOldPass) {
        // The entered old password matches the stored old password
        if (enteredOldPass !== newPass) {
          // The new password is not the same as the old password, proceed with changing the password
          this.authService.changePassword(username, "Y", newPass, enteredOldPass).subscribe({
            next: () => {
              this.messageService.clear();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'Successfully updated your password'});
              setTimeout(() => {
                this.authService.purgeAuth(true);
                // this.router.navigate(['/home/Account/Details']);
              }, 3000);
            },
            error: err => console.log(err)
          });
        } else {
          // The new password is the same as the old password, display an error message
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'New password cannot be the same as the old password'});
        }
      } else {
        // The entered old password does not match the stored old password, display an error message
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Invalid old password'});
      }
    }
  }

}
