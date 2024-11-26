export interface NormalReceipt {
    receiptNo: string;
    policyNo: string;
    paymentMemo: string;
    amount: number;
    authorizationDate: Date;
    captureDate: Date;
    status: 'Pending' | 'Authorized' | 'Rejected';
    selected: boolean;
    hasBankAccount?: boolean;
    rejectionRemarks?: string;
  }
  
  export interface BatchReceipt {
    statementNo: string;
    totalAmount: number;
    status: 'Pending' | 'Authorized' | 'Rejected';
    selected: boolean;
  }