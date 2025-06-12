import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ShareQuoteDTO} from '../../data/quotationsDTO';
import {Logger} from "../../../../../../shared/services";
import {HttpErrorResponse} from "@angular/common/http";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {QuotationsService} from "../../services/quotations/quotations.service";
import {untilDestroyed} from "../../../../../../shared/shared.module";

type ShareMethod = 'email' | 'sms' | 'whatsapp';

const log = new Logger('ShareQuotesComponent');

@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.css']
})
export class ShareQuotesComponent implements OnInit, OnDestroy {
  constructor(private globalMessagingService: GlobalMessagingService,
              private quotationService: QuotationsService) {
  }

  display = true;
  @Output() downloadRequested = new EventEmitter<void>();
  @Output() sendEvent: EventEmitter<{ mode: ShareQuoteDTO }> = new EventEmitter<{ mode: ShareQuoteDTO }>();
  private _notificationPayload: any

  @Input()
  set notificationPayload(value: any) {
    this._notificationPayload = value
  }

  get notificationPayload() {
    return this._notificationPayload
  }


  onDownload() {
    this.downloadRequested.emit();
  }


  shareMethods: { label: string, value: ShareMethod }[] = [
    {label: 'Email', value: 'email'},
    {label: 'SMS', value: 'sms'},
    {label: 'Whatsapp', value: 'whatsapp'}
  ];


  shareQuoteData: ShareQuoteDTO = {
    selectedMethod: 'email',
    email: '',
    smsNumber: '',
    whatsappNumber: '',
    clientName: ''
  };


  send() {
    let contactInfo = '';
    switch (this.shareQuoteData.selectedMethod) {
      case 'email':
        contactInfo = this.shareQuoteData.email || '';
        break;
      case 'sms':
        contactInfo = this.shareQuoteData.smsNumber || '';
        break;
      case 'whatsapp':
        contactInfo = this.shareQuoteData.whatsappNumber || '';
        break;
    }
    this.sendEvent.emit({mode: this.shareQuoteData})
    log.debug("Sending notification >>>", this.notificationPayload)
    this.quotationService.sendEmail(this.notificationPayload).pipe(
      untilDestroyed(this)
    )
      .subscribe({
        next: (res) => {
          if (res) {
            this.globalMessagingService.displaySuccessMessage('Success', 'Email sent successfully');
            log.debug(res)
          }
        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
        }
      })
    log.debug('Submitted payload:', JSON.stringify(this.notificationPayload));
  }


  cancel() {
    this.display = false;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

}
