import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { CoverageService } from '../../../../service/coverage/coverage.service';
import { CategoryDetailsDto } from '../../../../models/categoryDetails';
import { CoverTypePerProdDTO, CoverTypesDto, SelectRateTypeDTO } from '../../../../models/coverTypes/coverTypesDto';
import { MembersDTO } from '../../../../models/members';


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
quatationCalType: string;
quotationCode: number;
categoryDetails: CategoryDetailsDto[] = [];
categoryCode: number;
coverTypeCode: number;
coverTypeUniqueCode: number;
loadingDiscount: string;
coverTypes: CoverTypesDto[];
isEditMode: boolean = false;
SelectRateType: SelectRateTypeDTO[];
coverTypePerProd: CoverTypePerProdDTO[];
isDisabled: boolean = false;
membersDetails: MembersDTO[];
  constructor (
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private coverageService: CoverageService,
    private cdr: ChangeDetectorRef
    ) {}

    public clients = [
      { label: 'Client 1', value: 'client1' },
      { label: 'Client 2', value: 'client2' },
      { label: 'Client 3', value: 'client3' },
      { label: 'Client 10', value: 'client10' },
      { label: 'Client 15', value: 'client15' },
    ];
    
ngOnInit() {
  this.searchFormMember();
  this.detailedCoverDetails();
  this.SubmitMemberDetailsForm();
  this.getParams();
  this.getCategoryDets();
  this.getCoverTypes();
  this.categoryDetailsForm();
  this.getCoverTypesPerProduct();
  this.getSelectRateTypes();
  this.getMembers();
}

ngOnDestroy(): void {

}

