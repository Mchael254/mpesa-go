
import { Component } from '@angular/core';


@Component({
  selector: 'app-share-quotes',
  templateUrl: './share-quotes.component.html',
  styleUrls: ['./share-quotes.component.css']
})
export class ShareQuotesComponent {
  display = true; // Show dialog by default for demo
  shareMethods = [
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Whatsapp', value: 'whatsapp' }
  ];
  selectedMethod = 'email';
  clientName = '';
  email = '';

  onDownload() {
    // Your download logic here
    
  }

  send() {
    // Your send logic here
  
  }

  cancel() {
    // your logic to close dialog or clear fields
    this.display = false;
  }

}
