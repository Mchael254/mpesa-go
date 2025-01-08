import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PolicyDetailsComponent } from './policy-details.component';
import { DashboardService } from '../../../services/dashboard.service';
import { ReportsService } from '../../../../../../../../shared/services/reports/reports.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DetailedMemContrReceiptsDTO, memberBalancesDTO, MemberCoversDTO, MemberPensionDepReceiptsDTO, MemberWithdrawalsDTO } from '../../../models/member-policies';

jest.mock('../../../../../../../../shared/services', () => ({
  Logger: jest.fn()
}));

jest.mock('../../../../../../../../shared/data/common/BreadCrumbItem', () => ({
  BreadCrumbItem: jest.fn()
}));

describe('PolicyDetailsComponent', () => {
  let component: PolicyDetailsComponent;
  let fixture: ComponentFixture<PolicyDetailsComponent>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockDashboardService: Partial<DashboardService>;
  let mockReportsService: Partial<ReportsService>;
  let mockMessageService: Partial<MessageService>;
  let mockRouter: Partial<Router>;
  let mockChangeDetectorRef: Partial<ChangeDetectorRef>;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          policyNumber: '12345',
          entityCode: '100',
          policyCode: '1',
          endorsementCode: '2',
          productType: 'PENS',
          policyMemberCode: '3',
          productCode: '4'
        }
      } as any
    };

    mockDashboardService = {
      getMemberAllPensionDepositReceipts: jest.fn().mockReturnValue(of([])),
      getMemberBalances: jest.fn().mockReturnValue(of([])),
      getMemberCovers: jest.fn().mockReturnValue(of([])),
      getMemberDetails: jest.fn().mockReturnValue(of([])),
      getMemberWithdrawals: jest.fn().mockReturnValue(of([])),
      getDetMemDepConReceipts: jest.fn().mockReturnValue(of([])),
      getReports: jest.fn().mockReturnValue(of(new Blob()))
    };

    mockReportsService = {};

    mockMessageService = {
      add: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockChangeDetectorRef = {
      detectChanges: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PolicyDetailsComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockRouter = TestBed.inject(Router);
    mockDashboardService = TestBed.inject(DashboardService);
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef);
    mockReportsService = TestBed.inject(ReportsService);
    mockMessageService = TestBed.inject(MessageService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });


  test('should initialize data on ngOnInit', () => {
    const getProductTypeSpy = jest.spyOn(component, 'getProductType');
    const populateYearsSpy = jest.spyOn(component, 'populateYears');
    const adminDetsTableColumnsSpy = jest.spyOn(component, 'adminDetsTableColumns');
    const populateBreadCrumbItemsSpy = jest.spyOn(component, 'populateBreadCrumbItems');
    const getMemberAllPensionDepositReceiptsSpy = jest.spyOn(component, 'getMemberAllPensionDepositReceipts');
    const getValuationsSpy = jest.spyOn(component, 'getValuations');
    const getMemberCoversSpy = jest.spyOn(component, 'getMemberCovers');
    const getMemberDetailsSpy = jest.spyOn(component, 'getMemberDetails');
    const getMemberWithdrawalsSpy = jest.spyOn(component, 'getMemberWithdrawals');
    const loadPdfJsSpy = jest.spyOn(component as any, 'loadPdfJs');
    const getPensAccSummaryReportSpy = jest.spyOn(component, 'getPensAccSummaryReport');
    const getMembershipCertificateSpy = jest.spyOn(component, 'getMembershipCertificate');
    const getDateRangeFormSpy = jest.spyOn(component, 'getDateRangeForm');

    component.ngOnInit();

    expect(getProductTypeSpy).toHaveBeenCalled();
    expect(populateYearsSpy).toHaveBeenCalled();
    expect(adminDetsTableColumnsSpy).toHaveBeenCalled();
    expect(populateBreadCrumbItemsSpy).toHaveBeenCalled();
    expect(getMemberAllPensionDepositReceiptsSpy).toHaveBeenCalled();
    expect(getValuationsSpy).toHaveBeenCalled();
    expect(getMemberCoversSpy).toHaveBeenCalled();
    expect(getMemberDetailsSpy).toHaveBeenCalled();
    expect(getMemberWithdrawalsSpy).toHaveBeenCalled();
    expect(loadPdfJsSpy).toHaveBeenCalled();
    expect(getPensAccSummaryReportSpy).toHaveBeenCalled();
    expect(getMembershipCertificateSpy).toHaveBeenCalled();
    expect(getDateRangeFormSpy).toHaveBeenCalled();
  });

  test('should set product type correctly', () => {
    component.productType = 'PENSWITHRIDER';
    component.getProductType();
    expect(component.pensionWithLifeRider).toBe(true);

    component.productType = 'INV';
    component.getProductType();
    expect(component.investment).toBe(true);

    component.productType = 'INVWITHRIDER';
    component.getProductType();
    expect(component.investmentWithRider).toBe(true);

    component.productType = 'EARN';
    component.getProductType();
    expect(component.gla).toBe(true);
  });

  test('should populate breadcrumb items', () => {
    component.populateBreadCrumbItems();
    expect(component.breadCrumbItems.length).toBe(2);
    expect(component.breadCrumbItems[0].label).toBe('Dashboard');
    expect(component.breadCrumbItems[1].label).toBe(component.selectedPolicyNumber);
  });

  test('should show content based on selection', () => {
    component.showContent('summary');
    expect(component.selectedContent).toBe('summary');

    component.showContent('transactions');
    expect(component.selectedContent).toBe('transactions');

    component.showContent('cover_types');
    expect(component.selectedContent).toBe('cover_types');
  });

  test('should populate years correctly', () => {
    component.populateYears();
    expect(component.years[0]).toBe('All');
    expect(component.years.length).toBeGreaterThan(1);
    expect(component.years).toContain(new Date().getFullYear().toString());
  });

  test('should get member details', () => {
    component.getMemberDetails();
    expect(mockDashboardService.getMemberDetails).toHaveBeenCalledWith(component.selectedPolicyCode, component.policyMemCode);
  });

  test('should filter receipts by year and month', () => {
    component.memberPensionDepReceipts = [
      {
        pnmdp_date: '2023-01-15',
        pension_member_dep_code: 0,
        policy_code: 0,
        policy_member_code: 0,
        pnmdp_amount: 0,
        employer_amount: 0,
        employee_amount: 0,
        pnmdp_empyr_vol_amt: 0,
        pnmdp_empye_vol_amt: 0,
        pnmdp_empyr_trans_amt: 0,
        pnmdp_empye_trans_amt: 0,
        total_amount: 0,
        pnmdp_grct_code: 0,
        pnmdp_chq_rcpt_no: 0,
        contribution_amount: 0,
        voluntary_contribution_amount: 0,
        total_transfer_amount: 0,
        total_voluntary_transfer_amount: 0,
        cost_of_past_benefits: 0
      },
      {
        pnmdp_date: '2023-02-15',
        pension_member_dep_code: 0,
        policy_code: 0,
        policy_member_code: 0,
        pnmdp_amount: 0,
        employer_amount: 0,
        employee_amount: 0,
        pnmdp_empyr_vol_amt: 0,
        pnmdp_empye_vol_amt: 0,
        pnmdp_empyr_trans_amt: 0,
        pnmdp_empye_trans_amt: 0,
        total_amount: 0,
        pnmdp_grct_code: 0,
        pnmdp_chq_rcpt_no: 0,
        contribution_amount: 0,
        voluntary_contribution_amount: 0,
        total_transfer_amount: 0,
        total_voluntary_transfer_amount: 0,
        cost_of_past_benefits: 0
      },
      {
        pnmdp_date: '2024-01-15',
        pension_member_dep_code: 0,
        policy_code: 0,
        policy_member_code: 0,
        pnmdp_amount: 0,
        employer_amount: 0,
        employee_amount: 0,
        pnmdp_empyr_vol_amt: 0,
        pnmdp_empye_vol_amt: 0,
        pnmdp_empyr_trans_amt: 0,
        pnmdp_empye_trans_amt: 0,
        total_amount: 0,
        pnmdp_grct_code: 0,
        pnmdp_chq_rcpt_no: 0,
        contribution_amount: 0,
        voluntary_contribution_amount: 0,
        total_transfer_amount: 0,
        total_voluntary_transfer_amount: 0,
        cost_of_past_benefits: 0
      }
    ];
    component.selectedYear = '2023';
    component.selectedMonth = '01';
    component.filterReceiptsByYearMonth();
    expect(component.filteredMemberPensionDepReceipts.length).toBe(1);
  });

  test('should apply valuations filter', () => {
    component.memberBalances = [
      {
        year: "2023", balance_bf: 1000,
        policy_code: 0,
        policy_member_code: 0,
        period: '',
        employer_amount: 0,
        total_amount: 0,
        total_interest: 0,
        balance_cf: 0,
        balance_income: 0,
      },
    ];
    component.selectedColumn = 'balance_bf';
    component.selectedCondition = 'greater';
    component.filterValue = '1500';

    component.applyValuationsFilter();

    expect(component.filteredMemberBalances.length).toBe(0);
  });


  test('should filter withdrawals by year and month', () => {
    component.withdrawals = [
      {
        voucher_date: '2023-01-15',
        payee: '',
        accountName: '',
        clnt_acc_no: '',
        bank_branch_name: '',
        voucher_amount: 0,
        payment_mode: ''
      },
      {
        voucher_date: '2023-02-15',
        payee: '',
        accountName: '',
        clnt_acc_no: '',
        bank_branch_name: '',
        voucher_amount: 0,
        payment_mode: ''
      },
      {
        voucher_date: '2024-01-15',
        payee: '',
        accountName: '',
        clnt_acc_no: '',
        bank_branch_name: '',
        voucher_amount: 0,
        payment_mode: ''
      }
    ];
    component.selectedWithdrawalsYear = '2023';
    component.selectedWithdrawalsMonth = '01';
    component.filterWithdrawalsByYearMonth();
    expect(component.filteredWithdrawals.length).toBe(1);
  });

  test('should fetch member withdrawals and set withdrawals', () => {
    const mockResponse: MemberWithdrawalsDTO[] = [
      {
        voucher_amount: 100,
        payee: '',
        accountName: '',
        clnt_acc_no: '',
        bank_branch_name: '',
        voucher_date: '',
        payment_mode: ''
      },
    ];

    mockDashboardService.getMemberWithdrawals = jest.fn().mockReturnValue(of(mockResponse));
    component.getMemberWithdrawals();

    expect(mockDashboardService.getMemberWithdrawals).toHaveBeenCalledWith(component.selectedPolicyCode, component.policyMemCode);
    expect(component.withdrawals).toEqual(mockResponse);
    expect(component.filteredWithdrawals).toEqual(mockResponse);
  });

  test('should format date correctly', () => {
    const formattedDate = component.formatDateToCustomString('2023-01-15');
    expect(formattedDate).toBe('15-Jan-2023');
  });

  test('should extract pension details from text', () => {
    const mockText = `
      Contributions 1,000.00 2,000.00
      Transfer Value 500.00 1,000.00
      AVC 200.00 300.00
      Severance 100.00 200.00
      Interest 50.00 100.00
      Total 1,850.00 3,600.00
      Total Pension Account: MWK 5,450.00`;
    const result = (component as any).extractPensionDetails(mockText);
    expect(result.employee_contributions).toBe(1000);
    expect(result.employer_contributions).toBe(2000);
    expect(result.total_pension_account).toBe(5450);
  });


  test('should get gender label', () => {
    expect(component.getGenderLabel('M')).toBe('Male');
    expect(component.getGenderLabel('F')).toBe('Female');
  });

  test('should get status label', () => {
    expect(component.getStatusLabel('W')).toBe('Withdrawn');
    expect(component.getStatusLabel('A')).toBe('Active');
    expect(component.getStatusLabel('E')).toBe('Exited');
    expect(component.getStatusLabel('X')).toBe('');
  });

  test('should handle receipts table row click', () => {
    const mockReceipt = { pension_member_dep_code: 123, policy_member_code: 456 };
    component.onReceiptsTableRowClick(mockReceipt, 0);
    expect(component.selectedRowIndex).toBe(0);
    expect(component.pensionDepositCode).toBe(123);
    expect(component.policyMemCode).toBe(456);
    expect(mockDashboardService.getDetMemDepConReceipts).toHaveBeenCalledWith(123, 456);
  });

  test('should fetch detailed member contributions and update total contributions', () => {
    const mockResponse: DetailedMemContrReceiptsDTO[] = [
      {
        pension_member_dep_code: 989898,
        policy_code: 0,
        policy_member_code: 0,
        pnmdp_amount: 0,
        employer_amount: 0,
        employee_amount: 0,
        pnmdp_empyr_vol_amt: 0,
        pnmdp_empye_vol_amt: 0,
        pnmdp_empyr_trans_amt: 0,
        pnmdp_empye_trans_amt: 0,
        total_amount: 0,
        pnmdp_date: '',
        pnmdp_grct_code: 0,
        pnmdp_chq_rcpt_no: 0,
        contribution_amount: 0,
        voluntary_contribution_amount: 0,
        total_transfer_amount: 0,
        total_voluntary_transfer_amount: 0,
        cost_of_past_benefits: 0
      }
    ];
    mockDashboardService.getDetMemDepConReceipts = jest.fn().mockReturnValue(of(mockResponse));
    component.calculateTotalContributions = jest.fn().mockReturnValue(300);
    component.getDetMemDepConReceipts();
    expect(mockDashboardService.getDetMemDepConReceipts).toHaveBeenCalledWith(component.pensionDepositCode, component.policyMemCode);
    expect(component.detailedMemContrReceipts).toEqual(mockResponse);

    expect(component.totalContributions).toBe(300);
  });

  test('should handle empty response gracefully', () => {
    const mockResponse: DetailedMemContrReceiptsDTO[] = [];
    mockDashboardService.getDetMemDepConReceipts = jest.fn().mockReturnValue(of(mockResponse));
    component.calculateTotalContributions = jest.fn().mockReturnValue(0);
    component.getDetMemDepConReceipts();
    expect(component.detailedMemContrReceipts).toEqual(mockResponse);
    expect(component.totalContributions).toBe(0);
  });

  test('should calculate total contributions', () => {
    component.detailedMemContrReceipts = [{
      employee_amount: 1000,
      pnmdp_empye_trans_amt: 200,
      pnmdp_empye_vol_amt: 300,
      cost_of_past_benefits: 100,
      total_amount: 1600,
      employer_amount: 2000,
      pnmdp_empyr_trans_amt: 400,
      pension_member_dep_code: 0,
      policy_code: 0,
      policy_member_code: 0,
      pnmdp_amount: 0,
      pnmdp_empyr_vol_amt: 0,
      pnmdp_date: '',
      pnmdp_grct_code: 0,
      pnmdp_chq_rcpt_no: 0,
      contribution_amount: 0,
      voluntary_contribution_amount: 0,
      total_transfer_amount: 0,
      total_voluntary_transfer_amount: 0
    }];
    const total = component.calculateTotalContributions();
    expect(total).toBe(7700);
  });

  test('should fetch all pension deposit receipts and update filtered receipts', () => {
    const mockResponse: MemberPensionDepReceiptsDTO[] = [
      {
        pension_member_dep_code: 100,
        policy_code: 0,
        policy_member_code: 0,
        pnmdp_amount: 0,
        employer_amount: 0,
        employee_amount: 0,
        pnmdp_empyr_vol_amt: 0,
        pnmdp_empye_vol_amt: 0,
        pnmdp_empyr_trans_amt: 0,
        pnmdp_empye_trans_amt: 0,
        total_amount: 0,
        pnmdp_date: '',
        pnmdp_grct_code: 0,
        pnmdp_chq_rcpt_no: 0,
        contribution_amount: 0,
        voluntary_contribution_amount: 0,
        total_transfer_amount: 0,
        total_voluntary_transfer_amount: 0,
        cost_of_past_benefits: 0
      },
    ];

    mockDashboardService.getMemberAllPensionDepositReceipts = jest.fn().mockReturnValue(of(mockResponse));
    component.getMemberAllPensionDepositReceipts();

    expect(mockDashboardService.getMemberAllPensionDepositReceipts).toHaveBeenCalledWith(component.selectedPolicyCode, component.policyMemCode);
    expect(component.memberPensionDepReceipts).toEqual(mockResponse);
    expect(component.filteredMemberPensionDepReceipts).toEqual(mockResponse);
  });

  test('should handle empty response gracefully', () => {
    const mockResponse: MemberPensionDepReceiptsDTO[] = [];

    mockDashboardService.getMemberAllPensionDepositReceipts = jest.fn().mockReturnValue(of(mockResponse));
    component.getMemberAllPensionDepositReceipts();

    expect(component.memberPensionDepReceipts).toEqual(mockResponse);
    expect(component.filteredMemberPensionDepReceipts).toEqual(mockResponse);
  });

  test('should subscribe to the observable correctly', () => {
    const mockResponse: MemberPensionDepReceiptsDTO[] = [
      {
        pension_member_dep_code: 100,
        policy_code: 0,
        policy_member_code: 0,
        pnmdp_amount: 0,
        employer_amount: 0,
        employee_amount: 0,
        pnmdp_empyr_vol_amt: 0,
        pnmdp_empye_vol_amt: 0,
        pnmdp_empyr_trans_amt: 0,
        pnmdp_empye_trans_amt: 0,
        total_amount: 0,
        pnmdp_date: '',
        pnmdp_grct_code: 0,
        pnmdp_chq_rcpt_no: 0,
        contribution_amount: 0,
        voluntary_contribution_amount: 0,
        total_transfer_amount: 0,
        total_voluntary_transfer_amount: 0,
        cost_of_past_benefits: 0
      },
    ];

    mockDashboardService.getMemberAllPensionDepositReceipts = jest.fn().mockReturnValue(of(mockResponse));
    component.getMemberAllPensionDepositReceipts();

    expect(mockDashboardService.getMemberAllPensionDepositReceipts).toHaveBeenCalledWith(component.selectedPolicyCode, component.policyMemCode);
    expect(component.memberPensionDepReceipts).toEqual(mockResponse);
    expect(component.filteredMemberPensionDepReceipts).toEqual(mockResponse);
  });

  test('should fetch member balances and set filtered balances', () => {
    const mockResponse: memberBalancesDTO[] = [
      {
        policy_code: 100,
        year: '',
        policy_member_code: 0,
        period: '',
        employer_amount: 0,
        total_amount: 0,
        total_interest: 0,
        balance_bf: 0,
        balance_cf: 0,
        balance_income: 0
      },
    ];

    mockDashboardService.getMemberBalances = jest.fn().mockReturnValue(of(mockResponse));
    component.getValuations();

    expect(mockDashboardService.getMemberBalances).toHaveBeenCalledWith(component.selectedPolicyCode, component.policyMemCode);
    expect(component.memberBalances).toEqual(mockResponse);
    expect(component.filteredMemberBalances).toEqual(mockResponse);
  });

  test('should fetch member covers and set memberCovers', () => {
    const mockResponse: MemberCoversDTO[] = [
      {
        pcm_status: 'Active',
        cvt_desc: '',
        pcm_cover_wef_date: '',
        pcm_cover_wet_date: '',
        pcm_sa: 0,
        pcm_premium: 0,
        pcm_original_loan_amt: 0,
        pcm_orig_loan_repayment_prd: 0,
        pcm_loan_int: 0,
        pcm_saving_amt: 0,
        pcm_loan_issue_date: '',
        pcm_rate: 0,
        pcm_load_disc_prem: 0,
        pcm_add_ref_prem: 0,
        pcm_pay_period_premium: 0,
        pcm_earnings: 0,
        pcm_mult_earnings_prd: 0,
        pcm_code: 0,
        pcm_pcvt_code: 0,
        pcm_basic_sal: 0,
        pcm_house_allow: 0,
        pcm_trans_allow: 0,
        pcm_other_allow: 0,
        pcm_disc_prem: 0,
        pcm_pure_rate: 0,
        pcm_pure_premium: 0,
        pcm_adr_rate: 0,
        pcm_accidental_prem: 0,
        pcm_loading_type: '',
        pcm_loading_rate: 0,
        pcm_loading_div_factor: 0,
        pcvt_disc_rate: 0,
        pcvt_disc_div_fact: 0,
        pcm_orig_base_prem: 0,
        mem_prev_prem: 0,
        pcm_paid_to_date: '',
        pcm_load_reasons: ''
      },
    ];

    mockDashboardService.getMemberCovers = jest.fn().mockReturnValue(of(mockResponse));
    component.getMemberCovers();

    expect(mockDashboardService.getMemberCovers).toHaveBeenCalledWith(component.policyMemCode, component.endorsementCode);
    expect(component.memberCovers).toEqual(mockResponse);
  });

  test('should filter withdrawals by year and month', () => {
    const mockWithdrawals: MemberWithdrawalsDTO[] = [
      {
        voucher_date: '2023-05-01',
        payee: '',
        accountName: '',
        clnt_acc_no: '',
        bank_branch_name: '',
        voucher_amount: 100,
        payment_mode: ''
      },
    ];

    component.withdrawals = mockWithdrawals;
    component.selectedWithdrawalsYear = '2023';
    component.selectedWithdrawalsMonth = '05';

    component.filterWithdrawalsByYearMonth();

    expect(component.filteredWithdrawals).toEqual(mockWithdrawals);
  });

  test('should display message when no withdrawals data is available to filter', () => {
    component.withdrawals = [];
    component.filterWithdrawalsByYearMonth();

    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Information',
      detail: 'No withdrawals data available to filter'
    });
    expect(component.filteredWithdrawals).toEqual([]);
  });

  test('should reset to all records when "All" year is selected', () => {
    component.selectedWithdrawalsYear = 'All';
    component.filterWithdrawalsByYearMonth();

    expect(component.filteredWithdrawals).toEqual(component.withdrawals);
    expect(component.selectedWithdrawalsMonth).toBe('');
  });

  test('should validate date range', () => {
    component.dateRangeForm.setValue({
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-12-31')
    });
    expect(component.validateDateRange()).toBe(true);

    component.dateRangeForm.setValue({
      dateFrom: new Date('2023-12-31'),
      dateTo: new Date('2023-01-01')
    });
    expect(component.validateDateRange()).toBe(false);
  });

  test('should toggle date range picker', () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event;
    component.showDateRangePicker = false;
    component.toggleDateRangePicker(mockEvent);
    expect(component.showDateRangePicker).toBe(true);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('should handle getMemberItemizedStmt', () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event;
    component.dateRangeForm.setValue({
      dateFrom: new Date('2023-01-01'),
      dateTo: new Date('2023-12-31')
    });
    component.getMemberItemizedStmt(mockEvent);
    expect(mockDashboardService.getReports).toHaveBeenCalled();
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test('should download report', () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event;
    const mockFileUrl = 'blob:http://example.com/1234-5678';
    const mockFileName = 'test.pdf';

    const mockLink = { href: '', download: '', click: jest.fn() };
    jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

    component.downloadReport(mockEvent, mockFileUrl, mockFileName);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockLink.href).toBe(mockFileUrl);
    expect(mockLink.download).toBe(mockFileName);
    expect(mockLink.click).toHaveBeenCalled();
  });

});
