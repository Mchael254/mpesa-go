export interface ReceiptsToBankRequest {
  dateFrom: string;
  dateTo: string;
  orgCode: number;
  payMode: string;
  includeBatched?: string;
  bctCode?: number;
  brhCode?: number;
  
}
export interface ReceiptDTO {
  receiptNo: number;
  receiptDate: string;
  receiptCaptureDate: string;
  receiptCapturedByCode: number;
  receiptAmount: number;
  paymentMode: string;
  description: string;
  printed: string;
  accountCode: number;
  branchCode: number;
  status: string;
  paidBy: string;
  receivedFrom: string;
  capturedByUser: string;
  userEmail: string;
  allocationStatus: string;
}
export interface assignUserRctsDTO{
  userId: number;
  receiptNumbers:number[];
}