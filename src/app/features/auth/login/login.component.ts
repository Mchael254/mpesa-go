import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { UserCredential } from '../../base/util';
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";
import {Logger, UtilService} from "../../../shared/services";
import {AuthService} from "../../../shared/services/auth.service";

const log = new Logger('LoginComponent');

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
  isLoading: boolean = false;
  defaultLanguage: string = 'fi fi-gb fis';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    public  utilService: UtilService,
    private cdr: ChangeDetectorRef
  ) {
  }

  /**
   * Initializes the component by:
   *  1.Creating the login form
   *  2.Checking if user is authenticated
   *  3.Getting login details from local storage and if present, set them as default values for login form fields
   */
  ngOnInit(): void {
    this.createForm();
    this.isAuthenticated$ = this.authService.isAuthenticated;
    // Set default values for login form fields from local storage
    const loginDetails = JSON.parse(this.localStorageService.getItem('loginDetails'));
    if (loginDetails) {
      this.loginForm.patchValue({
        username: loginDetails.username,
        password: loginDetails.password,
        rememberMe: true
      });
    }
  }

  /**
   * Creates the login form.
   * Sets username and password as required fields
   * Sets password minimum length to 6
   * @returns void
   * @memberof LoginComponent
   */
  createForm() {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: ['']
      });
  }

  /**
   * Toggles password visibility
   * @returns void
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Authenticates user
   * Saves login details in local storage if remember me is checked as loginDetails
   * Saves response data in local storage as extras which contains action, phone, email and username
   * Routes to verify page if authentication is successful
   * @returns void
   */
  authAttempt() {
    this.isLoading = true
    this.errorOccurred = false;
    this.errorMessage = '';

    const rawData = this.loginForm.getRawValue();
    const authenticationData: UserCredential = {
      username: rawData.username,
      password: rawData.password,
    };

    this.authService.authenticateUser(authenticationData, (data) => {
      if(data != null){
        
        if (data.allowMultifactor === 'N') {
          log.info(`multi-factor authentication disabled. By-passing OTP...`, data);
          return this.authService.attemptAuth(authenticationData);
        }

        let message: string = data.message;
        this.expiryMessage = message;
        if (data.accountStatus ===true && data.emailAddress != null) {
          if (this.loginForm.get('rememberMe').value) {
            // Store login details in local storage
            this.localStorageService.setItem('loginDetails', JSON.stringify(authenticationData));
            // localStorage.setItem('loginDetails', JSON.stringify(authenticationData));
          } else {
            // Remove login details from local storage
            this.localStorageService.removeItem('loginDetails');
            // localStorage.removeItem('loginDetails');
          }

          // localStorage.clear();
          const loginDetails: UserCredential = {
            password: authenticationData.password,
            username: authenticationData.username,
          };
          const extras = {
            action: 'login',
            phone: data.phoneNumber,
            email: data.emailAddress,
            username: authenticationData.username
          };
          this.localStorageService.setItem('details', JSON.stringify(loginDetails));
          this.localStorageService.setItem('detailsM', loginDetails.password);
          this.localStorageService.setItem('extras', JSON.stringify(extras));
          //
          // localStorage.setItem('details', JSON.stringify(loginDetails));
          // localStorage.setItem('extras', JSON.stringify(extras));

          if(message.includes('will expire')){
            this.expiryMessage = message;

            // $("#passwordModal").modal('show');
            // log.info('Show Reset Password Modal')
          }
          else{
            this.router.navigate(['/auth/verify'])
              .then(r => {
              });
          }
        }else{
          /*ToDo: Implement password expired here*/
          this.errorOccurred = true;
          this.errorMessage = 'Error Occured, please try again';
          this.cdr.detectChanges()
        }
      }
      this.isLoading = false;
    },(msg) => {
      // log.info(`Pushing error message ${JSON.stringify(msg)}`);
      if(msg != null){
        this.errorOccurred = true;
        this.errorMessage = msg.detail;
        // log.debug('Reached here',this.errorOccurred, this.errorMessage);
        this.cdr.detectChanges()
      }
      this.isLoading = false;

    });
  }

  /**
   * Destroys the component
   */
  ngOnDestroy() {
  }

  /**
   * Redirects to resets password page after successful OTP verification
   */
  resetPassword() {
    const extras = JSON.parse(this.sessionStorageService.getItem("extras"));
    const username = extras.email;

    // $("#passwordModal").modal('hide');
    //generate and send otp
    this.authService.sentVerificationOtp(username, 'email')
      .subscribe(data =>{
          if(data==true){
            // log.info('OTP Sent to Email');
            // log.info('Routing to OTO Verification Page');
            this.router.navigate(['/auth/otp'],
              {queryParams: {referrer: 'password-reset'}})
              .then(r => {
              });
          }
          else{
            // log.error('OTP Not Sent');
            return;
          }
        });
  }
}
