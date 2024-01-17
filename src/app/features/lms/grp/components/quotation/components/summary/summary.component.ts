import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { distinct } from 'rxjs';
import { CategoryDetailsDto } from '../../models/categoryDetails';
import { CoverTypesDto } from '../../models/coverTypes/coverTypesDto';
import { MembersDTO } from '../../models/members';
import { QuoteSummaryDTO, MemberSummaryDTO, CategoryDTO, MemberCoverTypeSummaryDto } from '../../models/summary/summaryDTO';
import { CoverageService } from '../../service/coverage/coverage.service';
import { SummaryService } from '../../service/summary/summary.service';
import { SelectItem } from 'primeng/api';



@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  getPayFrequencies() {
    throw new Error('Method not implemented.');
  }
  quotationCode: number;
  quatationCalType: string;
  quotationNumber: string;
  productCode: number
  memberCode: number;
  quoteSummary: QuoteSummaryDTO;
  coverTypes: CoverTypesDto[];
  memberSummary: MemberSummaryDTO[];
  categorySummary: CategoryDTO[];
  membersDetails: MembersDTO[];
  productSelected: string;
  productType: string;
  memberCoverTypeSummaryDto: MemberCoverTypeSummaryDto[];
  categoryDetailsSummary: CategoryDetailsDto[];
  selectedRowIndex: number;
  columnOptionsDepLimits: SelectItem[];
  selectedColumnsDependantLimits: string[];
  columnOptionsCoveDets: SelectItem[];
  selectedColumnsCovDets: string[];
  columnOptionsMemberDets: SelectItem[];
  selectedColumnsMemberDets: string[];



  constructor( 
    private fb: FormBuilder,
    private summaryService: SummaryService,
    private coverageService: CoverageService,
    private router: Router,
    private session_storage: SessionStorageService
    ) {}
  
  ngOnInit(): void {
    this.retrievQuoteDets();
    this.getQuotationDetailsSummary();
    this.getMembersSummary();
    this.getDependantLimits();
    this.getMemberCoverTypes();
    this.getMembers();
    this.getCategoryDets();
    this.dependantLimitsColumns();
    this.coverDetailsColumns();
    this.memberDetailsColumns();
  }

  ngOnDestroy(): void {
    
  }

  dependantLimitsColumns() {
    this.columnOptionsDepLimits = [
      { label: 'Cover Type', value: 'cvt_desc' },
      { label: 'Dependant type', value: 'dty_sht_desc' },
      { label: 'Lives covered', value: 'maximum_type_allowed' },
      { label: 'Minimum amount', value: 'minimum_amt' },
      { label: 'Maximum limit amount', value: 'limit_amount' },
      { label: 'Rate', value: 'rate' },
      { label: 'Division factor', value: 'category_rate_division_factor' },
      { label: '% of main/yr SA', value: 'sum_assured_percentage' },
      { label: 'Inbuilt', value: 'cover_inbuilt' },
      { label: 'Accelerated', value: 'accelerator' },
      { label: 'Main cover rider', value: 'main_cover' },
  ];
  
  this.selectedColumnsDependantLimits = this.columnOptionsDepLimits.map(option => option.value);
  }

  coverDetailsColumns() {
    this.columnOptionsCoveDets = [
      { label: 'Cover Type', value: 'cvt_desc' },
      { label: 'Sum assured', value: 'sum_assured' },
      { label: 'Premium', value: 'premium' },
      { label: 'Select rate', value: 'use_cvr_rate' },
      { label: 'Override premiums', value: 'but_charge_premium' },
      { label: 'Rate', value: 'rate' },
      { label: 'Rate division factor', value: 'rate_division_factor' },
      { label: '% of main/yr SA', value: 'main_sumassured_percentage' },
      { label: 'Main cover', value: 'cvt_main_cover' },
  ];
  
  this.selectedColumnsCovDets = this.columnOptionsCoveDets.map(option => option.value);
  }

  memberDetailsColumns() {
    this.columnOptionsMemberDets = [
      { label: 'Surname', value: 'surname' },
      { label: 'Other names', value: 'other_names' },
      { label: 'Sum Assured', value: 'total_sum_assured' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'Gender', value: 'gender' },
      { label: 'Payroll/Member no.', value: 'member_number' },
      { label: 'Category', value: 'description' },
      { label: 'Dependant type', value: 'dty_description' },
  ];
  
  this.selectedColumnsMemberDets = this.columnOptionsMemberDets.map(option => option.value);
  }

  retrievQuoteDets() {
    const storedQuoteData = this.session_storage.get('quotation_code');
    const storedQuoteDetails = sessionStorage.getItem('quotationResponse');
    const parsedQuoteDetails = JSON.parse(storedQuoteDetails);
  
    this.quotationCode = parsedQuoteDetails.quotation_code;
    console.log("quotation code", this.quotationCode)
    this.quotationNumber = parsedQuoteDetails.quotation_number;
    console.log("quotation number", this.quotationNumber)
  
  
    if (storedQuoteData) {
      const quoteData = JSON.parse(storedQuoteData);
      const formData = quoteData.formData;
      console.log("formData", formData)
      this.productCode = formData.products.value;
      this.productSelected = formData.products.label;
      this.productType = formData.products.type;
      console.log("this.productCode", this.productCode, this.productSelected, this.productType)
      this.quatationCalType = formData.quotationCalcType
      console.log("this.quatationCalType", this.quatationCalType)
    }
  }

  getUseCvrRateDescription(useCvrRate: string): string {
    switch (useCvrRate) {
      case "M":
        return "Use Quote Mask";
      case "S":
        return "Select Specific Mask";
      case "C":
        return "Input Rate";
      default:
        return "Unknown";
    }
  }

  searchFormMemberDets = this.fb.group({
    filterby: [""],
    greaterOrEqual: [""],
    valueEntered: [""],
    searchMember: [""],
  })

  showCoverSummary() {
    const modal = document.getElementById('coverSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeCoverSummary() {
    const modal = document.getElementById('coverSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  closeMembersSummary() {
    const modal = document.getElementById('memberSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }
  closeCategorySummary() {
    const modal = document.getElementById('categorySummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  getQuotationDetailsSummary() {
    this.summaryService.quotationSummaryDetails(this.quotationNumber).subscribe((quote: QuoteSummaryDTO) => {
      console.log("quoteSummary", quote)
      this.quoteSummary = quote;
    });
  }

  getMembersSummary() {
    this.summaryService.membersSummaryDetails(this.productCode, this.quotationCode).subscribe((memberSummary: MemberSummaryDTO[]) => {
      console.log("memberSummary", memberSummary);
      this.memberSummary = memberSummary;
    });
  }

  getMemberCoverTypes() {
    this.coverageService.getCoverTypes(this.quotationCode).subscribe((coverTypes: CoverTypesDto[]) => {
      this.coverTypes = coverTypes
      console.log("coverTypesSummary", this.coverTypes)
    });
  }
  
  getDependantLimits() {
    this.summaryService.getDependantLimits(this.quotationCode).subscribe((dLimits: CategoryDTO[]) => {
      console.log("dLimits", dLimits)
      this.categorySummary = dLimits;
    });
  }

  getMembers() {
    this.coverageService.getMembers(this.quotationCode).subscribe((members: MembersDTO[]) => {
      console.log("members", members)
      this.membersDetails = members;
    })
  }

  getCategoryDets() {
    this.coverageService.getCategoryDetails(this.quotationCode).subscribe((categoryDets: CategoryDetailsDto[]) =>{
    this.categoryDetailsSummary = categoryDets;
    console.log("categoryDetailsSummary", categoryDets)
  });
}

onMemberTableRowClick(membersDetails, index: number) {
  this.selectedRowIndex = index;
  if(membersDetails){
    this.memberCode = membersDetails.member_code;
    console.log("this.memberCode", this.memberCode)
    this.summaryService.memberCoverSummary(this.quotationCode, this.memberCode).subscribe((memCvtTypes: MemberCoverTypeSummaryDto[]) => {
      console.log("memCvtTypes", memCvtTypes)
      this.memberCoverTypeSummaryDto = memCvtTypes;
      
    });
  }
}

  onProceed () {
  }

  onBack() {
    this.router.navigate(['/home/lms/grp/quotation/coverage']);
  }


}
