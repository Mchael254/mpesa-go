import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger, UtilService } from 'src/app/shared/services';
import { AuthService } from 'src/app/shared/services/auth.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { AuthVerification } from 'src/app/core/auth/auth-verification';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";

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

  constructor(
    private router: Router,
    private authService: AuthService,
    public utilService: UtilService,
    // private sessionStorageService: SessionStorageService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    const extras = JSON.parse(this.localStorageService.getItem("extras"));

    const verificationsTypes: AuthVerification[] = []
    if(extras?.phone){
      const verificationsType: AuthVerification = {
        name: extras.phone.substr(0,4)+ '********'+extras.phone.slice(-2),
        type: "Via sms:",
        icon: "fa-mobile",
        selected: true

      }
      verificationsTypes.push(verificationsType)
    }
    if(extras.email){
      const verificationsType: AuthVerification = {
        name: extras.email.substr(0,2)+'*****'+extras.email.slice(extras.email.lastIndexOf('@')),
        type: "Via email:",
        icon: "fa-envelope",

      }
      verificationsTypes.push(verificationsType)
    }
    this.accountVerification = verificationsTypes;
  }

  onSelectAccount(account: AuthVerification) {
    this.selectedAccount = account;
    this.isLoading = true;
    log.debug('Selected Verification Type:', this.selectedAccount)
    const verificationType = this.selectedAccount.type.includes("Email".toLocaleLowerCase())? "email": "sms"
    const extras = JSON.parse(this.localStorageService.getItem("extras"));
    let username = extras.username;
    this.authService.sentVerificationOtp(username, verificationType)
      .pipe(untilDestroyed(this)).subscribe( response =>{
        log.debug("OTP Sent", response);
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
      }


    );

  }

  getOtp(){
    // this.router.navigate(['/auth/otp']);
  }
  ngOnDestroy(): void {
  }

}
