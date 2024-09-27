import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { DashboardService } from '../../../services/dashboard.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';
import { AdminPolicyDetailsDTO, CategorySummaryDTO, CoverTypesDTO, DependentLimitDTO, EndorsementDetailsDTO, MemberDetailsDTO, MemberDetailsSummaryDTO, MemberListDTO } from '../../../models/admin-policies';
import { FormBuilder, FormGroup } from '@angular/forms';

const log = new Logger("AdminPolicyDetailsComponent");
@AutoUnsubscribe
@Component({
  selector: 'app-admin-policy-details',
  templateUrl: './admin-policy-details.component.html',
  styleUrls: ['./admin-policy-details.component.css']
})
export class AdminPolicyDetailsComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedPolicyNumber: string = 'PL/009/IUIU';
  columnOptionsMemberDets: SelectItem[];
  selectedColumnsMemberDets: string[];
  columnOptionsDepLimits: SelectItem[];
  selectedColumnsDepLimits: string[];
  columnOptionsCatDets: SelectItem[];
  selectedColumnsCatDets: string[];
  selectedRowIndex: number;
  endorsementCode: number = 20241004 /*20241036 20241004 20241000*/;
  policyCode: number  /*2024858 2024833*/;
  categoryCode: number;
  memberUnqiueCode: number;
  adminPolicyDetails: AdminPolicyDetailsDTO;
  endorsements: EndorsementDetailsDTO[] = [];
  endorsementForm: FormGroup;
  categorySummary: CategorySummaryDTO[] = []; 
  dependentLimit: DependentLimitDTO[] = [];
  coverTypes: CoverTypesDTO[] = [];
  memberDetailsSummary: MemberDetailsSummaryDTO[] = [];
  memberDetails: MemberDetailsDTO[] = [];
  memberList: MemberListDTO[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dasboardService: DashboardService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.populateBreadCrumbItems();
    this.memberDetailsColumns();
    this.getAdminPolicyDetails();
    this.getEndorsements();
    this.createEndorsementForm();
    this.onEndorsementChange();
    this.getCategorySummary();
    this.categoryDetailsColumns();
    this.depLimitsColumns();
    this.getCoverTypes();
    this.getPolicyMemberDetails();
    this.getMemberDetailsList();
    
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Policies', url: '/home/lms/grp/dashboard/admin-policy-listing' },
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/admin-policy-details' },
    ];
  }

  getParams() {
    this.policyCode = this.activatedRoute.snapshot.queryParams['policyCode'];
  }

  memberDetailsColumns() {
    this.columnOptionsMemberDets = [
      { label: 'Surname', value: 'surname' },
      { label: 'Other names', value: 'other_names' },
      { label: 'Premium', value: 'premium' },
      { label: 'Sum Assured', value: 'sum_assured' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'Gender', value: 'sex' },
      { label: 'Payroll/Member no.', value: 'member_number' },
      { label: 'Category', value: 'category' },
      { label: 'Dependant type', value: 'dependent_types' },
  ];

  this.selectedColumnsMemberDets = this.columnOptionsMemberDets.map(option => option.value);
  }

  depLimitsColumns() {
    this.columnOptionsDepLimits = [
      { label: 'Cover type', value: 'cover_type' },
      { label: 'Dependent type', value: 'dependent_type' },
      { label: 'Lives covered', value: 'lives_covered' },
      { label: 'Min amount', value: 'minimum_amt' },
      { label: 'Max limit amount', value: 'maximum_amt' },
      { label: 'Rate', value: 'rate' },
      { label: 'Division factor', value: 'div_factor' },
      { label: '% of main/yr SA', value: 'percentage_of_sa' },
      { label: 'Inbuilt', value: 'in_built' },
      { label: 'Accelerated', value: 'accelerated' },
  ];

  this.selectedColumnsDepLimits = this.columnOptionsDepLimits.map(option => option.value);
  }

  categoryDetailsColumns() {
    this.columnOptionsCatDets = [
      { label: 'Category', value: 'category_category' },
      { label: 'Multiple of earning', value: 'period' },
      { label: 'Access group', value: 'policy_access_group' },
      { label: 'Select rates', value: 'use_cvr_rate' },
      { label: 'Premium mask', value: 'premium_mask_desc' },
  ];

  this.selectedColumnsCatDets = this.columnOptionsCatDets.map(option => option.value);
  }

