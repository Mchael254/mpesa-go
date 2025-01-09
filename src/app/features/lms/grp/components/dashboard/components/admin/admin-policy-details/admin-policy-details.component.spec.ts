import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AdminPolicyDetailsComponent } from './admin-policy-details.component';
import { DashboardService } from '../../../services/dashboard.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CategorySummaryDTO } from '../../../models/admin-policies';

jest.mock('../../../../../../../../shared/services', () => ({
  Logger: jest.fn(() => ({
    info: jest.fn(),
  })),
}));

describe('AdminPolicyDetailsComponent', () => {
  let component: AdminPolicyDetailsComponent;
  let fixture: ComponentFixture<AdminPolicyDetailsComponent>;
  let dashboardServiceMock: jest.Mocked<DashboardService>;

  const activatedRouteMock = {
    snapshot: {
      queryParams: {
        policyCode: 2024858,
      },
    },
  };

  beforeEach(async () => {
    dashboardServiceMock = {
      getAdminPolicyDetails: jest.fn().mockReturnValue(of({})),
      getEndorsements: jest.fn().mockReturnValue(of([])),
      getCategorySummary: jest.fn().mockReturnValue(of([])),
      getDependentLimits: jest.fn().mockReturnValue(of([])),
      getCoverTypes: jest.fn().mockReturnValue(of([])),
      getPolicyMemberDetails: jest.fn().mockReturnValue(of([])),
      getMemberDetailsList: jest.fn().mockReturnValue(of([])),
      getMemberDetsSummary: jest.fn().mockReturnValue(of([])),
    } as unknown as jest.Mocked<DashboardService>;

    await TestBed.configureTestingModule({
      declarations: [AdminPolicyDetailsComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: DashboardService, useValue: dashboardServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPolicyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create the component', () => {
    expect(component).toBeTruthy();
  });

  test('should handle errors in getEndorsements', () => {
    dashboardServiceMock.getEndorsements.mockReturnValue(throwError(() => new Error('Error fetching endorsements')));

    component.getEndorsements();

    expect(dashboardServiceMock.getEndorsements).toHaveBeenCalledWith(2024858);
    expect(component.endorsements).toEqual([]);
  });

  test('should populate breadcrumb items', () => {
    component.populateBreadCrumbItems();
    expect(component.breadCrumbItems.length).toBe(3);
    expect(component.breadCrumbItems[2].label).toBe(component.selectedPolicyNumber);
  });

  test('should initialize member details columns', () => {
    component.memberDetailsColumns();
    expect(component.columnOptionsMemberDets.length).toBeGreaterThan(0);
    expect(component.selectedColumnsMemberDets.length).toBeGreaterThan(0);
  });

  test('should create endorsement form', () => {
    component.createEndorsementForm();
    expect(component.endorsementForm).toBeDefined();
    expect(component.endorsementForm.get('endorsement')).toBeDefined();
  });

  test('should handle endorsement change', () => {
    component.createEndorsementForm();
    component.onEndorsementChange();
    component.endorsementForm.get('endorsement').setValue(20241004);
    expect(component.endorsementCode).toBe(20241004);
  });

  test('should handle member table row click', () => {
    const mockMemberList = { policy_member_code: 123 };
    component.onMemberTableRowClick(mockMemberList, 0);
    expect(component.selectedRowIndex).toBe(0);
    expect(component.memberUnqiueCode).toBe(123);
    expect(dashboardServiceMock.getMemberDetsSummary).toHaveBeenCalled();
  });

  test('should fetch admin policy details', () => {
    component.getAdminPolicyDetails();
    expect(dashboardServiceMock.getAdminPolicyDetails).toHaveBeenCalledWith(component.endorsementCode);
  });

  test('should fetch category summary', () => {
    component.getCategorySummary();
    expect(dashboardServiceMock.getCategorySummary).toHaveBeenCalledWith(component.endorsementCode);
  });

  test('should fetch cover types', () => {
    component.getCoverTypes();
    expect(dashboardServiceMock.getCoverTypes).toHaveBeenCalledWith(component.endorsementCode);
  });

  test('should fetch policy member details', () => {
    component.getPolicyMemberDetails();
    expect(dashboardServiceMock.getPolicyMemberDetails).toHaveBeenCalledWith(component.endorsementCode);
  });

  test('should fetch member details list', () => {
    component.getMemberDetailsList();
    expect(dashboardServiceMock.getMemberDetailsList).toHaveBeenCalledWith(component.policyCode, component.endorsementCode);
  });

  test('should fetch member details summary', () => {
    component.getMemberDetsSummary();
    expect(dashboardServiceMock.getMemberDetsSummary).toHaveBeenCalledWith(component.endorsementCode, component.memberUnqiueCode);
  });

  test('should handle errors in getCategorySummary', () => {
    dashboardServiceMock.getCategorySummary.mockReturnValue(throwError(() => new Error('Error fetching category summary')));
    component.getCategorySummary();
    expect(component.categorySummary).toEqual([]);
  });

  test('should call all necessary methods in ngOnInit', () => {
    const spyGetParams = jest.spyOn(component, 'getParams');
    const spyPopulateBreadCrumbItems = jest.spyOn(component, 'populateBreadCrumbItems');
    const spyMemberDetailsColumns = jest.spyOn(component, 'memberDetailsColumns');
    const spyGetAdminPolicyDetails = jest.spyOn(component, 'getAdminPolicyDetails');
    const spyGetEndorsements = jest.spyOn(component, 'getEndorsements');
    const spyCreateEndorsementForm = jest.spyOn(component, 'createEndorsementForm');
    const spyOnEndorsementChange = jest.spyOn(component, 'onEndorsementChange');
    const spyGetCategorySummary = jest.spyOn(component, 'getCategorySummary');
    const spyCategoryDetailsColumns = jest.spyOn(component, 'categoryDetailsColumns');
    const spyDepLimitsColumns = jest.spyOn(component, 'depLimitsColumns');
    const spyGetCoverTypes = jest.spyOn(component, 'getCoverTypes');
    const spyGetPolicyMemberDetails = jest.spyOn(component, 'getPolicyMemberDetails');
    const spyGetMemberDetailsList = jest.spyOn(component, 'getMemberDetailsList');

    component.ngOnInit();

    expect(spyGetParams).toHaveBeenCalled();
    expect(spyPopulateBreadCrumbItems).toHaveBeenCalled();
    expect(spyMemberDetailsColumns).toHaveBeenCalled();
    expect(spyGetAdminPolicyDetails).toHaveBeenCalled();
    expect(spyGetEndorsements).toHaveBeenCalled();
    expect(spyCreateEndorsementForm).toHaveBeenCalled();
    expect(spyOnEndorsementChange).toHaveBeenCalled();
    expect(spyGetCategorySummary).toHaveBeenCalled();
    expect(spyCategoryDetailsColumns).toHaveBeenCalled();
    expect(spyDepLimitsColumns).toHaveBeenCalled();
    expect(spyGetCoverTypes).toHaveBeenCalled();
    expect(spyGetPolicyMemberDetails).toHaveBeenCalled();
    expect(spyGetMemberDetailsList).toHaveBeenCalled();
  });

  test('should initialize dependent limits columns', () => {
    component.depLimitsColumns();
    expect(component.columnOptionsDepLimits.length).toBeGreaterThan(0);
    expect(component.selectedColumnsDepLimits.length).toBeGreaterThan(0);
  });

  test('should initialize category details columns', () => {
    component.categoryDetailsColumns();
    expect(component.columnOptionsCatDets.length).toBeGreaterThan(0);
    expect(component.selectedColumnsCatDets.length).toBeGreaterThan(0);
  });


  test('should fetch dependent limits', () => {
    component.categoryCode = 789;
    component.getDependentLimits();
    expect(dashboardServiceMock.getDependentLimits).toHaveBeenCalledWith(component.endorsementCode, component.categoryCode);
  });

  test('should handle errors in getDependentLimits', () => {
    dashboardServiceMock.getDependentLimits.mockReturnValue(throwError(() => new Error('Error fetching dependent limits')));
    component.getDependentLimits();
    expect(component.dependentLimit).toEqual([]);
  });

  test('should handle errors in getCoverTypes', () => {
    dashboardServiceMock.getCoverTypes.mockReturnValue(throwError(() => new Error('Error fetching cover types')));
    component.getCoverTypes();
    expect(component.coverTypes).toEqual([]);
  });

  test('should handle errors in getPolicyMemberDetails', () => {
    dashboardServiceMock.getPolicyMemberDetails.mockReturnValue(throwError(() => new Error('Error fetching policy member details')));
    component.getPolicyMemberDetails();
    expect(component.memberDetails).toEqual([]);
  });

  test('should handle errors in getMemberDetailsList', () => {
    dashboardServiceMock.getMemberDetailsList.mockReturnValue(throwError(() => new Error('Error fetching member details list')));
    component.getMemberDetailsList();
    expect(component.memberList).toEqual([]);
  });

  test('should handle errors in getMemberDetsSummary', () => {
    dashboardServiceMock.getMemberDetsSummary.mockReturnValue(throwError(() => new Error('Error fetching member details summary')));
    component.getMemberDetsSummary();
    expect(component.memberDetailsSummary).toEqual([]);
  });

  test('should handle endorsement change', fakeAsync(() => {
    component.createEndorsementForm();
    component.onEndorsementChange();
    component.endorsementForm.get('endorsement').setValue(20241004);
    tick();
    expect(component.endorsementCode).toBe(20241004);
    expect(dashboardServiceMock.getAdminPolicyDetails).toHaveBeenCalledWith(20241004);
  }));

  test('should get params from activated route', () => {
    component.getParams();
    expect(component.policyCode).toBe(2024858);
  });

  test('should set selected row index and member unique code on member table row click', () => {
    const mockMemberList = { policy_member_code: 123 };
    component.onMemberTableRowClick(mockMemberList, 2);
    expect(component.selectedRowIndex).toBe(2);
    expect(component.memberUnqiueCode).toBe(123);
  });

  test('should handle category details table row click', () => {
    const mockCategorySummary: CategorySummaryDTO = {
      accelerator: '1',
      average_anb: 30,
      policy_category_code: 456,
      average_cvr_earning_permember: 0,
      average_earnings_per_member: 0,
      base_premium: 0,
      base_sum_assured: 0,
      category_category: '',
      category_rate_division_factor: 0,
      cover_inbuilt: '',
      cvt_desc: '',
      dty_sht_desc: '',
      endorsement_code: '',
      fee_amount: 0,
      level: '',
      limit_amount: 0,
      loan_amount: 0,
      lpag_code: '',
      main_cover: '',
      maximum_type_allowed: '',
      med_exempted: '',
      minimum_amt: 0,
      multiple_earnings_period: 0,
      pca_comm_amt: 0,
      pca_comm_rate: 0,
      period: 0,
      pmas_sht_desc: '',
      policy_code: '',
      premium: 0,
      premium_mask_code: 0,
      premium_mask_desc: '',
      previous_category_code: '',
      rate: 0,
      school_code: '',
      short_description: '',
      sum_assured: 0,
      sum_assured_per_member: 0,
      sum_assured_percentage: 0,
      total_member_earnings: 0,
      total_members: 0,
      total_original_loan_amount: 0,
      total_students: 0,
      use_cvr_rate: '',
      policy_access_group: ''
    };
  
    component.onCategoryDetailsTableRowClick([mockCategorySummary], 0);
    expect(component.selectedRowIndex).toBe(0);
    expect(component.categoryCode).toBe(456);
    expect(dashboardServiceMock.getDependentLimits).toHaveBeenCalled();
  });

  test('should show the member summary modal', () => {
    const modal = document.getElementById('memberSummaryModal') as HTMLElement;

    component.showMembersSummary();

    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close the member summary modal', () => {
    const modal = document.getElementById('memberSummaryModal') as HTMLElement;

    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeMembersSummary();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should show the category summary modal', () => {
    const modal = document.getElementById('categorySummaryModal') as HTMLElement;

    component.showCategorySummary();

    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close the category summary modal', () => {
    const modal = document.getElementById('categorySummaryModal') as HTMLElement;

    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeCategorySummary();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });
});
