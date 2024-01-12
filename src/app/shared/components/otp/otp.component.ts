import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {GlobalMessagingService} from "../../services/messaging/global-messaging.service";
import {untilDestroyed} from "../../services/until-destroyed";
import {LocalStorageService} from "../../services/local-storage/local-storage.service";
import {UtilService} from "../../services/util/util.service";
import {Logger} from "../../services/logger/logger.service";

const log = new Logger('OtpVerificationComponent');

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit, OnDestroy {

  public messageChannel: 'email' | 'sms' = 'email';
  public otpForm: FormGroup;
  public formInput = ['input1', 'input2', 'input3', 'input4'];
  public verifySuccess = false;
  public submitted = false;
  public title = 'otp';
  public otpValue = '';
  public otpProcess: string = '';
  public otp: string;
  isLoading: boolean = false;
  @ViewChildren('formRow') rows: any;

  @Output() public otpResponse: EventEmitter<any> = new EventEmitter<any>();

  error: {name: string, status: number, message: string} = { name: '', status: 0, message: '' };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private globalMessagingService: GlobalMessagingService,
    private utilService: UtilService,
    // private sessionStorage: SessionStorageService,
    private localStorageService: LocalStorageService,
  ) {
    this.otpForm = this.createOtpFormGroup(this.formInput);
  }

  ngOnInit(): void {
    let otpChannelSelected = JSON.parse(localStorage.getItem('otp-channel'));
    this.messageChannel = otpChannelSelected?.channel;
  }

  createOtpFormGroup(elements) {
    const group: any = {};
    elements.forEach((key) => {
      group[key] = new FormControl('', Validators.required);
    });

    return new FormGroup(group);
  }

  keyUpEvent(event, input) {
    const value = event.target.value;
    const index = this.formInput.indexOf(input);
    this.error = { name: '', status: 0, message: '' };

    if (event.keyCode === 8 && event.which === 8 && value.length === 0 && index > 0) {
      const previousInput = this.formInput[index - 1];
      this.otpForm.controls[previousInput].setValue('');
      this.rows._results[index - 1].nativeElement.focus();
    } else {
      this.otpForm.controls[input].setValue(event.key);
      if (index < this.formInput.length - 1) {
        const nextInput = this.formInput[index + 1];
        this.rows._results[index + 1].nativeElement.focus();
      }
    }
  }

  onVerify() {
    this.isLoading = true;
    const extras = JSON.parse(this.localStorageService.getItem("extras"));
    this.submitted = true;
    this.otpValue = '';
    let email = '';
    let username = '';

    if (this.otpForm.valid) {
      Object.keys(this.otpForm.controls).forEach((key, index) => {
        this.otpValue = this.otpValue + this.otpForm.controls[key].value;
      });
      username = extras.username;
      email = extras.email;
      
        this.authService.verifyResetOtp(username, parseInt(this.otpValue, 10), email)
        .subscribe({
          next: (data) => {
            this.otpResponse.emit(data);
            this.isLoading = false;
          },
          error: (err) => {
            let errorMessage = '';
            if (err.error.message) {
              errorMessage = err.error.message
            } else {
              errorMessage = err.message
            }
            this.isLoading = false;
            this.globalMessagingService.displayErrorMessage('Error', errorMessage);
          }
        })
    }

  }

  resendOtp() {
    this.isLoading = true;
    this.otpForm.reset();
    const otpChannel = JSON.parse(localStorage.getItem("otp-channel"));
    log.info(`OTP channel >>>`, otpChannel);
    this.authService.sentVerificationOtp(otpChannel.value, otpChannel.channel)
      .pipe(untilDestroyed(this)).subscribe( response =>{
        if(response){
          this.globalMessagingService.displaySuccessMessage("Success", "OTP sent successfully");
          log.info("OTP Sent", response);
          this.isLoading = false;
        }
      },
      (error)=> {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
  }

}
