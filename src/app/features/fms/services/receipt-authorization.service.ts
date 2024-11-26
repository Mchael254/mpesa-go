import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NormalReceipt, BatchReceipt }  from '../data/receipt-authorization-dto';

@Injectable({
  providedIn: 'root'
})
export class ReceiptAuthorizationService {

  private normalReceipts: NormalReceipt[] = [
    { receiptNo: 'RCPT123', policyNo: 'POL101', paymentMemo: 'Premium Payment', amount: 1500, captureDate: new Date('2023-12-15'), authorizationDate: new Date('2023-12-15'), status: 'Pending', selected: false },
    { receiptNo: 'RCPT456', policyNo: 'POL202', paymentMemo: 'Renewal Payment', amount: 2000, captureDate: new Date('2023-12-16'), authorizationDate: new Date('2023-12-16'), status: 'Pending', selected: false },
    // Add more dummy data here
  ];

  private batchReceipts: BatchReceipt[] = [
    { statementNo: 'STMT789', totalAmount: 5000, status: 'Pending', selected: false },
    { statementNo: 'STMT101', totalAmount: 3000, status: 'Pending', selected: false },
    // Add more dummy data here
  ];

  constructor(private http: HttpClient) { }

  /**
   * Fetches normal receipts from the service.
   * @returns Observable of NormalReceipt[].
   */
  getNormalReceipts(): Observable<NormalReceipt[]> {
    // Replace this with your actual API call to get normal receipts
    return of(this.normalReceipts);
  }

  /**
   * Fetches batch receipts from the service.
   * @returns Observable of BatchReceipt[].
   */
  getBatchReceipts(): Observable<BatchReceipt[]> {
    // Replace this with your actual API call to get batch receipts
    return of(this.batchReceipts);
  }

  /**
   * Authorizes a selected normal receipt.
   * @param receipt The normal receipt object to authorize.
   * @returns Observable of any.
   */
  authorizeNormalReceipt(receipt: NormalReceipt): Observable<any> {
    // Replace this with your actual API call to authorize normal receipts
    receipt.status = 'Authorized';
    return of(receipt);
  }

  /**
   * Rejects a selected normal receipt.
   * @param receipt The normal receipt object to reject.
   * @param rejectionRemarks The rejection remarks for the receipt.
   * @returns Observable of any.
   */
  rejectNormalReceipt(receipt: NormalReceipt, rejectionRemarks: string): Observable<any> {
    // Replace this with your actual API call to reject normal receipts
    receipt.status = 'Rejected';
    receipt.rejectionRemarks = rejectionRemarks;
    return of(receipt);
  }

  /**
   * Authorizes a selected batch receipt.
   * @param receipt The batch receipt object to authorize.
   * @param sendSmsAlerts Whether to send SMS alerts.
   * @returns Observable of any.
   */
  authorizeBatchReceipt(receipt: BatchReceipt, sendSmsAlerts: boolean): Observable<any> {
    // Replace this with your actual API call to authorize batch receipts
    receipt.status = 'Authorized';
    return of(receipt);
  }

  /**
   * Rejects a selected batch receipt.
   * @param receipt The batch receipt object to reject.
   * @param sendSmsAlerts Whether to send SMS alerts.
   * @returns Observable of any.
   */
  rejectBatchReceipt(receipt: BatchReceipt, sendSmsAlerts: boolean): Observable<any> {
    // Replace this with your actual API call to reject batch receipts
    receipt.status = 'Rejected';
    return of(receipt);
  }
}