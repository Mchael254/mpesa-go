import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { CoverageDetailsComponent } from './coverage-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoverageService } from '../../service/coverage/coverage.service';
import { SessionStorageService } from '../../../../../../../shared/services/session-storage/session-storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MembersDTO } from '../../models/members';
import { CoverTypesDto } from '../../models/coverTypes/coverTypesDto';

describe('CoverageDetailsComponent', () => {
  let component: CoverageDetailsComponent;
  let fixture: ComponentFixture<CoverageDetailsComponent>;
  let coverageService: CoverageService;
  let sessionStorageService: SessionStorageService;
  let messageService: MessageService;
  let spinnerService: NgxSpinnerService;
  let confirmationService: ConfirmationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CoverageDetailsComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        TableModule,
        MultiSelectModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: CoverageService, useValue: {
            getCategoryDetails: jest.fn().mockReturnValue(of([])),
            getCoverTypes: jest.fn().mockReturnValue(of([])),
            getCoverTypesPerProduct: jest.fn().mockReturnValue(of([])),
            getSelectRateType: jest.fn().mockReturnValue(of([])),
            getMembers: jest.fn().mockReturnValue(of([])),
            getPremiumMask: jest.fn().mockReturnValue(of([])),
            getOccupation: jest.fn().mockReturnValue(of([])),
            uploadMemberTemplate: jest.fn().mockReturnValue(of({})),
            postCategoryDetails: jest.fn().mockReturnValue(of({})),
            updateCategoryDetails: jest.fn().mockReturnValue(of({})),
            deleteCategoryDetails: jest.fn().mockReturnValue(of({})),
            postCoverType: jest.fn().mockReturnValue(of({})),
            deleteCoverType: jest.fn().mockReturnValue(of({})),
            deleteMember: jest.fn().mockReturnValue(of({})),
            computePremium: jest.fn().mockReturnValue(of({})),
            addMember: jest.fn().mockReturnValue(of({})),
            downloadMemberUploadTemplate: jest.fn().mockReturnValue(of(new Blob()))
          }
        },
        {
          provide: SessionStorageService, useValue: {
            get: jest.fn().mockReturnValue(JSON.stringify({ formData: { products: { value: 123, type: 'test' }, quotationCalcType: 'A' } }))
          }
        },
        { provide: MessageService, useValue: { add: jest.fn() } },
        { provide: NgxSpinnerService, useValue: { show: jest.fn(), hide: jest.fn() } },
        { provide: ConfirmationService, useValue: { confirm: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CoverageDetailsComponent);
    component = fixture.componentInstance;
    coverageService = TestBed.inject(CoverageService);
    sessionStorageService = TestBed.inject(SessionStorageService);
    messageService = TestBed.inject(MessageService);
    spinnerService = TestBed.inject(NgxSpinnerService);
    confirmationService = TestBed.inject(ConfirmationService);
    router = TestBed.inject(Router);
    component.searchFormMember();
    component.detailedCoverDetails();
    component.aggregateDetailsForm();
    component.categoryDetailsForm();
    component.memberDetsForm();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize on ngOnInit', () => {
    const spyRetrievQuoteDets = jest.spyOn(component, 'retrievQuoteDets');
    const spySearchFormMember = jest.spyOn(component, 'searchFormMember');
    const spyDetailedCoverDetails = jest.spyOn(component, 'detailedCoverDetails');
    const spyAggregateDetailsForm = jest.spyOn(component, 'aggregateDetailsForm');
    const spyGetCategoryDets = jest.spyOn(component, 'getCategoryDets');
    const spyGetCoverTypes = jest.spyOn(component, 'getCoverTypes');
    const spyCategoryDetailsForm = jest.spyOn(component, 'categoryDetailsForm');
    const spyGetCoverTypesPerProduct = jest.spyOn(component, 'getCoverTypesPerProduct');
    const spyGetSelectRateTypes = jest.spyOn(component, 'getSelectRateTypes');
    const spyGetMembers = jest.spyOn(component, 'getMembers');
    const spyGetPremiumMask = jest.spyOn(component, 'getPremiumMask');
    const spyGetSelectRate = jest.spyOn(component, 'getSelectRate');
    const spyMemberDetsForm = jest.spyOn(component, 'memberDetsForm');
    const spyGetOccupations = jest.spyOn(component, 'getOccupations');
    const spyGetPmasCodeToEdit = jest.spyOn(component, 'getPmasCodeToEdit');
    const spyMemberDetailsColumns = jest.spyOn(component, 'memberDetailsColumns');
    const spyAggregateCvtDetsColumns = jest.spyOn(component, 'aggregateCvtDetsColumns');

    component.ngOnInit();

    expect(spyRetrievQuoteDets).toHaveBeenCalled();
    expect(spySearchFormMember).toHaveBeenCalled();
    expect(spyDetailedCoverDetails).toHaveBeenCalled();
    expect(spyAggregateDetailsForm).toHaveBeenCalled();
    expect(spyGetCategoryDets).toHaveBeenCalled();
    expect(spyGetCoverTypes).toHaveBeenCalled();
    expect(spyCategoryDetailsForm).toHaveBeenCalled();
    expect(spyGetCoverTypesPerProduct).toHaveBeenCalled();
    expect(spyGetSelectRateTypes).toHaveBeenCalled();
    expect(spyGetMembers).toHaveBeenCalled();
    expect(spyGetPremiumMask).toHaveBeenCalled();
    expect(spyGetSelectRate).toHaveBeenCalled();
    expect(spyMemberDetsForm).toHaveBeenCalled();
    expect(spyGetOccupations).toHaveBeenCalled();
    expect(spyGetPmasCodeToEdit).toHaveBeenCalled();
    expect(spyMemberDetailsColumns).toHaveBeenCalled();
    expect(spyAggregateCvtDetsColumns).toHaveBeenCalled();
  });

  test('should retrieve quote details', () => {
    sessionStorage.setItem('quotationResponse', JSON.stringify({ quotation_code: 456, quotation_number: 'QN001' }));
    component.retrievQuoteDets();
    expect(component.quotationCode).toBe(456);
    expect(component.quotationNumber).toBe('QN001');
    expect(component.productCode).toBe(123);
    expect(component.productType).toBe('test');
    expect(component.quatationCalType).toBe('A');
  });

  test('should initialize search form', () => {
    component.searchFormMember();
    expect(component.searchFormMemberDets).toBeDefined();
    expect(component.searchFormMemberDets.get('filterby')).toBeDefined();
    expect(component.searchFormMemberDets.get('greaterOrEqual')).toBeDefined();
    expect(component.searchFormMemberDets.get('valueEntered')).toBeDefined();
    expect(component.searchFormMemberDets.get('searchMember')).toBeDefined();
  });

  test('should initialize detailed cover details form', () => {
    component.detailedCoverDetails();
    expect(component.detailedCovDetsForm).toBeDefined();
    expect(component.detailedCovDetsForm.get('detailedCoverType')).toBeDefined();
    expect(component.detailedCovDetsForm.get('detailedPercentageMainYr')).toBeDefined();
    expect(component.detailedCovDetsForm.get('rate')).toBeDefined();
    expect(component.detailedCovDetsForm.get('selectRate')).toBeDefined();
    expect(component.detailedCovDetsForm.get('premiumMask')).toBeDefined();
    expect(component.detailedCovDetsForm.get('rateDivFactor')).toBeDefined();
  });

  test('should initialize aggregate details form', () => {
    component.aggregateDetailsForm();
    expect(component.aggregateForm).toBeDefined();
    expect(component.aggregateForm.get('aggregateCoverType')).toBeDefined();
    expect(component.aggregateForm.get('aggrgatePremiumMask')).toBeDefined();
    expect(component.aggregateForm.get('aggregatePercentageMainYr')).toBeDefined();
    expect(component.aggregateForm.get('noOfMembers')).toBeDefined();
    expect(component.aggregateForm.get('category')).toBeDefined();
    expect(component.aggregateForm.get('aggregateSelectRate')).toBeDefined();
    expect(component.aggregateForm.get('rate')).toBeDefined();
    expect(component.aggregateForm.get('dependantType')).toBeDefined();
    expect(component.aggregateForm.get('averageEarningPerMember')).toBeDefined();
    expect(component.aggregateForm.get('overridePremiums')).toBeDefined();
    expect(component.aggregateForm.get('rateDivFactor')).toBeDefined();
    expect(component.aggregateForm.get('averageAnb')).toBeDefined();
    expect(component.aggregateForm.get('sumAssured')).toBeDefined();
    expect(component.aggregateForm.get('multiplesOfEarnings')).toBeDefined();
  });

  test('should initialize category details form', () => {
    component.categoryDetailsForm();
    expect(component.categoryDetailForm).toBeDefined();
    expect(component.categoryDetailForm.get('description')).toBeDefined();
    expect(component.categoryDetailForm.get('premiumMask')).toBeDefined();
    expect(component.categoryDetailForm.get('shortDescription')).toBeDefined();
    expect(component.categoryDetailForm.get('multiplesOfEarnings')).toBeDefined();
  });

  test('should initialize member details form', () => {
    component.memberDetsForm();
    expect(component.memberDetailsForm).toBeDefined();
    expect(component.memberDetailsForm.get('surname')).toBeDefined();
    expect(component.memberDetailsForm.get('dateOfBirth')).toBeDefined();
    expect(component.memberDetailsForm.get('mainMemberNumber')).toBeDefined();
    expect(component.memberDetailsForm.get('category')).toBeDefined();
    expect(component.memberDetailsForm.get('monthlyEarning')).toBeDefined();
    expect(component.memberDetailsForm.get('otherNames')).toBeDefined();
    expect(component.memberDetailsForm.get('gender')).toBeDefined();
    expect(component.memberDetailsForm.get('payrollNumber')).toBeDefined();
    expect(component.memberDetailsForm.get('occupation')).toBeDefined();
    expect(component.memberDetailsForm.get('dependantType')).toBeDefined();
    expect(component.memberDetailsForm.get('joiningDate')).toBeDefined();
  });

  test('should show detailed cover details modal', () => {
    document.body.innerHTML = '<div id="detailedModal"></div>';
    component.showDetailedCoverDetailsModal();
    const modal = document.getElementById('detailedModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should get use CVR rate description', () => {
    expect(component.getUseCvrRateDescription('M')).toBe('Use Quote Mask');
    expect(component.getUseCvrRateDescription('S')).toBe('Select Specific Mask');
    expect(component.getUseCvrRateDescription('C')).toBe('Input Rate');
    expect(component.getUseCvrRateDescription('X')).toBe('Unknown');
  });

  test('should get select rate for aggregate type', fakeAsync(() => {
    component.quatationCalType = 'A';
    component.aggregateDetailsForm();
    component.getSelectRate();
    component.aggregateForm.get('aggregateSelectRate').setValue('M');
    tick();
    expect(component.selectedRateType).toBe('M');
  }));

  test('should get select rate for detailed type', fakeAsync(() => {
    component.quatationCalType = 'D';
    component.detailedCoverDetails();
    component.getSelectRate();
    component.detailedCovDetsForm.get('selectRate').setValue('S');
    tick();
    expect(component.selectedRateType).toBe('S');
  }));

  test('should show edit detailed cover details modal', () => {
component.detailedCovDetsForm = {
  value: {},
  patchValue: jest.fn(function (value) {
    this.value = { ...this.value, ...value };
  }),
} as any;

document.body.innerHTML = '<div id="detailedModal"></div>';
const modal = document.getElementById('detailedModal');
const mockCoverType: Partial<CoverTypesDto> = {
  cover_type_unique_code: 1,
  cover_type_code: 2,
  cvt_desc: 'Test Cover',
  main_sumassured_percentage: '50',
  premium_rate: '0.5', 
  use_cvr_rate: 'M',
  premium_mask_short_description: 'Test Mask',
  rate_division_factor: 1,
};

component.showEditDetailedCoverDetailsModal(mockCoverType as CoverTypesDto);

expect(component.isEditMode).toBeTruthy();
expect(component.coverTypeUniqueCode).toBe(1);
expect(component.coverTypeCodeToEdit).toBe(2);

expect(component.detailedCovDetsForm.value).toEqual({
  detailedCoverType: 'test cover',
  detailedPercentageMainYr: '50',
  rate: '0.5',
  selectRate: 'M',
  premiumMask: 'Test Mask',
  rateDivFactor: 1,
});

expect(modal?.classList.contains('show')).toBeTruthy();
expect(modal?.style.display).toBe('block');
  });

  test('should show aggregate cover details modal', () => {
    document.body.innerHTML = '<div id="aggregateModal"></div>';
    component.showAggregateCoverDetailsModal();
    const modal = document.getElementById('aggregateModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should show edit aggregate cover details modal', () => {
    document.body.innerHTML = '<div id="aggregateModal"></div>';
    const mockCoverType = {
      cover_type_unique_code: 1,
      cover_type_code: 2,
      cvt_desc: 'Test Cover',
      premium_rate: '0.5',
      premium_mask_short_description: 'Test Mask',
      use_cvr_rate: 'M',
      rate_division_factor: 1,
      total_members: '100',
      average_earning_per_member: '5000',
      average_anb: '30',
      but_charge_premium: 'Y',
      sum_assured: 1000000,
      aggregate_plan: null,
      apply_commission_expense_loading: null,
      average_cover_per_member: null,
      average_period: null,
      before_load_discount_premium: '',
      beneficiaries: '',
      category_description: '',
      computed_premium: '',
      cover_duration_type: '',
      cover_term: '',
      cvt_main_cover: '',
      cvt_rate_type: '',
      discount: '',
      discount_division_factor: '',
      discount_loading_division_factor: '',
      discount_or_loading_rate: '',
      discount_percentage: '',
      discount_rate: '',
      dty_description: '',
      facultative_amount: '',
      group_premium_rates_code: '',
      if_inbuilt: '',
      if_main_cover: '',
      if_main_rider: '',
      if_use_unit_rate: '',
      letter_closing_remarks: '',
      letter_opening_remarks: '',
      limit: '',
      lnty_code: '',
      load_age_factor: '',
      loan_amount_per_member: '',
      loan_interval_per_member: '',
      loan_repayment_period: '',
      main_sumassured_percentage: '',
      member_minimum_allowed_premium: '',
      multiple_earnings_period: '',
      multiplier: '',
      multiplier_division_factor: '',
      override_facultative_amount: 0,
      percentage_payable: '',
      premium: 0,
      premium_but_charge_amount: '',
      premium_computation_formula: '',
      premium_mask_code: 0,
      product_code: '',
      quotation_code: '',
      quotation_duration_type: '',
      quotation_product_code: '',
      refund_formula: '',
      savings_per_member: '',
      short_description: '',
      staff_description: '',
      sum_assured_per_member: '',
      sum_assured_limit: 0,
      total_loan_amount: '',
      total_member_earnings: '',
      use_rate: '',
      weekly_indemnity: '',
      wef: '',
      wet: ''
    };
  
    component.aggregateDetailsForm();
    component.showEditAggregateCoverDetailsModal(mockCoverType);
  
    expect(component.isEditMode).toBeTruthy();
    expect(component.coverTypeUniqueCode).toBe(1);
    expect(component.coverTypeCodeToEdit).toBe(2);
    expect(component.aggregateForm.value).toEqual({
      aggregateCoverType: 'test cover',
      rate: '0.5',
      aggrgatePremiumMask: 'Test Mask',
      aggregateSelectRate: 'M',
      rateDivFactor: 1,
      aggregatePercentageMainYr: '0.5',
      noOfMembers: '100',
      averageEarningPerMember: '5000',
      averageAnb: '30',
      overridePremiums: 'Y',
      sumAssured: 1000000,
      category: null,
      dependantType: null,
      multiplesOfEarnings: null,
    });
  
    const modal = document.getElementById('aggregateModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });
  

  test('should show category details modal', () => {
    document.body.innerHTML = '<div id="categoryDetsModal"></div>';
    component.showCategoryDetstModal();
    const modal = document.getElementById('categoryDetsModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should show edit category details modal', () => {
    document.body.innerHTML = '<div id="categoryDetsModal"></div>';
    const mockCategoryDetails = {
      category_unique_code: 1,
      category_category: 'Test Category',
      short_description: 'TC',
      period: 12,
      premium_mask_code: 'PM001'
    };
    component.categoryDetailsForm();
    component.showEditCategoryDetstModal(mockCategoryDetails);
    expect(component.isEditMode).toBeTruthy();
    expect(component.categoryCode).toBe(1);
    expect(component.categoryDetailForm.value).toEqual({
      description: 'Test Category',
      shortDescription: 'TC',
      multiplesOfEarnings: 12,
      premiumMask: 'PM001'
    });
    const modal = document.getElementById('categoryDetsModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  test('should add member details modal', () => {
    document.body.innerHTML = '<div id="addMemberModal"></div>';
    component.addMemberDetailsModal();
    const modal = document.getElementById('addMemberModal');
    expect(modal.classList.contains('show')).toBeTruthy();
    expect(modal.style.display).toBe('block');
  }); 

  test('should close detailed modal', () => {
    document.body.innerHTML = '<div id="detailedModal" class="show" style="display: block;"></div>';
    component.closeDetailedModal();
    const modal = document.getElementById('detailedModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
  });

  test('should close aggregate cover details modal', () => {
    document.body.innerHTML = '<div id="aggregateModal" class="show" style="display: block;"></div>';
    component.closeAggregateCoverDetailsModal();
    const modal = document.getElementById('aggregateModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
  });

  test('should close category details modal', () => {
    document.body.innerHTML = '<div id="categoryDetsModal" class="show" style="display: block;"></div>';
    component.categoryDetailsForm();
    component.closeCategoryDetstModal();
    const modal = document.getElementById('categoryDetsModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
    expect(component.isEditMode).toBeFalsy();
    expect(component.categoryDetailForm.pristine).toBeTruthy();
  });

  test('should close add member details modal', () => {
    document.body.innerHTML = '<div id="addMemberModal" class="show" style="display: block;"></div>';
    component.closeAddMemberDetailsModal();
    const modal = document.getElementById('addMemberModal');
    expect(modal.classList.contains('show')).toBeFalsy();
    expect(modal.style.display).toBe('none');
  });

  test('should handle onProceed', fakeAsync(() => {
    component.onProceed();
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.computePremium).toHaveBeenCalledWith(component.quotationCode);
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'summary', detail: 'Premium Computed successfully' });
    expect(router.navigate).toHaveBeenCalledWith(['/home/lms/grp/quotation/summary']);
  }));

  test('should handle onBack', () => {
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/home/lms/grp/quotation/quick']);
  });

  test('should add member', fakeAsync(() => {
    const spinnerService = TestBed.inject(NgxSpinnerService);
    const messageService = TestBed.inject(MessageService);
    const coverageService = TestBed.inject(CoverageService);

    const spinnerShowSpy = jest.spyOn(spinnerService, 'show');
    const spinnerHideSpy = jest.spyOn(spinnerService, 'hide');
    const messageAddSpy = jest.spyOn(messageService, 'add');
    const addMemberSpy = jest.spyOn(coverageService, 'addMember').mockReturnValue(of({}));
    const getMembersSpy = jest.spyOn(component, 'getMembers');

    component.memberDetsForm();
    component.memberDetailsForm.patchValue({
      surname: 'Doe',
      dateOfBirth: '1990-01-01',
      mainMemberNumber: '12345',
      category: 'Test',
      monthlyEarning: 5000,
      otherNames: 'John',
      gender: 'M',
      payrollNumber: 'PR001',
      occupation: 'Engineer',
      dependantType: 'Self',
      joiningDate: '2023-01-01',
    });

    component.addMember();

    tick();

    expect(spinnerShowSpy).toHaveBeenCalledWith('download_view');
    expect(addMemberSpy).toHaveBeenCalled();
    expect(getMembersSpy).toHaveBeenCalled();
    expect(spinnerHideSpy).toHaveBeenCalledWith('download_view');
    expect(messageAddSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'summary',
      detail: 'Member added',
    });
  }));  

  test('should get category details', fakeAsync(() => {
    component.getCategoryDets();
    tick();
    expect(coverageService.getCategoryDetails).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should get cover types', fakeAsync(() => {
    component.getCoverTypes();
    tick();
    expect(coverageService.getCoverTypes).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should get cover types per product', fakeAsync(() => {
    const mockCoverTypes = [
      { cvt_desc: 'Cover Type 1' },
      { cvt_desc: 'Cover Type 2' },
      { cvt_desc: 'Cover Type 1' }
    ];
    jest.spyOn(coverageService, 'getCoverTypesPerProduct').mockReturnValue(of(mockCoverTypes));
    component.getCoverTypesPerProduct();
    tick();
    expect(coverageService.getCoverTypesPerProduct).toHaveBeenCalledWith(component.productCode);
    expect(component.coverTypePerProd.length).toBe(2);
    expect(component.coverTypePerProd[0].cvt_desc).toBe('cover type 1');
    expect(component.coverTypePerProd[1].cvt_desc).toBe('cover type 2');
  }));

  test('should get select rate types', fakeAsync(() => {
    component.getSelectRateTypes();
    tick();
    expect(coverageService.getSelectRateType).toHaveBeenCalled();
  }));

  test('should save category details', fakeAsync(() => {
    component.categoryDetailsForm();
    component.categoryDetailForm.patchValue({
      description: 'New Category',
      shortDescription: 'NC',
      multiplesOfEarnings: 12,
      premiumMask: 'PM001'
    });
    component.onSaveCatDets();
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.postCategoryDetails).toHaveBeenCalled();
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'summary', detail: 'Category added' });
  }));

  test('should save edited category details', fakeAsync(() => {
    component.categoryDetailsForm();
    component.categoryDetailForm.patchValue({
      description: 'Updated Category',
      shortDescription: 'UC',
      multiplesOfEarnings: 24,
      premiumMask: 'PM002'
    });
    component.categoryCode = 1;
    component.onSaveEditCatDets();
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.updateCategoryDetails).toHaveBeenCalled();
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'summary', detail: 'Edited' });
  }));

  test('should delete category details', fakeAsync(() => {
    const mockEvent = new Event('click');
    const mockCategoryDetails = { category_unique_code: 1 };
    jest.spyOn(confirmationService, 'confirm').mockImplementation((conf) => {
      return conf.accept();
    });
    component.deleteCategoryDets(mockCategoryDetails, mockEvent);
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.deleteCategoryDetails).toHaveBeenCalledWith(1);
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'summary', detail: 'Category deleted successfully' });
  }));

  test('should handle cover type selection', () => {
    component.coverTypePerProd = [
      {
        cover_type_unique_code: 1, cover_type_code: 101, loading_discount: 'N',
        cvt_desc: '',
        premium: 0,
        but_charge_premium: 0,
        cvt_main_cover: '',
        cvt_rate_type: '',
        dty_description: '',
        product_code: 0,
        quotation_product_code: 0,
        quotation_code: 0,
        sum_assured: 0,
        total_members: 0,
        discount_or_loading_rate: 0,
        premium_rate: 0,
        average_anb: 0,
        wet: '',
        wef: '',
        average_period: '',
        sum_assured_per_member: 0,
        if_use_unit_rate: '',
        use_rate: '',
        discount_loading_division_factor: 0,
        dependant_type_code: 0,
        average_earning_per_member: 0,
        staff_description: '',
        multiple_earnings_period: '',
        facultative_amount: 0,
        override_facultative_amount: 0,
        if_main_cover: '',
        if_main_rider: '',
        main_sumassured_percentage: 0,
        loan_amount_per_member: 0,
        loan_repayment_period: '',
        loan_interval_per_member: '',
        savings_per_member: 0,
        discount: '',
        discount_rate: 0,
        discount_division_factor: 0,
        premium_mask_code: 0,
        rate_division_factor: 0,
        use_cvr_rate: '',
        total_member_earnings: 0,
        total_loan_amount: 0,
        average_cover_per_member: 0,
        load_age_factor: 0,
        if_inbuilt: '',
        apply_commission_expense_loading: 0,
        beneficiaries: '',
        premium_computation_formula: '',
        refund_formula: '',
        multiplier: 0,
        multiplier_division_factor: 0,
        group_premium_rates_code: '',
        weekly_indemnity: '',
        premium_but_charge_amount: 0,
        letter_opening_remarks: '',
        letter_closing_remarks: '',
        quotation_duration_type: '',
        cover_duration_type: '',
        discount_percentage: 0,
        computed_premium: 0,
        before_load_discount_premium: 0,
        category_description: '',
        member_minimum_allowed_premium: 0,
        aggregate_plan: '',
        lnty_code: '',
        percentage_payable: 0,
        cover_term: '',
        cvt_code: 0
      },
      {
        cover_type_unique_code: 2, cover_type_code: 102, loading_discount: 'Y',
        cvt_desc: '',
        premium: 0,
        but_charge_premium: 0,
        cvt_main_cover: '',
        cvt_rate_type: '',
        dty_description: '',
        product_code: 0,
        quotation_product_code: 0,
        quotation_code: 0,
        sum_assured: 0,
        total_members: 0,
        discount_or_loading_rate: 0,
        premium_rate: 0,
        average_anb: 0,
        wet: '',
        wef: '',
        average_period: '',
        sum_assured_per_member: 0,
        if_use_unit_rate: '',
        use_rate: '',
        discount_loading_division_factor: 0,
        dependant_type_code: 0,
        average_earning_per_member: 0,
        staff_description: '',
        multiple_earnings_period: '',
        facultative_amount: 0,
        override_facultative_amount: 0,
        if_main_cover: '',
        if_main_rider: '',
        main_sumassured_percentage: 0,
        loan_amount_per_member: 0,
        loan_repayment_period: '',
        loan_interval_per_member: '',
        savings_per_member: 0,
        discount: '',
        discount_rate: 0,
        discount_division_factor: 0,
        premium_mask_code: 0,
        rate_division_factor: 0,
        use_cvr_rate: '',
        total_member_earnings: 0,
        total_loan_amount: 0,
        average_cover_per_member: 0,
        load_age_factor: 0,
        if_inbuilt: '',
        apply_commission_expense_loading: 0,
        beneficiaries: '',
        premium_computation_formula: '',
        refund_formula: '',
        multiplier: 0,
        multiplier_division_factor: 0,
        group_premium_rates_code: '',
        weekly_indemnity: '',
        premium_but_charge_amount: 0,
        letter_opening_remarks: '',
        letter_closing_remarks: '',
        quotation_duration_type: '',
        cover_duration_type: '',
        discount_percentage: 0,
        computed_premium: 0,
        before_load_discount_premium: 0,
        category_description: '',
        member_minimum_allowed_premium: 0,
        aggregate_plan: '',
        lnty_code: '',
        percentage_payable: 0,
        cover_term: '',
        cvt_code: 0
      }
    ];
    const mockEvent = { target: { selectedIndex: 1 } };
    component.onCoverTypeSelected(mockEvent);
    expect(component.coverTypeUniqueCode).toBe(2);
    expect(component.coverTypeCode).toBe(102);
    expect(component.loadingDiscount).toBe('Y');
  });

  test('should get PMAS code to edit for aggregate type', fakeAsync(() => {
    component.quatationCalType = 'A';
    component.aggregateDetailsForm();
    component.premiumMask = [{
      pmas_sht_desc: 'Test Mask', 
      pmas_code: 1,
      pmas_cla_code: '',
      pmas_comment: '',
      pmas_cur_code: '',
      pmas_cur_desc: '',
      pmas_default: '',
      pmas_dependent_anb: '',
      pmas_desc: '',
      pmas_hiv_loading: '',
      pmas_rate_type: '',
      pmas_smoker_loading: '',
      pmas_with_bonus: '',
      product_code: ''
    }];
    component.getPmasCodeToEdit();
    component.aggregateForm.get('aggrgatePremiumMask').setValue('Test Mask');
    tick();
    expect(component.selectedPmasCode).toBe(1);
  }));

  test('should get PMAS code to edit for detailed type', fakeAsync(() => {
    component.quatationCalType = 'D';
    component.detailedCoverDetails();
    component.premiumMask = [{
      pmas_sht_desc: 'Test Mask', 
      pmas_code: 2,
      pmas_cla_code: '',
      pmas_comment: '',
      pmas_cur_code: '',
      pmas_cur_desc: '',
      pmas_default: '',
      pmas_dependent_anb: '',
      pmas_desc: '',
      pmas_hiv_loading: '',
      pmas_rate_type: '',
      pmas_smoker_loading: '',
      pmas_with_bonus: '',
      product_code: ''
    }];
    component.getPmasCodeToEdit();
    component.detailedCovDetsForm.get('premiumMask').setValue('Test Mask');
    tick();
    expect(component.selectedPmasCode).toBe(2);
  }));

  test('should get selected PMAS code', () => {
    component.premiumMask = [
      {
        pmas_sht_desc: 'Mask 1', 
        pmas_code: 1,
        pmas_cla_code: '',
        pmas_comment: '',
        pmas_cur_code: '',
        pmas_cur_desc: '',
        pmas_default: '',
        pmas_dependent_anb: '',
        pmas_desc: '',
        pmas_hiv_loading: '',
        pmas_rate_type: '',
        pmas_smoker_loading: '',
        pmas_with_bonus: '',
        product_code: ''
      },
      {
        pmas_sht_desc: 'Mask 2', 
        pmas_code: 2,
        pmas_cla_code: '',
        pmas_comment: '',
        pmas_cur_code: '',
        pmas_cur_desc: '',
        pmas_default: '',
        pmas_dependent_anb: '',
        pmas_desc: '',
        pmas_hiv_loading: '',
        pmas_rate_type: '',
        pmas_smoker_loading: '',
        pmas_with_bonus: '',
        product_code: ''
      }
    ];
    const mockEvent = { target: { selectedIndex: 1 } };
    component.getSelectedPmasCode(mockEvent);
    expect(component.selectedPmasCode).toBe(2);
  });

  test('should delete cover type', fakeAsync(() => {
    const mockEvent = new Event('click');
    const mockCoverType = { cover_type_unique_code: 1 };
    component.quotationCode = 123;
    jest.spyOn(confirmationService, 'confirm').mockImplementation((conf) => {
      return conf.accept();
    });
    component.deleteCoverType(mockCoverType, mockEvent);
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.deleteCoverType).toHaveBeenCalledWith(123, 1);
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'summary', detail: 'Cover type Deleted' });
  }));

  test('should get members', fakeAsync(() => {
    component.getMembers();
    tick();
    expect(coverageService.getMembers).toHaveBeenCalledWith(component.quotationCode);
  }));

  test('should delete member', fakeAsync(() => {
    const mockEvent = new Event('click');
    const mockMember = { member_code: 1 } as MembersDTO;
    component.quotationCode = 123;
    jest.spyOn(confirmationService, 'confirm').mockImplementation((conf) => {
      return conf.accept();
    });
    component.deleteMember(mockMember, mockEvent);
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.deleteMember).toHaveBeenCalledWith(123, { member_code: 1, dependant_type_code: 1000 });
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'success', summary: 'summary', detail: 'Member deleted' });
  }));

  test('should get premium mask', fakeAsync(() => {
    component.getPremiumMask();
    tick();
    expect(coverageService.getPremiumMask).toHaveBeenCalledWith(component.productCode);
  }));

  test('should get occupations', fakeAsync(() => {
    component.getOccupations();
    tick();
    expect(coverageService.getOccupation).toHaveBeenCalled();
  }));

  test('should validate member details form', () => {
    component.memberDetsForm();
    const form = component.memberDetailsForm;
    
    expect(form.valid).toBeFalsy();

    form.patchValue({
      surname: 'Doe',
      dateOfBirth: '1990-01-01',
      mainMemberNumber: '12345',
      category: 'Test',
      monthlyEarning: 5000,
      otherNames: 'John',
      gender: 'M',
      payrollNumber: 'PR001',
      occupation: 'Engineer',
      dependantType: 'Self',
      joiningDate: '2023-01-01',
    });

    expect(form.valid).toBeTruthy();
  });

  test('should validate category details form', () => {
    component.categoryDetailsForm();
    const form = component.categoryDetailForm;
    
    expect(form.valid).toBeFalsy();

    form.patchValue({
      description: 'Test Category',
      premiumMask: 'PM001',
      shortDescription: 'TC',
      multiplesOfEarnings: 12,
    });

    expect(form.valid).toBeTruthy();
  });


  test('should handle empty response when fetching cover types', fakeAsync(() => {
    jest.spyOn(coverageService, 'getCoverTypes').mockReturnValue(of([]));
    component.getCoverTypes();
    tick();
    expect(component.coverTypes).toEqual([]);
  }));

  test('should efficiently handle large datasets', fakeAsync(() => {
    const largeMemberList = Array(1000).fill(null).map((_, index) => ({
      member_code: index,
      surname: `Surname${index}`,
      other_names: `OtherName${index}`,
      date_of_birth: '1990-01-01',
      gender: 'M',
      member_number: `MN${index}`,
      description: 'Description',
      dty_description: 'Dependant Type',
      monthly_earnings: 5000,
      date_joined: '2023-01-01',
    }));

    jest.spyOn(coverageService, 'getMembers').mockReturnValue(of(largeMemberList));
    
    const startTime = performance.now();
    component.getMembers();
    tick();
    const endTime = performance.now();

    expect(component.membersDetails.length).toBe(1000);
    expect(endTime - startTime).toBeLessThan(1000);
  }));

  test('should correctly handle multiple cover type selections', fakeAsync(() => {
    component.coverTypePerProd = [
      {
        cover_type_unique_code: 1, cover_type_code: 101, loading_discount: 'N',
        cvt_desc: '',
        premium: 0,
        but_charge_premium: 0,
        cvt_main_cover: '',
        cvt_rate_type: '',
        dty_description: '',
        product_code: 0,
        quotation_product_code: 0,
        quotation_code: 0,
        sum_assured: 0,
        total_members: 0,
        discount_or_loading_rate: 0,
        premium_rate: 0,
        average_anb: 0,
        wet: '',
        wef: '',
        average_period: '',
        sum_assured_per_member: 0,
        if_use_unit_rate: '',
        use_rate: '',
        discount_loading_division_factor: 0,
        dependant_type_code: 0,
        average_earning_per_member: 0,
        staff_description: '',
        multiple_earnings_period: '',
        facultative_amount: 0,
        override_facultative_amount: 0,
        if_main_cover: '',
        if_main_rider: '',
        main_sumassured_percentage: 0,
        loan_amount_per_member: 0,
        loan_repayment_period: '',
        loan_interval_per_member: '',
        savings_per_member: 0,
        discount: '',
        discount_rate: 0,
        discount_division_factor: 0,
        premium_mask_code: 0,
        rate_division_factor: 0,
        use_cvr_rate: '',
        total_member_earnings: 0,
        total_loan_amount: 0,
        average_cover_per_member: 0,
        load_age_factor: 0,
        if_inbuilt: '',
        apply_commission_expense_loading: 0,
        beneficiaries: '',
        premium_computation_formula: '',
        refund_formula: '',
        multiplier: 0,
        multiplier_division_factor: 0,
        group_premium_rates_code: '',
        weekly_indemnity: '',
        premium_but_charge_amount: 0,
        letter_opening_remarks: '',
        letter_closing_remarks: '',
        quotation_duration_type: '',
        cover_duration_type: '',
        discount_percentage: 0,
        computed_premium: 0,
        before_load_discount_premium: 0,
        category_description: '',
        member_minimum_allowed_premium: 0,
        aggregate_plan: '',
        lnty_code: '',
        percentage_payable: 0,
        cover_term: '',
        cvt_code: 0
      },
      {
        cover_type_unique_code: 2, cover_type_code: 102, loading_discount: 'Y',
        cvt_desc: '',
        premium: 0,
        but_charge_premium: 0,
        cvt_main_cover: '',
        cvt_rate_type: '',
        dty_description: '',
        product_code: 0,
        quotation_product_code: 0,
        quotation_code: 0,
        sum_assured: 0,
        total_members: 0,
        discount_or_loading_rate: 0,
        premium_rate: 0,
        average_anb: 0,
        wet: '',
        wef: '',
        average_period: '',
        sum_assured_per_member: 0,
        if_use_unit_rate: '',
        use_rate: '',
        discount_loading_division_factor: 0,
        dependant_type_code: 0,
        average_earning_per_member: 0,
        staff_description: '',
        multiple_earnings_period: '',
        facultative_amount: 0,
        override_facultative_amount: 0,
        if_main_cover: '',
        if_main_rider: '',
        main_sumassured_percentage: 0,
        loan_amount_per_member: 0,
        loan_repayment_period: '',
        loan_interval_per_member: '',
        savings_per_member: 0,
        discount: '',
        discount_rate: 0,
        discount_division_factor: 0,
        premium_mask_code: 0,
        rate_division_factor: 0,
        use_cvr_rate: '',
        total_member_earnings: 0,
        total_loan_amount: 0,
        average_cover_per_member: 0,
        load_age_factor: 0,
        if_inbuilt: '',
        apply_commission_expense_loading: 0,
        beneficiaries: '',
        premium_computation_formula: '',
        refund_formula: '',
        multiplier: 0,
        multiplier_division_factor: 0,
        group_premium_rates_code: '',
        weekly_indemnity: '',
        premium_but_charge_amount: 0,
        letter_opening_remarks: '',
        letter_closing_remarks: '',
        quotation_duration_type: '',
        cover_duration_type: '',
        discount_percentage: 0,
        computed_premium: 0,
        before_load_discount_premium: 0,
        category_description: '',
        member_minimum_allowed_premium: 0,
        aggregate_plan: '',
        lnty_code: '',
        percentage_payable: 0,
        cover_term: '',
        cvt_code: 0
      },
      {
        cover_type_unique_code: 3, cover_type_code: 103, loading_discount: 'N',
        cvt_desc: '',
        premium: 0,
        but_charge_premium: 0,
        cvt_main_cover: '',
        cvt_rate_type: '',
        dty_description: '',
        product_code: 0,
        quotation_product_code: 0,
        quotation_code: 0,
        sum_assured: 0,
        total_members: 0,
        discount_or_loading_rate: 0,
        premium_rate: 0,
        average_anb: 0,
        wet: '',
        wef: '',
        average_period: '',
        sum_assured_per_member: 0,
        if_use_unit_rate: '',
        use_rate: '',
        discount_loading_division_factor: 0,
        dependant_type_code: 0,
        average_earning_per_member: 0,
        staff_description: '',
        multiple_earnings_period: '',
        facultative_amount: 0,
        override_facultative_amount: 0,
        if_main_cover: '',
        if_main_rider: '',
        main_sumassured_percentage: 0,
        loan_amount_per_member: 0,
        loan_repayment_period: '',
        loan_interval_per_member: '',
        savings_per_member: 0,
        discount: '',
        discount_rate: 0,
        discount_division_factor: 0,
        premium_mask_code: 0,
        rate_division_factor: 0,
        use_cvr_rate: '',
        total_member_earnings: 0,
        total_loan_amount: 0,
        average_cover_per_member: 0,
        load_age_factor: 0,
        if_inbuilt: '',
        apply_commission_expense_loading: 0,
        beneficiaries: '',
        premium_computation_formula: '',
        refund_formula: '',
        multiplier: 0,
        multiplier_division_factor: 0,
        group_premium_rates_code: '',
        weekly_indemnity: '',
        premium_but_charge_amount: 0,
        letter_opening_remarks: '',
        letter_closing_remarks: '',
        quotation_duration_type: '',
        cover_duration_type: '',
        discount_percentage: 0,
        computed_premium: 0,
        before_load_discount_premium: 0,
        category_description: '',
        member_minimum_allowed_premium: 0,
        aggregate_plan: '',
        lnty_code: '',
        percentage_payable: 0,
        cover_term: '',
        cvt_code: 0
      },
    ];

    const mockEvent1 = { target: { selectedIndex: 0 } };
    component.onCoverTypeSelected(mockEvent1);
    expect(component.coverTypeUniqueCode).toBe(1);
    expect(component.coverTypeCode).toBe(101);
    expect(component.loadingDiscount).toBe('N');

    const mockEvent2 = { target: { selectedIndex: 1 } };
    component.onCoverTypeSelected(mockEvent2);
    expect(component.coverTypeUniqueCode).toBe(2);
    expect(component.coverTypeCode).toBe(102);
    expect(component.loadingDiscount).toBe('Y');

    const mockEvent3 = { target: { selectedIndex: 2 } };
    component.onCoverTypeSelected(mockEvent3);
    expect(component.coverTypeUniqueCode).toBe(3);
    expect(component.coverTypeCode).toBe(103);
    expect(component.loadingDiscount).toBe('N');
  }));

  test('should correctly handle file upload for member template', fakeAsync(() => {
    const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
    const mockEvent = { target: { files: [mockFile] } };

    jest.spyOn(coverageService, 'uploadMemberTemplate').mockReturnValue(of({ success: true }));
    jest.spyOn(component, 'getMembers');

    component.handleFileChange(mockEvent);
    tick(5000);

    expect(coverageService.uploadMemberTemplate).toHaveBeenCalled();
    expect(component.uploadProgress).toBe(100);
    expect(component.getMembers).toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Template uploaded successfully'
    });
  }));

  test('should handle file upload error', fakeAsync(() => {
    const mockFile = new File([''], 'test.csv', { type: 'text/csv' });
    const mockEvent = { target: { files: [mockFile] } };

    jest.spyOn(coverageService, 'uploadMemberTemplate').mockReturnValue(throwError(() => new Error('Upload failed')));

    component.handleFileChange(mockEvent);
    tick(5000);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while uploading the template.'
    });
  }));

  test('should handle error when computing premium', fakeAsync(() => {
    jest.spyOn(coverageService, 'computePremium').mockReturnValue(throwError(() => new Error('Computation failed')));
    component.onProceed();
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.computePremium).toHaveBeenCalledWith(component.quotationCode);
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Error occured'});
  }));

  test('should handle empty member list when fetching members', fakeAsync(() => {
    jest.spyOn(coverageService, 'getMembers').mockReturnValue(of([]));
    component.getMembers();
    tick();
    expect(coverageService.getMembers).toHaveBeenCalledWith(component.quotationCode);
    expect(component.membersDetails).toEqual([]);
  }));

  test('should handle error when adding a new member', fakeAsync(() => {
    component.memberDetsForm();
    component.memberDetailsForm.patchValue({
      surname: 'Doe',
      dateOfBirth: '1990-01-01',
      mainMemberNumber: '12345',
      category: 'Test',
      monthlyEarning: 5000,
      otherNames: 'John',
      gender: 'M',
      payrollNumber: 'PR001',
      occupation: 'Engineer',
      dependantType: 'Self',
      joiningDate: '2023-01-01',
    });

    jest.spyOn(coverageService, 'addMember').mockReturnValue(throwError(() => new Error('Failed to add member')));
    component.addMember();
    tick();

    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.addMember).toHaveBeenCalled();
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Error occured'});
  }));

  test('should handle invalid form when saving category details', fakeAsync(() => {
    component.categoryDetailsForm();
    component.categoryDetailForm.patchValue({
      description: '', // Invalid: empty description
      shortDescription: 'NC',
      multiplesOfEarnings: 12,
      premiumMask: 'PM001'
    });
    component.onSaveCatDets();
    tick();
    expect(spinnerService.show).not.toHaveBeenCalled();
    expect(coverageService.postCategoryDetails).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Fill all fields'});
  }));

  test('should handle error when deleting a cover type', fakeAsync(() => {
    const mockEvent = new Event('click');
    const mockCoverType = { cover_type_unique_code: 1 };
    component.quotationCode = 123;
    jest.spyOn(confirmationService, 'confirm').mockImplementation((conf) => {
      return conf.accept();
    });
    jest.spyOn(coverageService, 'deleteCoverType').mockReturnValue(throwError(() => new Error('Delete failed')));
    
    component.deleteCoverType(mockCoverType, mockEvent);
    tick();
    
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.deleteCoverType).toHaveBeenCalledWith(123, 1);
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Cover type not deleted'});
  }));

  test('should handle rejection when confirming delete cover type', fakeAsync(() => {
    const mockEvent = new Event('click');
    const mockCoverType = { cover_type_unique_code: 1 };
    component.quotationCode = 123;
    jest.spyOn(confirmationService, 'confirm').mockImplementation((conf) => {
      return conf.reject();
    });
    
    component.deleteCoverType(mockCoverType, mockEvent);
    tick();
    
    expect(spinnerService.show).not.toHaveBeenCalled();
    expect(coverageService.deleteCoverType).not.toHaveBeenCalled();
    expect(messageService.add).toHaveBeenCalledWith({ severity: 'error', summary: 'Rejected', detail: 'Cancelled', life: 3000 });
  }));

  test('should handle error when downloading member upload template', fakeAsync(() => {
    jest.spyOn(coverageService, 'downloadMemberUploadTemplate').mockReturnValue(throwError(() => new Error('Download failed')));
    component.downloadMemberUploadTemplate();
    tick();
    expect(spinnerService.show).toHaveBeenCalledWith('download_view');
    expect(coverageService.downloadMemberUploadTemplate).toHaveBeenCalledWith(component.productType, component.productCode);
    expect(spinnerService.hide).toHaveBeenCalledWith('download_view');
    expect(messageService.add).toHaveBeenCalledWith({severity: 'error', summary: 'summary', detail: 'Not downloaded'});
  }));
});