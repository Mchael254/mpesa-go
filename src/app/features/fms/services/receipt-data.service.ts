import { Injectable } from '@angular/core';
import { TransactionDTO } from '../data/receipting-dto'; // Adjust path as needed
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptDataService {
  private receiptData: any = {};
  private selectedClient: any = null; // Store selected client globally
  private globalAccountTypeSelected:any=null;
  private transactions: TransactionDTO[] = [];
  private allocatedAmounts: { allocatedAmount: number, commissionChecked: string }[] = [];

  setReceiptData(data: any) {
    this.receiptData = { ...this.receiptData, ...data };
  }

  getReceiptData() {
    return this.receiptData;
  }
  setGlobalAccountTypeSelected(account:any):void{
    this.globalAccountTypeSelected=account;
    localStorage.setItem('globalAccountTypeSelected', JSON.stringify(account)); // Persist data
  }
  getGlobalAccountTypeSelected():any{
    return this.globalAccountTypeSelected || JSON.parse(localStorage.getItem('globalAccountTypeSelected') || '{}')

  }
  setSelectedClient(client: any): void {
    this.selectedClient = client;
    localStorage.setItem('selectedClient', JSON.stringify(client)); // Persist data
  }

  getSelectedClient(): any {
    return this.selectedClient || JSON.parse(localStorage.getItem('selectedClient') || '{}');
  }

  setTransactions(transactions: TransactionDTO[]) {
    this.transactions = transactions;
    this.allocatedAmounts = transactions.map(() => ({
      allocatedAmount: 0,
      commissionChecked: 'N'
    }));
  }

  getAllocatedAmounts() {
    return this.allocatedAmounts;
  }

  updateAllocatedAmount(index: number, amount: number) {
    this.allocatedAmounts[index].allocatedAmount = amount;
  }

  updateCommissionChecked(index: number, isChecked: boolean) {
    this.allocatedAmounts[index].commissionChecked = isChecked ? 'Y' : 'N';
  }
  getTransactions(): TransactionDTO[] {
    return this.transactions;
  }
}
