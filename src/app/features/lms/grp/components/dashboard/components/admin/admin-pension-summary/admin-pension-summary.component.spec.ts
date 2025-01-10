import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AdminPensionSummaryComponent } from './admin-pension-summary.component';
import { DashboardService } from '../../../services/dashboard.service';
import { ValuationsDTO, ReceiptsDTO, PartialWithdrawalsDTO, MemberListDTO } from '../../../models/admin-policies';
import { AutoUnsubscribe } from '../../../../../../../../shared/services/AutoUnsubscribe';
import { Logger } from '../../../../../../../../shared/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

const log = new Logger("AdminPensionSummaryComponent");

describe('AdminPensionSummaryComponent', () => {
  let component: AdminPensionSummaryComponent;
  let fixture: ComponentFixture<AdminPensionSummaryComponent>;
  let mockDashboardService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockDashboardService = {
      getPolicyValuations: jest.fn(),
      getReceipts: jest.fn(),
      getPartialWithdrawals: jest.fn(),
      getMemberDetailsList: jest.fn(),
    };

    mockActivatedRoute = {
      snapshot: {
        queryParams: {
          policyCode: 2022169,
          policyNumber: '12345',
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [AdminPensionSummaryComponent],
      imports: [
              HttpClientTestingModule,
              TranslateModule.forRoot(),
            ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPensionSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should handle errors in service methods', () => {
    const mockError = new Error('Service call failed');
    mockDashboardService.getReceipts.mockReturnValue(throwError(() => mockError));

    const getReceiptsSpy = jest.spyOn(component, 'getReceipts');
    component.getReceipts();

    expect(getReceiptsSpy).toHaveBeenCalled();
    expect(component.receipts).toEqual([]);
  });

  it('should populate years correctly', () => {
    component.populateYears();
    const currentYear = new Date().getFullYear();
    expect(component.years[0]).toBe(currentYear);
    expect(component.years[component.years.length - 1]).toBe(1900);
  });

  it('should switch selected content', () => {
    component.showContent('transactions');
    expect(component.selectedContent).toBe('transactions');

    component.showContent('members');
    expect(component.selectedContent).toBe('members');
  });

  it('should get policy parameters from activatedRoute', () => {
    component.getParams();
    expect(component.policyCode).toBe(2022169);
    expect(component.selectedPolicyNumber).toBe('12345');
  });

  it('should populate breadcrumb items correctly', () => {
    component.populateBreadCrumbItems();
    expect(component.breadCrumbItems.length).toBeGreaterThan(0);
    expect(component.breadCrumbItems[0].label).toBe('Dashboard');
    expect(component.breadCrumbItems[1].label).toBe(component.selectedPolicyNumber);
  });
  
  it('should populate years array with current year to 1900', () => {
    component.populateYears();
    const currentYear = new Date().getFullYear();
    expect(component.years[0]).toBe(currentYear);
    expect(component.years[component.years.length - 1]).toBe(1900);
    expect(component.years.length).toBe(currentYear - 1900 + 1);
  });
  
  it('should switch selected content correctly', () => {
    component.showContent('summary');
    expect(component.selectedContent).toBe('summary');
    
    component.showContent('transactions');
    expect(component.selectedContent).toBe('transactions');
  
    component.showContent('members');
    expect(component.selectedContent).toBe('members');
  });
  
  it('should correctly get policy parameters from ActivatedRoute', () => {
    component.getParams();
    expect(component.policyCode).toBe(2022169);
    expect(component.selectedPolicyNumber).toBe('12345');
  });
  
  it('should fetch policy valuations', () => {
    const mockValuations: ValuationsDTO[] = [
      {
        authorised_by: '',
        authorised_date: '',
        client: '',
        employee_amt: 0,
        employee_bal_cf: 0,
        employee_bal_income: 0,
        employee_balance_bf: 0,
        employee_contri_income: 0,
        employee_vol_amt: 0,
        employee_withdrawal_amt: 0,
        employer_amt: 0,
        employer_bal_bf: 0,
        employer_bal_income: 0,
        employer_balance_cf: 0,
        employer_contri_income: 0,
        employer_retire_held: 0,
        employer_withdrawal_amt: 0,
        endorsement_code: 0,
        inception_date: '',
        interest_rate: 0,
        period: '',
        pnbal_valua_date: '',
        policy_code: 0,
        policy_number: '',
        scheme_fund: 0,
        scheme_fund_bf: 0,
        status: '',
        tot_bal_carried_forward: 0,
        total_amount: 0,
        total_bal_bf: 0,
        total_deductions: 0,
        total_fund_bal: 0,
        valuation_date: '',
        valuation_year: '',
        wef: '',
        wet: '',
        withdrawal_total: 0
      }
    ];
    mockDashboardService.getPolicyValuations.mockReturnValue(of(mockValuations));
    
    const getPolicyValuationsSpy = jest.spyOn(component, 'getPolicyValuations');
    component.getPolicyValuations();
    
    expect(getPolicyValuationsSpy).toHaveBeenCalled();
    expect(component.valuations).toEqual(mockValuations);
  });
  
  it('should fetch receipts data', () => {
    const mockReceipts: ReceiptsDTO[] = [
      {
        amount: 0,
        balance_amount: 0,
        cheque_no: '',
        comm_inclusive: '',
        doc_date: '',
        drcr: '',
        gross_amount: 0,
        member_allocated_amount: 0,
        member_allocated_balance: 0,
        pay_method: '',
        pension_allocate: 0,
        pension_allocated_amount: 0,
        pension_payment_amount: 0,
        policy_fee: 0,
        prem_orc_comm: 0,
        prem_tax: 0,
        premium_allocate: 0,
        premium_comm: 0,
        premium_payment_amount: 0,
        receipt_date: '',
        receipt_narration: '',
        receipt_no: '',
        refunded_amount: 0,
        status: ''
      }
    ];
    mockDashboardService.getReceipts.mockReturnValue(of(mockReceipts));
  
    const getReceiptsSpy = jest.spyOn(component, 'getReceipts');
    component.getReceipts();
  
    expect(getReceiptsSpy).toHaveBeenCalled();
    expect(component.receipts).toEqual(mockReceipts);
  });
  
  it('should fetch partial withdrawals data', () => {
    const mockPartialWithdrawals: PartialWithdrawalsDTO[] = [
      {
        amount: 0,
        bank_account_no: '',
        bank_accountn_name: '',
        bank_name: '',
        narration: '',
        notification_date: '',
        pay_method: '',
        payee: ''
      }
    ];
    mockDashboardService.getPartialWithdrawals.mockReturnValue(of(mockPartialWithdrawals));
  
    const getPartialWithdrawalsSpy = jest.spyOn(component, 'getPartialWithdrawals');
    component.getPartialWithdrawals();
  
    expect(getPartialWithdrawalsSpy).toHaveBeenCalled();
    expect(component.partialWithdrawals).toEqual(mockPartialWithdrawals);
  });
  
  it('should fetch member details list', () => {
    const mockMemberList: MemberListDTO[] = [
      {
        member_number: '',
        surname: '',
        other_names: '',
        sex: '',
        schedule_join_date: '',
        telephone_number: '',
        email: '',
        category: '',
        dependent_types: '',
        date_of_birth: '',
        premium: 0,
        sum_assured: 0,
        policy_member_code: ''
      }
    ];
    mockDashboardService.getMemberDetailsList.mockReturnValue(of(mockMemberList));
  
    const getMemberDetailsListSpy = jest.spyOn(component, 'getMemberDetailsList');
    component.getMemberDetailsList();
  
    expect(getMemberDetailsListSpy).toHaveBeenCalled();
    expect(component.memberList).toEqual(mockMemberList);
  });
  
  it('should handle error when fetching receipts', () => {
    const mockError = new Error('Service call failed');
    mockDashboardService.getReceipts.mockReturnValue(throwError(() => mockError));
  
    const getReceiptsSpy = jest.spyOn(component, 'getReceipts');
    component.getReceipts();
  
    expect(getReceiptsSpy).toHaveBeenCalled();
    expect(component.receipts).toEqual([]);
  });
});
