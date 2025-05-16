import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { ReceiptManagementService } from './receipt-management.service';
import { ApiService } from '../../../shared/services/api/api.service'; // Adjust path as needed
import { API_CONFIG } from '../../../../environments/api_service_config'; // Adjust path as needed
import {
  unPrintedReceiptsDTO,
  unPrintedReceiptContentDTO,
  PageableDTO
} from '../data/receipt-management-dto'; // Adjust path as needed

// --- Mock Data Matching DTOs (Keep this as is from the previous correct version) ---
const mockReceiptContent1: unPrintedReceiptContentDTO = {
  no: 101, receiptDate: '2023-10-27', captureDate: '2023-10-27T10:00:00Z', capturedBy: 1, amount: 150.00, paymentMode: 'Cash', paymentMemo: 'Payment for INV-001', paidBy: 'Client A Payer', documentDate: null, description: 'Standard Receipt 1', printed: 'N', applicationSource: 1, accountCode: 5001, accountType: 'Client', branchCode: 10, accountShortDescription: 'Client A Acc', currencyCode: 1, bankAccCode: 9001, cancelled: 'N', commission: 0, batchCode: null, branchReceiptNumber: 12001, branchReceiptCode: 'BR001-12001', drawersBank: 'N/A', accountTypeId: 'CL', bankBranchCode: 11, receiptType: 'Normal', cancelledBy: null, reference: 'REF-ABC', cbPosted: 'N', sourcePosted: 'N', netGrossFlag: 'N', glAccount: '12000', parentNumber: null, cancelledDate: null, voucherNumber: 8001, reverseVoucherNumber: null, errorMessage: null, bankChargeAmount: null, clientChargeAmount: null, vatCertificateNumber: null, policyType: null, remarks: 'First receipt remark', agentCode: 99, receivedFrom: 'Client A', collectionAccountCode: null, manualReference: null, banked: 'N', allocation: 'N', totalAllocation: 0, totalAllocation2: 0
};
const mockReceiptContent2: unPrintedReceiptContentDTO = {
  no: 102, receiptDate: '2023-10-28', captureDate: '2023-10-28T11:30:00Z', capturedBy: 2, amount: 250.50, paymentMode: 'Cheque', paymentMemo: 'Payment for INV-002', paidBy: 'Client B Payer', documentDate: '2023-10-25', description: 'Standard Receipt 2', printed: 'N', applicationSource: 1, accountCode: 5002, accountType: 'Client', branchCode: 10, accountShortDescription: 'Client B Acc', currencyCode: 1, bankAccCode: 9002, cancelled: 'N', commission: 5.00, batchCode: 50, branchReceiptNumber: 12002, branchReceiptCode: 'BR001-12002', drawersBank: 'Bank ABC', accountTypeId: 'CL', bankBranchCode: 12, receiptType: 'Normal', cancelledBy: null, reference: 'REF-XYZ', cbPosted: 'N', sourcePosted: 'N', netGrossFlag: 'N', glAccount: '12000', parentNumber: null, cancelledDate: null, voucherNumber: 8002, reverseVoucherNumber: null, errorMessage: null, bankChargeAmount: 0, clientChargeAmount: 0, vatCertificateNumber: null, policyType: null, remarks: null, agentCode: 98, receivedFrom: 'Client B', collectionAccountCode: null, manualReference: 'MAN-REF-01', banked: 'N', allocation: 'Y', totalAllocation: 100.00, totalAllocation2: 0
};
const mockPageable: PageableDTO = { pageNumber: 0, pageSize: 10, sort: [], offset: 0, paged: true, unpaged: false };
const mockUnprintedReceiptsResponse: unPrintedReceiptsDTO = {
  msg: 'Success', success: true, data: { content: [mockReceiptContent1, mockReceiptContent2], pageable: mockPageable, last: true, totalElements: 2, totalPages: 1, first: true, size: 10, number: 0, sort: [], numberOfElements: 2, empty: false }
};
// --- End Mock Data ---


