import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ShareQuoteDTO } from '../../data/quotationsDTO';
import { Logger } from "../../../../../../shared/services";
import { HttpErrorResponse } from "@angular/common/http";
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { QuotationsService } from "../../services/quotations/quotations.service";
import { untilDestroyed } from "../../../../../../shared/shared.module";
import { EmailDto } from 'src/app/shared/data/common/email-dto';
import { QuoteReportComponent } from '../quote-report/quote-report.component';
import { NotificationServiceService } from '../../services/notification/notification-service.service';
import { NotificationService } from '../../services/notification/notification.service';

type ShareMethod = 'email' | 'sms' | 'whatsapp';

const log = new Logger('ShareQuotesComponent');

@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.css']
})
export class ShareQuotesComponent implements OnInit, OnDestroy {
  constructor(
    private globalMessagingService: GlobalMessagingService,
    private quotationService: QuotationsService,
    private notificationService: NotificationService
  ) {
  }

  display = true;
  @Output() downloadRequested = new EventEmitter<void>();
  @Output() sendEvent = new EventEmitter<{ mode: ShareQuoteDTO }>();
  private _notificationPayload: any

  @ViewChild('closeButton') closeButton: ElementRef;
  @ViewChild('quoteReport', { static: false }) quoteReportComponent!: QuoteReportComponent;


  shareMethods: { label: string, value: ShareMethod }[] = [
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Whatsapp', value: 'whatsapp' }
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
  }
  set notificationPayload(value: any) {
    this._notificationPayload = value
  }

  get notificationPayload() {
    return this._notificationPayload
  }


  onDownload() {
    this.downloadRequested.emit();
  }
 

  cancel() {
    this.display = false;
  }
  onSend() {
    this.sendEvent.emit({ mode: this.shareQuoteData });
  }


  handlePdfBlob(pdfBlob: Blob, mode: ShareQuoteDTO): void {
    this.convertBlobToBase64(pdfBlob).then(base64String => {
      console.log('Base64 PDF:', base64String);
      // Remove 'data:application/pdf;base64,' if it exists
      const cleanedBase64 = base64String.replace(/^data:application\/pdf;base64,/, '');

      // Now you can build your payload for email/whatsapp
      const payload: EmailDto = {
        code: null,
        address: [mode.email],
        subject: 'Quotation Report',
        message: 'Please find the attached quotation report.',
        status: 'D',
        emailAggregator: 'N',
        response: '524L',
        systemModule: 'NB for New Business',
        systemCode: 0,
        attachments: [
          {
            name: 'quote-report.pdf',
            content: cleanedBase64,
            type: 'application/pdf',
            disposition: 'attachment',
            contentId: 'quote-report'
          }
        ],
        fromName: 'Hope Ibrahim',
        from: 'hope.ibrahim@turnkeyAfrica.com',
        sendOn: new Date().toISOString(),
        clientCode: 0,
        agentCode: 0
      };

      // Call your sendEmail or sendWhatsapp method with the payload
      this.sendEmail(payload);
    }).catch(error => {
      console.error('Error converting PDF to base64', error);
    });
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }
  sendEmail(payload: EmailDto) {
    log.debug("Email payload", payload)
    this.notificationService.sendEmail(payload).subscribe({
      next: (response) => {
        
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
}
