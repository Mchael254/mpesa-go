import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { QuotationReportDto, ShareQuoteDTO } from '../../data/quotationsDTO';
import { Logger } from "../../../../../../shared/services";
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { EmailDto } from 'src/app/shared/data/common/email-dto';
import { NotificationService } from '../../services/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';


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
    { label: 'SMS', value: 'sms', disabled: true, tooltip: 'SMS sharing coming soon' },
    { label: 'WhatsApp', value: 'whatsapp', disabled: true, tooltip: 'WhatsApp sharing coming soon' }
  ];


  shareQuoteData: ShareQuoteDTO = {
    selectedMethod: 'email',
    email: '',
    smsNumber: '',
    whatsappNumber: '',
    clientName: ''
  };




  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.shareForm = this.fb.group({
      clientName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

    });

  }

  onDownload() {
    this.downloadRequested.emit();
  }


  cancel() {
    this.display = false;
  }

  onSend() {
    if (this.shareForm.invalid) {
      this.shareForm.markAllAsTouched();
      return;
    }

    this.shareQuoteData.clientName = this.shareForm.value.clientName;
    this.shareQuoteData.email = this.shareForm.value.email;

    this.sendEvent.emit({ mode: this.shareQuoteData });


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


}
