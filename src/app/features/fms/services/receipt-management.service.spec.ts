import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

import { ReceiptManagementService } from './receipt-management.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { cancelReceiptDTO, shareReceiptDTO } from '../data/receipt-management-dto';
import { API_CONFIG } from '../../../../environments/api_service_config';

// Jest Mock for the ApiService
const mockApiService = {
  GET: jest.fn(),
  POST: jest.fn(),
};

describe('ReceiptManagementService', () => {
  let service: ReceiptManagementService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReceiptManagementService,
        // Provide the mock ApiService instead of the real one
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(ReceiptManagementService);
    apiService = TestBed.inject(ApiService);

    // Reset mocks before each test to ensure a clean state
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUnprintedReceipts', () => {
    it('should call api.GET with the correct parameters and branchCode', () => {
      // Arrange
      const branchCode = 123;
      const expectedParams = new HttpParams().set('branchCode', `${branchCode}`);
      // We don't care about the response data here, just that the call is made
      mockApiService.GET.mockReturnValue(of({})); 

      // Act
      service.getUnprintedReceipts(branchCode).subscribe();

      // Assert
      expect(apiService.GET).toHaveBeenCalledTimes(1);
      expect(apiService.GET).toHaveBeenCalledWith(
        'receipts/unprinted',
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        expectedParams
      );
    });
  });

  describe('getReceiptsToCancel', () => {
    it('should call api.GET with the correct parameters and branchCode', () => {
      // Arrange
      const branchCode = 456;
      const expectedParams = new HttpParams().set('branchCode', `${branchCode}`);
      mockApiService.GET.mockReturnValue(of({}));

      // Act
      service.getReceiptsToCancel(branchCode).subscribe();

      // Assert
      expect(apiService.GET).toHaveBeenCalledTimes(1);
      expect(apiService.GET).toHaveBeenCalledWith(
        'receipts/receipts-to-cancel',
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        expectedParams
      );
    });
  });

  describe('cancelReceipt', () => {
    it('should call api.POST with the correct body and endpoint', () => {
      // Arrange
      const mockBody: cancelReceiptDTO = { no: 1 } as cancelReceiptDTO;
      mockApiService.POST.mockReturnValue(of({ msg: 'Success' }));

      // Act
      service.cancelReceipt(mockBody).subscribe();

      // Assert
      expect(apiService.POST).toHaveBeenCalledTimes(1);
      expect(apiService.POST).toHaveBeenCalledWith(
        'receipts/cancel',
        mockBody,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    });
  });

  describe('getGlAccount', () => {
    it('should call api.GET with the correct dynamic endpoint for branch', () => {
      // Arrange
      const branchCode = 789;
      const expectedEndpoint = `gl-accounts/branch/${branchCode}`;
      mockApiService.GET.mockReturnValue(of({}));

      // Act
      service.getGlAccount(branchCode).subscribe();

      // Assert
      expect(apiService.GET).toHaveBeenCalledTimes(1);
      // Note: This method does not pass HttpParams in the 3rd argument
      expect(apiService.GET).toHaveBeenCalledWith(
        expectedEndpoint,
        API_CONFIG.FMS_GENERAL_LEDGER_SERVICE_BASE_URL
      );
    });
  });

  describe('shareReceipt', () => {
    it('should call api.POST with the correct body and endpoint', () => {
      // Arrange
      const mockBody: shareReceiptDTO = { shareType: 'EMAIL', recipient: 'test@test.com' } as shareReceiptDTO;
      mockApiService.POST.mockReturnValue(of({ msg: 'Shared' }));

      // Act
      service.shareReceipt(mockBody).subscribe();

      // Assert
      expect(apiService.POST).toHaveBeenCalledTimes(1);
      expect(apiService.POST).toHaveBeenCalledWith(
        'receipts/share',
        mockBody,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    });
  });
});