describe('ReceiptManagementService', () => {
  let service: ReceiptManagementService;
  // Declare the mock with Jest types
  let apiServiceMock: { GET: jest.Mock }; // Type GET as a Jest Mock function

  beforeEach(() => {
    // Create the mock object for ApiService
    apiServiceMock = {
      GET: jest.fn() // Initialize GET as a Jest mock function
    };

    TestBed.configureTestingModule({
      providers: [
        ReceiptManagementService,
        // Provide the mock object for the ApiService dependency
        { provide: ApiService, useValue: apiServiceMock }
      ]
    });

    service = TestBed.inject(ReceiptManagementService);
    // No need to inject apiServiceMock again, we already have the reference
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUnprintedReceipts', () => {
    const testBranchCode = 123;
    const expectedUrl = 'receipts/unprinted';
    const expectedBaseUrl = API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL;

    it('should call api.GET with correct URL, Base URL, and HttpParams', () => {
      // Arrange: Configure the mock GET method to return an observable
      apiServiceMock.GET.mockReturnValue(of(mockUnprintedReceiptsResponse)); // Use mockReturnValue for Jest

      // Act: Call the service method
      service.getUnprintedReceipts(testBranchCode).subscribe(); // Subscribe to trigger the call

      // Assert: Check if apiServiceMock.GET was called correctly
      expect(apiServiceMock.GET).toHaveBeenCalledTimes(1); // Jest matcher

      // Check the arguments passed to api.GET using mock.lastCall
      const actualArgs = apiServiceMock.GET.mock.lastCall; // Jest way to get last call args
      expect(actualArgs[0]).toBe(expectedUrl); // Check relative URL
      expect(actualArgs[1]).toBe(expectedBaseUrl); // Check base URL

      // Check HttpParams
      const actualParams = actualArgs[2] as HttpParams;
      expect(actualParams).toBeInstanceOf(HttpParams); // Jest matcher (same as Jasmine)
      expect(actualParams.has('branchCode')).toBe(true); // Jest matcher: toBe(true)
      expect(actualParams.get('branchCode')).toBe(String(testBranchCode)); // Jest matcher: toBe()
    });

     // Alternative using toHaveBeenCalledWith
     it('should call api.GET with correct arguments (alternative check)', () => {
        apiServiceMock.GET.mockReturnValue(of(mockUnprintedReceiptsResponse));
        service.getUnprintedReceipts(testBranchCode).subscribe();

        // Create expected HttpParams for comparison
        const expectedParams = new HttpParams().set('branchCode', `${testBranchCode}`);

        expect(apiServiceMock.GET).toHaveBeenCalledWith( // Jest matcher
            expectedUrl,
            expectedBaseUrl,
            expectedParams // Compare HttpParams objects (may need custom matcher or careful checks if order matters within HttpParams)
        );
    });


    it('should return the observable from api.GET on success', (done) => { // Keep 'done' for async Observable tests
      // Arrange
      apiServiceMock.GET.mockReturnValue(of(mockUnprintedReceiptsResponse));

      // Act & Assert
      service.getUnprintedReceipts(testBranchCode).subscribe(response => {
        expect(response).toEqual(mockUnprintedReceiptsResponse); // Jest matcher (same as Jasmine)
        expect(response.data.content.length).toBe(2); // Example specific check
        done(); // Signal Jest that the async test is complete
      });

      // Verify the mock was called (optional here, checked in previous test)
       expect(apiServiceMock.GET).toHaveBeenCalledTimes(1);
    });

    it('should propagate an error if api.GET fails', (done) => {
        // Arrange
        const mockError = { status: 500, message: 'Server Error', error: { msg: 'Internal Error' } };
        // Configure the mock GET to return an error observable
        // Using mockImplementation is slightly cleaner for errors
        apiServiceMock.GET.mockImplementation(() => throwError(() => mockError));

        // Act & Assert
        service.getUnprintedReceipts(testBranchCode).subscribe({
            next: () => {
                 // Use done.fail() when using the done callback approach
                 done.fail('Expected an error, but got a value');
            },
            error: (error) => {
                expect(error).toEqual(mockError); // Jest matcher (same as Jasmine)
                done(); // Signal Jest that the async test is complete
            }
        });

         // Verify the mock was called (optional here, checked in first test)
        expect(apiServiceMock.GET).toHaveBeenCalledTimes(1);
    });
  });
});