import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-underwriting',
  templateUrl: './underwriting.component.html',
  styleUrls: ['./underwriting.component.css']
})
export class UnderwritingComponent {

  items: MenuItem[] ;

  activeItem: MenuItem ;
  accountDetailActiveItem: MenuItem ;
  activeTab: string = 'ACCOUNT_DETAILS';
  accountDetailItemsActiveTab: string = 'RECIEPTS';
  accountDetailItems: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            { label: 'Account Details', command: () => this.activeTab = 'ACCOUNT_DETAILS' },
            { label: 'Exceptions', command: () => this.activeTab = 'EXCEPTIONS' },
        ];
        this.accountDetailItems = [
          { label: 'Reciepts', command: () => this.accountDetailItemsActiveTab = 'RECIEPTS' },
          { label: 'Maturities', command: () => this.accountDetailItemsActiveTab = 'MATURTIES' },
      ];

        this.activeItem = this.items[0];
        this.accountDetailActiveItem = this.accountDetailItems[0];
    }

    openModal() {
      const modal = document.getElementById('UnderWritingModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
      }
    }
    closeModal() {
      const modal = document.getElementById('UnderWritingModal');
      if (modal) {
        modal.classList.remove('show')
        modal.style.display = 'none';
      }
    }

}