getParams() {
  this.activatedRoute.queryParams.subscribe((queryParams) => {
    this.quatationCalType = queryParams['quotationCalcType'];
    this.quotationCode = queryParams['quotationCode'];
  });
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
    // overridePremiums: [""],
    detailedPercentageMainYr: [""],
    rate: [""],
    selectRate: [""],
    premiumMask: [""],
    rateDivFactor: [""],
  });
}
  

  aggregateForm = this.fb.group({
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

  categoryDetailsForm() {
    this.categoryDetailForm = this.fb.group({
    description: ["", [Validators.required]],
    premiumMask: ["", [Validators.required]],
    shortDescription: ["", [Validators.required]],
    multiplesOfEarnings: ["", [Validators.required]],
  });
}

  memberDetailsForm = this.fb.group({
    surname: [""],
    dateOfBirth: [""],
    mainMemberNumber: [""],
    category: [""],
    monthlyEarning: [""],
    otherNames: [""],
    gender: [""],
    payrollNumber: [""],
    dependantType: [""],
    joiningDate: [""],
  });

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
  
  showEditDetailedCoverDetailsModal(coverTypes: CoverTypesDto) {
    this.isEditMode = true;
    console.log("detailedEdit", this.isEditMode)
    const modal = document.getElementById('detailedModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (coverTypes) {
     console.log("patched", coverTypes)
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

  showEditAggregateCoverDetailsModal(coverTypes) {
    this.isEditMode = true;
    console.log("aggregateEdit", this.isEditMode)
    const modal = document.getElementById('aggregateModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

    if (coverTypes) {
      this.aggregateForm.patchValue({
        aggregateCoverType: coverTypes.cvt_desc.toLowerCase(),
        rate: coverTypes.premium_rate,
        aggrgatePremiumMask: coverTypes.premium_mask_short_description,
        aggregateSelectRate: coverTypes.use_cvr_rate,
        rateDivFactor: coverTypes.rate_division_factor,
        aggregatePercentageMainYr: coverTypes.main_sumassured_percentage,
        noOfMembers: coverTypes.total_members,
        averageEarningPerMember: coverTypes.average_earning_per_member,
        //Total member earning
        averageAnb: coverTypes.average_anb,
        //Override SA
        sumAssured: coverTypes.sum_assured,
        category: coverTypes.category,
        dependantType: coverTypes.dependantType,
        overridePremiums: coverTypes.override_premium,
      });
      console.log("After patchValue:", this.aggregateForm.value);
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
        premiumMask: categoryDetails.cover_type_code
      });
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
    this.router.navigate(['/home/lms/grp/quotation/summary']);
  }

  SubmitMemberDetailsForm() {
    if(this.memberDetailsForm.valid) {
      const memberDetailsFormValues = this.memberDetailsForm.getRawValue();
    }
  }

  getCategoryDets() {
      this.coverageService.getCategoryDetails(this.quotationCode).subscribe((categoryDets: CategoryDetailsDto[]) =>{
      this.categoryDetails = categoryDets;
      console.log("categoryDetails", this.categoryDetails)
    });
  }

  getCoverTypes() {
    this.coverageService.getCoverTypes(this.quotationCode).subscribe((coverTypes: CoverTypesDto[]) => {
      this.coverTypes = coverTypes
      console.log("coverTypes", this.coverTypes)
    });
  }

  getCoverTypesPerProduct() {
    this.coverageService.getCoverTypesPerProduct(2021675).subscribe((coversPerProd: CoverTypePerProdDTO[]) => {
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

  getSelectRateTypes() {
    this.coverageService.getSelectRateType().subscribe((SelectRateTypes: SelectRateTypeDTO[]) => {
      console.log("SelectRateTypes", SelectRateTypes)
      this.SelectRateType = SelectRateTypes
    });
  }

  onSaveCatDets() {
    const categoryDetailFormData = this.categoryDetailForm.value;
    const mappedCatDetails = {
      "category_category": categoryDetailFormData.description,
      "short_description": categoryDetailFormData.shortDescription,
      "premium_mask_desc": categoryDetailFormData.premiumMask.premium_mask_short_description,
      "period": categoryDetailFormData.multiplesOfEarnings,
      "quotation_code": this.quotationCode,
      "category_unique_code": this.categoryCode
    };
  
    this.coverageService.postCategoryDetails(mappedCatDetails).subscribe(
      (catDets: CategoryDetailsDto) => {
        this.getCategoryDets();
        this.categoryDetails.push(catDets);
        this.categoryDetailForm.reset();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Save request error:', error);
      }
    );
  }

  onSaveEditCatDets() {
    const categoryDetailFormData = this.categoryDetailForm.value;
    const mappedCatDetails = {
      "category_category": categoryDetailFormData.description,
      "short_description": categoryDetailFormData.shortDescription,
      "premium_mask_desc": categoryDetailFormData.premiumMask.premium_mask_short_description,
      "period": categoryDetailFormData.multiplesOfEarnings,
      "quotation_code": this.quotationCode,
      "category_unique_code": this.categoryCode
    };
  
    this.coverageService
      .updateCategoryDetails(this.categoryCode, mappedCatDetails)
      .subscribe(
        (updatedCategory: CategoryDetailsDto) => {
          const index = this.categoryDetails.findIndex(
            (c) => c.category_unique_code === this.categoryCode
          );
  
          if (index !== -1) {
            this.categoryDetails[index] = updatedCategory;
          }
        },
        (error) => {
          console.error('Update request error:', error);
        },
        () => {
          this.cdr.detectChanges();
          this.closeCategoryDetstModal();
        }
      );
  }
  
  
  deleteCategoryDets(categoryDetails) {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      const categoryIdToDelete = categoryDetails.category_unique_code;
  
      this.coverageService.deleteCategoryDetails(categoryIdToDelete).subscribe((del) => {
        this.cdr.detectChanges();
        this.categoryDetails = this.categoryDetails.filter(item => item.category_unique_code !== categoryIdToDelete);
      });
    }
    this.cdr.detectChanges();
  }

  onCoverTypeSelected(event: any) {
    const selectedCoverType = event.target.selectedIndex;
    if (selectedCoverType >= 0) {
      this.coverTypeUniqueCode = this.coverTypePerProd[selectedCoverType].cover_type_unique_code;
      this.coverTypeCode = this.coverTypePerProd[selectedCoverType].cover_type_code;
      this.loadingDiscount = this.coverTypePerProd[selectedCoverType].loading_discount;
    }
  }

  saveCoverDetails() {
    if(this.quatationCalType === 'D') {
      const cover = this.detailedCovDetsForm.value
    const coverRaw = this.detailedCovDetsForm.getRawValue();
    console.log("cover",cover, coverRaw)
    const coverToPost = {
      "cvt_desc": cover.detailedCoverType,
      "cover_type_unique_code": this.coverTypeUniqueCode,
      // "cover_type_unique_code": 202110751,
      "cover_type_code": this.coverTypeCode,
      // "cover_type_code": 2021754,
      "dty_description": cover.premiumMask,
      "main_sumassured_percentage": cover.detailedPercentageMainYr,
      "premium_mask_short_description": cover.premiumMask,
      "use_cvr_rate": this.detailedCovDetsForm.get('selectRate').value,
      "premium_rate": cover.rate,
      "rate_division_factor": cover.rateDivFactor,
      "product_code": 2021675,
      "quotation_code": this.quotationCode,
      "loading_discount": "N"
      // "loading_discount": this.loadingDiscount
    };
    const coverToPostArray = [coverToPost];
    
    this.coverageService.postCoverType(coverToPostArray).subscribe((coverDets) => {
      this.getCoverTypes();
      this.cdr.detectChanges();
    });
    }
    else  if(this.quatationCalType === 'A') {
      const cover = this.aggregateForm.value
      const noOfMembers = parseInt(cover.noOfMembers, 10);
      const averageEarningPerMember = parseFloat(cover.averageEarningPerMember);

      const total_member_earnings = noOfMembers * averageEarningPerMember;

        const coverRaw = this.detailedCovDetsForm.getRawValue();
        const coverToPost = {
          "cvt_desc": cover.aggregateCoverType,
          "cover_type_unique_code": this.coverTypeUniqueCode,
          // "cover_type_unique_code": 202110751,
          "cover_type_code": this.coverTypeCode,
          // "cover_type_code": 2021754,
          "main_sumassured_percentage": cover.aggregatePercentageMainYr,
          "premium_mask_short_description": cover.aggrgatePremiumMask,
          "total_members": cover.noOfMembers,
          "category_description":cover.category,
          "use_cvr_rate": this.aggregateForm.get('aggregateSelectRate').value,
          "premium_rate": cover.rate,
          "average_earning_per_member":cover.averageEarningPerMember,
          "override_facultative_amount":cover.overridePremiums,
          "rate_division_factor": cover.rateDivFactor,
          "average_anb":cover.averageAnb,
          "sum_assured":cover.sumAssured,
          "product_code": 2021675,
          "quotation_code": this.quotationCode,
          "loading_discount": "N",
          "total_member_earnings": total_member_earnings
          // "loading_discount": this.loadingDiscount
    };
    const coverToPostArray = [coverToPost];
    
    this.coverageService.postCoverType(coverToPostArray).subscribe((coverDets) => {
      this.getCoverTypes();
      this.cdr.detectChanges();
    });
    }
  }

  saveEditedCoverDetails() {
    const cover = this.detailedCovDetsForm.value
    const coverRaw = this.detailedCovDetsForm.getRawValue();
    const coverToPost = {
      "cvt_desc": cover.detailedCoverType.cvt_desc,
      "cover_type_unique_code": cover.detailedCoverType.cover_type_unique_code,
      "cover_type_code": cover.detailedCoverType.cover_type_code,
      "dty_description": cover.premiumMask.dty_description,
      "main_sumassured_percentage": cover.detailedPercentageMainYr,
      "premium_mask_short_description": cover.premiumMask.premium_mask_short_description,
      "use_cvr_rate": cover.selectRate.value,
      "premium_rate": cover.rate,
      "rate_division_factor": cover.rateDivFactor,
      "product_code": 2021675,
      "quotation_code": this.quotationCode
    };
    console.log("coverToPost",coverToPost)
    const coverToPostArray = [coverToPost];
    
    // this.coverageService.postCoverType(coverToPostArray).subscribe((coverDets) => {
    // });
  }

  deleteCoverType(coverTypes) {
    const confirmation = window.confirm('Are you sure you want to delete this Cover Type?');
    if (confirmation) {
      const coverIdToDelete = coverTypes.cover_type_unique_code;
      const quotationCode = this.quotationCode;
  
      this.coverageService.deleteCoverType(quotationCode, coverIdToDelete).subscribe((del) => {
        this.getCoverTypes();
        this.cdr.detectChanges();
        this.coverTypes = this.coverTypes.filter(item => item.cover_type_code !== coverIdToDelete);
      });
    }
    this.cdr.detectChanges();
  }

  // downloadMemberUploadTemplate(event: Event) {
  //   event.preventDefault();
  //   this.coverageService.downloadMemberUploadTemplate().subscribe(
  //     (response: Blob) => {
  //       const blob = new Blob([response], { type: 'text/csv' });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = 'Template.csv';
  //       document.body.appendChild(a);
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     (error) => {
  //       console.error('Download error:', error);
  //     }
  //   );
  // }

  downloadMemberUploadTemplate(event: Event) {
    event.preventDefault();
    this.coverageService.downloadMemberUploadTemplate().subscribe(
      (response: Blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Template.csv';
        // Trigger a click event to initiate the download
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download error:', error);
      }
    );
  }
  
  getMembers() {
    this.coverageService.getMembers(20237348).subscribe((members: MembersDTO[]) => {
      console.log("members", members)
      this.membersDetails = members;
    })
  }
  
  
  
  


}
