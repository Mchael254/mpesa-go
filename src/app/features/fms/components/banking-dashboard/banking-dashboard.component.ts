import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
      batchNo: 'BL34',
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
  ];
  filteredReceipts: receipt[] = this.receipts; // start as full list
  constructor(public translate: TranslateService, private router: Router) {}
  ngOnInit() {}
  navigateToBanking(): void {
    this.router.navigate(['/home/fms/new-banking-process']);
  }
  onRowSelect(event: any) {}
  filter(event: Event, fieldName: string): any {
    let inputValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredReceipts = this.receipts.filter((rctobj) => {
      let fieldValue = rctobj[fieldName];
      if (fieldValue instanceof Date) {
        // Format the date consistently for comparison
        fieldValue = fieldValue.toISOString().split('T')[0];
      } else if (typeof fieldValue == 'number') {
        fieldValue = fieldValue.toString();
      } else {
        fieldValue = fieldValue.toString();
      }
      return fieldValue.includes(inputValue);
    });
  }
  clearFilter(): void {
    this.filteredReceipts = this.receipts;
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
