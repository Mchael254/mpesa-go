import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {UtilService} from "../../../shared/services";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{

  form: FormGroup;
  submitted = false;
  saveSuccess = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private globalMessagingService: GlobalMessagingService,
    public utilService: UtilService,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', [Validators.required]]
      });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

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
            setTimeout(() => {
              this.router.navigate(['/auth/otp'],
                {queryParams: {referrer: 'password-reset'}});
            }, 3000);
          },
          //error: error => console.log(error)
        })
    }
  }

}
