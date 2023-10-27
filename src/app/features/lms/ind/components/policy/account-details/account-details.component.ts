import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent {


  accountDetailActiveItem: MenuItem ;
  accountDetailItemsActiveTab: string = 'RECIEPTS';
  accountDetailItems: MenuItem[] = [];

    ngOnInit() {

        this.accountDetailItems = [
          { label: 'Reciepts', command: () => this.accountDetailItemsActiveTab = 'RECIEPTS' },
          { label: 'Maturities', command: () => this.accountDetailItemsActiveTab = 'MATURTIES' },
      ];

        this.accountDetailActiveItem = this.accountDetailItems[0];
    }

}
