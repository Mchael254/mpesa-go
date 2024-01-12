import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilService} from "../../../shared/services";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import { catchError } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  form: FormGroup;
  submitted = false;
  saveSuccess = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private globalMessagingService: GlobalMessagingService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Create verify details form
   * Sets email and phone number as required fields
   */
  createForm(){
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]]
      });
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() { return this.form.controls; }

  /**
   * Check if form is valid and verify account details
   * If form is valid, verify account details and route to change password page
   */
  onSubmit() {
    this.submitted = true;
    this.isLoading = true;

    if(this.form.valid){
      const email = this.f['email'].value;
      const phoneNo = this.f['phoneNumber'].value;
      let extras = {
        action: 'reset-password',
        email: email,
        username: null,
        accountToUse: email
      }
      this.sessionStorageService.setItem("extras", JSON.stringify(extras));

      this.authService.verifyAccount(email, phoneNo)
        .subscribe({
          next: (response) => {
            this.globalMessagingService.displaySuccessMessage('Success', response?.message )
            this.saveSuccess = true;
            this.router.navigate(['/auth/otp'], {queryParams: {referrer: 'password-reset'}});
            this.isLoading = false;
          },
          error: (err) => {
            let errorMessage = '';
            if (err.error.message) {
              errorMessage = err.error.message
            } else {
              errorMessage = err.message
            }
            this.globalMessagingService.displayErrorMessage('Error', errorMessage);
            this.isLoading = false;
          }
        })
    }
  }

}
