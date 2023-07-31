import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {Logger} from "../../../shared/services";
import {SessionStorageService} from "../../../shared/services/session-storage/session-storage.service";
import {LocalStorageService} from "../../../shared/services/local-storage/local-storage.service";

const log = new Logger('OtpVerificationComponent');

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit, OnDestroy {

  public otpProcess: string = '';
  constructor(
    private authService: AuthService,
    // private sessionStorage: SessionStorageService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.otpProcess = this.route.snapshot.queryParamMap.get('referrer');
    log.info(`OTP Process: ${this.otpProcess}`);
  }

  ngOnDestroy(): void {
  }

  verifyOtp(event: any) {
    if(event === true){

      if(this.otpProcess == 'password-reset'){
        this.router.navigate(['/auth/change-password']).then(r => {});
      }
      else {
        const details = JSON.parse(this.localStorageService.getItem('details'));
        this.authService.attemptAuth(details);
      }

      // switch(this.otpProcess) {
      //   case 'password-reset': {
      //     this.router.navigate(['/auth/change-password']).then(r => {});
      //     break;
      //   }
      //   default: {
      //     const details = JSON.parse(this.sessionStorage.getItem('details'));
      //     this.authService.attemptAuth(details);
      //     break;
      //   }
      // }
     }else{
      return;
    }
  }
}
