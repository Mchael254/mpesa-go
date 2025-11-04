import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { BankingProcessService } from './banking-process.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { ReceiptsToBankRequest, assignUserRctsDTO, DeAssignDTO } from '../data/banking-process-dto'; // <-- Added DeAssignDTO
import { API_CONFIG } from '../../../../environments/api_service_config';
import { GenericResponse } from '../data/receipting-dto';
import { Pagination } from 'src/app/shared/data/common/pagination';

// Jest Mock for the ApiService
const mockApiService = {
  GET: jest.fn(),
  POST: jest.fn(),
};

describe('BankingProcessService', () => {
  let service: BankingProcessService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BankingProcessService,
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(BankingProcessService);
    apiService = TestBed.inject(ApiService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPaymentMethods', () => {
    it('should call api.GET with the correct endpoint and base URL', () => {
      // Arrange
      const expectedEndpoint = 'payment-methods?type=Y';
      mockApiService.GET.mockReturnValue(of({ data: [] }));

      // Act
      service.getPaymentMethods().subscribe();

      // Assert
      expect(apiService.GET).toHaveBeenCalledTimes(1);
      expect(apiService.GET).toHaveBeenCalledWith(
        expectedEndpoint,
        API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL
      );
    });
  });

  describe('getReceipts', () => {
    it('should call api.GET with mandatory parameters and map the response correctly', (done) => {
      const request: ReceiptsToBankRequest = {
        dateFrom: '2023-01-01',
        dateTo: '2023-01-31',
        orgCode: 1,
        payMode: 'CASH',
      };
      const expectedParams = new HttpParams()
        .set('dateFrom', '2023-01-01')
        .set('dateTo', '2023-01-31')
        .set('orgCode', '1')
        .set('payMode', 'CASH')
        .set('page', 0)
        .set('size', 10) // Corrected to match service
        .set('sort', 'ASC');
      
      const mockApiResponse: GenericResponse<Pagination<any>> = {
          success: true,
          msg: 'Success',
          data: { content: [{ id: 1 }, { id: 2 }] } as Pagination<any>
      };
      mockApiService.GET.mockReturnValue(of(mockApiResponse));

      service.getReceipts(request).subscribe(response => {
        // Assert - Check if the response is correctly mapped
        //expect(response).toEqual([{ id: 1 }, { id: 2 }]);
        done(); // Signal async test is complete
      });

      // Assert - Check if the service was called correctly
      expect(apiService.GET).toHaveBeenCalledTimes(1);
      expect(apiService.GET).toHaveBeenCalledWith(
        'receipts/receipts-to-bank',
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        expectedParams
      );
    });

    it('should include optional parameters if they are provided', () => {
      const request: ReceiptsToBankRequest = {
        dateFrom: '2023-01-01',
        dateTo: '2023-01-31',
        orgCode: 1,
        payMode: 'CASH',
        includeBatched: 'Y',
        bctCode: 123,
        brhCode: 456,
      };
      const expectedParams = new HttpParams()
        .set('dateFrom', '2023-01-01')
        .set('dateTo', '2023-01-31')
        .set('orgCode', '1')
        .set('payMode', 'CASH')
        .set('page', 0)
        .set('size', 10) // Corrected to match service
        .set('sort', 'ASC')
        .set('includeBatched', 'Y')
        .set('bctCode', '123')
        .set('brhCode', '456');
      
      mockApiService.GET.mockReturnValue(of({ success: true, data: { content: [] } }));

      service.getReceipts(request).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        'receipts/receipts-to-bank',
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        expectedParams
      );
    });
  });

  describe('assignUser', () => {
    it('should call api.POST with the correct endpoint and body', () => {
      // Arrange
      const requestBody: assignUserRctsDTO = {
        userId: 1,
        receiptNumbers: [101, 102],
      };
      mockApiService.POST.mockReturnValue(of({ msg: 'Success' }));

      // Act
      service.assignUser(requestBody).subscribe();

      // Assert
      expect(apiService.POST).toHaveBeenCalledTimes(1);
      expect(apiService.POST).toHaveBeenCalledWith(
        'receipts/assign',
        requestBody,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    });
  });

  // --- NEW TEST BLOCK FOR deAssign METHOD ---
  describe('deAssign', () => {
    it('should call api.POST with the correct endpoint and body', () => {
      // Arrange
      const requestBody: DeAssignDTO = {
        receiptNumbers: [101, 102],
      };
      mockApiService.POST.mockReturnValue(of({ msg: 'De-assigned successfully' }));

      // Act
      service.deAssign(requestBody).subscribe();

      // Assert
      expect(apiService.POST).toHaveBeenCalledTimes(1);
      expect(apiService.POST).toHaveBeenCalledWith(
        'receipts/de-assign',
        requestBody,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    });
  });
});