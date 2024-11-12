export interface CurrencyDTO{
  "code": number;
  "symbol": string;
  "desc": string;
  "roundOff": number
}
// export interface ReceiptNumberDTO{
//   bankAccountCode: number;
//     bankAccountBranchCode: number;
//     bankAccountName: string;
//     bankAccountType: string;
//     receiptingPointId: number;
//     receiptingPointName: string;
//     receiptingPointAutoManual: string;
//     branchReceiptNumber: number;
//     receiptNumber: string;
//     newCurrencyExchangeRateAmount: number
// }
export interface DrawersBankDTO {
  bankName: string;
branchName: string | null;
refCode: string | null;
code: number; 
}
export interface NarrationDTO{
  code:number;
  narration:string;
}
export interface ReceiptingPointsDTO{
  id: number;
    name: string;
    code?:number;
    autoManual: string;
    printerName: string;
    userRestricted: string;
}

export interface PaymentModesDTO{
  code: string;
  desc: string;
  clearingRequired: string;
  collectAcc: string;
  minAmt: number;
  maxAmt: number;
  grossRctngAllowed: string;
  docRqrd: string;
  amtEditable: string;
  rate: number;
  accNumber: string;
  accName: string;
  accountType: string;
  refUnique: string;
  refLength: number;
  emailApplicable: string;
  bnkRateType: string;

}
export interface GroupBusinessAccount {
    accountNumber: string; // Primary key for this data type
    accountName: string; 
    businessUnit: string; // Assuming you need to connect to a business unit 
    balance: number;
    currency: string; 
   
  }
  export interface GlAccount {
    accountNumber: string;
    accountName: string;
    description: string;
    balance: number;
    currency: string; 
    // Add any other relevant GL Account properties 
  }


export interface Client {
    clientName: string;
    policyNumber: string;
    debitNote: string;
    accountNumber: string;
    amountInsured: number;
    allocatedAmount: number;
    
  }
export interface Transaction {
    detailProperty1?: string;
    detailProperty2?: string;
    id?: number;
    clientName: string;
    amount?: number;
    allocatedAmount?: string;
    narration?:string;
    policyNumber?:number;

    date?:Date
  }
  
export interface Receipt {
  amountIssued: number;
  openCheque: string;
  ipfFinancier: string;
  grossReceiptAmount: string;
  receivedFrom: string;
  drawersBank: string;
  receiptDate: Date;
  narration: string;
  paymentRef: string;
  otherRef: string;
  documentDate: string;
  manualRef: string;
  currency: string;
  paymentMode: string;
  bankAccount: string;
  receiptingPoint: string;
  chargeAmount: string;
  selectedChargeType?: string;
  deductions: string;
  capitalInjection: string;
  receiptNumber?: string;
  transactions: Transaction[]; 
}