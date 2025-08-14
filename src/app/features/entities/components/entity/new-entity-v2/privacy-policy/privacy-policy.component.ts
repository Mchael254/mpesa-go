import {Component, Input} from '@angular/core';
import {FieldModel} from "../../../../data/form-config.model";
import {Logger, UtilService} from "../../../../../../shared/services";
import {FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {Profile} from "../../../../../../shared/data/auth/profile";
import {ClientService} from "../../../../services/client/client.service";
import {OtpRequestPayload} from "../../../../data/otp-request.model";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('PrivacyPolicyInfoComponent');

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {

  @Input() otpFormFields: FieldModel[];

  selectedTab: string = 'otp_phone_number';
  shouldShowFields: boolean = false
  language: string = 'en';
  otpForm!: FormGroup;
  currentUser!: Profile;
  countdownTime: number = 0;

  constructor(
    private utilService: UtilService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });

    this.otpForm = this.fb.group({
      fields: this.fb.array([]) // initialize FormArray
    });

  }

  get fields(): FormArray {
    return this.otpForm.get('fields') as FormArray;
  }

  private setFields(): void {
    const group: { [key: string]: FormControl } = {};

    this.otpFormFields.forEach((field: FieldModel) => {

      const validators: ValidatorFn[] = [];

      if (field.isMandatory) {
        validators.push(Validators.required);
      }
      group[field.fieldId] = new FormControl('', validators);
    });

    this.otpForm = this.fb.group(group);
  }

  /**
   * show selected from template (SMS | Email)
   * @param selectedTab
   */
  showSelectedTab(selectedTab: string): void {
    this.selectedTab = selectedTab;
    this.shouldShowFields = true;
  }

  /**
   * Process the selected input and call appropriate method to either request or verify OTP
   * @param fieldId
   */
  processInput(fieldId: string): void {
    const formValues = this.otpForm.getRawValue();
    const requestPayload = {
      recipient: formValues.otp_email || formValues.otp_sms,
      purpose: formValues.otp_sms  ? 'CPV' : 'CEV',
      channel: formValues.otp_sms ? 'sms' : 'email',
      otpCode: formValues.enter_otp
    }

    if (fieldId === 'otp_email' || fieldId === 'otp_sms') {
      this.requestOtp(requestPayload)
    } else if (fieldId === 'enter_otp') {
      this.verifyOtp(requestPayload)
    }
  }

  /**
   * Call request OTP API and trigger countdown timer
   * @param requestPayload
   */
  requestOtp(requestPayload: OtpRequestPayload): void {
    this.otpCountdownTimer()
    this.clientService.requestOtp(requestPayload).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage('Success', res);
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      },
    });
  }

  /**
   * Call verify OTP API
   * @param requestPayload
   */
  verifyOtp(requestPayload: OtpRequestPayload): void {
    this.clientService.verifyOtp(requestPayload).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage('Success', res);
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      },
    });
  }

  /**
   * triggered to countdown time for OTP
   */
  otpCountdownTimer() {
    this.countdownTime = 30;
    let timer = setInterval(() => {
      this.countdownTime -= 1;
      if (this.countdownTime === 0) clearInterval(timer);
    }, 1000)
  }


  ngOnChanges(): void {
    if (this.otpFormFields) {
      this.setFields();
    }
    setTimeout(() => {
      this.showSelectedTab('otp_sms')
    }, 2000)
  }

}