createEndorsementForm() {
  this.endorsementForm = this.fb.group({
    endorsement: [""],
  });
}

onEndorsementChange() {
  this.endorsementForm.get("endorsement").valueChanges.subscribe((endCode) => {
    this.endorsementCode = endCode;
    log.info("new EndCode...", this.endorsementCode)
    this.getAdminPolicyDetails();
  });
}


  showMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  //Enables modal to close on click of anywhere outside the modal
  onBackdropClick(event: MouseEvent) {
    // Check if the clicked element is the backdrop of the modal
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeMembersSummary();
      this.closeCategorySummary();
    }
  }

  onMemberTableRowClick(memberList, index: number) {
    this.selectedRowIndex = index;
    if(memberList){
      this.memberUnqiueCode = memberList.policy_member_code;
      this.getMemberDetsSummary();
      // this.dasboardService.getMemberDetsSummary(this.endorsementCode, this.memberUnqiueCode).subscribe((res: MemberDetailsSummaryDTO[]) => {
      //   this.memberDetailsSummary = res;
      //   log.info("getMemberDetsSummary", this.memberDetailsSummary)
      // });
    }
  }

  onCategoryDetailsTableRowClick(categorySummary: CategorySummaryDTO[], index: number) {
    this.selectedRowIndex = index;
    if(categorySummary){
      this.categoryCode = categorySummary["policy-category-code"];
      log.info("catCode from row click", this.categoryCode)
      this.getDependentLimits();
    }
  }

  getAdminPolicyDetails() {
    this.dasboardService.getAdminPolicyDetails(this.endorsementCode).subscribe((res: AdminPolicyDetailsDTO) => {
      this.adminPolicyDetails = res;
      log.info("getAdminPolicyDetails", this.adminPolicyDetails);
    });
  }

  getEndorsements() {
    this.dasboardService.getEndorsements(this.policyCode).subscribe((res: EndorsementDetailsDTO[]) => {
      this.endorsements = res;
      log.info("getEndorsements", res)
    });
  }

  getCategorySummary() {
    this.dasboardService.getCategorySummary(this.endorsementCode).subscribe((res: CategorySummaryDTO[]) => {
      this.categorySummary = res;
      log.info("getCategorySummary", this.categorySummary)
    });
  }

  getDependentLimits() {
    this.dasboardService.getDependentLimits(this.endorsementCode, this.categoryCode).subscribe((res: DependentLimitDTO[]) => {
      this.dependentLimit = res;
      log.info("getDependentLimits", this.dependentLimit)
    });
  }

  getCoverTypes() {
    this.dasboardService.getCoverTypes(this.endorsementCode).subscribe((res: CoverTypesDTO[]) => {
      this.coverTypes = res
      log.info("getCoverTypes", this.coverTypes)
    });
  }

  getPolicyMemberDetails() {
    this.dasboardService.getPolicyMemberDetails(this.endorsementCode).subscribe((res: MemberDetailsDTO[]) => {
      this.memberDetails = res;
      log.info("getPolicyMemberDetails", this.memberDetails)
    });
  }

  getMemberDetailsList() {
    this.dasboardService.getMemberDetailsList(this.policyCode, this.endorsementCode).subscribe((res: MemberListDTO[]) => {
      this.memberList = res
      log.info("getMemberDetailsList", this.memberList)
    });
  }

  getMemberDetsSummary() {
    this.dasboardService.getMemberDetsSummary(this.endorsementCode, this.memberUnqiueCode).subscribe((res: MemberDetailsSummaryDTO[]) => {
      this.memberDetailsSummary = res;
      log.info("getMemberDetsSummary", this.memberDetailsSummary)
    });
  }

}
