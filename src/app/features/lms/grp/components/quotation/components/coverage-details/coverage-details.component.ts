import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { CoverageService } from '../../../../service/coverage/coverage.service';
import { CategoryDetailsDto } from '../../../../models/categoryDetails';
import { CoverTypePerProdDTO, CoverTypesDto, SelectRateTypeDTO } from '../../../../models/coverTypes/coverTypesDto';


@AutoUnsubscribe
@Component({
  selector: 'app-coverage-details',
  templateUrl: './coverage-details.component.html',
  styleUrls: ['./coverage-details.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverageDetailsComponent implements OnInit, OnDestroy {

searchFormMemberDets: FormGroup;
categoryDetailForm: FormGroup;
detailedCovDetsForm: FormGroup;
quatationCalType: string;
quotationCode: number;
categoryDetails: CategoryDetailsDto[] = [];
categoryCode: number
coverTypes: CoverTypesDto[]
isEditMode: boolean = false;
SelectRateType: SelectRateTypeDTO[];
coverTypePerProd: CoverTypePerProdDTO[];
// public editing: boolean = false;
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

    public currency = [
      {label: ' Ksh', value: 'ksh'},
      {label: ' Naira', value: 'naira'},
      {label: ' USD', value: 'usd'},
      {label: ' EURO', value: 'euro'},
      {label: ' Ugsh', value: 'ugsh'},
      {label: ' Tzsh', value: 'tzsh'},
      {label: ' Peso', value: 'peso'},
      {label: ' Real', value: 'real'},
    ];
    
    public yourDataDetailed = [
      {
        isSelected: true,
        isEditable: false,
        coverType: 'Type A',
        dependantType: 'Dependant 1',
        rateType: 'Rate Type 1',
        premiumMask: 'Premium Mask 1',
        rate: 0.05,
        rateDivisionFactor: 1.2,
        percentOfMainYearSA: 10,
      }
    ]

public yourDataMemberDets = [
  {
    sname: 'John',
    name: 'Doe',
    dob: '1980-05-15',
    quantity: 'Male',
    price: '12345',
    category: 'Category A',
    dependantType: 'Spouse',
    monthlyEarnings: 5000,
    joiningDate: '2022-01-10',
    mainMemberNo: '9876',
  },
  {
    sname: 'Smith',
    name: 'Jane',
    dob: '1975-08-20',
    quantity: 'Female',
    price: '54321',
    category: 'Category B',
    dependantType: 'Child',
    monthlyEarnings: 6000,
    joiningDate: '2021-11-05',
    mainMemberNo: '6765',
  },
  {
    sname: 'Johnson',
    name: 'Bob',
    dob: '1990-03-25',
    quantity: 'Male',
    price: '98765',
    category: 'Category C',
    dependantType: 'Spouse',
    monthlyEarnings: 5500,
    joiningDate: '2022-02-15',
    mainMemberNo: '7654',
  },
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
    overridePremiums: [""],
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
      this.detailedCovDetsForm.patchValue({
        detailedCoverType: coverTypes.cvt_desc,
        detailedPercentageMainYr: coverTypes.main_sumassured_percentage,
        rate: coverTypes.premium_rate,
        selectRate: coverTypes.cvt_rate_type,
        premiumMask: coverTypes.premium_mask_short_description,
        rateDivFactor: coverTypes.rate_division_factor
      });
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
        return desc.charAt(0).toUpperCase() + desc.slice(1).toLowerCase();
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
      "premium_mask_short_description": categoryDetailFormData.premiumMask.premium_mask_short_description,
      "period": categoryDetailFormData.multiplesOfEarnings,
      "quotation_code": this.quotationCode
    }
    this.coverageService.postCategoryDetails(mappedCatDetails, ).subscribe((catDets: CategoryDetailsDto) => {
      return this.categoryDetails.push(catDets);
    
    });

    this.categoryDetailForm.reset();
    this.cdr.detectChanges();
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
    this.coverageService.updateCategoryDetails(this.categoryCode, mappedCatDetails).subscribe((catDets) => {
      
      this.cdr.detectChanges();
    });
    this.closeCategoryDetstModal();
  }
  
  
  deleteCategoryDets(categoryDetails) {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (confirmation) {
      const categoryIdToDelete = categoryDetails.category_unique_code;
      console.log('categoryIdToDelete', categoryIdToDelete)
  
      this.coverageService.deleteCategoryDetails(categoryIdToDelete).subscribe((del) => {
        this.cdr.detectChanges();
        // this.categoryDetails = this.categoryDetails.filter(item => item.category_unique_code !== categoryIdToDelete);
        console.log("Deleted", del);
      });
    }
    this.cdr.detectChanges();
  }
  

}
