import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as bootstrap  from 'bootstrap';
@Component({
  selector: 'app-banking-dashboard',
  templateUrl: './banking-dashboard.component.html',
  styleUrls: ['./banking-dashboard.component.css'],
})
export class BankingDashboardComponent {

  receipts: receipt[] = [
    {
      batchNo: 'BL11',
      slipNo: 'SL30',
      bankAcc: '2911X',
      amount: 3000,
      status: 'pending',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'BL11',
      slipNo: 'SL20',
      bankAcc: '2034',
      amount: 3400,
      status: 'processed',
      assignee: 'jerry',
      date: new Date('2000-12-30'),
    },
    {
      batchNo: 'BL34',
      slipNo: 'SL9',
      bankAcc: '8684',
      amount: 1000,
      status: 'pending',
      assignee: 'tom',
      date: new Date('2000-11-10'),
    },
    {
      batchNo: 'BL221',
      slipNo: 'SL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'assignee1',
      date: new Date('2017-12-12'),
    },
    {
      batchNo: 'ML221',
      slipNo: 'WL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'assignee2',
      date: new Date('2023-01-03'),
    },
    {
      batchNo: 'OL221',
      slipNo: 'FL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'erick',
      date: new Date('2019-02-20'),
    },
    {
      batchNo: 'LL221',
      slipNo: 'ML670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'user2',
      date: new Date('2020-05-26'),
    },
    {
      batchNo: 'cL221',
      slipNo: 'xL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'user3',
      date: new Date('2025-05-21'),
    },
  ];
  filteredReceipts: receipt[] = this.receipts; // start as full list
  selectedrct:receipt;
  
  cols: any[]=[];
  selectedColumns: any[]=[];
  displayColumnDialog: boolean = false;


  constructor(public translate: TranslateService, private router: Router) {}
  ngOnInit() {
    this.cols=[
        { field: 'batchNo', header:this.translate.instant('fms.receipting.batchNumber') },
      { field: 'slipNo', header: this.translate.instant('fms.banking.slipNumber') },
      { field: 'date', header: this.translate.instant('fms.banking.date') },
      { field: 'assignee', header:this.translate.instant('serviceDesk.assignee') },
      { field: 'amount', header: this.translate.instant('fms.receipting.amount') },
      { field: 'bankAcc', header: this.translate.instant('fms.banking.bankAccount') },
      { field: 'status', header: this.translate.instant('base.status') },
      { field: 'actions', header:this.translate.instant('fms.receipting.actions')  }

    ];
    this.selectedColumns=[...this.cols];
  }
 

 
get currentPageReportTemplate():string{
  return this.translate.instant("fms.receipt-management.pageReport");
}

  

showColumnsDialogs(){
  this.displayColumnDialog=true;
}
  filter(event: any, fieldName: any): any {
    let inputValue = (event.target as HTMLInputElement).value;

    this.filteredReceipts = this.receipts.filter((rctobj) => {
      let fieldValue = rctobj[fieldName];
      if (fieldValue instanceof Date) {
        // Format the date consistently for comparison
        const formatted = fieldValue.toISOString().split('T')[0];
        return formatted.includes(inputValue);
      } else if (typeof fieldValue === 'number') {
       
        const inputNumber = String(inputValue);
         return fieldValue.toString().includes(inputNumber);
      } else if(typeof fieldValue === 'string'){
        fieldValue = fieldValue.toString();
         return fieldValue.toLowerCase().includes(inputValue.toLowerCase());
      }
     return false;
    });
  }
  clearFilter(): void {
    this.filteredReceipts = this.receipts;
  }
  
  onRow(){
    //console.log('selected receipt',this.selectedrct);
  }
showColumns(){
 const element = document.getElementById("colModal");
 const modal = new bootstrap.Modal(element);
 if(element){

 modal.show();
 } 
}
 navigateToBanking(): void {
    this.router.navigate(['/home/fms/new-banking-process']);
    
  }
}
export interface receipt {
  batchNo: string;
  slipNo: string;
  bankAcc: string;
  amount: number;
  date: Date;
  assignee: string;
  status: string;
}
