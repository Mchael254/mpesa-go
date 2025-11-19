import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { PaymentsService } from './payments.service';
import {ApiService} from '../../../shared/services/api/api.service';
import { API_CONFIG} from '../../../../environments/api_service_config';
// Jest Mock for the ApiService, following your established pattern
const mockApiService = {
  GET: jest.fn(),
  POST: jest.fn(), // Include POST for completeness, even if not used yet
};

describe('PaymentsService', () => {
  let service: PaymentsService;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentsService,
        // Provide the mock ApiService instead of the real one
        { provide: ApiService, useValue: mockApiService },
      ],
    });
    service = TestBed.inject(PaymentsService);
    apiService = TestBed.inject(ApiService);

    // Reset mocks before each test to ensure a clean state
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPaymentsBankActs', () => {
    it('should call api.GET with the correct endpoint and HttpParams', () => {
      // Arrange
      const userCode = 940;
      const orgCode = 2;
      const branchCode = 1;

      const expectedEndpoint = 'payments/payment-bank-accounts';
      const expectedParams = new HttpParams()
        .set('userCode', '940')
        .set('orgCode', '2')
        .set('branchCode', '1');
      
      // We don't care about the response data here, just that the call is made correctly.
      mockApiService.GET.mockReturnValue(of({})); 

      // Act
      service.getPaymentsBankActs(userCode, orgCode, branchCode).subscribe();

      // Assert
      expect(apiService.GET).toHaveBeenCalledTimes(1);
      expect(apiService.GET).toHaveBeenCalledWith(
        expectedEndpoint,
        API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL,
        expectedParams
      );
    });

    it('should return the data provided by the ApiService', (done) => {
        // Arrange
        const mockResponse = { success: true, data: [{ bankName: 'Test Bank' }] } as any;
        mockApiService.GET.mockReturnValue(of(mockResponse));
  
        // Act
        service.getPaymentsBankActs(940, 2, 1).subscribe(response => {
          // Assert
          expect(response).toEqual(mockResponse);
          done(); // Signal that the async test is complete
        });
    });
  });
});