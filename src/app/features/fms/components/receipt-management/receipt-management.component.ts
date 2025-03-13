import { Component } from '@angular/core';

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

  
  constructor(){}
  ngOnInit():void{};
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
}
