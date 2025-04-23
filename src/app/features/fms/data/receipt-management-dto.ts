export interface tabledataDTO{
    "receiptNumber":string;
    "receiptDate":string;
    "receivedFrom":string;
    "amount":number;
    "paymentMethod":string;
  }
  export interface unPrintedReceiptsDTO{
    "message":string;
    "success":string;
   "data":{
      "totalPages": number;
      "totalElements": number;
      "pageable": {
        "pageNumber": number;
        "pageSize": number;
        "offset": number;
        "sort": {
          "sorted": boolean;
          "empty": boolean;
          "unsorted":boolean;
        },
        "unpaged":boolean;
        "paged": boolean;
      },
      "first": boolean;
      "last": boolean;
      "size": boolean;
      "content": [
        {
          "no":number;
          "receiptDate": string;
          "captureDate": string;
          "capturedBy": number;
          "amount": number;
          "paymentMode": string;
          "paymentMemo": string;
          "paidBy":string;
          "documentDate": string;
          "description": string;
          "printed": string;
          "applicationSource":number;
          "accountCode": number;
          "accountType": string;
          "branchCode": number;
          "accountShortDescription": string;
          "currencyCode": number;
          "bankAccCode":number;
          "cancelled":string;
          "commission": number;
          "batchCode": number;
          "branchReceiptNumber": number;
          "branchReceiptCode": string;
          "drawersBank": string;
          "accountTypeId": string;
          "bankBranchCode": number;
          "receiptType": string;
          "cancelledBy": number;
          "reference": string;
          "cbPosted":string;
          "sourcePosted": string;
          "netGrossFlag": string;
          "glAccount": string;
          "parentNumber":number;
          "cancelledDate":string;
          "voucherNumber": number;
          "reverseVoucherNumber": number;
          "errorMessage": string;
          "bankChargeAmount": number;
          "clientChargeAmount": number;
          "vatCertificateNumber": string;
          "policyType": string;
          "remarks": string;
          "agentCode": number;
          "receivedFrom": string;
          "collectionAccountCode":number;
          "manualReference": string;
          "banked": string;
          "allocation": string;
          "totalAllocation": number;
          "totalAllocation2": number;
        }
      ],
      "number":number;
      "sort": {
        "sorted": boolean;
        "empty":boolean;
        "unsorted": boolean;
      },
      "numberOfElements": number;
      "empty": boolean
    }
   
    }
    export interface unPrintedReceiptContentDTO{
      "no":number;
      "receiptDate": string;
      "captureDate": string;
      "capturedBy": number;
      "amount": number;
      "paymentMode": string;
      "paymentMemo": string;
      "paidBy":string;
      "documentDate": string;
      "description": string;
      "printed": string;
      "applicationSource":number;
      "accountCode": number;
      "accountType": string;
      "branchCode": number;
      "accountShortDescription": string;
      "currencyCode": number;
      "bankAccCode":number;
      "cancelled":string;
      "commission": number;
      "batchCode": number;
      "branchReceiptNumber": number;
      "branchReceiptCode": string;
      "drawersBank": string;
      "accountTypeId": string;
      "bankBranchCode": number;
      "receiptType": string;
      "cancelledBy": number;
      "reference": string;
      "cbPosted":string;
      "sourcePosted": string;
      "netGrossFlag": string;
      "glAccount": string;
      "parentNumber":number;
      "cancelledDate":string;
      "voucherNumber": number;
      "reverseVoucherNumber": number;
      "errorMessage": string;
      "bankChargeAmount": number;
      "clientChargeAmount": number;
      "vatCertificateNumber": string;
      "policyType": string;
      "remarks": string;
      "agentCode": number;
      "receivedFrom": string;
      "collectionAccountCode":number;
      "manualReference": string;
      "banked": string;
      "allocation": string;
      "totalAllocation": number;
      "totalAllocation2": number;
    }