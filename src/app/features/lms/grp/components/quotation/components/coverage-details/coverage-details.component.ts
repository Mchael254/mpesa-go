import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { CoverageService } from '../../../../service/coverage/coverage.service';
import { CategoryDetailsDto } from '../../../../models/categoryDetails';
import { CoverTypePerProdDTO, CoverTypesDto, OccupationDTO, PremiumMaskDTO, SelectRateTypeDTO } from '../../../../models/coverTypes/coverTypesDto';
import { MembersDTO } from '../../../../models/members';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {MessageService} from "primeng/api";


@AutoUnsubscribe
@Component({
  selector: 'app-coverage-details',
  templateUrl: './coverage-details.component.html',
  styleUrls: ['./coverage-details.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CoverageDetailsComponent implements OnInit, OnDestroy {

searchFormMemberDets: FormGroup;
categoryDetailForm: FormGroup;
detailedCovDetsForm: FormGroup;
aggregateForm: FormGroup;
memberDetailsForm: FormGroup;
quatationCalType: string;
quotationCode: number;
quotationNumber: string;
categoryDetails: CategoryDetailsDto[] = [];
categoryCode: number;
coverTypeCode: number;
coverTypeUniqueCode: number;
coverTypeCodeToEdit: number
loadingDiscount: string;
coverTypes: CoverTypesDto[];
isEditMode: boolean = false;
SelectRateType: SelectRateTypeDTO[];
coverTypePerProd: CoverTypePerProdDTO[];
isDisabled: boolean = false;
membersDetails: MembersDTO[];
memberCode: number;
premiumMask: PremiumMaskDTO[];
showAllColumns: boolean = false;
selectedRateType: string;
productCode: number
productType: string;
showStateSpinner: boolean;
showTownSpinner: boolean;
occupation: OccupationDTO[];
selectedPmasCode: number;

  constructor (
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private coverageService: CoverageService,
    private cdr: ChangeDetectorRef,
    private session_storage: SessionStorageService,
    private spinner_Service: NgxSpinnerService,
    private messageService: MessageService
    ) {}
    
ngOnInit() {
  this.retrievQuoteDets();
  this.searchFormMember();
  this.detailedCoverDetails();
  this.aggregateDetailsForm()
  // this.getParams();
  this.getCategoryDets();
  this.getCoverTypes();
  this.categoryDetailsForm();
  this.getCoverTypesPerProduct();
  this.getSelectRateTypes();
  this.getMembers();
  this.getPremiumMask();
  this.getSelectRate();
  this.memberDetsForm();
  this.getOccupations();
  this.getPmasCodeToEdit();
  
}

ngOnDestroy(): void {

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
    console.log("this.productCode", this.productCode)
    this.productType = formData.products.type;
    console.log("this.productType", this.productType)
    this.quatationCalType = formData.quotationCalcType
    console.log("this.quatationCalType", this.quatationCalType)
  }
}

addMemberDependantType = [
  { label: 'Self', value: 'SELF' },
]

// getParams() {
//   this.activatedRoute.queryParams.subscribe((queryParams) => {
//     this.quatationCalType = queryParams['quotationCalcType'];
//     this.quotationCode = queryParams['quotationCode'];
//   });
// }

toggleShowAllColumns() {
  this.showAllColumns = !this.showAllColumns;
} 

searchFormMember() {
  this.searchFormMemberDets = this.fb.group({
    filterby: [""],
    greaterOrEqual: [""],
    valueEntered: [""],
    searchMember: [""],

  })

}

detailedCoverDetails(){
  this.detailedCovDetsForm = this.fb.group({
    detailedCoverType: [""],
    detailedPercentageMainYr: [""],
    rate: [""],
    selectRate: [""],
    premiumMask: [""],
    rateDivFactor: [""],
  });
}
  
  aggregateDetailsForm() {
    this.aggregateForm = this.fb.group({
      aggregateCoverType: [""],
      aggrgatePremiumMask: [""],
      aggregatePercentageMainYr: [""],
      noOfMembers: [""],
      category: [""],
      aggregateSelectRate: [""],
      rate: [""],
      dependantType: [""],
      averageEarningPerMember: [""],
      overridePremiums: [""],
      rateDivFactor: [""],
      averageAnb: [""],
      sumAssured: [""],
  
    });
  }
  
  categoryDetailsForm() {
    this.categoryDetailForm = this.fb.group({
    description: ["", [Validators.required]],
    premiumMask: ["", [Validators.required]],
    shortDescription: ["", [Validators.required]],
    multiplesOfEarnings: ["", [Validators.required]],
  });
}

memberDetsForm() {
  this.memberDetailsForm = this.fb.group({
    surname: ["", Validators.required],
    dateOfBirth: ["", Validators.required],
    mainMemberNumber: ["", Validators.required],
    category: ["", Validators.required],
    monthlyEarning: ["", Validators.required],
    otherNames: ["", Validators.required],
    gender: ["", Validators.required],
    payrollNumber: ["", Validators.required],
    occupation: ["", Validators.required],
    dependantType: ["", Validators.required],
    joiningDate: ["", Validators.required],
  });
}
 
  showDetailedCoverDetailsModal() {
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
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

  getSelectRate() {
    if(this.quatationCalType === 'A') {
      this.aggregateForm.get('aggregateSelectRate').valueChanges.subscribe((selectedRateAggregate) => {
        this.selectedRateType = selectedRateAggregate;
        console.log("this.selectedRateType", this.selectedRateType)
      });
    } else {
      this.detailedCovDetsForm.get('selectRate').valueChanges.subscribe((selectedRateD) => {
        this.selectedRateType = selectedRateD;
        console.log("this.selectedRateTypeDet", this.selectedRateType)
      });
    }
    
  }
  
  showEditDetailedCoverDetailsModal(coverTypes: CoverTypesDto) {
    this.isEditMode = true;
    console.log("detailedEdit", this.isEditMode)
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (coverTypes) {
      this.coverTypeUniqueCode = coverTypes.cover_type_unique_code;
      this.coverTypeCodeToEdit = coverTypes.cover_type_code;
     console.log("patched", coverTypes, this.coverTypeUniqueCode, this.coverTypeCodeToEdit)
     console.log("Before patchValue:", this.detailedCovDetsForm.value);
      this.detailedCovDetsForm.patchValue({
      detailedCoverType: coverTypes.cvt_desc.toLowerCase(),
      detailedPercentageMainYr: coverTypes.main_sumassured_percentage,
      rate: coverTypes.premium_rate,
      selectRate: coverTypes.use_cvr_rate,
      premiumMask: coverTypes.premium_mask_short_description,
      rateDivFactor: coverTypes.rate_division_factor,
      });
      console.log("After patchValue:", this.detailedCovDetsForm.value);
    }
  }

  showAggregateCoverDetailsModal() {
    const modal = document.getElementById('aggregateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  showEditAggregateCoverDetailsModal(coverTypes: CoverTypesDto) {
    this.isEditMode = true;
    console.log("aggregateEdit", this.isEditMode)
    const modal = document.getElementById('aggregateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (coverTypes) {
      this.coverTypeUniqueCode = coverTypes.cover_type_unique_code
      this.coverTypeCodeToEdit = coverTypes.cover_type_code;
      this.selectedPmasCode = coverTypes.premium_mask_code;
      console.log("this.selectedPmasCodeToEdit", this.selectedPmasCode)
      console.log("this.coverTypeCodeToEdit", this.coverTypeCodeToEdit, coverTypes.cover_type_unique_code)
      this.aggregateForm.patchValue({
        aggregateCoverType: coverTypes.cvt_desc.toLowerCase(),
        rate: coverTypes.premium_rate,
        aggrgatePremiumMask: coverTypes.premium_mask_short_description,
        aggregateSelectRate: coverTypes.use_cvr_rate,
        rateDivFactor: coverTypes.rate_division_factor,
        aggregatePercentageMainYr: coverTypes.premium_rate,
        noOfMembers: coverTypes.total_members,
        averageEarningPerMember: coverTypes.average_earning_per_member,
        averageAnb: coverTypes.average_anb,
        overridePremiums: coverTypes.but_charge_premium,
        sumAssured: coverTypes.sum_assured,
      });
      console.log("After patchValueAggregate:", this.aggregateForm.value, this.coverTypeUniqueCode);
    }
  }

  showCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  showEditCategoryDetstModal(categoryDetails) {
    this.isEditMode = true;
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    this.categoryCode = categoryDetails.category_unique_code;

    if (categoryDetails) {
      this.categoryDetailForm.patchValue({
        description: categoryDetails.category_category,
        shortDescription: categoryDetails.short_description,
        multiplesOfEarnings: categoryDetails.period,
        premiumMask: categoryDetails.premium_mask_code
      });
      console.log("After batch category", this.categoryDetailForm.value)
    }

  }

  addMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  openFileInput() {

  }

  closeDetailedModal() {
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  closeAggregateCoverDetailsModal() {
    const modal = document.getElementById('aggregateModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  closeCategoryDetstModal() {
    const modal = document.getElementById('categoryDetsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
    this.isEditMode = false
    this.categoryDetailForm.reset();

  }
  closeAddMemberDetailsModal() {
    const modal = document.getElementById('addMemberModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }

  }

  onProceed () {
    this.spinner_Service.show('download_view');
    this.coverageService.computePremium(this.quotationCode).subscribe((computed) => {
      console.log("computed", computed)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'success', summary: 'summary', detail: 'Premium Computed successfully'});
      this.router.navigate(['/home/lms/grp/quotation/summary']);
    },
    (error) => {
      console.log(error)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
    });
  }

  onBack() {
    this.router.navigate(['/home/lms/grp/quotation/quick']);
  }

  addMember() {
    if(this.memberDetailsForm) {
      this.closeAddMemberDetailsModal();
      this.spinner_Service.show('download_view');
      const memberDetailsFormValues = this.memberDetailsForm.value;
      console.log("memberDetailsFormValues", memberDetailsFormValues);
      const memberDetails = {
        "member_number": memberDetailsFormValues.mainMemberNumber,
        "surname": memberDetailsFormValues.surname,
        "other_names": memberDetailsFormValues.otherNames,
        "sex": memberDetailsFormValues.gender,
        "schedule_join_date": "2023-11-20",
        "category": 'default',
        "date_of_birth": formatDate(memberDetailsFormValues.dateOfBirth, 'yyyy-MM-dd', 'en-US'),
        "sacco_join_date": formatDate(memberDetailsFormValues.joiningDate, 'yyyy-MM-dd', 'en-US'),
        "group_occupation_code": memberDetailsFormValues.occupation,
        "product_code": this.productCode,
        "effective_date": "2023-11-20",
        "proposer_code": 20211410718,
        "dependent_type_code": 1000,
        "dependent_type_short_desc": "SELF",
        "proposer_short_desc": "string",
        "gender": memberDetailsFormValues.gender,
        "category_unique_code": 20233193,
        "period": 4,
        "multiple_earnings_period": 4,
        "average_earnings_per_member": 30000,
        "monthly_earnings": memberDetailsFormValues.monthlyEarning,
      }
      this.spinner_Service.show('download_view');
      console.log("memberDetails", memberDetails)
      this.coverageService.addMember(this.quotationCode, memberDetails).subscribe((res) => {
          this.getMembers();
          this.cdr.detectChanges();
          this.memberDetailsForm.reset();
          this.spinner_Service.hide('download_view');
          this.messageService.add({severity: 'success', summary: 'summary', detail: 'Member added'});
      },
      (error) => {
        console.log(error)
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
      });
    } else {
      this.spinner_Service.hide('download_view');
      alert("Fill all Fields")
    }
  }

  getCategoryDets() {
      this.coverageService.getCategoryDetails(this.quotationCode).subscribe((categoryDets: CategoryDetailsDto[]) =>{
      this.categoryDetails = categoryDets;
      console.log("categoryDetails", categoryDets)
    });
  }

  getCoverTypes() {
    this.coverageService.getCoverTypes(this.quotationCode).subscribe((coverTypes: CoverTypesDto[]) => {
      this.coverTypes = coverTypes
      console.log("coverTypes", this.coverTypes)
    });
  }

  getCoverTypesPerProduct() {
    this.coverageService.getCoverTypesPerProduct(this.productCode).subscribe((coversPerProd: CoverTypePerProdDTO[]) => {
      console.log("coversPerProd", coversPerProd);
    
      const formatCvtDesc = (desc) => {
        return desc.charAt(0).toLowerCase() + desc.slice(1).toLowerCase();
      };
    
      const uniqueCvtDescs = new Set();
      this.coverTypePerProd = coversPerProd.filter(item => {
        if (!uniqueCvtDescs.has(item.cvt_desc)) {
          uniqueCvtDescs.add(item.cvt_desc);
          item.cvt_desc = formatCvtDesc(item.cvt_desc);
          return true;
        }
        return false;
      });
    });
    
  }

  // getCoverTypesPerProduct() {
  //   this.coverageService.getCoverTypesPerProduct(this.productCode).subscribe((coversPerProd: CoverTypePerProdDTO[]) => {
  //     console.log("coversPerProd", coversPerProd);
  
  //     const formatCvtDesc = (desc) => {
  //       return desc.charAt(0).toLowerCase() + desc.slice(1).toLowerCase();
  //     };
  
  //     const uniqueCvtDescs = new Set();
  //     this.coverTypePerProd = coversPerProd.filter(item => {
  //       if (!uniqueCvtDescs.has(item.cvt_desc)) {
  //         uniqueCvtDescs.add(item.cvt_desc);
  //         const formattedCvtDesc = formatCvtDesc(item.cvt_desc);
  //           //remove covertype in the table
  //             if (!this.coverTypes.some(coverType => formatCvtDesc(coverType.cvt_desc) === formattedCvtDesc)) {
  //               return true;
  //             }
          
  //       }
  //       return false;
  //     });
  //   });
  // }

  getSelectRateTypes() {
    this.coverageService.getSelectRateType().subscribe((SelectRateTypes: SelectRateTypeDTO[]) => {
      console.log("SelectRateTypes", SelectRateTypes)
      this.SelectRateType = SelectRateTypes
    });
  }

  onSaveCatDets() {
    const categoryDetailFormData = this.categoryDetailForm.value;
    console.log("categoryDetailFormData", categoryDetailFormData)
   
    const mappedCatDetails = {
      // "category_category": categoryDetailFormData.description,
      // "short_description": categoryDetailFormData.shortDescription,
      // "premium_mask_code":categoryDetailFormData.premiumMask,
      // "premium_mask_desc": "TEST",
      // "period": categoryDetailFormData.multiplesOfEarnings,
      // "quotation_code": this.quotationCode

        // "category_unique_code": 0,
        "short_description": categoryDetailFormData.shortDescription,
        "category_category": categoryDetailFormData.description,
        "period": categoryDetailFormData.multiplesOfEarnings,
        "quotation_code": this.quotationCode,
        "pmas_sht_desc": categoryDetailFormData.premiumMask,
        "school_code": 0,
        "premium_mask_code": categoryDetailFormData.premiumMask,
        "previous_category_code": 0,
        "use_cvr_rate": "string",
        "rate": 0,
        "category_rate_division_factor": 0,
        "average_earnings_per_member": 0,
        "average_anb": 0,
        "sum_assured_per_member": 0,
        "multiple_earnings_period": 4,
        "total_member_earnings": 0,
        "total_original_loan_amount": 0,
        "total_members": 0,
        // "sum_assured": 0,
        // "premium": 0,
        "base_sum_assured": 0,
        "base_premium": 0,
        "fee_amount": 0,
        "total_students": 0
    };
    console.log("categoryDetailFormData", mappedCatDetails)
    if(this.categoryDetailForm.valid) {
      this.closeCategoryDetstModal();
      this.spinner_Service.show('download_view');
      this.categoryDetailForm.reset();
      this.coverageService.postCategoryDetails(mappedCatDetails).subscribe(
        (catDets: CategoryDetailsDto) => {
          this.getCategoryDets();
          // this.categoryDetails.push(catDets);
          
          this.categoryDetailForm.reset();
          this.cdr.detectChanges();
          this.spinner_Service.hide('download_view');
          this.messageService.add({severity: 'success', summary: 'summary', detail: 'Category added'});
        },
        (error) => {
          console.error('Save request error:', error);
          this.spinner_Service.hide('download_view');
          this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
        }
      );
    } else {
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Fill all fields'});
    }
    
  }

  onSaveEditCatDets() {
    if(this.categoryDetailForm.valid) {
      const categoryDetailFormData = this.categoryDetailForm.value;
      this.closeCategoryDetstModal();
      this.spinner_Service.show('download_view');
    
    console.log("categoryDetailFormData", categoryDetailFormData);
    const mappedCatDetails = {
      // "category_category": categoryDetailFormData.description,
      // "short_description": categoryDetailFormData.shortDescription,
      // "pmas_sht_desc": categoryDetailFormData.premiumMask.pmas_sht_desc,
      // "period": categoryDetailFormData.multiplesOfEarnings,
      // "quotation_code": this.quotationCode,
      // "category_unique_code": this.categoryCode,
      // "premium_mask_code": categoryDetailFormData.premiumMask,
      "short_description": categoryDetailFormData.shortDescription,
        "category_category": categoryDetailFormData.description,
        "period": categoryDetailFormData.multiplesOfEarnings,
        "quotation_code": this.quotationCode,
        "pmas_sht_desc": categoryDetailFormData.premiumMask,
        "school_code": 0,
        "premium_mask_code": categoryDetailFormData.premiumMask,
        "previous_category_code": 0,
        "use_cvr_rate": "string",
        "rate": 0,
        "category_rate_division_factor": 0,
        "average_earnings_per_member": 0,
        "average_anb": 0,
        "sum_assured_per_member": 0,
        "multiple_earnings_period": 1,
        "total_member_earnings": 0,
        "total_original_loan_amount": 0,
        "total_members": 0,
        "sum_assured": 0,
        "premium": 0,
        "base_sum_assured": 0,
        "base_premium": 0,
        "fee_amount": 0,
        "total_students": 0
    };
    this.coverageService
      .updateCategoryDetails(this.categoryCode, mappedCatDetails)
      .subscribe(
        (updatedCategory: CategoryDetailsDto) => {
          // const index = this.categoryDetails.findIndex(
          //   (c) => c.category_unique_code === this.categoryCode
          // );
  
          // if (index !== -1) {
          //   this.categoryDetails[index] = updatedCategory;
          // }
          this.getCategoryDets();
          this.spinner_Service.hide('download_view');
          this.messageService.add({severity: 'success', summary: 'summary', detail: 'Edited'});
        },
        (error) => {
          console.error('Update request error:', error);
          this.spinner_Service.hide('download_view');
          this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
        },
        () => {
          this.cdr.detectChanges();
          this.closeCategoryDetstModal();
        }
      );
  } else {
    this.spinner_Service.hide('download_view');
    this.messageService.add({severity: 'error', summary: 'summary', detail: 'Fill all fields'});
  }
    
  }
  
  deleteCategoryDets(categoryDetails) {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      this.spinner_Service.show('download_view');
      const categoryIdToDelete = categoryDetails.category_unique_code;
  
      this.coverageService.deleteCategoryDetails(categoryIdToDelete).subscribe((del) => {
        this.cdr.detectChanges();
        this.categoryDetails = this.categoryDetails.filter(item => item.category_unique_code !== categoryIdToDelete);
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'success', summary: 'summary', detail: 'Deleted'});
      },
      (error) => {
        console.log(error)
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'error', summary: 'summary', detail: 'Not deleted'});
      });
    }
  }

  onCoverTypeSelected(event: any) {
    const selectedCoverType = event.target.selectedIndex;
    if (selectedCoverType >= 0) {
      this.coverTypeUniqueCode = this.coverTypePerProd[selectedCoverType].cover_type_unique_code;
      this.coverTypeCode = this.coverTypePerProd[selectedCoverType].cover_type_code;
      this.loadingDiscount = this.coverTypePerProd[selectedCoverType].loading_discount;
    }
  }

  getPmasCodeToEdit() {
    this.aggregateForm.get('aggrgatePremiumMask')?.valueChanges.subscribe((selectedPmasShtDesc: string) => {
      if (selectedPmasShtDesc) {
        const selectedMask = this.premiumMask.find(mask => mask['pmas_sht_desc'] === selectedPmasShtDesc);
    
        if (selectedMask) {
          this.selectedPmasCode = selectedMask.pmas_code;
          console.log("this.selectedPmasCodeRest", this.selectedPmasCode);
        }
      }
    });
  }

  getSelectedPmasCode(event: any) {
    const selectedPmasShtDesc = event.target.selectedIndex;
    if (selectedPmasShtDesc >= 0) {
      this.selectedPmasCode = this.premiumMask[selectedPmasShtDesc].pmas_code;
      console.log("this.selectedPmasCode", this.selectedPmasCode)
    }
  }

  saveCoverDetails() {
    this.closeDetailedModal();
    this.spinner_Service.show('download_view');
    if(this.quatationCalType === 'D') {
      const cover = this.detailedCovDetsForm.value
    const coverRaw = this.detailedCovDetsForm.getRawValue();
    console.log("cover",cover, coverRaw)
    const coverToPost = {
      "cvt_desc": cover.detailedCoverType,
      // "cover_type_unique_code": this.coverTypeUniqueCode,
      "cover_type_code": this.coverTypeCode,
      "dty_description": cover.premiumMask,
      "main_sumassured_percentage": cover.detailedPercentageMainYr,
      "premium_mask_short_description": cover.premiumMask,
      "use_cvr_rate": this.detailedCovDetsForm.get('selectRate').value,
      "premium_rate": cover.rate,
      "rate_division_factor": cover.rateDivFactor,
      "product_code": this.productCode,
      "quotation_code": this.quotationCode,
      "loading_discount": "N",
      "multiple_earnings_period": 4,
    };
    const coverToPostArray = [coverToPost];
    
    this.coverageService.postCoverType(coverToPostArray).subscribe((coverDets) => {
      this.getCoverTypes();
      this.cdr.detectChanges();
      this.detailedCovDetsForm.reset();
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'success', summary: 'summary', detail: 'Cover saved'});
    },
    (error) => {
      console.log(error)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
    });
    }
    else  if(this.quatationCalType === 'A') {
      this.closeAggregateCoverDetailsModal();
      this.spinner_Service.show('download_view');
      const cover = this.aggregateForm.value
      const noOfMembers = parseInt(cover.noOfMembers, 10);
      const averageEarningPerMember = parseFloat(cover.averageEarningPerMember);

      const total_member_earnings = noOfMembers * averageEarningPerMember;

        const coverRaw = this.detailedCovDetsForm.getRawValue();
        const coverToPost = {
          "cvt_desc": cover.aggregateCoverType,
          // "cover_type_unique_code": this.coverTypeUniqueCode,
          "cover_type_code": this.coverTypeCode,
          "main_sumassured_percentage": cover.aggregatePercentageMainYr,
          "premium_mask_short_description":cover.aggrgatePremiumMask,
          "premium_mask_code": this.selectedPmasCode,
          "total_members": cover.noOfMembers,
          // "category_description":cover.category,
          "use_cvr_rate": this.aggregateForm.get('aggregateSelectRate').value,
          "premium_rate": cover.rate,
          "average_earning_per_member":cover.averageEarningPerMember,
          "but_charge_premium":cover.overridePremiums,
          "rate_division_factor": cover.rateDivFactor,
          "average_anb":cover.averageAnb,
          // "sum_assured":cover.sumAssured,
          "product_code": this.productCode,
          "quotation_code": this.quotationCode,
          "loading_discount": "N",
          "total_member_earnings": total_member_earnings,
          "multiple_earnings_period": 4,
    };
    console.log("coverToPostForNewCover", coverToPost)

    const jsonToTry = {
      "product_code": 2021675,
      "cover_type_code": 2021750,
      "quotation_code": 20237460,
      "total_members": 10,
      "loading_discount": "N",
      "average_anb": 38,
      "dependant_type_code": 1000,
      "average_earning_per_member": 40000,
      "staff_description": "DEFAULT",
      "multiple_earnings_period": 4,
      "premium_mask_code": 2021492,
      "use_cvr_rate": "M"
  
    }
    const coverToPostArray = [coverToPost];
    const coverToPostArray2 = [jsonToTry];
    
    this.coverageService.postCoverType(coverToPostArray2).subscribe((coverDets) => {
      this.getCoverTypes();
      this.cdr.detectChanges();
      this.aggregateForm.reset();
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'success', summary: 'summary', detail: 'Cover saved'});
    },
    (error) => {
      console.log(error)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
    });
    }
  }

  saveEditedCoverDetails() {
    if(this.quatationCalType === 'D') {
      this.closeDetailedModal();
      this.spinner_Service.show('download_view');
      const cover = this.detailedCovDetsForm.value
    const coverRaw = this.detailedCovDetsForm.getRawValue();
    console.log("cover",cover, coverRaw)
    const coverToPost = {
      "cvt_desc": cover.detailedCoverType,
      "cover_type_unique_code": this.coverTypeUniqueCode,
      "cover_type_code": this.coverTypeCodeToEdit,
      "dty_description": cover.premiumMask,
      "main_sumassured_percentage": cover.detailedPercentageMainYr,
      "premium_mask_short_description": cover.premiumMask,
      "use_cvr_rate": this.detailedCovDetsForm.get('selectRate').value,
      "premium_rate": cover.rate,
      "rate_division_factor": cover.rateDivFactor,
      "quotation_code": this.quotationCode,
      "loading_discount": "N",
      "multiple_earnings_period": 4,
    };
    const coverToPostArray = [coverToPost];
    console.log("coverToPost edit", coverToPost)
    
    this.coverageService.postCoverType(coverToPostArray).subscribe((coverDets) => {
      this.getCoverTypes();
      this.cdr.detectChanges();
      this.detailedCovDetsForm.reset();
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'success', summary: 'summary', detail: 'Updated'});
    },
    (error) => {
      console.log(error)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured'});
    });
    }
    else  if(this.quatationCalType === 'A') {
      this.closeAggregateCoverDetailsModal();
      this.spinner_Service.show('download_view');
      const cover = this.aggregateForm.value
      const noOfMembers = parseInt(cover.noOfMembers, 10);
      const averageEarningPerMember = parseFloat(cover.averageEarningPerMember);

      const total_member_earnings = noOfMembers * averageEarningPerMember;

        const coverRaw = this.aggregateForm.getRawValue();
        console.log("coverRawPremium", coverRaw)
        const coverToPost = {
          "cvt_desc": cover.aggregateCoverType,
          "cover_type_unique_code": this.coverTypeUniqueCode,
          "cover_type_code": this.coverTypeCodeToEdit,
          "main_sumassured_percentage": cover.aggregatePercentageMainYr,
          "premium_mask_short_description": cover.aggrgatePremiumMask,
          "premium_mask_code": this.selectedPmasCode,
          "total_members": cover.noOfMembers,
          // "category_description":cover.category,
          "use_cvr_rate": this.aggregateForm.get('aggregateSelectRate').value,
          "premium_rate": cover.rate,
          "average_earning_per_member":cover.averageEarningPerMember,
          "but_charge_premium":cover.overridePremiums,
          "rate_division_factor": cover.rateDivFactor,
          "average_anb":cover.averageAnb,
          // "sum_assured":cover.sumAssured,
          "quotation_code": this.quotationCode,
          "loading_discount": "N",
          "total_member_earnings": total_member_earnings,
          "product_code": this.productCode,
          "multiple_earnings_period": 4,
          "dependant_type_code": 1000,
          "dty_description": "TEST",
          "apply_commission_expense_loading": "N",
          "sum_assured_limit": 0,
    };
    console.log("coverToPostArrayForEditedCover", coverToPost)
    const coverToPostArray = [coverToPost];
    
    this.coverageService.postCoverType(coverToPostArray).subscribe((coverDets) => {
      this.getCoverTypes();
      this.cdr.detectChanges();
      this.aggregateForm.reset();
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'success', summary: 'summary', detail: 'Cover Updated'});
    },
    (error) => {
      console.log(error)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error occured while Editing'});
    });
    }
  }

  deleteCoverType(coverTypes) {
    const confirmation = window.confirm('Are you sure you want to delete this Cover Type?');
    if (confirmation) {
      this.spinner_Service.show('download_view');
      const coverIdToDelete = coverTypes.cover_type_unique_code;
      const quotationCode = this.quotationCode;
  
      this.coverageService.deleteCoverType(quotationCode, coverIdToDelete).subscribe((del) => {
        this.getCoverTypes();
        this.cdr.detectChanges();
        this.coverTypes = this.coverTypes.filter(item => item.cover_type_code !== coverIdToDelete);
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'success', summary: 'summary', detail: 'Cover type Deleted'});
      },
      (error) => {
        console.log(error)
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'error', summary: 'summary', detail: 'Cover type not deleted'});
      });
    }
    this.cdr.detectChanges();
  }

  downloadMemberUploadTemplate() {
    this.spinner_Service.show('download_view');
    this.coverageService.downloadMemberUploadTemplate(this.productType, this.productCode).subscribe((data: any) =>{
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = blobUrl;
      anchor.download = 'downloaded-file.csv';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      window.URL.revokeObjectURL(blobUrl);
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'success', summary: 'summary', detail: 'Downloaded'});
    },
    (error) => {
      console.log(error)
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Not downloaded'});
    }
    );
  }
  
  getMembers() {
    this.coverageService.getMembers(this.quotationCode).subscribe((members: MembersDTO[]) => {
      console.log("members", members)
      this.membersDetails = members;
    },
    (error) => {
      console.log(error);
    })
  }

  deleteMember(membersDetails: MembersDTO) {
    const confirmation = window.confirm('Are you sure you want to delete this Cover Type?');
    if (confirmation) {
      this.spinner_Service.show('download_view');
      const coverIdToDelete = membersDetails.member_code;
      const quotationCode = this.quotationCode;
      // const dependantTypeCode = membersDetails.dependant_type_code 
      const dependantTypeCode = 1000
      const quoteDto = {
        member_code: coverIdToDelete,
        dependant_type_code: dependantTypeCode,
      };
      console.log("memberTodel", coverIdToDelete, quoteDto)
      this.coverageService.deleteMember(quotationCode, quoteDto).subscribe((del) => {
       
        this.getMembers();
        this.cdr.detectChanges();
        this.membersDetails = this.membersDetails.filter(item => item.member_code !== coverIdToDelete);
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'success', summary: 'summary', detail: 'Deleted'});
      },
      (error) => {
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'error', summary: 'summary', detail: 'Not deleted'});
        console.log(error);
      });
    }
    this.cdr.detectChanges();
  }

  getPremiumMask() {
    this.coverageService.getPremiumMask(this.productCode).subscribe((mask: PremiumMaskDTO[]) => {
      console.log("mask", mask);
      this.premiumMask = mask
    });
  }

  getOccupations() {
    this.coverageService.getOccupation().subscribe((occupation: OccupationDTO[]) => {
      console.log("occupation", occupation);
      this.occupation = occupation;
      console.log("this.occupation", this.occupation);
    })
  }
  
}
