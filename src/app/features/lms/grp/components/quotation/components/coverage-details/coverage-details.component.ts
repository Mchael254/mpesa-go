import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { CoverageService } from '../../../../service/coverage/coverage.service';


@AutoUnsubscribe
@Component({
  selector: 'app-coverage-details',
  templateUrl: './coverage-details.component.html',
  styleUrls: ['./coverage-details.component.css']
})
export class CoverageDetailsComponent implements OnInit, OnDestroy {

searchFormMemberDets: FormGroup;
detailedCovDetsForm: FormGroup;
quatationCalType: string;
quotationCode: number;
  constructor (
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private coverageService: CoverageService
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
      },
      {
        isSelected: false,
        isEditable: true,
        coverType: 'Type B',
        dependantType: 'Dependant 2',
        rateType: 'Rate Type 2',
        premiumMask: 'Premium Mask 2',
        rate: 0.08,
        rateDivisionFactor: 0.9,
        percentOfMainYearSA: 15,
      },
      {
        isSelected: false,
        isEditable: true,
        coverType: 'Type C',
        dependantType: 'Dependant 3',
        rateType: 'Rate Type 3',
        premiumMask: 'Premium Mask 3',
        rate: 0.07,
        rateDivisionFactor: 1.0,
        percentOfMainYearSA: 12,
      },
    ];
    

    public yourDataAggregate = [
      {
        coverType: 'Type A',
        dependantType: 'Dependant 1',
        rateType: 'Rate Type 1',
        premiumMask: 'Premium Mask 1',
        rate: 0.05,
        rateDivisionFactor: 1.2,
        percentOfMainYearSA: 10,
        noOfMembers: 50,
        avgEarningsPerMember: 5000,
        totalMemberEarnings: 250000,
        avgANB: 45,
        overrideSA: 0,
        sumAssured: 0,
      },
      {
        coverType: 'Type B',
        dependantType: 'Dependant 2',
        rateType: 'Rate Type 2',
        premiumMask: 'Premium Mask 2',
        rate: 0.08,
        rateDivisionFactor: 0.9,
        percentOfMainYearSA: 15,
        noOfMembers: 75,
        avgEarningsPerMember: 6000,
        totalMemberEarnings: 450000,
        avgANB: 60,
        overrideSA: 0,
        sumAssured: 0,
      },
      {
        coverType: 'Type C',
        dependantType: 'Dependant 3',
        rateType: 'Rate Type 3',
        premiumMask: 'Premium Mask 3',
        rate: 0.07,
        rateDivisionFactor: 1.0,
        percentOfMainYearSA: 12,
        noOfMembers: 60,
        avgEarningsPerMember: 5500,
        totalMemberEarnings: 330000,
        avgANB: 55,
        overrideSA: 0,
        sumAssured: 0,
      },
    ];

yourDataCat = [
  {
    description: 'Category A',
    shortDescription: 'Cat A',
    multipleOfEarnings: 1.5,
    premiumMask: 'Mask A',
  },
  {
    description: 'Category B',
    shortDescription: 'Cat B',
    multipleOfEarnings: 1.2,
    premiumMask: 'Mask B',
  },
  {
    description: 'Category C',
    shortDescription: 'Cat C',
    multipleOfEarnings: 1.0,
    premiumMask: 'Mask C',
  },
];

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
    
    
public editing = false;

ngOnInit(): void {
  this.searchFormMember();
  this.detailedCoverDetails();
  this.SubmitMemberDetailsForm();
  this.getQuotationCalType();
  this.getCategoryDets(this.quotationCode);
}

ngOnDestroy(): void {
  
}

getQuotationCalType() {
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

  categoryDetailsForm = this.fb.group({
    description: ["", [Validators.required]],
    premiumMask: ["", [Validators.required]],
    shortDescription: ["", [Validators.required]],
    multiplesOfEarnings: ["", [Validators.required]],
  });

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

  showAggregateCoverDetailsModal() {
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

  getCategoryDets(quotationCode: number) {
    this.coverageService.getCategoryDetails(20237348).subscribe((categoryDets) =>{
      console.log('categoryDets',categoryDets)
    });
  }

}
