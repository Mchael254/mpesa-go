import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClaimsService } from '../../services/claims.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  activeView: string = 'transactionDetails'; // Set default view

  
  transactionData:any;

 
  constructor(
    private translateService: TranslateService,
    public claimService:ClaimsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getClaimTransactionDetails()
  }
  
  setActiveView(view: string) {
    this.activeView = view;
  }

  /**
  * Handles the view transaction action.
  *
  * @param transaction The transaction data.
  */
  viewTransaction(transaction: any,transactionDetails): void {
   
    this.router.navigate([`/home/gis/claim/view-transaction/${transaction}`]);
    sessionStorage.setItem('transactionDetails',JSON.stringify(transactionDetails))
    console.log(transactionDetails)
  }


  getClaimTransactionDetails(){
    this.claimService.getClaimTransactionDetails('C/HDO/FSP/22/000009').subscribe({
      next:(res=>{
        this.transactionData = res
        this.transactionData = this.transactionData.embedded[0]
      
        console.log(this.transactionData,'transactionDatta')
      })
    })
  }

}
