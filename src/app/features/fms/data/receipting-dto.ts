export interface GenericResponse<F> {
  data: F;
  msg: string;
  success: boolean;
}
export interface UsersDTO {
  id: number;
  name: string;
  username: string;
  emailAddress: string;
  dateOfBirth: Date;
  status: string;
  userType: string;
  telNo: number;
  phoneNumber: string;
  otherPhone: number;
  personelRank: number;
  countryCode: number;
  townCode: number;
  physicalAddress: string;
  postalCode: number;
  departmentCode: number;
  activatedBy: string;
  updateBy: string;
  dateCreated: Date;
  profilePicture: string | null;
  organizationId: number;
  organizationGroupId: number;
  supervisorId: number;
  branchId: number;
  gender: string;
  pinNumber: number;
  idNumber: number;
}
export interface BranchDTO {
  bnsCode: number;
  countryId: number;
  countryName: string;
  emailAddress: string;
  generalPolicyClaim: string;
  id: number;
  logo: string;
  manager: string;
  managerAllowed: string;
  managerId: number;
  managerName: string;
  managerSeqNo: string;
  name: string;
  organizationId: number;
  overrideCommissionAllowed: string;
  physicalAddress: string;
  policyPrefix: string;
  policySequence: number;
  postalAddress: string;
  postalCode: number;
  regionId: number;
  regionName: string;
  shortDescription: string;
  stateId: number;
  stateName: string;
  telephone: string;
  townId: number;
  townName: string;
}
export interface DeleteAllocationResponseDTO {
  msg: string;
  success: boolean;
  data: any; // Adjust the type if you have a specific structure for the data
}
export interface CurrencyDTO {
  code: number;
  symbol: string;
  desc: string;
  roundOff: number;
}
export interface ExchangeRateDTO {
  data: string;
}
export interface ReceiptNumberDTO {
  bankAccountCode: number;
  bankAccountBranchCode: number;
  bankAccountName: string;
  bankAccountType: string;
  receiptingPointId: number;
  receiptingPointName: string;
  receiptingPointAutoManual: string;
  branchReceiptNumber: number;
  receiptNumber: string;
}
export interface ManualExchangeRateDTO {
  data: string;
}
// DTO for the response schema
export interface ManualExchangeRateResponseDTO {
  msg: string;
  success: boolean;
  data: string | object; // Adjust type if necessary (e.g., object or another type)
}

// export interface DrawersBankDTO {
//   bankName: string;
// branchName: string | null;
// refCode: string | null;
// code: number;
// }

export interface NarrationDTO {
  code: number;
  narration: string;
}
export interface ReceiptingPointsDTO {
  id: number;
  name: string;

  autoManual: string;
  printerName: string | null;
  userRestricted: string;
}
export interface BanksDTO {
  code: number;
  branchCode: number;
  name: string;
  type: string;
  defaultBank: string;
}
export interface PaymentModesDTO {
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
export interface ChargesDTO {
  id: number;
  name: string;
  accNo: string;
  branchCode: number;
  orgCode: number;
  tempReceiptExpensesList: [
    {
      id: number;
      receiptCharge: string;
      amount: number;
      receiptNo: number;
    }
  ];
}
export interface ChargeManagementDTO {
  addEdit: string;
  receiptExpenseId?: number;
  receiptNo: number;
  receiptChargeId: number;
  receiptChargeAmount: number;
  suspenseRct: string;
}
// export interface ExistingChargesResponseDTO {
//   msg: string;
//   success: boolean;
//   data: any[]; // Replace `any[]` with the specific type if known
// }
export interface ExistingChargesResponseDTO {
  id: number;
  receiptChargeId: number;
  amount: number;
  receiptNO: number;
  receiptChargeName: string;
}
export interface UploadReceiptDocsDTO {
  originalFilename: string;
  docDescription: string;
  username: string;
  receiptNumber: number;
  userCode: number;
  uploadedFiles: string[];
}

export interface AccountTypeDTO {
  branchCode: number;
  userCode: number;
  code: number;
  systemCode: number;
  accCode: number;
  name: string;
  coaAccNumber: string;
  coaAccOrgCode: number;
  coaBranchCode: number;
  receiptBank: number;
  chequeBank: number;
  subClass: string;
  active: string;
  receiptAccount: string;
  restrictGrossDebitRcpt: string;
  vatApplicable: string;
  rateApplicable: number;
  actTypeShtDesc: string;
  systemName: string;
}

export interface ClientsDTO {
  tableUsed: string;
  code: number;
  accountCode: number;
  shortDesc: string;
  name: string;
  acctNo: string;
  systemCode: number;
  systemShortDesc: string;
  receiptType: string;
}
export interface TransactionDTO {
  systemShortDescription: string;
  transactionNumber: number;
  transactionDate: Date;
  referenceNumber: string;
  transactionType: string;
  clientCode: number;
  amount: number;
  balance: number;
  commission: number;
  withholdingTax: number;
  transactionLevy: number;
  serviceDuty: number;
  settlementAmount: number;
  narrations: string;
  accountCode: string;
  clientPolicyNumber: string;
  receiptType: string;
  extras: number;
  policyHolderFund: number;
  agentDiscount: number;
  policyBatchNumber: number;
  propertyCode: number;
  clientName: string;
  vat: number;
  commissionPayable: number;
  vatPayable: number;
  healthFund: number;
  roadSafetyFund: number;
  clientVatAmount: number;
  certificateCharge: number;
  motorLevy: number;
  originalInstallmentPremium: number;
  outstandingPremiumBalance: number;
  nextInstallmentNumber: number;
  paidToDate: Date;
  transmissionReferenceNumber: string;
}

export interface ReceiptParticular {
  receiptNumber: number;
  capturedBy: number;
  systemCode: number;
  branchCode: number;
  clientCode: number;
  clientShortDescription: string;
  receiptType: string;
  clientName: string;
  sslAccountCode: number;
  accountTypeId: string;
  referenceNumber: string;
  receiptParticularDetails: ReceiptParticularDetail[];
}

export interface ReceiptParticularDetail {
  policyNumber: string;
  referenceNumber: string;
  transactionNumber: number;
  batchNumber: number;
  premiumAmount: number;
  loanAmount: number;
  pensionAmount: number;
  miscAmount: number;
  endorsementCode: number;
  endorsementDrCrNumber: string;
  includeCommission: string;
  commissionAmount: number;
  overAllocated: number;
  includeVat: string;
  clientPolicyNumber: string;
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
  narration?: string;
  policyNumber?: number;

