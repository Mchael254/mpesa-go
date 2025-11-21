import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { QuotationReportDto, ShareQuoteDTO } from '../../data/quotationsDTO';
import { Logger } from "../../../../../../shared/services";
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { EmailDto } from 'src/app/shared/data/common/email-dto';
import { NotificationService } from '../../services/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';


type ShareMethod = 'email' | 'sms' | 'whatsapp';

const log = new Logger('ShareQuotesComponent');

@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.css']
})
export class ShareQuotesComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService
  ) {
  }

  display = true;
  @Output() downloadRequested = new EventEmitter<void>();
  @Output() printRequested = new EventEmitter<void>();
  @Output() previewRequested = new EventEmitter<void>();
  @Output() sendEvent = new EventEmitter<{ mode: ShareQuoteDTO }>();
  @Input() previewVisible!: boolean;
  @Input() pdfSrc!: any;

  @ViewChild('closeButton') closeButton: ElementRef;

  shareForm!: FormGroup;


  shareMethods: { label: string; value: ShareMethod; disabled: boolean; tooltip?: string }[] = [
    { label: 'Email', value: 'email', disabled: false },
    { label: 'SMS', value: 'sms', disabled: false },
    { label: 'WhatsApp', value: 'whatsapp', disabled: false }
  ];


  shareQuoteData: ShareQuoteDTO = {
    selectedMethod: 'email',
    email: '',
    smsNumber: '',
    whatsappNumber: '',
    clientName: ''
  };

  // Phone input properties
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Kenya];




  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.shareForm = this.fb.group({
      clientName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onDownload() {
    this.downloadRequested.emit();
  }


  cancel() {
    this.display = false;
  }

  // onSend() {
  //   if (this.shareForm.invalid) {
  //     this.shareForm.markAllAsTouched();
  //     return;
  //   }

  //   this.shareQuoteData.clientName = this.shareForm.value.clientName;
  //   this.shareQuoteData.email = this.shareForm.value.email;

  //   this.sendEvent.emit({ mode: this.shareQuoteData });


  //   this.closeButton.nativeElement.click();
  // }

  onSend() {
    if (this.shareForm.invalid) {
      this.shareForm.markAllAsTouched();
      return;
    }

    // Extract current selected method
    const method = this.shareQuoteData.selectedMethod;

    // Common fields
    this.shareQuoteData.clientName = this.shareForm.value.clientName;

    // Handle fields based on the selected method
    if (method === 'email') {
      this.shareQuoteData.email = this.shareForm.value.email;
    } else if (method === 'whatsapp') {
      const phoneValue = this.shareForm.value.phone;
 
      this.shareQuoteData.whatsappNumber = phoneValue?.e164Number || this.formatPhoneNumber(phoneValue?.number || '');
    } else if (method === 'sms') {
      const phoneValue = this.shareForm.value.phone;

      this.shareQuoteData.smsNumber = phoneValue?.e164Number || this.formatPhoneNumber(phoneValue?.number || '');
    }


    this.sendEvent.emit({ mode: this.shareQuoteData });

    // Clear the form inputs after successful send
    this.shareForm.reset();
    this.shareForm.patchValue({
      clientName: '',
      email: '',
      phone: ''
    });

    // Close the modal
    this.closeButton.nativeElement.click();
  }


  sendEmail(payload: EmailDto) {
    log.debug("Email payload", payload)
    this.notificationService.sendEmail(payload).subscribe({
      next: (response) => {
        log.debug("Response after sending email:", response)
        log.debug("Email sent:", response.sent)

        this.closeButton.nativeElement.click();

        this.globalMessagingService.displaySuccessMessage('success', 'Email sent successfully')
        log.debug(response);

      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('error', error.error.message);
        log.debug(error);

      }

    })

  }

  onPreview() {
    this.previewRequested.emit();

  }

  onPrint() {
    this.printRequested.emit();
  }
  onMethodChange(method: 'email' | 'whatsapp' | 'sms') {
    this.shareQuoteData.selectedMethod = method;

    const emailControl = this.shareForm.get('email');
    const phoneControl = this.shareForm.get('phone');

    if (method === 'email') {
      // Email required, phone not required
      emailControl?.setValidators([Validators.required, Validators.email]);
      phoneControl?.clearValidators();
      phoneControl?.reset(); // Clear phone value when switching to email
    } else {
      // Phone required (for both WhatsApp and SMS), email not required
      // ngx-intl-tel-input has built-in validation, so we only need required
      phoneControl?.setValidators([Validators.required]);
      emailControl?.clearValidators();
      emailControl?.reset(); // Clear email value when switching to phone
    }

    // Update the validation state
    emailControl?.updateValueAndValidity();
    phoneControl?.updateValueAndValidity();
  }

  /**
   * Format phone number to international format (254XXXXXXXXX)
   * @param phoneNumber - The phone number to format
   * @returns Formatted phone number with 254 prefix
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');

    // If already starts with 254, return as is
    if (cleaned.startsWith('254')) {
      return cleaned;
    }

    if (!cleaned.match(/^(01|07)/)) {
      throw new Error("Invalid phone number format");
    }

    // Convert to 254 format by removing leading 0 and adding 254
    return '254' + cleaned.substring(1);
  }


}
