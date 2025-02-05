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
import { SESSION_KEY } from '../../lms/util/session_storage_enum';
import { ToastService } from '../../../shared/services/toast/toast.service';

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
  private tenant_id: any;
  public tenants: Tenant[] = [];
  public entities: string[] = [];
  public shouldShowTenants: boolean = false;
  public shouldShowEntities: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
    public  utilService: UtilService,
    private cdr: ChangeDetectorRef,
    private toast_service: ToastService
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

    // Handle autofill
    const usernameField = document.getElementById('emailAddress');
    const passwordField = document.getElementById('password');

    // Add listeners for both fields
    usernameField?.addEventListener('animationstart', (e) => {
      if (e.animationName === 'onAutoFillStart') {
        this.loginForm.get('username').updateValueAndValidity();
        this.cdr.detectChanges();
      }
    });

    passwordField?.addEventListener('animationstart', (e) => {
      if (e.animationName === 'onAutoFillStart') {
        this.loginForm.get('password').updateValueAndValidity();
        this.cdr.detectChanges();
      }
    });

    // Set default values for login form fields from local storage
    const loginDetails = JSON.parse(this.localStorageService.getItem('loginDetails'));
    if (loginDetails) {
      this.loginForm.patchValue({
        username: loginDetails.username,
        password: loginDetails.password,
        rememberMe: true
      });
      // Trigger validation after setting values
      this.loginForm.updateValueAndValidity();
      this.cdr.detectChanges();
    }


    this.route.queryParams.subscribe((params) => {
      this.tenant_id = params['id'];
      // if(this.tenant_id===null || this.tenant_id===undefined){
      //   this.toast_service.info('Provide a TENANT ID', 'TENANT ID IS REQUIRED')
      // }
      // this.sessionStorageService.set(SESSION_KEY.API_TENANT_ID, this.tenant_id)
    });
  }

  /**
   * Creates the login form.
   * Sets username and password as required fields
   * Sets password minimum length to 6
   * @returns void
   * @memberof LoginComponent
   */
  createForm() {
    // Create password validators
    const passwordValidators = [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)
    ];

    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]],
      password: ['', passwordValidators],
      rememberMe: ['']
    });

    // Add value change subscriptions
    this.loginForm.get('username').valueChanges.subscribe(() => {
      if (this.loginForm.get('username').value) {
        this.loginForm.get('username').markAsTouched();
      }
    });

    this.loginForm.get('password').valueChanges.subscribe(() => {
      if (this.loginForm.get('password').value) {
        this.loginForm.get('password').markAsTouched();
      }
    });
  }

  // helper methods for error messages
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);

    if (!control?.errors || !control.touched) {
      return '';
    }

    if (controlName === 'username') {
      if (control.errors['required']) {
        return 'Email address is required';
      }
      if (control.errors['email'] || control.errors['pattern']) {
        return 'Please enter a valid email address';
      }
    }

    if (controlName === 'password') {
      if (control.errors['required']) {
        return 'Password is required';
      }
      if (control.errors['minlength']) {
        return 'Password must be at least 8 characters long';
      }
      if (control.errors['pattern']) {
        return 'Password must contain at least one number and one special character';
      }
    }

    return '';
  }

  /**
   * Toggles password visibility
   * @returns void
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Fetches user tenants using login credentials (username & password)
   * @returns void
   */
  fetchUserTenants(): void {
    // Check if form is valid before proceeding
    if (this.loginForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control.markAsTouched();
      });
      return; // Exit the method if form is invalid
    }

    this.isLoading = true;
    const rawData = this.loginForm.getRawValue();
    const authenticationData: UserCredential = {
      username: rawData.username,
      password: rawData.password,
    };
    this.authService.fetchUserTenants(authenticationData, (tenants) => {
      if (this.errorOccurred) {
        this.tenants = []; // Clear tenants array on error
      } else {
        this.tenants = tenants; // Only set tenants on success
      }

      log.info(`user tenants >>>`, tenants);
      this.tenants = tenants;

      if (tenants.length === 0) {
        this.authAttempt();
      } else if (tenants.length === 1) {
        this.tenant_id = tenants[0].name;
        this.sessionStorageService.set(SESSION_KEY.API_TENANT_ID, this.tenant_id);
        const entities = tenants[0].authType;

        if (entities.length === 0 || entities.length === 1) {
          this.sessionStorageService.set(SESSION_KEY.ENTITY_TYPE, entities[0]);
          this.entities = entities;
          this.authAttempt();
        } else if (entities.length > 0) {
          this.shouldShowEntities = true;
          this.entities = entities;
        }

      } else if (tenants.length > 1) {
        this.shouldShowTenants = true;
        this.shouldShowEntities = false;
        this.entities = tenants[0].authType;
      }

      log.info(`entities >>> `, this.entities);

      this.isLoading = false;
    });

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

    if (this.loginForm.invalid) {
      this.isLoading = false;
      return;
    }

    const rawData = this.loginForm.getRawValue();
    const authenticationData: UserCredential = {
      username: rawData.username,
      password: rawData.password,
    };

    this.authService.authenticateUser(authenticationData, (data) => {
      if(data != null){

        if (data.allowMultifactor === 'N') {
          log.info(`multi-factor authentication disabled. By-passing OTP...`, data);
          this.authService.attemptAuth(authenticationData);
          setTimeout(() => {this.isLoading = false}, 2000)
          return;
        }

        let message: string = data.message;
        this.expiryMessage = message;
        if (data.accountStatus === true && data.emailAddress != null) {
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

          if(message.includes('will expire')){
            this.expiryMessage = message;
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
      } else {
        this.handleAuthError('Authentication failed. Please try again.');
      }
      this.isLoading = false;
    },(msg) => {
      this.handleAuthError('Invalid username or password. Please try again.');
      this.isLoading = false;

    });
  }

  handleAuthError(errorMessage: string) {
    this.errorOccurred = true;
    this.errorMessage = errorMessage;
    this.tenants = []; // Clear tenants array to keep form visible

    // Preserve the entered username
    const currentUsername = this.loginForm.get('username').value;

    // Reset only the password field
    this.loginForm.patchValue({
      password: ''
    });

    // Re-mark fields as untouched but keep the username
    this.loginForm.get('password').markAsUntouched();

    // Ensure change detection runs
    this.cdr.detectChanges();
  }

  isTenantIdPresent(): boolean {
    return this.tenant_id===undefined || this.tenant_id===null || this.tenant_id==='';
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
      }
    );
  }

  /**
   * selects a tenant and save tenant_id in session storage
   * If only 1 entity exist in the selected tenant, proceed to login
   * @param tenant:Tenant
   * @returns void
   */
  selectTenant(tenant: Tenant): void {
    this.entities = tenant.authType;
    this.tenant_id = tenant.name;
    this.sessionStorageService.set(SESSION_KEY.API_TENANT_ID, this.tenant_id);
    this.shouldShowTenants = false;

    if (this.entities.length === 0 || this.entities.length === 1) {
      const entityType = this.entities[0];
      this.sessionStorageService.set(SESSION_KEY.ENTITY_TYPE, entityType);
      log.info(`entity type >> auto-selected ===> `, entityType);
      this.authAttempt()
    } else if (this.entities.length > 1) {
      this.shouldShowEntities = true;
    }
  }

  selectEntity(entity: string): void {
    this.sessionStorageService.set(SESSION_KEY.ENTITY_TYPE, entity);
    log.info(`entity type >> selected by clicking ===> `, entity);
    this.authAttempt();
  }

  /**
   * show list of tenants from the entities display by setting entities to empty array
   * @returns void
   */
  showTenants(): void {
    this.entities = [];
    this.shouldShowTenants = true;
    this.shouldShowEntities = false;
  }

}

interface Tenant {
  name: string,
  authType: string[]
}
