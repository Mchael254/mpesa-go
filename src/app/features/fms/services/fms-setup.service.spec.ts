import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FmsSetupService } from './fms-setup.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { GenericResponse } from '../data/receipting-dto';
import { HttpParams } from '@angular/common/http';

// Mock the ApiService
const mockApiService = {
  GET: jest.fn().mockReturnValue(of({ data: 'mockData' })),
};

describe('FmsSetupService', () => {
  let service: FmsSetupService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FmsSetupService,
        { provide: ApiService, useValue: mockApiService }, // Use the mock ApiService
      ],
    });
    service = TestBed.inject(FmsSetupService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Ensure there are no outstanding requests
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should get parameter status', () => {
  //   const paramName = 'TEST_PARAM';
  //   const mockResponse: GenericResponse<string> = {
  //     data: 'ACTIVE',
  //     msg: 'Parameter status retrieved successfully',
  //     success: true,
  //   };

  //   service.getParamStatus(paramName).subscribe((response) => {
  //     expect(response).toEqual(mockResponse);
  //   });

  //   // Construct the expected URL
  //   const expectedUrl = `${environment.API_URLS.get(API_CONFIG.FMS_SETUPS_SERVICE_BASE_URL)}/parameters/get-param-status?paramName=${paramName}`;

  //   const req = httpTestingController.expectOne(expectedUrl);
  //   expect(req.request.method).toBe('GET');

  //   req.flush(mockResponse);

  //   expect(mockApiService.GET).toHaveBeenCalledWith(
  //       `parameters/get-param-status`,
  //       API_CONFIG.FMS_SETUPS_SERVICE_BASE_URL,
  //       expect.any(HttpParams)
        
  //   );
  // });

  it('should handle error when getting parameter status', () => {
    const paramName = 'TEST_PARAM';
    const errorMessage = 'Failed to retrieve parameter status';

    service.getParamStatus(paramName).subscribe(
      () => {
        fail('Expected an error, but received a successful response');
      },
      (error) => {
        expect(error.message).toContain(errorMessage);
      }
    );

    const expectedUrl = `${environment.API_URLS.get(API_CONFIG.FMS_SETUPS_SERVICE_BASE_URL)}/parameters/get-param-status?paramName=${paramName}`;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    // Simulate an error response
    req.error(new ErrorEvent('Network error', { message: errorMessage }));
  });
});