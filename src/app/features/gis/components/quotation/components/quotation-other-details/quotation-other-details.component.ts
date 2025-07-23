import { Component } from '@angular/core';

@Component({
  selector: 'app-quotation-other-details',
  templateUrl: './quotation-other-details.component.html',
  styleUrls: ['./quotation-other-details.component.css']
})
export class QuotationOtherDetailsComponent {

  showRevision: boolean = true;
  activeTab: 'internal' | 'external' = 'internal';

  toggleRevision() {
    this.showRevision = !this.showRevision;
  }
  


}
