import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { UtilService } from 'src/app/shared/services';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  showPassword: boolean = false;
  expiryMessage: string = '';
  public errorOccurred = false;
  public errorMessage: string = '';
  @Output()
  errMsgsEvent = new EventEmitter<Message[]>(true);
  public isAuthenticated$!: Observable<boolean>;
  public rememberMe: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    public utilService: UtilService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.isAuthenticated$ = this.authService.isAuthenticated;
    // Set default values for login form fields from local storage
    const loginDetails = JSON.parse(localStorage.getItem('loginDetails')|| '');
    if (loginDetails) {
      this.loginForm.patchValue({
        username: loginDetails.username,
        password: loginDetails.password,
        rememberMe: true
      });
    }
  }
  createForm() {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: ['']
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  authAttempt() {
  //   this.errorOccurred = false;
  //   this.errorMessage = '';

  //   const rawData = this.loginForm.getRawValue();
  //   const authenticationData: UserCredential = {
  //     username: rawData.username,
  //     password: rawData.password,
    };

  //   this.authService.authenticateUser(authenticationData, (data) => {
  //     // log.info(`Pushing Authentication response ${JSON.stringify(data)}`);
  //     if(data != null){
  //       let message: string = data.message;
  //       this.expiryMessage = message;
  //       if (data.accountStatus === true && data.emailAddress != null && this.rememberMe === true) {
  //         localStorage.clear();
  //         const loginDetails: UserCredential = {
  //           password: authenticationData.password,
  //           username: authenticationData.username,
  //         };
  //         const extras = {
  //           action: 'login',
  //           phone: data.phoneNumber,
  //           email: data.emailAddress,
  //           username: loginDetails.username
  //         };
  //         localStorage.setItem('details', JSON.stringify(loginDetails));
  //         localStorage.setItem('extras', JSON.stringify(extras));
  //         // this.router.navigate(['/auth/otp-verification'])

  //         if(message.includes('will expire')){
  //           log.info(`Expiry Message: ${this.expiryMessage}`);
  //           this.expiryMessage = message;

  //           $("#passwordModal").modal('show');
  //           log.info('Show Reset Password Modal')
  //         }
  //         else{
  //           log.info('No error or expiry message ');
  //           log.info('Routing to OTP Verification Page')
  //           this.router.navigate(['/auth/verify'])
  //             .then(r => {
  //             });
  //         }

  //         // this.router.navigate(['/auth/verify'])
  //         //   .then(r => {
  //         //   });
  //       }else{
  //         /*ToDo: Implement password expired here*/
  //         this.errorOccurred = true;
  //         this.errorMessage = 'Error Occured, please try again';
  //         this.cdr.detectChanges()
  //       }
  //     }
  //   },(msg) => {
  //     log.info(`Pushing error message ${JSON.stringify(msg)}`);
  //     if(msg != null){
  //       this.errorOccurred = true;
  //       this.errorMessage = msg.detail;
  //       log.debug('Reached here',this.errorOccurred, this.errorMessage);
  //       this.cdr.detectChanges()
  //     }
  //   });

  // }

// authAttempt() {
//     this.errorOccurred = false;
//     this.errorMessage = '';

//     const rawData = this.loginForm.getRawValue();
//     const authenticationData: UserCredential = {
//       username: rawData.username,
//       password: rawData.password,
//     };

//     this.authService.authenticateUser(authenticationData, (data) => {
//       if(data != null){
//         let message: string = data.message;
//         this.expiryMessage = message;
//         if (data.accountStatus ===true && data.emailAddress != null) {
//           if (this.loginForm.get('rememberMe').value) {
//             // Store login details in local storage
//             localStorage.setItem('loginDetails', JSON.stringify(authenticationData));
//           } else {
//             // Remove login details from local storage
//             localStorage.removeItem('loginDetails');
//           }

//           // localStorage.clear();
//           const loginDetails: UserCredential = {
//             password: authenticationData.password,
//             username: authenticationData.username,
//           };
//           const extras = {
//             action: 'login',
//             phone: data.phoneNumber,
//             email: data.emailAddress,
//             username: authenticationData.username
//           };
//           localStorage.setItem('details', JSON.stringify(loginDetails));
//           localStorage.setItem('extras', JSON.stringify(extras));

//           if(message.includes('will expire')){
//             // log.info(`Expiry Message: ${this.expiryMessage}`);
//             this.expiryMessage = message;

//             // $("#passwordModal").modal('show');
//             // log.info('Show Reset Password Modal')
//           }
//           else{
//             // log.info('No error or expiry message ');
//             // log.info('Routing to OTP Verification Page')
//             this.router.navigate(['/auth/verify'])
//               .then(r => {
//               });
//           }
//         }else{
//           /*ToDo: Implement password expired here*/
//           this.errorOccurred = true;
//           this.errorMessage = 'Error Occured, please try again';
//           this.cdr.detectChanges()
//         }
//       }
//     },(msg) => {
//       // log.info(`Pushing error message ${JSON.stringify(msg)}`);
//       if(msg != null){
//         this.errorOccurred = true;
//         this.errorMessage = msg.detail;
//         // log.debug('Reached here',this.errorOccurred, this.errorMessage);
//         this.cdr.detectChanges()
//       }
//     });
//   }

  ngOnDestroy() {
  }

  // resetPassword() {
  //   const extras = JSON.parse(localStorage.getItem("extras"));
  //   const username = extras.email;

  //   // $("#passwordModal").modal('hide');
  //   //generate and send otp
  //   this.authService.sentVerificationOtp(username, 'email')
  //     .subscribe(data =>{
  //         if(data==true){
  //           // log.info('OTP Sent to Email');
  //           // log.info('Routing to OTO Verification Page');
  //           this.router.navigate(['/auth/otp'],
  //             {queryParams: {referrer: 'password-reset'}})
  //             .then(r => {
  //             });
  //         }
  //         else{
  //           // log.error('OTP Not Sent');
  //           return;
  //         }
  //       });
  // }
}
