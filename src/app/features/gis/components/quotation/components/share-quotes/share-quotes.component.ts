
import { Component, EventEmitter, Output } from '@angular/core';
import { ShareQuoteDTO } from '../../data/quotationsDTO';

type ShareMethod = 'email' | 'sms' | 'whatsapp';
@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.css']
})
export class ShareQuotesComponent {
  display = true; // Show dialog by default for demo
  @Output() downloadRequested = new EventEmitter<void>();

  onDownload() {
    this.downloadRequested.emit();
  }
  
  


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


  

  send() {
    let contactInfo = '';
  
    switch (this.shareQuoteData.selectedMethod) {
      case 'email':
        contactInfo = this.shareQuoteData.email || '';
        break;
      case 'sms':
        contactInfo = this.shareQuoteData.smsNumber ||'';
        break;
      case 'whatsapp':
        contactInfo = this.shareQuoteData.whatsappNumber ||'';
        break;
    }
  
    console.log(`Sending via ${this.shareQuoteData.selectedMethod} to ${contactInfo}`);
  }
  

  cancel() {
    // your logic to close dialog or clear fields
    this.display = false;
  }

}
