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
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'BL34',
      slipNo: 'SL9',
      bankAcc: '8684',
      amount: 1000,
      status: 'pending',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'BL221',
      slipNo: 'SL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'ML221',
      slipNo: 'WL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'OL221',
      slipNo: 'FL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'LL221',
      slipNo: 'ML670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
    {
      batchNo: 'cL221',
      slipNo: 'xL670',
      bankAcc: '7911X',
      amount: 8889,
      status: 'processed',
      assignee: 'frank',
      date: new Date('2000-02-20'),
    },
  ];
  filteredReceipts: receipt[] = this.receipts; // start as full list
  selectedrct:receipt;
  
  cols: any[]=[];
  selectedColumns: any[]=[];
  displayColumnDialog: boolean = false;
first:number=0;
totalRecords:number=this.filteredReceipts.length;
rows:number=10;
  constructor(public translate: TranslateService, private router: Router) {}
  ngOnInit() {
    this.cols=[
        { field: 'batchNo', header: 'Batch Number' },
      { field: 'slipNo', header: 'Slip Number' },
      { field: 'date', header: 'Date' },
      { field: 'assignee', header: 'Assignee' },
      { field: 'amount', header: 'Amount' },
      { field: 'bankAcc', header: 'Bank Account' },
      { field: 'status', header: 'Status' },
      { field: 'actions', header: 'Actions' }

    ];
    this.selectedColumns=[...this.cols];
  }
 
 
 next() {
        this.first = this.first + this.rows;
    }
 

 navigateToBanking(): void {
    this.router.navigate(['/home/fms/new-banking-process']);
    
  }
  

showColumnsDialogs(){
  this.displayColumnDialog=true;
}
  filter(event: any, fieldName: any): any {
    let inputValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredReceipts = this.receipts.filter((rctobj) => {
      let fieldValue = rctobj[fieldName];
      if (fieldValue instanceof Date) {
        // Format the date consistently for comparison
        fieldValue = fieldValue.toISOString().split('T')[0];
      } else if (typeof fieldValue == 'number') {
        fieldValue = Number(fieldValue);
      } else if(typeof fieldValue == 'string'){
        fieldValue = fieldValue.toString();
      }
      return fieldValue.includes(inputValue);
    });
  }
  clearFilter(): void {
    this.filteredReceipts = this.receipts;
  }
  
  onRow(){
    console.log('selected receipt',this.selectedrct);
  }
showColumns(){
 const element = document.getElementById("colModal");
 const modal = new bootstrap.Modal(element);
 if(element){

 modal.show();
 } 
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
