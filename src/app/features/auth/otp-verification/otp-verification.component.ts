import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {Logger} from "../../../shared/services";
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
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  /**
   * Initialize component by:
   *  - getting the otp process from the query params
   */
  ngOnInit(): void {
    this.otpProcess = this.route.snapshot.queryParamMap.get('referrer');
    log.info(`OTP Process: ${this.otpProcess}`);
  }

  /**
   * Destroy component
   */
  ngOnDestroy(): void {
  }

  /**
   * Get OTP verification result and redirect to the appropriate page based on the otp process
   * @param event
   * @return void
   */
  verifyOtp(event: any) {
    if(event === true){

      if(this.otpProcess == 'password-reset'){
        this.router.navigate(['/auth/change-password']).then(r => {});
      }
      else {
        const details = JSON.parse(this.localStorageService.getItem('details'));
        this.authService.attemptAuth(details);
      }
     }else{
      return;
    }
  }
}