  date?: Date;
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
export interface ReceiptSaveDTO {
  receiptNo: number | string;
  receiptCode: string;
  receiptDate: string;
  amount: number | string;
  paidBy: string;
  currencyCode: number | string;
  branchCode: number | string;
  paymentMode: string;
  paymentMemo: string;
  docDate: string;
  drawerBank: string;
  userCode: number;
  narration: string;
  insurerAccount: string;
  receivedFrom: string;
  grossOrNet: string;
  sysShtDesc: string;
  receiptingPointId: number;
  receiptingPointAutoManual: string;
  capitalInjection: string;
  chequeNo: number;
  ipfFinancier: string;
  receiptSms: string;
  receiptChequeType: string;
  vatInclusive: string;
  rctbbrCode: number;
  directType: string;
  pmBnkCode: number;
  dmsKey: string;
  currencyRate: number;
  internalRemarks: string;
  manualRef: string;
  bankAccountCode: number | string;
  grossOrNetAdminCharge: string;
  insurerAcc: number;
  grossOrNetWhtax: string;
  grossOrNetVat: string;
  sysCode: number;
  bankAccountType: string;
  receiptParticularDetailUpdateRequests?: {
    receiptParticularDetailCode: number;
    premium: number;
    loan: number;
    pension: number;
  }[];
}
export interface ReceiptParticularDetailsDTO {
  policyNumber: string;
  referenceNumber: string;
  transactionNumber: number;
  batchNumber?: number;
  premiumAmount?: number;
  loanAmount?: number;
  pensionAmount?: number;
  miscAmount?: number;
  endorsementCode?: number;
  endorsementDrCrNumber?: string;
  includeCommission: string; // 'Y' or 'N'
  commissionAmount: number;
  overAllocated: number;
  includeVat: string; // 'Y' or 'N'
  clientPolicyNumber: string;
}

export interface ReceiptParticularDTO {
  receiptNumber: number;
  capturedBy: number;
  systemCode: number;
  branchCode: number;
  clientCode: number;
  clientShortDescription: string;
  receiptType: string;
  clientName: string;
  sslAccountCode: number;
  accountTypeId: string;
  referenceNumber: string;
  receiptParticularDetails: ReceiptParticularDetailsDTO[];
}

export interface AllocationDTO {
  receiptParticulars: ReceiptParticularDTO[];
}
export interface GetReceiptParticularDetailDTO {
  code: number;
  rctpCode: number;
  policyNumber: string;
  referenceNumber: string;
  transactionNumber: number;
  batchNumber: number;
  premiumAmount: number;
  loanAmount: number;
  pensionAmount: number;
  miscAmount: number;
  endorsementCode: number;
  endorsementDrCrNumber: string;
  includeCommission: string; // 'Y' or 'N'
  commissionAmount: number;
  overAllocated: number;
  includeVat: string; // 'Y' or 'N'
  policyType: string;
  accountNumber: string;
  narration: string;
  side: string;
  currencyCode: number;
  currencyRate: number;
  clientPolicyNumber: string;
  directType: string;
}

export interface GetAllocationDTO {
  code: number;
  receiptNumber: number;
  date: string;
  captureDate: string;
  capturedBy: number;
  amount: number;
  applicationId: number;
  branchCode: number;
  clientCode: number;
  clientShortDescription: string;
  receiptType: string;
  accountTypeId: string;
  sslAccountCode: number;
  receiptPrimaryKey: number;
  receiptMasterCode: number;
  clientDescription: string;
  referenceNumber: string;
  exceptionRaised: string; // 'Y' or 'N'
  exceptionRemarks: string;
  source: string; // 'Y' or 'N'
  sourceChannel: string;
  previousReceiptNumber: number;
  transactionCharge: number;
  receiptParticularDetails: GetReceiptParticularDetailDTO[];
}

export interface GetAllocationResponseDTO {
  msg: string;
  success: boolean;
  data: AllocationDTO[];
}
export interface printDTO {
  receiptNumber: number;
  receiptDate: Date;
  captureDate: Date;
  capturedBy: number;
  amount: number;
  paymentMode: string;
  paymentMemo: string;
  paidBy: string;
  documentDate: Date;
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
  batchCode: number;
  branchReceiptNumber: number;
  branchReceiptCode: string;
  drawersBank: string;
  accountTypeId: string;
  bankBranchCode: number;
  receiptType: string;
  cancelledBy: number;
  cbPosted: string;
  sourcePosted: string;
  netGrossFlag: string;
  glAccount: string;
  parentNumber: number;
  cancelledDate: Date;
  voucherNumber: number;
  reverseVoucherNumber: number;
  bankChargeAmount: number;
  clientChargeAmount: number;
  vatCertificateNumber: string;
  policyType: string;
  remarks: string;
  agentCode: number;
  receivedFrom: string;
  collectionAccountCode: number;
  cleared: string;
  divisionCode: number;
  clearedBy: number;
  clearedDate: string;
  batchRecordId: number;
  multiOrg: string;
  sourceOrganization: number;
  multiOrgAmount: number;
  directReceipt: string;
  insurerAccount: number;
  receiptingPointId: number;
  fixedExchangeRate: string;
  fixedExchangeCurrencyRate: number;
  manualReference: string;
  banked: string;
  unallocatedAmount: number;
  grossAmount: number;
  capitalInjectionFlag: string;
  cancelSourcePosted: string;
  ipfFinancier: string;
  ipfNumber: number;
  ocqNumber: number;
  smsNotification: string;
  currencyRate: number;
  isPostDatedCheque: string;
  postDatedChequeNotification: string;
  acknowledgementPrinted: string;
  uniqueVal: number;
  raiseException: string;
  exceptionAuthorizedBy: number;
  exceptionAuthDate: string;
  loadIndicator: string;
  authorizationStatus: string;
}
export interface ReceiptUploadRequest {
  docType: string;
  docData: string;
  module: string;
  originalFileName: string;
  filename: string;
  referenceNo: string;
  docDescription: string;
  amount: number;
  paymentMethod: string;
  policyNumber: string;
}
export interface FileDescription {
  file: File;
  description: string;
}
export interface ReceiptRequest {
  docType: string;
  docData: string;
  module: string;
  referenceNo: string;
  originalFileName: string;
  description: string;
  amount: number;
  paymentMethod: string;
  filename: string;
  policyNumber: string;
}
export interface Allocation {
  referenceNo: string;
  amount: number;
  policyNumber: string;
  // ... add other allocation properties you need
}
// export interface YearDTO {
//   msg: string;
//   success: boolean;
//   data: DataItem[];
// }

// export interface DataItem {
//   year: string;
//   branch_code: number;
//   wef: Date;
//   wet: Date;
//   state: string;
//   balance: string;
//   transaction: string;
//   periods: Period[];
// }

// export interface Period {
//   period: string;
//   branch_code: number;
//   year: string;
//   wef: Date;
//   wet: Date;
//   counter: number;
//   state: string;
//   start: string;
//   orgCode: number;
//   currentPeriod: number;
//   curPeriod: number;
//   transacted: string;
//   closedByUser: number;
//   closedByUserName: string;
// }
export interface YearDTO {
  msg: string;
  success: boolean;
  data: DataItem[];
}

export interface DataItem {
  year: string;
  branch_code: number; // Matches API response
  wef: string; // Change to string or handle Date conversion
  wet: string;
  state: string;
  balance: string;
  transaction: string;
  periods: Period[];
}

export interface Period {
  period: string;
  branch_code: number;
  year: string;
  wef: string;
  wet: string;
  counter: number;
  state: string;
  start?: string | null; // Can be null
  orgCode?: number | null;
  currentPeriod?: number | null;
  curPeriod?: number | null;
  transacted: string;
  closedByUser?: number | null;
  closedByUserName?: string | null;
}

