export interface AuthRequisitionDTO {
  cqrNo: number,
  cqrSource: number,
  cqrRef: string,
  cqrRefDate: string,
  cqrNarrative: string,
  cqrBrhCode: string,
  cqrFmsRemarks: string,
  cqrAmount: number,
  cqrPayee: string,
  cqrCurCode: number,
  cqrBctCode: number,
  cqrChqNo: string,
  cqrChqDt: string,
  cqrChqWords: string,
  cqrCstStatus: string,
  cqrSourceAuthBy: number,
  cqrSourceAuthDt: string,
  cqrReqBy: number,
  cqrReqDt: string,
  cqrChqPrnBy: number,
  cqrChqPrnDt: string,
  cqrChqCancelledBy: number,
  cqrChqCancelledDt: string,
  cqrPmtType: string,
  cqrRef2: string,
  cqrBctBrhCode: number,
  cqrPmtVchNo: number,
  cqrPhysicalAddress: string,
  cqrPostalAddress: string,
  cqrAuthRejectedBy: number,
  cqrAuthRejectedDt: string,
  cqrChqUpdatedBy: number,
  cqrChqUpdatedDt: string,
  cqrParentNo: number,
  cqrEftPrn: string,
  cqrCpyNo: number,
  cqrVatRate: number,
  cqrVatCertNo: string,
  cqrItfcTransCode: number,
  cqrItfcref3: number,
  cqrSplit: string,
  cqrSplitDt: string,
  cqrSplitBy: number,
  cpyName: string,
  cpyPinNo: string,
  cpyVatNo: string,
  cqrSecurityCode: string,
  bctSecurityCodeRqd: string,
  cqrCtCode: string,
  bctChqTypeRqd: string,
  bctChqFile: string,
  sysShtDesc: string,
  cpyIdNo: string,
  cqrCurrate: number,
  dmsDocViewable: string,
  dmsDocEndpoint: string,
  dmsDocEndpointParamName: string,
  cpySamName: string,
  bankName: string,
  cqrAuthorisedBy: string,
  cqrRequisitionBy: string,
  currencyName: string
}
export interface eftDTO {
  bbrBranchName: string,
  bbrCode: number,
  bnkBankName: string,
  bnkCode: number,
  brhCode: number,
  chequeAmount: number,
  chequeBatchNo: null,
  chequeCpyNo: number,
  chequeCstStatus: string,
  chequeCstStatusDesc: string,
  chequeNarrative: string,
  chequeNo: number,
  chequeRef: string,
  chequeRef2: string,
  chequeRefDate: string,
  chequeSinglePayeeCon: string,
  chequeSource: number,
  chequerFmsRemarks: string,
  cpyName: string,
  disableControls: string,
  eftStatus: string,
  mandatesComplete: string,
  pyAccNo: string,
  toolTip: string,
  userEligible: string
}

export interface PaymentBankAccountsDTO {
  bankSlipReportNo: number,
  bctBbrCode: number,
  by: number,
  chequeFile: string,
  chequePrinter: string,
  chequeTypeRequired: string,
  coaNo: string,
  coaOrgCode: number,
  code: number,
  currencyChequeNo: number,
  currencyCode: number,
  dateFrom: string,
  dateOpened: string,
  dateTo: string,
  defaultBank: string,
  documentRequired: string,
  eftChequeRequired: string,
  eftFile: string,
  eftFolder: string,
  maxChequeLmt: number,
  mftFile: string,
  minBalance: number,
  name: string,
  number: string,
  paymentMode: string,
  reconStartDate: string,
  ref: string,
  restrictUser: string,
  restrictUser1: string,
  rtgsChequeRequired: string,
  rtgsEft: string,
  securityCodeRequired: string,
  status: string,
  type: string,
  userRestricted: string
}

export interface EftPaymentTypesDTO {
  chqPaymentDesc: string,
  chqPaymentType: string
}

export interface PaymentModesDTO{
code: string;
orgCode: number;
description: string;
clearingRequired: string;
collectAccount: string;
minAmount:  number;
maxAmount:  number;
sortOrder: number;
grossReceiptingAllowed: string;
documentRequired: string;
amountEditable: string;
rateApplicable: string;
rate: number;
accountNumber: string;
isDefault: string;
accountType: string;
referenceUnique: string;
referenceLength: number;
emailApplicable: string;
bankRateType: string
}
export interface EligibleAuthorizersDTO {
  signatoryType: string,
  userName: string,
  jointSignatoryType: string,
  dsgnDescription: string
}

export interface ApprovedChequeMandatesDTO {
  chequeNo: number,
  userName: string,
  authorizationDate: string,
  voucherNo: number,
  remarks: string,
  id: number
}

export interface TransactionalDetailsDTO {
  chequeNo: number,
  chequeSource: string,
  chequeRef: string,
  chequeRefDate: string,
  chequeNarrative: string,
  chequeTransactionBranch: string,
  chequeAmount: number,
  currency: string,
  bank: string,
  chequeNumber: string,
  chequeDate: string,
  chequeAmountInWords: string,
  chequePayee: string,
  payeeBank: string,
  actionBy1: string,
  date1: string,
  actionBy2: string,
  date2: string,
  requisitionBy: string,
  reqDate: string,
  authorisedBy: string,
  sourceAuthDate: string
}
