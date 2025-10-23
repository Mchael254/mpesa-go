// Interface for the objects within the content array
export interface unPrintedReceiptContentDTO {
  no: number;
  receiptDate: string;
  captureDate: string;
  capturedBy: number;
  amount: number;
  paymentMode: string;
  paymentMemo: string | null; // Allow null
  paidBy: string;
  documentDate: string | null; // Allow null
  description: string;
  printed: string; // Typically 'Y' or 'N'
  applicationSource: number;
  accountCode: number;
  accountType: string | null; // Allow null
  branchCode: number;
  accountShortDescription: string;
  currencyCode: number;
  bankAccCode: number;
  cancelled: string; // Typically 'Y' or 'N'
  commission: number;
  batchCode: number | null; // Allow null
  branchReceiptNumber: number;
  branchReceiptCode: string;
  drawersBank: string;
  accountTypeId: string;
  bankBranchCode: number;
  receiptType: string;
  cancelledBy: number | null; // Allow null
  reference: string | null; // Allow null
  cbPosted: string; // Typically 'Y' or 'N'
  sourcePosted: string; // Typically 'Y' or 'N'
  netGrossFlag: string;
  glAccount: string;
  parentNumber: number | null; // Allow null
  cancelledDate: string | null; // Allow null
  voucherNumber: number;
  reverseVoucherNumber: number | null; // Allow null
  errorMessage: string | null; // Allow null
  bankChargeAmount: number | null; // Allow null
  clientChargeAmount: number | null; // Allow null
  vatCertificateNumber: string | null; // Allow null
  policyType: string | null; // Allow null
  remarks: string | null; // Allow null
  agentCode: number;
  receivedFrom: string;
  collectionAccountCode: number | null; // Allow null
  manualReference: string | null; // Allow null
  banked: string; // Typically 'Y' or 'N'
  allocation: string; // Typically 'Y' or 'N'
  totalAllocation: number;
  totalAllocation2: number;
}

// Interface for the sort object within pageable (can be simple if not used)
export interface PageableSortDTO {
  sorted?: boolean;
  empty?: boolean;
  unsorted?: boolean;
}

export interface PageableDTO {
  pageNumber: number;
  pageSize: number;
  sort: PageableSortDTO[]; // Match API response (array)
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

// Interface for the main response structure
export interface unPrintedReceiptsDTO {
  msg: string; // Renamed from message
  success: boolean; // Changed type to boolean
  data: {
    content: unPrintedReceiptContentDTO[]; // Array of content objects
    pageable: PageableDTO;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number; // Already existed
    sort: any[]; // Changed type to array (matches API response `sort: []`)
    numberOfElements: number; // Already existed
    empty: boolean; // Already existed
  };
}
export interface cancelReceiptDTO {
  no: number;
  remarks: string;
  isChargeRaised: string;
  cancellationDate: string;
  bankAmount: number;
  clientAmount: number;
  userCode: number;
  branchCode: number;
  bankChargesGlAcc: number;
  otherChargesGlAcc: number;
}
export interface ReceiptToCancelDTO {
  msg: string;
  success: boolean;
  data: {
    content: ReceiptsToCancelContentDTO[];
    pageable: PageableDTO;

    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: any[];
    numberOfElements: number;
    empty: boolean;
  };
}

export interface ReceiptsToCancelContentDTO {
  receiptNumber: number;
  receiptDate: string;
  captureDate: string;
  capturedBy: number;
  amount: number;
  paymentMode: string;
  paymentMemo: string;
  paidBy: string;
  documentDate: string;
  description: string;
  printed: string;
  applicationSource: number;
  accountCode: number;
  accountType: string;
  branchCode: number;
  accountShortDescription: string;
  currencyCode: number;
  bankAccCode: number;
  cancelled: string;
  commission: number;
  batchCode: string;
  branchReceiptNumber: number;
  branchReceiptCode: string;
  drawersBank: string;
  accountTypeId: string;
  bankBranchCode: number;
  receiptType: string;
  cancelledBy: string;
  reference: string;
  cbPosted: string;
  sourcePosted: string;
  netGrossFlag: string;
  glAccount: string;
  parentNumber: string;
  cancelledDate: string;
  voucherNumber: number;
  reverseVoucherNumber: string;
  errorMessage: string;
  bankChargeAmount: string;
  clientChargeAmount: string;
  vatcertificateNumber: string;
  policyType: string;
  remarks: string;
  agentCode: number;
  receivedFrom: string;
  collectionAccountCode: number;
  manualReference: string;
  banked: string;
  allocation: string;
  totalAllocation: number;
  totalAllocation2: number;
}
export interface glContentDTO {
  account_number: string;
  account_name: string;
  branch_code: number;
  organization_code: string;
}
export interface glAccountDTO {
  msg: string;
  success: boolean;
  data: {
    totalPages: number;
    totalElements: number;
    pageable: PageableDTO;
    first: boolean;
    last: boolean;
    size: number;
    content: glContentDTO;
    number: number;
    sort: PageableSortDTO;
    numberOfElements: number;
    empty: boolean;
  };
}
export interface shareReceiptDTO{
  shareType:string;
  clientName:string;
  recipientEmail:string;
  recipientPhone:string;
  receiptNumber:string;
  orgCode:string;
}

export interface GLAccountDTO {
  account_number: string;
  account_name: string;
}
  branchReceiptCode:string;
}
