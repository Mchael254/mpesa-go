import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { of } from 'rxjs';

class MockApiService {
  GET = jest.fn();
  POSTBYTE = jest.fn();
}

describe('DashboardService', () => {
  let service: DashboardService;
  let apiService: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        { provide: ApiService, useClass: MockApiService },
      ],
    });

    service = TestBed.inject(DashboardService);
    apiService = TestBed.inject(ApiService) as unknown as MockApiService;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

    test('should call ApiService.GET with the correct URL', () => {
      const mockId = 123;
      apiService.GET.mockReturnValue(of([]));

      service.getMemberPolicies(mockId).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/member-policies?identityNumber=${mockId}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct parameters', () => {
      const policyCode = 456;
      const memberCode = 789;
      apiService.GET.mockReturnValue(of({}));

      service.getMemberDetails(policyCode, memberCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/${policyCode}/member-details?policyMemberCode=${memberCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct parameters', () => {
      const policyCode = 123;
      const memberCode = 456;
      apiService.GET.mockReturnValue(of([]));

      service.getMemberAllPensionDepositReceipts(policyCode, memberCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/${policyCode}/member-pension-deposits?policyMemberCode=${memberCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct parameters', () => {
      const policyCode = 789;
      const memberCode = 101;
      apiService.GET.mockReturnValue(of({}));

      service.getMemberBalances(policyCode, memberCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/${policyCode}/member-valuations?policyMemberCode=${memberCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct parameters', () => {
      const policyMemCode = 202;
      const endorsementCode = 303;
      apiService.GET.mockReturnValue(of([]));

      service.getMemberCovers(policyMemCode, endorsementCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/member-covers?policyMemberCode=${policyMemCode}&endorsementCode=${endorsementCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct parameters', () => {
      const pensDepCode = 404;
      const memberCode = 505;
      apiService.GET.mockReturnValue(of({}));

      service.getDetMemDepConReceipts(pensDepCode, memberCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/${pensDepCode}/receipt-info?policyMemberCode=${memberCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct parameters', () => {
      const policyCode = 606;
      const memberCode = 707;
      apiService.GET.mockReturnValue(of([]));

      service.getMemberWithdrawals(policyCode, memberCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/portal/${policyCode}/member-withdrawals?policyMemberCode=${memberCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const clientCode = 789;
      apiService.GET.mockReturnValue(of([]));

      service.getAdminPolicies(clientCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/policies-listing?clientCode=${clientCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const clientCode = 567;
      apiService.GET.mockReturnValue(of([]));

      service.getClaimsSummary(clientCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/claims-summary?clientCode=${clientCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const clientCode = 890;
      apiService.GET.mockReturnValue(of([]));

      service.getClaimsListing(clientCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/claims-listing?clientCode=${clientCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const clientCode = 123;
      apiService.GET.mockReturnValue(of([]));

      service.getAdminPensionListing(clientCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/pensions?clientCode=${clientCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const endorsementCode = 456;
      apiService.GET.mockReturnValue(of({}));

      service.getAdminPolicyDetails(endorsementCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/policy-details?endorsementCode=${endorsementCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const policyCode = 789;
      apiService.GET.mockReturnValue(of([]));

      service.getEndorsements(policyCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/${policyCode}/endorsements`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const endorsementCode = 101;
      apiService.GET.mockReturnValue(of([]));

      service.getCategorySummary(endorsementCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/category/${endorsementCode}/categories`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const endorsementCode = 202;
      const categoryCode = 303;
      apiService.GET.mockReturnValue(of([]));

      service.getDependentLimits(endorsementCode, categoryCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/category/${endorsementCode}/limits?policyCategoryCode=${categoryCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const endorsementCode = 404;
      apiService.GET.mockReturnValue(of([]));

      service.getCoverTypes(endorsementCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/policy-covers/${endorsementCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const endorsementCode = 505;
      apiService.GET.mockReturnValue(of({}));

      service.getPolicyMemberDetails(endorsementCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/${endorsementCode}/fcl`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const policyCode = 606;
      const endorsementCode = 707;
      apiService.GET.mockReturnValue(of([]));

      service.getMemberDetailsList(policyCode, endorsementCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/policies/${policyCode}/policy-members?endorsementCode=${endorsementCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const endorsementCode = 808;
      const memberUniqueCode = 909;
      apiService.GET.mockReturnValue(of({}));

      service.getMemberDetsSummary(endorsementCode, memberUniqueCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `admin/${endorsementCode}/member-covers?policyMemberUniqueCode=${memberUniqueCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const policyCode = 1010;
      apiService.GET.mockReturnValue(of([]));

      service.getPolicyValuations(policyCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/policies/annual-valuations?policy_code=${policyCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const policyCode = 1111;
      apiService.GET.mockReturnValue(of([]));

      service.getReceipts(policyCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/receipts/${policyCode}?allocated=Y`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.GET with the correct URL', () => {
      const policyCode = 1212;
      apiService.GET.mockReturnValue(of([]));

      service.getPartialWithdrawals(policyCode).subscribe();

      expect(apiService.GET).toHaveBeenCalledWith(
        `group/policies/partial-withdrawals?policy_code=${policyCode}`,
        API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.POSTBYTE with the correct payload including dates', () => {
      const rptCode = 101;
      const prodCode = 202;
      const polCode = 303;
      const polMemCode = 404;
      const dateFrom = '2025-01-01';
      const dateTo = '2025-01-31';

      const expectedPayload = {
        rpt_code: rptCode,
        system: 'GRP',
        report_format: 'PDF',
        encode_format: 'RAW',
        params: [
          { name: 'V_PROD_CODE', value: prodCode },
          { name: 'V_POL_CODE', value: polCode },
          { name: 'V_POLM_CODE', value: polMemCode },
          { name: 'V_DATE_FROM', value: dateFrom },
          { name: 'V_DATE_TO', value: dateTo },
        ],
      };

      apiService.POSTBYTE.mockReturnValue(of({}));

      service
        .getReports(rptCode, prodCode, polCode, polMemCode, dateFrom, dateTo)
        .subscribe();

      expect(apiService.POSTBYTE).toHaveBeenCalledWith(
        null,
        expectedPayload,
        API_CONFIG.REPORT_SERVICE_BASE_URL
      );
    });

    test('should call ApiService.POSTBYTE with the correct payload when dates are not provided', () => {
      const rptCode = 101;
      const prodCode = 202;
      const polCode = 303;
      const polMemCode = 404;

      const expectedPayload = {
        rpt_code: rptCode,
        system: 'GRP',
        report_format: 'PDF',
        encode_format: 'RAW',
        params: [
          { name: 'V_PROD_CODE', value: prodCode },
          { name: 'V_POL_CODE', value: polCode },
          { name: 'V_POLM_CODE', value: polMemCode },
        ],
      };

      apiService.POSTBYTE.mockReturnValue(of({}));

      service.getReports(rptCode, prodCode, polCode, polMemCode).subscribe();

      expect(apiService.POSTBYTE).toHaveBeenCalledWith(
        null,
        expectedPayload,
        API_CONFIG.REPORT_SERVICE_BASE_URL
      );
    });
});