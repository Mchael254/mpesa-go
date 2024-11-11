import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import {Client,Transaction,GroupBusinessAccount,GlAccount,Receipt} from '../data/receipting-dto';

// import {PreviewTransaction} from  '../data/previewTransaction-dto';
@Injectable({
  providedIn: 'root' 
})
export class ReceiptingService {

  private apiUrl = 'http://your-backend-api-url/api/receipt'; // Replace with your API URL
 

  constructor(private http: HttpClient) { }

  // Update the receipting currency code
  updateReceiptingCurrCode(currencyCode: string): void {
    // Store the currency code in a session variable or a service property 
    sessionStorage.setItem('currCode', currencyCode); 
    // (You can also store in the service's own property instead)
  }

  // Update the payment mode
  updatePaymentMode(paymentMode: string): void {
    // Store the payment mode
    sessionStorage.setItem('paymentMode', paymentMode); 
  }

  // Update the bank account
  updateBankAccount(bankAccount: string): void {
    // Store the bank account
    sessionStorage.setItem('bankAccount', bankAccount); 
  }

  // Update the receipting point
  updateReceiptingPoint(receiptingPoint: string): void {
    // Store the receipting point
    sessionStorage.setItem('receiptingPoint', receiptingPoint); 
  }

  // Save Receipt
  saveReceipt(receipt: Receipt, transactions: Transaction[], allocatedClients: Client[], groupBusinessAccounts: GroupBusinessAccount[], glAccounts: GlAccount[]): Observable<any> {
    //  You might need to update the HTTP headers or add 
    //  additional information depending on your backend requirements.
    //  In real-world scenarios, we need to combine and send an array of 
    //  objects to allocate to group business account,gl accounts,and the transactions

    const requestBody = {
      receipt: receipt, // Pass your Receipt object
      transactions: transactions, // Pass your Transactions array
      allocatedClients: allocatedClients, // Pass your Client array 
      groupBusinessAccounts: groupBusinessAccounts, // Pass your groupBusinessAccounts array
      glAccounts: glAccounts, // Pass your glAccounts array
    };
    return this.http.post(this.apiUrl, requestBody, { headers: this.getHttpHeaders() });
  }

  // Print Receipt (Make an API call to the backend for generating a PDF)
  printReceipt(receipt: Receipt, transactions: Transaction[], allocatedClients: Client[], groupBusinessAccounts: GroupBusinessAccount[], glAccounts: GlAccount[]): Observable<any> {
    const requestBody = {
      receipt: receipt, // Pass your Receipt object
      transactions: transactions, // Pass your Transactions array
      allocatedClients: allocatedClients, // Pass your Client array 
      groupBusinessAccounts: groupBusinessAccounts, // Pass your groupBusinessAccounts array
      glAccounts: glAccounts, // Pass your glAccounts array
    };

    // In a real API, this method will trigger the PDF generation. You will handle downloading the PDF using Angular's file handling methods or simply directing to the PDF URL if the API does it for you.
    return this.http.post<Blob>(`${this.apiUrl}/print`, requestBody, { headers: this.getHttpHeaders(),  }); // Modify to fit your API's response. 
  }
  getNarrationDescriptions(): Observable<{ value: string, text: string }[]> { 
    const apiUrl = 'http://your-backend-api-url/api/narrations'; // Replace with the actual API URL
    return this.http.get<{ value: string, text: string }[]>(apiUrl);
  } 

  // Fetch Receipting Points
  getReceiptingPoints(): Observable<any[]> {
    const apiUrl = 'http://your-backend-api-url/api/receipting-points'; // Replace with your API URL
    return this.http.get<any[]>(apiUrl);
  }

  // Add other ReceiptingService methods as needed (e.g., fetch receipt details)

  // Helper Method for adding headers
  private getHttpHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      return new HttpHeaders(); 
    }
  }
  
  getBackdatingEnabled(): Observable<boolean> {
    const endpoint = ''; 
    return this.http.get<boolean>(endpoint);
  }
getReceiptPreviewData(
  receipt: Receipt,
  transactions: Transaction[],
  clients: Client[],
  groupBusinessAccounts: GroupBusinessAccount[],
  glAccounts: GlAccount[]
): Observable<Receipt> {

  console.log("Transactions before mapping:", transactions); // Check if transactions are coming in
  console.log("Receipt object before update:", receipt); // Check if receipt has the data

  const previewData: Receipt = {
    ...receipt,
    transactions: transactions.map(transaction => ({
      clientName: transaction.clientName, // Assuming these fields exist
      policyNumber: transaction.policyNumber,
      allocatedAmount: transaction.allocatedAmount.toString(), // Ensure type match
      narration: transaction.narration,
      date: transaction.date
    }))
  };

  console.log("Preview Data:", previewData); // Log the preview data

  return new Observable(observer => {
    setTimeout(() => {
      observer.next(previewData);
      observer.complete();
    }, 1000);
  });
}


}