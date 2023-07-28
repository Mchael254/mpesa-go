import {Component, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {GlobalMessagingService} from "../../../shared/services/messaging/global-messaging.service";
import {Logger, UtilService} from "../../../shared/services";
import {untilDestroyed} from "../../../shared/shared.module";

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

      switch(this.otpProcess) {
        case 'password-reset': {
          this.router.navigate(['/auth/change-password']).then(r => {});
          break;
        }
        default: {
          const details = JSON.parse(localStorage.getItem('details'));
          this.authService.attemptAuth(details);
          break;
        }
      }
     }else{
      return;
    }
  }

}
