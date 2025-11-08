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
  batchAssignmentId: null;
  batchAssignmentDate: any;
  batchAssignmentRefNo: any;
  totalAllocatedKnown: number;
  totalAllocatedUnknown: number;
  batchAssignmentUserName: string | null;
  batchAssignmentUserId:number | null;
}
export interface assignUserRctsDTO {
  userId: number;
  receiptNumbers: number[];
}
export interface DeAssignDTO {
  receiptNumbers: number[];
}
export interface ReAssignUserDTO{
    fromUserId: number;
  toUserId: number;
  receiptNumbers: number[]
}