import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ShareQuoteDTO} from '../../data/quotationsDTO';
import {Logger} from "../../../../../../shared/services";

type ShareMethod = 'email' | 'sms' | 'whatsapp';

const log = new Logger('ShareQuotesComponent');

@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.css']
})
export class ShareQuotesComponent {
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
  }


  cancel() {
    this.display = false;
  }

}
