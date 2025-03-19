import { Component } from '@angular/core';
import { tabledataDTO } from '../../data/receipt-management-dto';

@Component({
  selector: 'app-receipt-management',
  templateUrl: './receipt-management.component.html',
  styleUrls: ['./receipt-management.component.css']
})
export class ReceiptManagementComponent {
  /** @property {number} first - Index of the first row to display in pagination.*/
  first: number = 0;
   /** @property {number} rows - Number of rows to display per page in pagination.*/
   rows: number = 10;

   /** @property {number} totalRecords - Total number of records matching the search criteria.*/
   totalRecords: number = 0;
   tabledata:tabledataDTO[]=[];
  
  paymentMethodFilter: string='';
  receivedFromFilter: string ='';
  receiptDateFilter: string='';
  amountFilter: number | null =null;
  receiptNumberFilter: string;
  filteredtabledata:any;
  printingEnabled:boolean=false;
  cancellationDeactivated:boolean=true;
  constructor(){}
  ngOnInit():void{
    // Initialize the table data
    this.tabledata = [
      {
      receiptNumber:'QXCW33F',
      receiptDate:"23/12/2033",
      receivedFrom:'FRANKLINE',
      amount:234444,
      paymentMethod:'CASH',
  
    },
    {
      receiptNumber:'RQXCW33F',
      receiptDate:"13/23/2033",
      receivedFrom:'FRANKLINE',
      amount:234444,
      paymentMethod:'CASH',
    }]
    this.filteredtabledata=this.tabledata;
  };
  
  moveFirst(state: any) {
    state.first = 0;
  }

  movePrev(state: any) {
    state.first = Math.max(state.first - state.rows, 0);
  }

  moveNext(state: any) {
    state.first = Math.min(
      state.first + state.rows,
      state.totalRecords - state.rows
    );
  }

  moveLast(state: any) {
    state.first = state.totalRecords - state.rows;
  }
isPrintingClicked():void{
  this.printingEnabled=true;
  this.cancellationDeactivated=false;
}
cancleClicked():void{
  this.printingEnabled=false;
  this.cancellationDeactivated=true; 
}
  applyFilter(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;

    switch (field) {
      case 'receiptNumber':
        this.receiptNumberFilter = filterValue;
        break;
      case 'receiptDate':
        this.receiptDateFilter = filterValue;
        break;
      case 'receivedFrom':
        this.receivedFromFilter = filterValue;
        break;
      case 'amount':
        this.amountFilter = filterValue ? Number(filterValue) : null;
        break;
      case 'paymentMethod':
        this.paymentMethodFilter = filterValue ;
        break;
     
    }

    this.filterTransactions(); // Ensure this is called
  }
  filterTransactions(): void {
    this.filteredtabledata = this.tabledata.filter((item) => {
      return (
        (!this.receiptNumberFilter || item.receiptNumber.includes(this.receiptNumberFilter)) &&
        (!this.receiptDateFilter || item.receiptDate.includes(this.receiptDateFilter)) &&
        (!this.receivedFromFilter || item.receivedFrom.includes(this.receivedFromFilter)) &&
        (!this.amountFilter || item.amount === this.amountFilter) &&
        (!this.paymentMethodFilter || item.paymentMethod.includes(this.paymentMethodFilter))
     )} )

  }
}
