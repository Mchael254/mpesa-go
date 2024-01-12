import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { untilDestroyed } from '../../../shared/services/until-destroyed';
import { AuthVerification } from '../../../core/auth/auth-verification';
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";
import { Logger } from '../../../shared/services/logger/logger.service';
import { UtilService } from '../../../shared/services/util/util.service';
import { take } from 'rxjs';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

const log = new Logger('VerificationComponent');

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  accountVerification: AuthVerification[] = [];
  selectedAccount?: AuthVerification;
  isLoading: boolean = false;
  error: {name: string, status: number, message: string} = { name: '', status: 0, message: '' };


  constructor(
    private router: Router,
    private authService: AuthService,
    public utilService: UtilService,
    private localStorageService: LocalStorageService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  /**
   * Initialize component by:
   * 1. Get extras from local storage
   * 2. Create account verification types populated with extras
   * 3. Set selected account to the first account verification type by default
   */
  ngOnInit(): void {
    // const extras = this.localStorageService.getItem("extras");
    const extras = JSON.parse(this.localStorageService.getItem("extras"));

    const verificationsTypes: AuthVerification[] = []
    if(extras?.phone){
      const verificationsType: AuthVerification = {
        name: extras.phone.substr(0,4)+ '********'+extras.phone.slice(-2),
        type: "SMS",
        icon: "fa-mobile-retro",
        selected: true

      }
      verificationsTypes.push(verificationsType)
    }
    if(extras.email){
      const verificationsType: AuthVerification = {
        name: extras.email.substr(0,2)+'*****'+extras.email.slice(extras.email.lastIndexOf('@')),
        type: "Email",
        icon: "fa-envelope",

      }
      verificationsTypes.push(verificationsType)
    }
    this.accountVerification = verificationsTypes;
  }


  /**
   * Select account of type AuthVerification and send OTP to the selected account
   * Upon successful OTP sent, navigate to OTP screen
   * @param account - Account of type AuthVerification
   */
  onSelectAccount(account: AuthVerification) {
    this.selectedAccount = account;
    this.isLoading = true;
    log.debug('Selected Verification Type:', this.selectedAccount)
    // const verificationType = this.selectedAccount.type.includes("Email".toLocaleLowerCase())? "email": "sms"
    const verificationType = this.selectedAccount.type === 'SMS' ? 'sms' : 'email';
    // const extras = this.localStorageService.getItem("extras");
    const extras = JSON.parse(this.localStorageService.getItem("extras"));
    let username = extras.username;

    this.authService.sentVerificationOtp(username, verificationType)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (response) => {
        if(response){
          const channel = {
            action: 'Verify',
            channel: verificationType,
            value: username
          };
          localStorage.setItem('otp-channel', JSON.stringify(channel));
          this.router.navigate(['/auth/otp']);
        }
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

  /**
   * Destroy component
   */
  ngOnDestroy(): void {
  }

}
