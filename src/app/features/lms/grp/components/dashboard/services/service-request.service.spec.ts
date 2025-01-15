import { TestBed } from '@angular/core/testing';
import { ServiceRequestService } from './service-request.service';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { of } from 'rxjs';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';

class MockApiService {
  GET = jest.fn();
  POST = jest.fn();
}

describe('ServiceRequestService', () => {
  let service: ServiceRequestService;
  let apiService: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceRequestService,
        { provide: ApiService, useClass: MockApiService },
      ],
    });

    service = TestBed.inject(ServiceRequestService);
    apiService = TestBed.inject(ApiService) as unknown as MockApiService;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('getContactMethod should call GET with the correct URL and base URL', () => {
    const mockResponse = [];
    apiService.GET.mockReturnValue(of(mockResponse));

    service.getContactMethod().subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.GET).toHaveBeenCalledWith(
      'service-request/contact-method',
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  });

  test('getServiceReqCategories should call GET with the correct URL and base URL', () => {
    const mockResponse = [];
    apiService.GET.mockReturnValue(of(mockResponse));

    service.getServiceReqCategories().subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.GET).toHaveBeenCalledWith(
      'service-request/service-request-categories?srtCode&reqName',
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  });

  test('getServiceReqCategoryTypes should call GET with the correct URL and base URL', () => {
    const mockResponse = [];
    apiService.GET.mockReturnValue(of(mockResponse));

    service.getServiceReqCategoryTypes().subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.GET).toHaveBeenCalledWith(
      'service-request/category-types',
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  });

  test('getServiceReqPolicies should call GET with the correct URL and base URL', () => {
    const mockResponse = [];
    const clientCode = 123;
    apiService.GET.mockReturnValue(of(mockResponse));

    service.getServiceReqPolicies(clientCode).subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.GET).toHaveBeenCalledWith(
      `service-request/request-policies?clntCode=${clientCode}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  });

  test('postServiceReq should call POST with the correct URL, payload, and base URL', () => {
    const mockPayload = { key: 'value' };
    const mockResponse = {};
    apiService.POST.mockReturnValue(of(mockResponse));

    service.postServiceReq(mockPayload).subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.POST).toHaveBeenCalledWith(
      'service-request/create',
      mockPayload,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  });

  test('postDocument should call POST with the correct URL, JSON payload, and base URL', () => {
    const mockData = { file: 'test.pdf' };
    const mockResponse = {};
    apiService.POST.mockReturnValue(of(mockResponse));

    service.postDocument(mockData).subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.POST).toHaveBeenCalledWith(
      'uploadAgentDocs',
      JSON.stringify(mockData),
      API_CONFIG.DMS_SERVICE
    );
  });

  test('postDocumentInfo should call POST with the correct URL, data, and base URL', () => {
    const mockData = { docId: '123' };
    const mockResponse = {};
    apiService.POST.mockReturnValue(of(mockResponse));

    service.postDocumentInfo(mockData).subscribe((result) => {
      expect(result).toBe(mockResponse);
    });

    expect(apiService.POST).toHaveBeenCalledWith(
      'service-request/documents',
      mockData,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  });
});
