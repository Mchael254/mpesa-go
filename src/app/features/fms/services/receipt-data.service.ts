import { Injectable } from '@angular/core';
import { TransactionDTO } from '../data/receipting-dto'; // Adjust path as needed
import { retry } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptDataService {
  private defaultOrg: any = null;
  private selectedOrg: any = null;
  private defaultBranch: any = null;
  private selectedBranch: any = null;
  private receiptData: any = {};
  private selectedClient: any = null; // Store selected client globally
  private selectedCurrency: number | null = null; // Store selected currency
  private selectedBankCode: number | null = null; // Store selected bank
  private globalAccountTypeSelected: any = null;
  private transactions: TransactionDTO[] = [];
  private allocatedAmounts: {
    allocatedAmount: number;
    commissionChecked: string;
    
  }[] = [];
  private receiptDataSubject = new BehaviorSubject<any>(null);
  receiptData$ = this.receiptDataSubject.asObservable();
  private selectedCurrencySubject = new BehaviorSubject<number | null>(null);
  private defaultCurrencySubject = new BehaviorSubject<number | null>(null);
  setReceiptData(data: any) {
    this.receiptData = { ...this.receiptData, ...data
     
     };
     this.receiptDataSubject.next(this.receiptData); // Notify subscribers
    
  }

  getReceiptData() {
    return this.receiptData;
  }
  private formState = new BehaviorSubject<any>(null);
formState$ = this.formState.asObservable();

setFormState(state: any) {
  this.formState.next(state);
  localStorage.setItem('receiptFormState', JSON.stringify(state)); // Optional persistence
}

getFormState() {
  return this.formState.value || JSON.parse(localStorage.getItem('receiptFormState') || '{}');
}

clearFormState() {
  this.formState.next(null);
  localStorage.removeItem('receiptFormState');
}
   // New methods to store/retrieve currency and bank
   setSelectedCurrency(currencyId: number) {
    this.selectedCurrency = currencyId;
  }

  getSelectedCurrency(): number | null {
    return this.selectedCurrency;
  }

  setSelectedBank(bankCode: number) {
    this.selectedBankCode = bankCode;
  }

  getSelectedBank(): number | null {
    return this.selectedBankCode;
  }
  setDefaultCurrency(currencyId: number): void {
    this.defaultCurrencySubject.next(currencyId);
  }

  getDefaultCurrency(): number | null {
    return this.defaultCurrencySubject.value;
  }
  setGlobalAccountTypeSelected(account: any): void {
    this.globalAccountTypeSelected = account;
    localStorage.setItem('globalAccountTypeSelected', JSON.stringify(account)); // Persist data
  }
  getGlobalAccountTypeSelected(): any {
    return (
      this.globalAccountTypeSelected ||
      JSON.parse(localStorage.getItem('globalAccountTypeSelected') || '{}')
    );
  }
  setSelectedClient(client: any): void {
    this.selectedClient = client;
    localStorage.setItem('selectedClient', JSON.stringify(client)); // Persist data
  }

  getSelectedClient(): any {
    return (
      this.selectedClient ||
      JSON.parse(localStorage.getItem('selectedClient') || '{}')
    );
  }

  setTransactions(transactions: TransactionDTO[]) {
    this.transactions = transactions;
    this.allocatedAmounts = transactions.map(() => ({
      allocatedAmount: 0,
      commissionChecked: 'N',
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
    // Set Default Organization
    setDefaultOrg(org: any) {
      this.defaultOrg = org;
      this.selectedOrg = null; // Reset selectedOrg if defaultOrg exists
      
      // localStorage.setItem('defaultOrg', JSON.stringify(org));
      // localStorage.removeItem('selectedOrg'); // Ensure selectedOrg is cleared
    }
    getDefaultOrg() {
      return this.defaultOrg || null;
    }

  // Set Selected Organization
  setSelectedOrg(org: any) {
    this.selectedOrg = org;
    this.defaultOrg = null; // Reset defaultOrg if user selects a new org
    
    // localStorage.setItem('selectedOrg', JSON.stringify(org));
    // localStorage.removeItem('defaultOrg'); // Ensure defaultOrg is cleared
  }

  getSelectedOrg() {
    return this.selectedOrg || null;
  }
    // Set Default Branch
    setDefaultBranch(branch: any) {
      this.defaultBranch = branch;
      this.selectedBranch = null; // Reset selectedBranch if defaultBranch exists
      //localStorage.setItem('defaultBranch', JSON.stringify(branch));
    }
  
    getDefaultBranch() {
      return this.defaultBranch || JSON.parse(localStorage.getItem('defaultBranch') || 'null');
    }
      // Set Selected Branch
  setSelectedBranch(branch: any) {
    this.selectedBranch = branch;
    this.defaultBranch = null; // Reset defaultBranch if user selects a new branch
    //localStorage.setItem('selectedBranch', JSON.stringify(branch));
  }

  getSelectedBranch() {
    return this.selectedBranch || JSON.parse(localStorage.getItem('selectedBranch') || 'null');
  }
   
  // Clear organization and branch data
  clearOrgAndBranchData() {
    this.receiptData.defaultOrg = null;
    this.receiptData.selectedOrg = null;
    this.receiptData.defaultBranch = null;
    this.receiptData.selectedBranch = null;
    this.setReceiptData({
      defaultOrg: null,
      selectedOrg: null,
      defaultBranch: null,
      selectedBranch: null,
    });
  }
  clearReceiptData() {
    // Preserve required fields
    const preservedData = {
        currency: this.receiptData.currency || '',
        receiptDate: this.receiptData.receiptDate || '',
        documentDate: this.receiptData.documentDate || ''
    };

    // Reset receiptData while keeping preserved fields
    this.receiptData = { ...preservedData };

    // Notify subscribers that data has been reset
    this.receiptDataSubject.next(this.receiptData);
}

}
