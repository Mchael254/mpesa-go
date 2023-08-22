import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilService} from "../../../shared/services";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {ConfirmedValidator} from "../../../core/validators/confirmed.validator";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  form: FormGroup;
  submitted = false;
  public errorOccurred = false;
  public errorMessage: string = undefined;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              public utilService: UtilService,
              public globalMessagingService: GlobalMessagingService,
              private sessionStorageService: SessionStorageService) { }

  /**
   * Initialize component by:
   * 1. Creating the form
   * 2. Setting the form validators
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group({
        // password: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmedValidator('newPassword', 'confirmPassword')
      }
    );
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() { return this.form.controls; }

  /**
   * Save the password details if form is valid and route to login page
   */
  onSave() {
    const extras = JSON.parse(this.sessionStorageService.getItem("extras"));
    const username = extras.username;
    const email = extras.email;
    // let tempUser = sessionStorage.getItem('tempUser');
    this.submitted = true;

    if (this.form.valid) {
      // let pass = this.form.controls['password'].value;
      let newPass = this.form.controls['newPassword'].value;
      let confirmPass = this.form.controls['confirmPassword'].value;

      this.authService.resetPassword(username,  newPass, "N", email )
        .subscribe(data=>{
          if(data==true) {
            // this.changeSuccess = true;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated your password' );

            setTimeout(() => {
              this.router.navigate(['/auth/']);
            }, 3000);
          }
          else{
            this.errorOccurred = false;
            this.errorMessage = "Something went wrong.Please try Again";
            this.globalMessagingService.displayErrorMessage('Error', 'Something went wrong.Please try Again');
          }
        })
    }
  }

}
