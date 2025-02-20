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
  private globalAccountTypeSelected: any = null;
  private transactions: TransactionDTO[] = [];
  private allocatedAmounts: {
    allocatedAmount: number;
    commissionChecked: string;
  }[] = [];
  private receiptDataSubject = new BehaviorSubject<any>(null);
  receiptData$ = this.receiptDataSubject.asObservable();

  setReceiptData(data: any) {
    this.receiptData = { ...this.receiptData, ...data,
      amountIssued: this.receiptData.amountIssued ?? data.amountIssued, // Preserve amountIssued
     };
     this.receiptDataSubject.next(this.receiptData); // Notify subscribers
    
  }

  getReceiptData() {
    return this.receiptData;
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
    // Get default organization
    // getDefaultOrg() {
    //   return this.receiptData.defaultOrg;
    // }
    
  // Set selected organization
  // setSelectedOrg(org: any) {
  //   this.receiptData.selectedOrg = org;
  //   this.setReceiptData({ selectedOrg: org });
  // }

  // // Get selected organization
  // getSelectedOrg() {
  //   return this.receiptData.selectedOrg;
  // }
  // Set default branch
  // setDefaultBranch(branch: any) {
  //   console.log('default>',branch);
  //   this.receiptData.defaultBranch = branch;
  //   this.setReceiptData({ defaultBranch: branch });
  // }
 
  // Set selected branch
  // setSelectedBranch(branch: any) {
  //   this.receiptData.selectedBranch = branch;
  //   this.setReceiptData({ selectedBranch: branch });
  // }
  // setSelectedBranch(branch: any) {
  //   if (branch) {
  //     this.receiptData.selectedBranch = branch;
  //     this.receiptData.defaultBranch = null; // Clear default branch when selecting a branch
  //   } else {
  //     this.receiptData.selectedBranch = null;
  //   }
  //   this.setReceiptData({ selectedBranch: branch, defaultBranch: null });
  // }
  // // Get selected branch
  // getSelectedBranch() {
  //   return this.receiptData.selectedBranch;
  // }
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
